import React, { Component } from 'react';
import SideNav, { NavItem} from '@trendmicro/react-sidenav';
import { Button } from 'reactstrap';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { BrowserRouter, Link, NavLink } from 'react-router-dom'
import style from './home.module.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: localStorage.getItem('userID'),
            token : localStorage.getItem('token')
        };
    }

    async componentDidMount() {
        const userID = this.state.userID;
        const token = this.state.token;

        try {
            const result = await fetch(`http://localhost:10000/user?userID=${userID}&token=${token}`, {
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
                alert(content.message);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }   
    }

    toHome = () => {
        this.props.history.push('/home');
    }

    toTables = () => {
        this.props.history.push('/tables');
    }
    
    render() {
        return (
            <BrowserRouter>
                <SideNav className={style.sidenav} >
                    <SideNav.Toggle />
                    <SideNav.Nav defaultSelected="home" >
                        <NavItem eventKey="home">
                            <NavLink to="/home" onClick={this.toHome} className={style.bar}>
                                Home
                            </NavLink>
                            <NavLink to="/tables" onClick={this.toTables} className={style.bar}>
                                Tables
                            </NavLink>
                        </NavItem>
                        <Link to="/" onClick={() => {
                            if (window.confirm("Do you really want to Sign Out?")) {        
                                localStorage.setItem('token', '');
                                localStorage.setItem('userID', '');
                                this.props.history.push('/');  }}
                        }>
                                <Button className={style.logOutButton}> Log out </Button>
                        </Link>
                    </SideNav.Nav>
                </SideNav>
                <div className={style.container}>
                    <div className={style.rightConteiner}>
                        <h3 className={style.text}> Name : {this.state.name} </h3>
                        <h3 className={style.text}> Surname : {this.state.surname} </h3>
                        <h3 className={style.text}> Age : {this.state.age} </h3>
                        <h3 className={style.text}> Mail : {this.state.mail} </h3>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default Home;