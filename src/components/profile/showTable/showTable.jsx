import React, { Component } from 'react';
import { BrowserRouter, Link} from 'react-router-dom';
import style from './showTable.module.css';
import { Alert } from '../../warnings/alert';
import SideNav from '@trendmicro/react-sidenav';
import { Col, Button, Container, Table } from 'reactstrap';
import { userLogout, getTable } from '../../configs/config';
import cookie from 'react-cookies';

class showTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAlert: false,
            alertMess: '',
            userID: cookie.load('userID'),
            token: cookie.load('token'),
            name : cookie.load('tableName')
        };
    }

    logout = async() => {
        await userLogout();
        cookie.remove('userID', { path: '/' });
        cookie.remove('token', { path: '/' });
        cookie.remove('tableName', { path: '/' });
        this.props.history.push('/');
    }

    async componentDidMount() {
        const tableName = this.state.name;
        const content = await getTable(tableName);
        if (200 === content.status) {
            this.setState({
                table: content.table,
                description: content.description,
                columns: content.columns
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

    render() {
        const results = this.state.columns;
        return (
            <BrowserRouter>
                {this.state.isAlert ? 
                    <Container className={style.block}>
                        <Alert className={style.block-alert} value={this.state.alertMess}/>
                        <Button className={style.block-button} onClick={this.handleExit}> OK </Button>
                    </Container>
                :
                <Container>
                    <SideNav className={style.sidenav}>
                        <Link to="/home" onClick={this.toHome}>
                            <Button className={style.block-button}> Home </Button>
                        </Link>
                        <Link to="/tables" onClick={this.toTables}>
                            <Button className={style.block-button}> Tables </Button>
                        </Link>
                        <Link to="/addTable" onClick={this.addTable}>
                            <Button className={style.block-button}> Add table </Button>
                        </Link>
                        <Link to="/" onClick={this.logout}>
                            <Button className={style.sidenav-button-logout}> Log out </Button>
                        </Link>
                    </SideNav>
                    <Col className={style.col}>           
                        <h1 className={style.col-header}> Table name: {this.state.table} </h1>
                    </Col>
                    <Col className={style.col-desc}>      
                        <h1 className={style.col-desc-text}> Description: {this.state.description} </h1>
                    </Col>
                    <Container className={style.cont}>
                        <Table className={style.cont-table}>
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
                                    <td><Button className={style.cont-table-name}
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