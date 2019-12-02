import React, { Component } from 'react';
import { BrowserRouter, Link} from 'react-router-dom';
import { Button, Container, Table } from 'reactstrap';
import { Alert } from '../../warnings/alert';
import { sendRequest } from '../table.dao';
import SideNav from '@trendmicro/react-sidenav';
import cookie from 'react-cookies';
import PropTypes from 'prop-types';
import style from './table.module.css';

class Tab extends Component {
    static get propTypes() {
        return {
            history: PropTypes.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            isAlert: false,
            alertMess: '',
            isDel: false,
            delMess: 'Are you sure whant delete the table?',
            userID: cookie.load('userID', { path: '/' })
        };

        this.handleExit = this.handleExit.bind(this);
        this.logout = this.logout.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.prettyDate = this.prettyDate.bind(this);
        this.saveResults = this.saveResults.bind(this);
        this.removeTable = this.removeTable.bind(this);
        this.delAlert = this.delAlert.bind(this);
    }

    async logout() {
        await sendRequest('logout', 'GET');
        cookie.remove('userID', { path: '/' });
        cookie.remove('loggedin', { path: '/' });
        this.props.history.push('/');
    }

    handleExit() {
        this.setState({
            isAlert: false,
            isDel: false,
            alertMess: ''
        });
        this.props.history.push('/tables');
    }

    prettyDate() {
        let results = this.state.results;
        const begin = 0;
        const end = 10;
        Object.keys(results).map(function(key, index) {
            results[index].date = results[index].date.slice(begin, end);
            return results;
        });
        this.setState({results: results});
    }

    handleClick() {
        window.location.reload();
    }

    saveResults(results) {
        for (let i = 0; i < results.length; ++i) {
            results[i].number = i;
        }
        this.setState({results: results});
    }

    async componentDidMount() {
        if (!this.state.userID) {
            this.props.history.push('/');
        }
        const content = await sendRequest('tables', 'GET');
        const status = 200;
        if (content) {
            content.json().then((result) => {
                if (status === content.status) {
                    this.saveResults(result);
                    this.prettyDate();
                } else {
                    this.setState({
                        isAlert: true,
                        alertMess: result.message + '. Please, try again.'
                    });
                }
            });
        } else {
            this.setState({
                isAlert: true,
                alertMess: 'Error 404, server not found. Please, try again.'
            });
        }
        this.props.history.push('/tables');
    }

    getTable(id) {
        const tables = this.state.results;
        let table;
        for (let i = 0; i < tables.length; ++i) {
            if (Number(tables[i].number) === Number(id)) {
                table = {tableID: tables[i].tableID};
            }
        }
        return table;
    }

    async removeTable() {
        const id = cookie.load('tableID', {path: '/'});
        const body = this.getTable(id);
        const content = await sendRequest('deleteTable', 'POST', body);
        let status = 200;
        this.setState({
            isAlert: false,
            isDel: false,
            alertMess: ''
        });
        if (content) {
            content.json().then((result) => {
                if (status === content.status) {
                    window.location.reload();
                } else {
                    this.setState({
                        isAlert: true,
                        alertMess: result.message + '. Please, try again.'
                    });
                }
            });
        } else {
            this.setState({
                isAlert: true,
                alertMess: 'Error 404, server not found. Please, try again.'
            });
        }
    }

    delAlert(e) {
        e.preventDefault();
        cookie.save('tableID', e.target.id, {path: '/'});
        this.setState({
            isAlert: true,
            isDel: true
        });
    }

    render() {
        const results = this.state.results;
        const count = 0;
        return (
            <BrowserRouter>
                {this.state.isAlert ?
                    (this.state.isDel) ?
                    <Container>
                        <Alert className={style.block_alert} value={this.state.delMess}/>
                        <Button className={style.block_button} onClick={this.removeTable}>Yes</Button>
                        <Button className={style.block_button} onClick={this.handleExit}>No</Button>
                    </Container> :
                    <Container className={style.block}>
                        <Alert className={style.block_alert} value={this.state.alertMess}/>
                        <Button className={style.block_button} onClick={this.handleExit}>OK</Button>
                    </Container>
                :
                <Container>
                    <SideNav className={style.sidenav} onClick={this.handleClick}>
                        <Link to="/home" >
                            <Button className={style.block_button}>Home</Button>
                        </Link>
                        <Link to="/tables">
                            <Button className={style.block_button} disabled>Tables</Button>
                        </Link>
                        <Link to="/addTable">
                            <Button className={style.block_button}>Add table</Button>
                        </Link>
                        <Link to="/" onClick={this.logout}>
                            <Button className={style.sidenav_button_logout}>Log out</Button>
                        </Link>
                    </SideNav>
                    <Container className={style.cont}>
                        <Table>
                            <thead>
                                <tr>
                                    <th className={style.cont_head}>Table Name</th>
                                    <th className={style.cont_head}>Creation Date</th>
                                    <th className={style.cont_head}>Description (About table)</th>
                                    <th className={style.cont_head}>Delete</th>
                                    <th className={style.cont_head}>Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(results) && results.length > count && results.map(r => (
                                    <tr key={r.id} >
                                        <td><Button className={style.cont_table_name}>{r.name}</Button></td>
                                        <td>{r.date}</td>
                                        <td>{r.description}</td>
                                        <td><Button className={style.cont_table_name}
                                            onClick={this.delAlert} id={r.number}>X</Button></td>
                                        <td><Button className={style.cont_table_name} id={r.number}>/</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                </Container>}
            </BrowserRouter>
        );
    }
}

export { Tab };