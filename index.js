import { app, BrowserWindow, Menu, shell } from 'electron'
import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import 'dotenv/config'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import config from './config.js'

const isMac = process.platform === 'darwin'

const template = [
  // // { role: 'appMenu' }
  // ...(isMac
  //   ? [{
  //       label: app.name,
  //       submenu: [
  //         { role: 'about' },
  //         { type: 'separator' },
  //         { role: 'services' },
  //         { type: 'separator' },
  //         { role: 'hide' },
  //         { role: 'hideOthers' },
  //         { role: 'unhide' },
  //         { type: 'separator' },
  //         { role: 'quit' }
  //       ]
  //     }]
  //   : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
            // { role: 'pasteAndMatchStyle' },
            // { role: 'delete' },
            { role: 'selectAll' },
            // { type: 'separator' },
            // {
            //   label: 'Speech',
            //   submenu: [
            //     { role: 'startSpeaking' },
            //     { role: 'stopSpeaking' }
            //   ]
            // }
          ]
        : [
            // { role: 'delete' },
            // { type: 'separator' },
            { role: 'selectAll' }
          ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
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
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
          ]
        : [
            { role: 'close' }
          ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          await shell.openExternal(config.homePage)
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// Register protocol before app is ready
app.whenReady().then(() => {
  createWindow()
})

const createWindow = async () => {
  const win = new BrowserWindow({
    // width: 800,
    // height: 600
    autoHideMenuBar: true,
    icon: './icon.png'
  })

  const url = config.chatPage

  win.loadURL(url)
}