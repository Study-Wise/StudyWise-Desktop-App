const { app, BrowserWindow, protocol } = require('electron')

const jsdom = require('jsdom')
const { JSDOM } = jsdom

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const fs = require('fs')
const path = require('path')

require('dotenv').config()

// Register protocol before app is ready
app.whenReady().then(() => {
  createWindow()
})

const createWindow = async () => {
  const win = new BrowserWindow({
    // width: 800,
    // height: 600
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'icon.png')
  })

  const url = 'https://assistant.adarshrkumar.dev/chat'

  switch (process.env.NODE_ENV) {
    case 'development':
      // Fetch and process main page only
      const response = await fetch(url)
      const html = await response.text()

      // Create a DOM to manipulate the HTML
      const dom = new JSDOM(html)
      const document = dom.window.document

      // Add base tag to head
      const base = document.createElement('base')
      base.href = url
      document.head.insertBefore(base, document.head.firstChild)

      // Save the modified HTML
      fs.writeFileSync(
        path.join(__dirname, 'chat.html'), 
        dom.serialize()
      )

      win.loadFile(path.join(__dirname, 'chat.html'))
      break
    default:
      win.loadURL(url)
  }
}