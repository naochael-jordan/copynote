'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('electron'),
    ipcRenderer = _require.ipcRenderer;

function onClick() {
  var storage = localStorage.getItem('copynote');
  var value = typeof storage === 'number' ? Number(storage) : 0;
  value += 1;
  localStorage.setItem('copynote', value);
  ipcRenderer.send('dismiss', value);
}

var Main = function Main() {
  return _react2.default.createElement(
    'div',
    { onClick: onClick },
    'hogefuga'
  );
};

exports.default = Main;