import React from 'react';
import ReactDOM from 'react-dom';
import { io } from "socket.io-client"
import './index.css';
import 'spectre.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

const socket = io();


