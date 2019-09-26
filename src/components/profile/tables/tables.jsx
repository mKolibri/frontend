import React, { Component } from 'react';
import { BrowserRouter, Link} from 'react-router-dom';
import { Button } from 'reactstrap';
import style from './table.module.css';
import { url } from '../../configs/config';
import { Alert } from '../../warnings/alert';
import SideNav from '@trendmicro/react-sidenav';

class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAlert: false,
            alertMess: '',
            userID: localStorage.getItem('userID'),
            token : localStorage.getItem('token')
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        if (e.target.id === 'tableName') {
            this.setState({ tableName: e.target.value });
        } else if (e.target.id === 'description') {
            this.setState({ desc : e.target.value });
        }
    }

    logout = () => {
        localStorage.setItem('token', '');
        localStorage.setItem('userID', '');
        this.props.history.push('/');
    }

    async componentDidMount() {
        const userID = this.state.userID;
        const token = this.state.token;

        try {
            const result = await fetch(`${url}tables?userID=${userID}&token=${token}`, {
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

    addTables = () => {
        this.props.history.push('/addTable');
    }

    render() {
        const results = this.state.results;
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
                        <table className="striped responsive-table">
                            <thead>
                                <tr>
                                    <th className={style.head}>Table Name</th>
                                    <th className={style.head}>Creation Date</th>
                                    <th className={style.head}>Description (About table)</th>
                                    <th className={style.head}>Delete</th>
                                    <th className={style.head}>Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(results) && results.length > 0 && results.map(r => (
                                    <tr key={r.id} >
                                        <td><Button className={style.name}>{r.name}</Button></td>
                                        <td>{r.date.substring(0, 10)}</td>
                                        <td>{r.desc}</td>
                                        <td><Button className={style.name}>X</Button></td>
                                        <td><Button className={style.name}>...</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>}
            </BrowserRouter>
        );
    }
}

export { Tab };