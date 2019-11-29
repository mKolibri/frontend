import React, { Component } from 'react';
import { BrowserRouter, Link} from 'react-router-dom';
import { Button, Container, Table } from 'reactstrap';
import { Alert } from '../../warnings/alert';
import { sendRequest } from '../table.dao';
import SideNav from '@trendmicro/react-sidenav';
import cookie from 'react-cookies';
import style from './table.module.css';

class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAlert: false,
            alertMess: '',
            userID: cookie.load('userID', { path: '/' })
        };

        this.handleExit = this.handleExit.bind(this);
        this.logout = this.logout.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.prettyDate = this.prettyDate.bind(this);
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
            alertMess: ''
        });
        this.props.history.push('/');
    }

    prettyDate() {
        let results = this.state.results;
        Object.keys(results).map(function(key, index) {
            results[index].date = results[index].date.slice(0, 10);
            return results;
        });
        this.setState({results: results});
    }

    handleClick() {
        window.location.reload();
    }

    async componentDidMount() {
        if (!this.state.userID) {
            this.props.history.push('/');
        }

        const content = await sendRequest('tables', 'GET');
        if (content) {
            content.json().then((result) => {
                if (200 === content.status) {
                    this.setState({results: result});
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
    }

    render() {
        const results = this.state.results;
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
                                {Array.isArray(results) && results.length > 0 && results.map(r => (
                                    <tr key={r.id} >
                                        <td><Button className={style.cont_table_name}>{r.name}</Button></td>
                                        <td>{r.date}</td>
                                        <td>{r.description}</td>
                                        <td><Button className={style.cont_table_name}
                                            onClick={this.remove} id={r.num}>X</Button></td>
                                        <td><Button className={style.cont_table_name}>/</Button></td>
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