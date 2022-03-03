const electron = require('electron')
const jQuery = require('jQuery')


const fs = require('fs')
const path = require('path')
const {ipcRenderer} = require('electron');




const { desktopCapturer, ipcRenderer: ipc, screen } = electron

function onCapture(evt, targetDir) {
  getMainSource(desktopCapturer, screen, source => {
     //electron.remote.getCurrentWindow().webContents.send('screen-capture', { paths: source.thumbnail.toDataURL() });
  // jQuery("#short").attr('src',source.thumbnail.toDataURL())
  })
}

function getMainSource(desktopCapturer, screen, done) {
  const options = { types: ['screen'], thumbnailSize: screen.getPrimaryDisplay().workAreaSize }
  desktopCapturer.getSources(options, (err, sources) => {
    if (err) return console.log('Cannot capture screen:', err)

    const isMainSource = source => source.name === 'Entire screen' || source.name === 'Screen 1'
    done(sources.filter(isMainSource)[0])
  })
}

function writeScreenshot(png, filePath) {
  fs.writeFile(filePath, png, err => {
    if (err) return console.log('Failed to write screen:', err)
  })
}
  
ipc.on('capture', onCapture)
ipc.on('screencapture', _=>{
    console.log('as')
})
