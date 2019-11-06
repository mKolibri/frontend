import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Login } from './components/login/login';
import { Registry } from './components/registry/registry';
import { Home } from './components/profile/home/home';
import { Tab } from './components/profile/tables/tables';
import { AddTable } from './components/profile/addTable/addTable';
import { ShowTable } from './components/profile/showTable/showTable';

class App extends Component {
  render() {
    return (
      <div>
          <BrowserRouter>
            <div>
              <Route path='/' exact component={Login}/>
              <Route path='/registry' exact component={Registry}/>
              <Route path='/home' exact component={Home}/>
              <Route path='/tables' exact component={Tab}/>
              <Route path='/addTable' exact component={AddTable}/>
              <Route path='/showTable' exact component={ShowTable}/>
            </div>
          </BrowserRouter>
      </div>
    );
  }
}

export { App };