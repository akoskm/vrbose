import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';

import { routes } from './routes';

import createBrowserHistory from 'history/lib/createBrowserHistory';

import './styles/scss/style.scss';
import 'react-flexgrid/lib/flexgrid.css';
import 'bootstrap/less/bootstrap.less';
import 'react-dropzone-component/styles/filepicker.css';
import 'react-dropzone-component/example/styles/example.css';
import 'react-dropzone-component/node_modules/dropzone/dist/dropzone.css';
import 'react-select/dist/react-select.css';

ReactDOM.render(
  <Router routes={routes} history={createBrowserHistory()} />,
  document.getElementById('app')
);
