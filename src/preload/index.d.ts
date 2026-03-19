import { ElectronAPI } from '@electron-toolkit/preload'

interface WindowAPI {
  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void
  isMaximized: () => Promise<boolean>
  onMaximizedChange: (callback: (isMaximized: boolean) => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: WindowAPI
  }
}
