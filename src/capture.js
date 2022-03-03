const electron = require('electron')
const jQuery = require('jQuery')


const fs = require('fs')
const path = require('path')
const {ipcRenderer} = require('electron');

// require('./libs/fabric.min.js')
// require('./libs/jquery-3.3.1.min.js')

// require('./libs/tui-code-snippet.min.js')
// require('./libs/tui-image-editor.js')

//eval(fs.readFileSync('./src/libs/tui-image-editor.js')+'');

const { desktopCapturer, ipcRenderer: ipc, screen } = electron

function onCapture(evt, targetDir) {
  console.log('cap')
 // getMainSource(desktopCapturer, screen, source => {
 
 /*For saving file while taking screenshot*/
    // const png = source.thumbnail.toPng()
    // const filePath = path.join(targetDir, new Date().getTime() + '.png');
    // let d = filePath
    // writeScreenshot(png, filePath);
/*End For saving file while taking screenshot*/
    electron.remote.getCurrentWindow().webContents.send('screen-capture', { paths: targetDir });
   
 // })
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

    ipc.on('errors', (event, arg)=> {
alert('can\'t capture here' );
});


   

ipc.on('capture', onCapture)
