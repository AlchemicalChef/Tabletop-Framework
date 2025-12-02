import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import { join } from 'path'
import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    titleBarStyle: 'hiddenInset',
    show: false
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Create application menu
  createMenu()
}

function createMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Scenario',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow?.webContents.send('menu:new-scenario')
        },
        {
          label: 'Open...',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow?.webContents.send('menu:open')
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.send('menu:save')
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow?.webContents.send('menu:save-as')
        },
        { type: 'separator' },
        {
          label: 'Export Participant Package...',
          click: () => mainWindow?.webContents.send('menu:export-participant')
        },
        {
          label: 'Import Responses...',
          click: () => mainWindow?.webContents.send('menu:import-responses')
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Scenario Editor',
          accelerator: 'CmdOrCtrl+1',
          click: () => mainWindow?.webContents.send('menu:view-editor')
        },
        {
          label: 'Exercise Runner',
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow?.webContents.send('menu:view-runner')
        },
        {
          label: 'Library',
          accelerator: 'CmdOrCtrl+3',
          click: () => mainWindow?.webContents.send('menu:view-library')
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About CTEP Framework',
          click: () => mainWindow?.webContents.send('menu:about')
        },
        {
          label: 'CISA CTEP Resources',
          click: async () => {
            const { shell } = await import('electron')
            shell.openExternal('https://www.cisa.gov/resources-tools/services/cisa-tabletop-exercise-packages')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// IPC Handlers for file operations
ipcMain.handle('dialog:openFile', async (_, options: { filters?: Electron.FileFilter[] }) => {
  if (!mainWindow) return null

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: options.filters || [
      { name: 'CTEP Scenarios', extensions: ['ctep.json'] },
      { name: 'CTEP Exercises', extensions: ['ctep-exercise.json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  return result.filePaths[0]
})

ipcMain.handle('dialog:saveFile', async (_, options: {
  defaultPath?: string
  filters?: Electron.FileFilter[]
}) => {
  if (!mainWindow) return null

  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: options.defaultPath,
    filters: options.filters || [
      { name: 'CTEP Scenario', extensions: ['ctep.json'] }
    ]
  })

  if (result.canceled || !result.filePath) {
    return null
  }

  return result.filePath
})

ipcMain.handle('file:read', async (_, filePath: string) => {
  try {
    if (!existsSync(filePath)) {
      return { success: false, error: 'File not found' }
    }
    const content = await readFile(filePath, 'utf-8')
    return { success: true, data: content }
  } catch (error) {
    return { success: false, error: String(error) }
  }
})

ipcMain.handle('file:write', async (_, filePath: string, content: string) => {
  try {
    await writeFile(filePath, content, 'utf-8')
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
})

ipcMain.handle('file:exists', async (_, filePath: string) => {
  return existsSync(filePath)
})

// App lifecycle
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
