import React, { Component } from 'react';
import { BrowserRouter, Link} from 'react-router-dom';
import style from './showTable.module.css';
import { Alert } from '../../warnings/alert';
import SideNav from '@trendmicro/react-sidenav';
import { Col, Button, Container, Table } from 'reactstrap';
import { get } from '../../configs/dao';
import cookie from 'react-cookies';

class showTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAlert: false,
            alertMess: '',
            name : localStorage.getItem('tableName')
        };
    }

    async componentDidMount() {
        const tableName = this.state.name;
        const path = 'showTable?table=' + tableName;
        const content = await get(path);
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
                alertMess: content.message + '. Please, try again.'
            });
        }
    }

    handleExit = () => {
        this.setState({
            isAlert: false,
            alertMess: ''
        });
    }

    toHome = () => {
        this.props.history.push('/home');
    }

    toTables = () => {
        this.props.history.push('/tables');
    }

    addTable = () => {
        this.props.history.push('/addTable');
    }

    logout = async() => {
        await get('logout');
        cookie.remove('userID', { path: '/' });
        cookie.remove('token', { path: '/' });
        localStorage.removeItem('tableName');
        this.props.history.push('/');
    }

    componentWillUnmount() {
        localStorage.removeItem('tableName');
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
                            {/* {Array.isArray(results) && results.length > 0 && results.map(r => (
                                <tr key={r.id}>
                                    <td>{r.column}</td>
                                    <td>{r.type}</td>
                                    <td><Button className={style.cont_table_name}
                                        onClick={this.remove} id={r.num}
                                    >X</Button></td>
                                </tr>
                            ))} */}
                        </tbody>
                        </Table>
                    </Container>
                </Container>}
            </BrowserRouter>
        );
    }
}

export { showTable };