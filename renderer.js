// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require ('electron');

document.addEventListener('click', event => {
  event.preventDefault ();
  ipcRenderer.send ('dismiss', 'fugaaaa');
});

// const robot = require("robotjs");

// document.querySelector('#btnEd').addEventListener('click', () => {
//   // console.log(11111111)
//   // var window = remote.getCurrentWindow();
//   // window.hide();
//   // console.log(2222222)
//   // Menu.sendActionToFirstResponder('hide:');
//   // robot.typeString("fugaaaaaaaaaaaaaaaaaaaaaa");
// })

