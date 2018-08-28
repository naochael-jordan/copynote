'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _Main = require('./Main');

var _Main2 = _interopRequireDefault(_Main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _reactDom.render)(_Main2.default, document.getElementById('app'));

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// const { ipcRenderer } = require ('electron');

// document.addEventListener('click', event => {
//   event.preventDefault ();
//   ipcRenderer.send ('dismiss', 'fugaaaa');
// });