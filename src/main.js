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

  const LABEL_LENGTH_LIMIT = 20;

  function trancate(text) {
    return text.length <= LABEL_LENGTH_LIMIT ? text : `${text.substring(0, LABEL_LENGTH_LIMIT)}...`;
  }

  // 右上のメニューを作る
  appIcon = new Tray('./assets/images/icon.png')
  let items = [];
  db.find({}).sort({ updatedAt: -1 }).exec((err, docs) => {
    docs.forEach((doc, index) => {
      items.push({
        label: trancate(doc.text),
        click: function(menu) {
          // clipboard.writeText(doc.text);
          // robot.typeString(clipboard.readText());
          // removeSelectedItem({
          //   text: doc.text,
          //   index,
          // });
        }
      })
    });

    const contextMenu = Menu.buildFromTemplate(items);

    // Call this again for Linux because we modified the context menu
    appIcon.setContextMenu(contextMenu)
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
ipcMain.on('dismiss', async (event, { text, index}) => {
  // app.hide();
  // mainWindow.hide();
  await removeSelectedItem({ text });

  clipboard.writeText(text);
  robot.keyTap('v', 'command');

  // 最初の履歴はクリップボード更新がなくtext-changedが発火しないので、DB保存を手動でする
  if (index === 0) {
    db.insert({ text });
  }
});

function removeSelectedItem({ text, index }) {
  console.log(text)
  return new Promise(resolve => {
    db.remove({ text }, { multi: true }, (err, numRemoved) => {
      console.log('numRemoved: ', numRemoved);
      resolve();
    });
  })
}
