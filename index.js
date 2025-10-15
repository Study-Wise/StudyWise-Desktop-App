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

const buildMenu = (appName) => {
  const template = [
    // { role: 'appMenu' }
    {
      label: appName,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        ...(isMac
          ? [
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { 
                label: 'Close Window',
                accelerator: 'Cmd+W',
                role: 'close'
              },
              { type: 'separator' }
            ]
          : [
              { 
                label: 'Close Window',
                accelerator: 'Ctrl+W',
                role: 'close'
              },
              { type: 'separator' }
            ]),
        { role: 'quit' }
      ]
    },
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
}

// Fetch page title early
const getPageTitle = async () => {
  try {
    const url = config.chatPage
    const response = await fetch(url)
    const html = await response.text()
    const dom = new JSDOM(html)
    return dom.window.document.title || config.appName
  } catch (error) {
    console.error('Error fetching page title:', error)
    return config.appName
  }
}

// Register protocol before app is ready
app.whenReady().then(async () => {
  // Fetch and set app name before creating window/menu
  const pageTitle = await getPageTitle()
  app.setName(pageTitle)
  
  // Build menu with the app title
  buildMenu(pageTitle)
  
  createWindow(pageTitle)
})

const createWindow = (pageTitle) => {
  const win = new BrowserWindow({
    // width: 800,
    // height: 600
    title: pageTitle,
    autoHideMenuBar: true,
    icon: './icon.png'
  })

  win.maximize()
  win.loadURL(config.chatPage)
}