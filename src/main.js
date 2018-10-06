const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  Tray
} = require("electron");
const clipboard = require("electron-clipboard-extended");
const robot = require("robotjs");
const Datastore = require("nedb");

const LABEL_LENGTH_LIMIT = 20; // ...処理する文字数
let mainWindow = null;
let appIcon = null; // 右上のアイコン(Macの時)

const db = new Datastore({
  filename: "db/data.db",
  autoload: true,
  timestampData: true
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1,
    height: 1,
    show: false,
    frame: false
  });

  mainWindow.loadFile("index.html");

  // mainWindow.webContents.openDevTools()

  mainWindow.on("closed", function() {
    mainWindow = null;
  });

  mainWindow.on("blur", () => {
    mainWindow.hide();
  });
}

app.on("ready", () => {
  globalShortcut.register("CommandOrControl+Shift+V", () => {
    createWindow();
  });

  // 右上メニューを作る
  appIcon = new Tray("./assets/images/icon.png");

  traySetContextMenu();
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});

app.dock.hide();

// システムのClipboardにコピーされた時
clipboard
  .on("text-changed", () => {
    db.insert({
      text: clipboard.readText()
    });

    // 履歴が100件超えたら超えた分は削除する
    db.find({}, (err, docs) => {
      if (docs.length > 100) {
        db.find({})
          .sort({ updatedAt: 1 })
          .exec((err, docs) => {
            db.remove({ text: docs[0].text }, {}, (err, numRemoved) => {
              // console.log('numRemoved: ', numRemoved);
            });
          });
      }
    });

    // Trayのメニューを更新する
    traySetContextMenu();
  })
  .startWatching();

// rendererプロセスからの通知を監視
ipcMain.on("onMenuItemClick", async (event, { text, index }) => {
  onMenuItemClick({ text, index });
});

// DBから指定のテキストの履歴を削除する
function removeSelectedItem({ text }) {
  return new Promise(resolve => {
    db.remove({ text }, { multi: true }, (err, numRemoved) => {
      resolve();
    });
  });
}

// メニューのアイテムを選択した時
async function onMenuItemClick({ text, index }) {
  await removeSelectedItem({ text });

  clipboard.writeText(text);
  robot.keyTap("v", "command");

  // 最初の履歴はクリップボード更新がなくtext-changedが発火しないので、DB保存を手動でする
  if (index === 0) {
    await db.insert({ text });
  }
}

// 指定の文字数に達したら、...処理する
function trancate(text) {
  return text.length <= LABEL_LENGTH_LIMIT
    ? text
    : `${text.substring(0, LABEL_LENGTH_LIMIT)}...`;
}

// 右上のアイコンの中身を更新する
function traySetContextMenu() {
  db.find({})
    .sort({ updatedAt: -1 })
    .exec((err, docs) => {
      const items = docs.map((doc, index) => ({
        label: trancate(doc.text),
        click: () => onMenuItemClick({ text: doc.text, index })
      }));

      const contextMenu = Menu.buildFromTemplate(items);

      // Call this again for Linux because we modified the context menu
      appIcon.setContextMenu(contextMenu);
    });
}
