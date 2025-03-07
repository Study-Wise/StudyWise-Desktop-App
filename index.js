const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    // width: 800,
    // height: 600
  })

  win.loadURL('https://assistant.adarshrkumar.dev/chat')
}

app.whenReady().then(() => {
  createWindow()
})