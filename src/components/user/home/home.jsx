import React, { Component } from 'react';
import SideNav from '@trendmicro/react-sidenav';
import { Container, Button } from 'reactstrap';
import style from './home.module.css';
import { Alert } from '../../warnings/alert';
import { sendRequest } from '../user.dao';
import cookie from 'react-cookies';
import { BrowserRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Home extends Component {
    static get propTypes() {
        return {
            history: PropTypes.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            isAlert: false,
            alertMess: ''
        };
        this.logout = this.logout.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount() {
        if (!cookie.load('userID', {path: '/'})) {
            this.props.history.push('/');
        }

        const content = await sendRequest('user', 'GET');
        const normalStatus = 200;
        const badStatus = 400;
        const stat = 401;
        if (content) {
            content.json().then((result) => {
                if (normalStatus === content.status) {
                    this.setState(result);
                } else if (badStatus === content.status || stat === content.status) {
                    cookie.remove('userID', { path: '/'});
                    this.props.history.push('/');
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

    handleExit() {
        this.setState({
            isAlert: false,
            alertMess: ''
        });
        this.props.history.push('/');
    }

    handleClick() {
        window.location.reload();
    }

    async logout() {
        await sendRequest('logout', 'GET');
        cookie.remove('userID', { path: '/' });
        cookie.remove('loggedin', { path: '/' });
        this.props.history.push('/');
    }

    render() {
        return (
            <BrowserRouter>
                { this.state.isAlert ?
                    <Container className={style.block}>
                        <Alert className={style.block_alert} value={this.state.alertMess}/>
                        <Button className={style.error_button} onClick={this.handleExit}>OK</Button>
                    </Container>
                :
                <Container>
                    <SideNav className={style.sidenav} onClick={this.handleClick}>
                        <Link to="/home">
                            <Button className={style.block_button} disabled>Home</Button>
                        </Link>
                        <Link to="/tables">
                            <Button className={style.block_button}>Tables</Button>
                        </Link>
                        <Link to="/addTable">
                            <Button className={style.block_button}>Add table</Button>
                        </Link>
                        <Link to="/" onClick={this.logout}>
                            <Button className={style.sidenav_button_logout}>Log out</Button>
                        </Link>
                    </SideNav>

                    <Container className={style.cont}>
                        <Container className={style.rightConteiner}>
                            <h3><span className={style.cont_text}>Name: </span>{this.state.name}</h3>
                            <h3><span className={style.cont_text}>Surname: </span>{this.state.surname}</h3>
                            <h3><span className={style.cont_text}>Age: </span>{this.state.age}</h3>
                            <h3><span className={style.cont_text}>Mail: </span>{this.state.mail}</h3>
                        </Container>
                    </Container>
                </Container>}
             </BrowserRouter>
        );
    }
}

export { Home };