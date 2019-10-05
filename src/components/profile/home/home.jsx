import React, { Component } from 'react';
import SideNav from '@trendmicro/react-sidenav';
import { Button } from 'reactstrap';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { BrowserRouter, Link } from 'react-router-dom'
import style from './home.module.css';
import { url } from '../../configs/config';
import { Alert } from '../../warnings/alert';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: localStorage.getItem('userID'),
            token : localStorage.getItem('token'),
            isAlert: false,
            alertMess: ''
        };
    }

    async componentDidMount() {
        const userID = this.state.userID;
        const token = this.state.token;

        try {

            const result = await fetch(`${url}user?userID=${userID}&token=${token}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            
            const content = await result.json();
            if (200 === result.status) {
                this.setState({name : content.name});
                this.setState({surname : content.surname});
                this.setState({age : content.age});
                this.setState({mail: content.mail});
            } else {
                this.setState({
                    isAlert: true,
                    alertMess: content.message + '. Please, try again.'
                });
            }
        } catch (error) {
            this.setState({
                isAlert: true,
                alertMess: `Error: ${error.message}`
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
        const info = {
            userID: this.state.userID,
            token: this.state.token
        };

        try {
            const result = await fetch(url + 'logout', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(info)
            });
            
            await result.json();
            if (200 === result.status) {
                this.props.history.push('/');
            }
            localStorage.clear();

        } catch (error) {
            localStorage.clear();
        }
    }
    
    render() {
        return (
            <BrowserRouter>
                { this.state.isAlert ? 
                    <div className={style.div}><Alert className={style.alert} value={this.state.alertMess}/>
                        <Button className={style.Button} onClick={this.handleExit}> OK </Button>
                    </div>
                :
                <div>
                    <SideNav className={style.sidenav}>
                        <Link to="/home" onClick={this.toHome}>
                            <Button className={style.Button}> Home </Button>
                        </Link>
                        <Link to="/tables" onClick={this.toTables}>
                            <Button className={style.Button}> Tables </Button>
                        </Link>
                        <Link to="/addTable" onClick={this.addTable}>
                            <Button className={style.Button}> Add table </Button>
                        </Link>
                        <Link to="/" onClick={this.logout}>
                            <Button className={style.logOutButton}> Log out </Button>
                        </Link>
                    </SideNav>
                <div className={style.container}>
                    <div className={style.rightConteiner}>
                        <h3 className={style.text}><span className={style.span}>Name :</span>{this.state.name}</h3>
                        <h3 className={style.text}><span className={style.span}>Surname :</span>{this.state.surname}</h3>
                        <h3 className={style.text}><span className={style.span}>Age :</span>{this.state.age}</h3>
                        <h3 className={style.text}><span className={style.span}> Mail :</span>{this.state.mail}</h3>
                    </div>
                </div>
                </div>}
            </BrowserRouter>
        );
    }
}

export { Home };