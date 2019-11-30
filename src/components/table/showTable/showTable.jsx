import React, { Component } from 'react';
import cookie from 'react-cookies';
import { BrowserRouter, Link } from 'react-router-dom';
import style from './showTable.module.css';
import { Alert } from '../../warnings/alert';
import SideNav from '@trendmicro/react-sidenav';
import { Col, Button, Container, Table } from 'reactstrap';
import { sendRequest } from '../../user/user.dao';
import PropTypes from 'prop-types';

class ShowTable extends Component {
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
            name : cookie.load('tableName'),
            userID: cookie.load('userID')
        };
        this.handleExit = this.handleExit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.logout = this.logout.bind(this);
    }

    async componentDidMount() {
        if (!this.state.userID) {
            this.props.history.push('/');
        }

        const content = await sendRequest('table', 'GET');
        const status = 200;
        if (content) {
            content.json().then((results) => {
                if (status === content.status) {
                    this.setState({
                        table: results.table,
                        description: results.description,
                        columns: results.columns
                    });
                } else if (content.message === 'Failed to fetch') {
                    this.setState({
                        isAlert: true,
                        alertMess: 'Error 404, server not found. Please, try again.'
                    });
                } else {
                    this.setState({
                        isAlert: true,
                        alertMess: content.message + '. Please, try again.'
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

    handleExit() {
        this.setState({
            isAlert: false,
            alertMess: ''
        });
    }

    async logout() {
        await sendRequest('logout', 'GET');
        cookie.remove('tableName', { path: '/' });
        cookie.remove('userID', { path: '/' });
        cookie.remove('loggedin', { path: '/' });
        this.props.history.push('/');
    }

    handleClick() {
        window.location.reload(true);
    }

    componentWillUnmount() {
        cookie.remove('tableName', { path: '/' });
    }

    render() {
        const results = this.state.columns;
        return (
            <BrowserRouter>
                {this.state.isAlert ?
                    <Container className={style.block}>
                        <Alert className={style.block_alert} value={this.state.alertMess}/>
                        <Button className={style.block_button} onClick={this.handleExit}>OK</Button>
                    </Container>
                :
                <Container>
                    <SideNav className={style.sidenav} onClick={this.handleClick}>
                        <Link replace={true} to="/home">
                            <Button className={style.block_button} onClick={this.handleClick}>Home</Button>
                        </Link>
                        <Link replace={true} to="/tables">
                            <Button className={style.block_button} onClick={this.handleClick}>Tables</Button>
                        </Link>
                        <Link to="/addTable">
                            <Button className={style.block_button} onClick={this.handleClick}>Add table</Button>
                        </Link>
                        <Link to="/" onClick={this.logout}>
                            <Button className={style.sidenav_button_logout}>Log out</Button>
                        </Link>
                    </SideNav>
                    <Col className={style.col}>
                        <h1 className={style.col_header}>Table name: {this.state.table}</h1>
                    </Col>
                    <Col className={style.col_desc}>
                        <h1 className={style.col_desc_text}>Description: {this.state.description}</h1>
                    </Col>
                    <Container className={style.cont}>
                        <Table className={style.cont_table}>
                        <thead>
                            <tr>
                                {Array.isArray(results) && results.length && results.map((r) => (
                                    <th key={r.id}>{r.column} ({r.type})</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                        </Table>
                    </Container>
                </Container>}
            </BrowserRouter>
        );
    }
}

export { ShowTable };