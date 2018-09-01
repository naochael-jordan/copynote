import React, { Component } from 'react';
const { ipcRenderer, clipboard } = require ('electron');
const Datastore = require('nedb');

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
    ipcRenderer.send('dismiss', text);
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
