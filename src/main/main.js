const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain
} = require('electron');
const clipboard = require('electron-clipboard-extended')
const robot = require("robotjs");
const Datastore = require('nedb');

let mainWindow

const db = new Datastore({
  filename: 'db/data.db',
  autoload: true,
  timestampData: true,
});

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    frame: false
  })

  mainWindow.loadFile('index.html')

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  });

  mainWindow.on('blur', () => {
    mainWindow.hide();
  });
}

app.on('ready', () => {
  createWindow();

  globalShortcut.register("CommandOrControl+Shift+V", () => {
    mainWindow.show();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

app.dock.hide();

// Clipboardのコピーを監視する
clipboard
  .on('text-changed', () => {
      const doc = {
        text: clipboard.readText()
      };

      db.insert(doc, (err, newDocs) => {});
  })
  .startWatching();

// rendererプロセスからの通知を監視
ipcMain.on('dismiss', (event, value) => {
  app.hide();
  robot.typeString(value);
});
