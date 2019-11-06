import React, { Component } from 'react';
import { BrowserRouter, Link} from 'react-router-dom';
import style from './showTable.module.css';
import { Alert } from '../../warnings/alert';
import SideNav from '@trendmicro/react-sidenav';
import { Col, Button, Container, Table } from 'reactstrap';
import { showTableFetch } from './showTable.dao';
import { logOut } from '../../components.dao';
import cookie from 'react-cookies';

class ShowTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAlert: false,
            alertMess: '',
            name : cookie.load('tableName')
        };

        this.handleExit = this.handleExit.bind(this);
        this.toHome = this.toHome.bind(this);
        this.toTables = this.toTables.bind(this);
        this.addTable = this.addTable.bind(this);
        this.logout = this.logout.bind(this);
    }

    async componentDidMount() {
        const tableName = this.state.name;
        const path = 'table/' + tableName;
        const content = await showTableFetch(path);
        const results = content.json();

        if (200 === content.status) {
            this.setState({
                table: content.table,
                description: content.description,
                columns: content.columns
            });
        }  else if (content.message === 'Failed to fetch') {
            this.setState({
                isAlert: true,
                alertMess: 'Error 404, server not found. Please, try again.'
            });
        } else {
            this.setState({
                isAlert: true,
                alertMess: results.message + '. Please, try again.'
            });
        }
    }

    handleExit() {
        this.setState({
            isAlert: false,
            alertMess: ''
        });
    }

    toHome() {
        this.props.history.push('/home');
    }

    toTables() {
        this.props.history.push('/tables');
    }

    addTable() {
        this.props.history.push('/addTable');
    }

    async logout() {
        await logOut();
        cookie.remove('tableName', { path: '/' });
        this.props.history.push('/');
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
                        <Button className={style.block_button} onClick={this.handleExit}> OK </Button>
                    </Container>
                :
                <Container>
                    <SideNav className={style.sidenav}>
                        <Link to="/home" onClick={this.toHome}>
                            <Button className={style.block_button}> Home </Button>
                        </Link>
                        <Link to="/tables" onClick={this.toTables}>
                            <Button className={style.block_button}> Tables </Button>
                        </Link>
                        <Link to="/addTable" onClick={this.addTable}>
                            <Button className={style.block_button}> Add table </Button>
                        </Link>
                        <Link to="/" onClick={this.logout}>
                            <Button className={style.sidenav_button_logout}> Log out </Button>
                        </Link>
                    </SideNav>
                    <Col className={style.col}>
                        <h1 className={style.col_header}> Table name: {this.state.table} </h1>
                    </Col>
                    <Col className={style.col_desc}>
                        <h1 className={style.col_desc_text}> Description: {this.state.description} </h1>
                    </Col>
                    <Container className={style.cont}>
                        <Table className={style.cont_table}>
                        <thead>
                            <tr>
                                {Array.isArray(results) && results.length > 0 && results.map(r => (
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