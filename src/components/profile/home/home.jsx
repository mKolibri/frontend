import React, { Component } from 'react';
import SideNav from '@trendmicro/react-sidenav';
import { Container, Button } from 'reactstrap';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { BrowserRouter, Link } from 'react-router-dom'
import style from './home.module.css';
import { Alert } from '../../warnings/alert';
import { userLogout, getUser } from '../../configs/config';
import cookie from 'react-cookies';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: cookie.load('userID'),
            token: cookie.load('token'),
            isAlert: false,
            alertMess: ''
        };
    }

    async componentDidMount() {
        const content = await getUser();
        if (200 === content.status) {
            this.setState({
                name : content.name,
                surname : content.surname,
                age : content.age,
                mail: content.mail
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

    handleExit = (e) => {
        this.setState({
            isAlert: false,
            alertMess: ''
        });
    }

    logout = async() => {
        await userLogout();
        cookie.remove('userID', { path: '/' });
        cookie.remove('token', { path: '/' });
        cookie.remove('tableName', { path: '/' });
        this.props.history.push('/');
    }
    
    render() {
        return (
            <BrowserRouter>
                { this.state.isAlert ? 
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
                <Container className={style.cont}>
                    <Container className={style.rightConteiner}>
                        <h3><span className={style.cont-text}>Name :</span>{this.state.name}</h3>
                        <h3><span className={style.cont-text}>Surname :</span>{this.state.surname}</h3>
                        <h3><span className={style.cont-text}>Age :</span>{this.state.age}</h3>
                        <h3><span className={style.cont-text}>Mail :</span>{this.state.mail}</h3>
                    </Container>
                </Container>
                </Container>}
            </BrowserRouter>
        );
    }
}

export { Home };