import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import windowStateKeeper from 'electron-window-state'
import auth from './api/provider/auth'
import configStore from './utils/configstore'
import { VK_APP_ID, VK_SCOPE, VK_REVOKE } from './api/config'

let mainWindow = null

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')

  sourceMapSupport.install()
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')()
  const path = require('path'),
        p = path.join(__dirname, '..', 'src', 'node_modules')

  require('module').globalPaths.push(p)
}

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'),
          extensions = [
            'REACT_DEVELOPER_TOOLS',
            'REDUX_DEVTOOLS'
          ],
          forceDownload = !!process.env.UPGRADE_EXTENSIONS

    for (const name of extensions) {
      try {
        await installer.default(installer[name], forceDownload)
      } catch (e) {} // eslint-disable-line no-empty
    }
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', async () => {
  await installExtensions()

  const mainWindowState = windowStateKeeper({
    defaultWidth: 1024,
    defaultHeight: 728
  })

  mainWindow = new BrowserWindow({
    show: false,
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minHeight: 500,
    minWidth: 780
  })

  mainWindow.loadURL(`file://${__dirname}/app.html`)

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    // configStore.clear()
  })

  mainWindowState.manage(mainWindow)

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools()
    mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props

      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          mainWindow.inspectElement(x, y)
        }
      }]).popup(mainWindow)
    })
  }

  ipcMain.on('get-vk-permission', () => {
    auth({
      appId: VK_APP_ID,
      scope: VK_SCOPE,
      revoke: VK_REVOKE
    }, {
      parent: mainWindow
    }).then((res) => {
      configStore.set('vk', { token: res.access_token, ownerId: res.user_id })
    }).catch((err) => {
      console.error(err) // eslint-disable-line no-console
    })
  })
})

app.setName('Vortex')
