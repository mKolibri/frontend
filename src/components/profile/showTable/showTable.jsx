import React, { Component } from 'react';
import { BrowserRouter, Link} from 'react-router-dom';
import style from './showTable.module.css';
import { url } from '../../configs/config';
import { Alert } from '../../warnings/alert';
import SideNav from '@trendmicro/react-sidenav';
import { Col, Button } from 'reactstrap';

class showTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAlert: false,
            alertMess: '',
            userID: localStorage.getItem('userID'),
            token : localStorage.getItem('token'),
            name : localStorage.getItem('tableName')
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        if (e.target.id === 'tableName') {
            this.setState({ tableName: e.target.value });
        } else if (e.target.id === 'description') {
            this.setState({ description : e.target.value });
        } else if (e.target.id === 'column') {
            this.setState({ column : e.target.value });
        } else if (e.target.id === 'type') {
            this.setState({ type : e.target.value });
        }
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

    async componentDidMount() {
        const userID = this.state.userID;
        const token = this.state.token;
        const tableName = this.state.name;

        try {
            const result = await fetch(`${url}showTable?userID=${userID}&token=${token}&table=${tableName}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            
            const content = await result.json();
            if (200 === result.status) {
                this.setState({result : content});
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
        const results = this.state.result;

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
                    <Col className={style.head}>           
                        <h1 className={style.header}> {this.state.tableName} </h1>
                    </Col>
                    <div className={style.container}>
                        <table className={style.table}>
                        <thead>
                            {Array.isArray(results) && results.length > 0 && results.map(r => (
                                <tr key={r.id}>
                                    <th>{r.column} ({r.type})</th>
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {/* {Array.isArray(results) && results.length > 0 && results.map(r => (
                                <tr key={r.id}>
                                    <td>{r.column}</td>
                                    <td>{r.type}</td>
                                    <td><Button className={style.name}
                                        onClick={this.remove} id={r.num}
                                    >X</Button></td>
                                </tr>
                            ))} */}
                        </tbody>
                        </table>
                    </div>
                </div>}
            </BrowserRouter>
        );
    }
}

export { showTable };