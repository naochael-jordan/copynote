import React, { Component } from 'react';
const { ipcRenderer, remote } = require ('electron');
const Datastore = require('nedb');
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

const menu = new Menu();
const db = new Datastore({
  filename: 'db/data.db',
  autoload: true,
});

db.find({}).sort({ updatedAt: -1 }).exec((err, docs) => {
  docs.forEach((doc, index) => {
    menu.append(
      new MenuItem({
        label: doc.text,
        click: function(menu) {
          ipcRenderer.send('dismiss', {
            text: menu.label,
            index,
          });
        }
      })
    );
  });

  // コンテキストメニューを開く
  menu.popup(remote.getCurrentWindow());
})

// menu.append(new MenuItem({ type: 'separator' }));
// menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }));

class Main extends Component {
  constructor() {
    super();

    this.state = {
      copyedItems: [],
    };
  }

  componentWillMount() {
    const db = new Datastore({
      filename: 'db/data.db',
      autoload: true,
      timestampData: true,
    });

    db.find({}).sort({ updatedAt: -1 }).exec((err, docs) => {
      this.setState({
        copyedItems: docs
      });
    })
  }

  onClick(text) {
    // clipboard.writeText(text);
    // ipcRenderer.send('dismiss', text);
    menu.popup(remote.getCurrentWindow());
  }

  render() {
    return (
      <ul>
        {this.state.copyedItems.map((item, index) => (
          <li
            onClick={() => this.onClick(item.text)}
            key={index}>
            {item.text}
          </li>
        ))}
      </ul>
    );
  }
}

export default Main;
