const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  Tray,
} = require('electron');
const clipboard = require('electron-clipboard-extended')
const robot = require("robotjs");
const Datastore = require('nedb');

let mainWindow
let appIcon = null

const db = new Datastore({
  filename: 'db/data.db',
  autoload: true,
  timestampData: true,
});

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1,
    height: 1,
    show: false,
    frame: false
  })

  mainWindow.loadFile('index.html')

  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  });

  mainWindow.on('blur', () => {
    mainWindow.hide();
  });
}

app.on('ready', () => {
  // createWindow();

  globalShortcut.register("CommandOrControl+Shift+B", () => {
    // mainWindow.show();
    createWindow();
  });

  // 右上のメニューを作る
  appIcon = new Tray('./assets/images/icon.png')
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Item1', type: 'radio'},
    {label: 'Item2', type: 'radio'}
  ])

  // Call this again for Linux because we modified the context menu
  appIcon.setContextMenu(contextMenu)
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

      db.insert(doc, (err, newDocs) => {
        // console.log(1111, newDocs)
      });

      // 履歴が100件超えたら超えた分は削除する
      db.find({}, (err, docs) => {
        // console.log(docs.length, docs)
        if (docs.length > 100) {
          db.find({}).sort({ updatedAt: 1 }).exec((err, docs) => {
            db.remove({ text: docs[0].text }, {}, (err, numRemoved) => {
              // console.log('numRemoved: ', numRemoved);
            });
          })
        }
      })
  })
  .startWatching();

// rendererプロセスからの通知を監視
ipcMain.on('dismiss', (event, { text, index}) => {
  // app.hide();
  // mainWindow.hide();

  clipboard.writeText(text);
  robot.typeString(clipboard.readText());

  // 最初の履歴以外で、選択した文字列の履歴は消去する
  if (index !== 0) {
    db.remove({ text }, { multi: true }, (err, numRemoved) => {
      // console.log('numRemoved: ', numRemoved);
    });
  }
});

// デバック用で一旦、履歴を全部消したい時
// db.remove({}, { multi: true }, (err, numRemoved) => {
//   console.log('numRemoved: ', numRemoved);
// });
