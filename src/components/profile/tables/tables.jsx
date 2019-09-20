import React, { Component } from 'react';
import SideNav, { NavItem} from '@trendmicro/react-sidenav';
import {  Input, Button } from 'reactstrap';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { BrowserRouter, NavLink, Link} from 'react-router-dom'
import style from '../home/home.module.css';

class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: localStorage.getItem('userID'),
            token : localStorage.getItem('token')
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        if (e.target.id === 'taleName') {
            this.setState({ tableName: e.target.value });
        } else if (e.target.id === 'description') {
            this.setState({ desc : e.target.value });
        }
    }

    async componentDidMount() {
        const userID = this.state.userID;
        const token = this.state.token;

        try {
            const result = await fetch(`http://localhost:10000/tables?userID=${userID}&token=${token}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            
            const content = await result.json();
            if (200 === result.status) {
                this.setState({results : content});
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
        const results = this.state.results;

        return (
            <BrowserRouter>
                <SideNav className={style.sidenav} >
                    <SideNav.Toggle />
                    <SideNav.Nav defaultSelected="tables" >
                        <NavItem eventKey="tables">
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
                        <table className="striped responsive-table dark hover">
                            <thead>
                                <tr>
                                    <th>Table Name</th>
                                    <th>Creation Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(results) && results.length > 0 && results.map(r => (
                                    <tr key={r.id} >
                                        <td><Button className={style.button}>{r.name}</Button></td>
                                        <td>{r.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={style.container}>
                    <div className={style.rightConteiner}>
                    <Input type="text" name="tableName" id="tableName"
                        placeholder="New table name*"
                        onChange={this.handleChange} required />
                    <Input type="text" name="description" id="description"
                        placeholder="Description(tell about table)..." className={style.input}
                        onChange={this.handleChange}/>
                        
                        <Button className={style.addButton}>Add Table</Button>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default Tab;