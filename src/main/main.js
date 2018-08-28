// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain
} = require('electron');
const robot = require("robotjs");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });

  mainWindow.on('blur', () => {
    mainWindow.hide();
  });

  globalShortcut.register("CommandOrControl+Shift+V", () => {
    mainWindow.show();
  });

  ipcMain.on('dismiss', (hoge) => {
    app.hide();
    robot.typeString('hogehoge');
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
app.dock.hide();

// // Modules to control application life and create native browser window
// const {
//   app,
//   BrowserWindow,
//   globalShortcut,
//   clipboard,
//   Menu,
//   MenuItem,
// } = require('electron')
// const clipboardWatcher = require('electron-clipboard-watcher')
// const storage = require('electron-json-storage');
// const robot = require("robotjs");
// var ks = require('node-key-sender');

// const menu = new Menu()
// menu.append(new MenuItem({label: 'MenuItem1', click() { console.log('item 1 clicked') }}))
// menu.append(new MenuItem({type: 'separator'}))
// menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}))

// const STRAGE_NAME = 'copynote';
// let copyNoteData = {
//   texts: []
// };

// // Keep a global reference of the window object, if you don't, the window will
// // be closed automatically when the JavaScript object is garbage collected.
// let mainWindow

// // console.log(clipboard.readText())
// // console.log(clipboard.readBookmark())
// // clipboard.writeText('Example String')

// function createWindow () {
//   // Create the browser window.
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     frame: false,
//   })

//   // and load the index.html of the app.
//   mainWindow.loadFile('index.html')

//   // Open the DevTools.
//   // mainWindow.webContents.openDevTools()

//   // Emitted when the window is closed.
//   mainWindow.on('closed', function () {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     mainWindow = null
//   })
// }

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', () => {
//   globalShortcut.register('command+shift+v', () => {
//     // createWindow();
//     menu.popup({ window: mainWindow })
//   })
// })

// function sleep(time) {
//   const d1 = new Date();
//   while (true) {
//       const d2 = new Date();
//       if (d2 - d1 > time) {
//           return;
//       }
//   }
// }

// // Quit when all windows are closed.
// app.on('window-all-closed', function () {
//   // On OS X it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

// app.on('activate', function () {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow()
//   }
// })

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and require them here.

// clipboardWatcher({
//   // (optional) delay in ms between polls
//   watchDelay: 1000,

//   // handler for when image data is copied into the clipboard
//   // onImageChange: function (nativeImage) { ... },

//   // handler for when text data is copied into the clipboard
//   onTextChange: text => {
//     setData(text);
//   }
// })

// storage.remove(STRAGE_NAME, function(error) {
//   if (error) throw error;
// });

// storage.set(STRAGE_NAME, copyNoteData, function (error) {
//   if (error) throw error;
// });

// storage.get(STRAGE_NAME, function (error, data) {
//   if (error) throw error;
//   copyNoteData = data;
//   console.log(data)

//   if (Object.keys(data).length === 0) {
//       // データがないときの処理
//   } else {
//       // データがあるときの処理
//   }
// });

// function setData(text) {
//   console.log(copyNoteData)
//   copyNoteData.texts.push(text);
//   storage.set(STRAGE_NAME, copyNoteData, function (error) {
//     if (error) throw error;
//   });
// }

// app.dock.hide();


