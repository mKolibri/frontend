import './App.css';
import React, { Component } from 'react';
import Login from './components/login/login';
import { BrowserRouter, Route } from 'react-router-dom';
import Registry from './components/registry/registry';
import Home from './components/profile/home/home';

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Route path='/' exact component={Login} />
            <Route path='/registry' exact component={Registry} />
            <Route path='/home' exact component={Home} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;