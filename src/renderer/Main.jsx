import React from 'react';
const { ipcRenderer } = require ('electron');

function onClick() {
  const storage = localStorage.getItem('copynote');
  let value = typeof storage === 'number' ? Number(storage) : 0;
  value += 1;
  localStorage.setItem('copynote', value);
  ipcRenderer.send ('dismiss', value);
}

const Main = () => (
  <div onClick={onClick}>
    hogefuga
  </div>
);

export default Main;
