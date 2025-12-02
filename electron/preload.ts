import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

// Helper to create menu listener with proper cleanup
const createMenuListener = (channel: string) => {
  return (callback: () => void) => {
    const wrappedCallback = (_event: IpcRendererEvent) => callback()
    ipcRenderer.on(channel, wrappedCallback)
    // Return cleanup function
    return () => {
      ipcRenderer.removeListener(channel, wrappedCallback)
    }
  }
}

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Dialog operations
  openFileDialog: (options?: { filters?: { name: string; extensions: string[] }[] }) =>
    ipcRenderer.invoke('dialog:openFile', options || {}),

  saveFileDialog: (options?: { defaultPath?: string; filters?: { name: string; extensions: string[] }[] }) =>
    ipcRenderer.invoke('dialog:saveFile', options || {}),

  // File operations
  readFile: (filePath: string) =>
    ipcRenderer.invoke('file:read', filePath),

  writeFile: (filePath: string, content: string) =>
    ipcRenderer.invoke('file:write', filePath, content),

  fileExists: (filePath: string) =>
    ipcRenderer.invoke('file:exists', filePath),

  // Menu event listeners - each returns a cleanup function
  onMenuNewScenario: createMenuListener('menu:new-scenario'),
  onMenuOpen: createMenuListener('menu:open'),
  onMenuSave: createMenuListener('menu:save'),
  onMenuSaveAs: createMenuListener('menu:save-as'),
  onMenuExportParticipant: createMenuListener('menu:export-participant'),
  onMenuImportResponses: createMenuListener('menu:import-responses'),
  onMenuViewEditor: createMenuListener('menu:view-editor'),
  onMenuViewRunner: createMenuListener('menu:view-runner'),
  onMenuViewLibrary: createMenuListener('menu:view-library'),
  onMenuAbout: createMenuListener('menu:about')
})

// Type for cleanup function returned by menu listeners
type CleanupFunction = () => void

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      openFileDialog: (options?: { filters?: { name: string; extensions: string[] }[] }) => Promise<string | null>
      saveFileDialog: (options?: { defaultPath?: string; filters?: { name: string; extensions: string[] }[] }) => Promise<string | null>
      readFile: (filePath: string) => Promise<{ success: boolean; data?: string; error?: string }>
      writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>
      fileExists: (filePath: string) => Promise<boolean>
      // Menu listeners return cleanup functions to properly remove listeners
      onMenuNewScenario: (callback: () => void) => CleanupFunction
      onMenuOpen: (callback: () => void) => CleanupFunction
      onMenuSave: (callback: () => void) => CleanupFunction
      onMenuSaveAs: (callback: () => void) => CleanupFunction
      onMenuExportParticipant: (callback: () => void) => CleanupFunction
      onMenuImportResponses: (callback: () => void) => CleanupFunction
      onMenuViewEditor: (callback: () => void) => CleanupFunction
      onMenuViewRunner: (callback: () => void) => CleanupFunction
      onMenuViewLibrary: (callback: () => void) => CleanupFunction
      onMenuAbout: (callback: () => void) => CleanupFunction
    }
  }
}
