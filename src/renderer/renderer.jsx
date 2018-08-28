import React from 'react';
import { render } from 'react-dom';

render(
  <div>hogehoge</div>,
  document.getElementById('app')
);

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// const { ipcRenderer } = require ('electron');

// document.addEventListener('click', event => {
//   event.preventDefault ();
//   ipcRenderer.send ('dismiss', 'fugaaaa');
// });
