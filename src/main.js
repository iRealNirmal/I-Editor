 //handle setupevents as quickly as possible
//  const setupEvents = require('./installer/windows/setupEvents')
//  if (setupEvents.handleSquirrelEvent()) {
//     // squirrel event handled and app will exit in 1000ms, so don't do anything else
//     return;
//  }

const electron = require('electron')
const path = require('path')
const fs = require('fs')
const {dialog} = require('electron')  
const Menu = electron.Menu
const { app, BrowserWindow, globalShortcut, Tray, nativeImage,shell  } = electron
const ipcMain = require('electron').ipcMain;
let mainWindow;let win;let page;let status=false;var fpath;let tray 

app.on('ready', _ => {
  function isDev() {
  return process.mainModule.filename.indexOf('app.asar') === -1;
}
 if(!isDev()){
   fpath='/resources';
   const trayIcon = path.join(__dirname, 'trayIcon.png');
  const nimage = nativeImage.createFromPath(trayIcon);
  tray = new Tray(nimage);
   
 }else{
    const trayIcon = path.join(__dirname, 'trayIcon.png');
  const nimage = nativeImage.createFromPath(trayIcon);
  tray = new Tray(nimage);
 }
 let stack = []
  
 const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit',click: _ => app.quit()}
  ])
  tray.setToolTip('I-Edit');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if(mainWindow){
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }else if(win){
      win.show();
    }
})
function isDev() {
  return process.mainModule.filename.indexOf('app.asar') === -1;
}
const logErr = err => err && console.error(err)
getDirPath = app => path.join(app.getPath('pictures'), 'I-Editor')
let picturesPath = getDirPath(app)
function createDir(){
   fs.stat(picturesPath, (err, stats) => {
    if (err && err.code !== 'ENOENT')
      return console.log(err)
    else if (err || !stats.isDirectory())
      fs.mkdir(picturesPath, console.log(err))
  })
}
createDir();

function saveFile(d){
 // console.log(d)
   const base64Data = d.paths.replace(/^data:image\/png;base64,/, '');
  // base64Data = base64Data.replace(/^data:image\/png;base64,/, '')
 //  console.log(base64Data)
const fileName = `photo-${new Date().getTime()}.png`
  const imgPath = path.join(picturesPath, fileName)
  fs.writeFile(imgPath, base64Data, { encoding: 'base64' }, err => {
    
    if (err){ return console.log(err) }

    const dialogOptions = {type: 'info', buttons: ['OK'], message: 'File is saved in pictures folder'}

dialog.showMessageBox(dialogOptions, i => shell.openItem(picturesPath)
)

  })
}
function mopen(){
    mainWindow = new BrowserWindow({
    fullscreen : true,
    frame: false,
        minimizable :false,
  });
  mainWindow.on('minimize',function(event){
    event.preventDefault();
    //mainWindow.hide();
});

mainWindow.on('close', function (event) {
    if(!application.isQuiting){
        event.preventDefault();
        mainWindow.hide();
    }

    return false;
});
}
function wopen(){
   win = new BrowserWindow({
    width: 900,
    height: 600,
    frame: true
  });
}

  mopen();
  mainWindow.loadURL(`file://${__dirname}/short.html`)
  // mainWindow.on('close', _ => {
  //   mainWindow = null
  // })


  mainWindow.webContents.on('did-finish-load', () => {
        setTimeout(_=>{
          mainWindow.minimize();
        },2500);
        
      });

ipcMain.on('save-file', (event, arg) => {
  saveFile(arg)
});

  // in main process, outside of app.on:
ipcMain.on('load-capture', (event, arg) => {
    wopen();
    win.on('close', _ => {
      win = null
    })
    win.on('closed', _ => {
      win = null
    })
    win.maximize()
    win.loadURL(arg.url);
    win.webContents.on('did-finish-load', () => {
       win.webContents.send('capture', arg.data);
     });
     mainWindow.destroy();
     mainWindow=null;
});
// globalShortcut.register('CommandOrControl+Y', _ => {
//   if(mainWindow===null || mainWindow===undefined){
//    win.openDevTools()
//    return;
//   }
//   mainWindow.openDevTools()
//   })
   electron.globalShortcut.register('Escape', function(){
     if(mainWindow){
        mainWindow.minimize();
     }
  });
  const ret = globalShortcut.register('PrintScreen', _ => {
    if(win){
       if(win.isFocused()) {
         win.webContents.send('errors')
        return;
      }
    }
    if(mainWindow===null || mainWindow===undefined){
      mopen();
      if(win){
      win.destroy();
      win=null;
      }
      mainWindow.loadURL(`file://${__dirname}/short.html`);
      mainWindow.minimize();
      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('transfer', app.getPath('pictures'));
        setTimeout(_=>{
         // mainWindow.focus();
          mainWindow.show();
        },150);
        
      });
    }else{
       setTimeout(_=>{
         mainWindow.minimize();
         mainWindow.webContents.send('transfer', app.getPath('pictures'));
         setTimeout(_=>{
         // mainWindow.focus();
          mainWindow.show();
        },350);
      },300);
    }
   
  })

  if (!ret) {
    console.log('registration failed')
  }

})
