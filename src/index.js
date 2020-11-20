import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import mutilRule from './views/mutilRule';
import follw from './views/follw';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as serviceWorker from './serviceWorker';
import "antd/dist/antd.css";


ReactDOM.render(
  <Router>
    <Switch>
        <Route path="/" exact component={mutilRule} />
        <Route path="/follw/" component={follw} />
    </Switch>
  </Router>
  ,document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
