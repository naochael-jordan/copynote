import React from 'react';
import { render } from 'react-dom';
import Main from './Main';

render(
  <Main />,
  document.getElementById('app')
);


// document.addEventListener('click', event => {
//   event.preventDefault ();
//   ipcRenderer.send ('dismiss', 'fugaaaa');
// });
