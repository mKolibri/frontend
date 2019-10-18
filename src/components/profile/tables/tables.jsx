import React, { Component } from 'react';
import { BrowserRouter, Link} from 'react-router-dom';
import { Button, Container, Table } from 'reactstrap';
import style from './table.module.css';
import { Alert } from '../../warnings/alert';
import SideNav from '@trendmicro/react-sidenav';
import { userLogout, getTables } from '../../configs/config';
import cookie from 'react-cookies';

class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAlert: false,
            alertMess: '',
            userID: cookie.load('userID'),
            token: cookie.load('token')
        };
    }

    handleChange(e) {
            this.setState({ [e.target.id]: e.target.value });
    }
    
    logout = async() => {
        await userLogout();
        cookie.remove('userID', { path: '/' });
        cookie.remove('token', { path: '/' });
        cookie.remove('tableName', { path: '/' });
        this.props.history.push('/');
    }

    async componentDidMount() {
        const content = await getTables();
        if (200 === content.status) {
            this.setState({results : content});
        } else if (content.message === 'Failed to fetch'){
            this.setState({
                isAlert: true,
                alertMess: 'Server 404 not found. Please, try again.'
            });
        } else {
            this.setState({
                isAlert: true,
                alertMess: content.message + '. Please, try again.'
            });
        }
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
        const results = this.state.results;
        return (
            <BrowserRouter>
                {this.state.isAlert ? 
                    < Container className={style.block}>
                        <Alert className={style.block_alert} value={this.state.alertMess}/>
                        <Button className={style.block_button} onClick={this.handleExit}> OK </Button>
                    </ Container>
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
                                {Array.isArray(results) && results.length > 0 && results.map(r => (
                                    <tr key={r.id} >
                                        <td><Button className={style.cont_table_name}>{r.name}</Button></td>
                                        <td>{r.date}</td>
                                        <td>{r.desc}</td>
                                        <td><Button className={style.cont_table_name}>X</Button></td>
                                        <td><Button className={style.cont_table_name}>...</Button></td>
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