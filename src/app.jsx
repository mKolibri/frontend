import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Login } from './components/user/login/login';
import { Registry } from './components/user/registry/registry';
import { Home } from './components/user/home/home';
import { Tab } from './components/table/tables/tables';
import { AddTable } from './components/table/addTable/addTable';
import { ShowTable } from './components/table/showTable/showTable';
import { AddValues } from './components/table/addValues/addValues';
import { UpdateTableInfo } from './components/table/updateTableInfo/updateTableInfo';
import cookie from 'react-cookies';

class App extends Component {
  componentWillUnmount() {
    cookie.remove('userID', {path: '/'});
    cookie.remove('loggedin', {path: '/'});
    cookie.remove('tableID', {path: '/'});
  }

  render() {
    return (
      <BrowserRouter>
        <Route path='/' exact component={Login}/>
        <Route path='/registry' exact component={Registry}/>
        <Route path='/home' exact component={Home}/>
        <Route path='/tables' exact component={Tab}/>
        <Route path='/addTable' exact component={AddTable}/>
        <Route path='/showTable' exact component={ShowTable}/>
        <Route path='/addValues' exact component={AddValues}/>
        <Route path='/updateTableInfo' exact component={UpdateTableInfo}/>
      </BrowserRouter>
    );
  }
}

export { App };