import React, { Component } from 'react';
import { BrowserRouter, Link} from 'react-router-dom';
import style from './addTable.module.css';
import { url } from '../../configs/config';
import { Alert } from '../../warnings/alert';
import SideNav from '@trendmicro/react-sidenav';
import { Col, Input, Button, Label, FormGroup } from 'reactstrap';

class addTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAlert: false,
            alertMess: '',
            type: 'Number',
            num : 1,
            userID: localStorage.getItem('userID'),
            token : localStorage.getItem('token'),
            results: []
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
            localStorage.setItem('token', '');
            localStorage.setItem('userID', '');
            localStorage.setItem('tableName', '');

        } catch (error) {
            localStorage.setItem('token', '');
            localStorage.setItem('userID', '');
            localStorage.setItem('tableName', '');
        }  
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

    addColumn = () => {
        this.setState((state) => {
            const value = {
                column: this.state.column,
                type: this.state.type,
                num: this.state.num
            };

            const results = state.results.concat(value);
            return {results};
        });

        this.setState({
            column: '',
            num: this.state.num + 1
        });
    }

    remove = (e) => {
        const id = e.target.id;
        let array = [...this.state.results];
        for (let i = 0; i < array.length; ++i) {
            if (Number(array[i].num) === Number(id)) {
                array.splice(i, 1);
                --i;
            }
        }
        this.setState({results: array});
    }

    handleSubmit = async(e) => {
        e.preventDefault();
        const userID = this.state.userID;
        const token = this.state.token;
        const table = {
            "userID": userID,
            "token": token,
            "name": this.state.tableName,
            "description": this.state.description,
            "columns" : this.state.results
        };

        try {
            const result = await fetch( url + 'addTable', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(table)
            });

            const content = await result.json();
            if (200 === result.status) {
                localStorage.setItem('tableName', content.name);
                this.props.history.push('/showTable');
            } else {
                this.setState({
                    isAlert: true,
                    allertMess: content.message
                });
            }
        } catch (err) {
            this.setState({
                isAlert: true,
                allertMess: err.message
            });
        }    
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
                    <Col className={style.head}>           
                        <h1 className={style.header}> Create Table </h1>
                    </Col>
                    <div className={style.container}>
                        <Col>
                            <FormGroup>
                                <Label for="name">
                                    Name
                                    <span className={style.red}>*</span>
                                </Label>
                                <Input type="text" id="tableName" placeholder="Table name"
                                    onChange={this.handleChange} className={style.fix} required/>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                    <Input type="text" id="description" placeholder="Not required" 
                                        className={style.fix} onChange={this.handleChange}/>
                            </FormGroup>
                        </Col>
                        <Col>
                            <Label for="createTable">If your table ready, then press...</Label>
                            <Link to="/showTable" onClick={this.handleSubmit}>
                                <Button className={style.create}
                                    disabled={!this.state.tableName}> Create Table </Button>
                            </Link>
                        </Col>
                    </div>
                    <div className={style.container}>
                        <table className={style.table}>
                        <thead>
                            <tr>
                                <th className={style.head}>Column Name</th>
                                <th className={style.head}>Column Type</th>
                                <th className={style.head}>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(results) && results.length > 0 && results.map(r => (
                                <tr key={r.id}>
                                    <td>{r.column}</td>
                                    <td>{r.type}</td>
                                    <td><Button className={style.name}
                                        onClick={this.remove} id={r.num}
                                    >X</Button></td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    <div className={style.footer}>
                        <Col>
                            <FormGroup>
                                <Label for="column">
                                    Name
                                    <span className={style.red}>*</span>
                                </Label>
                                <Input type="text" id="column" placeholder="Column name"
                                    onChange={this.handleChange} value={this.state.column}
                                    className={style.input} required/>
                                <Label for="type">
                                    Type
                                    <span className={style.red}>*</span>
                                </Label>
                                <Input type="select" name="type" id="type" value={this.state.type}
                                    onChange={this.handleChange} className={style.select}>
                                        <option>Number</option>
                                        <option>String</option>
                                        <option>Date</option>
                                </Input>
                                <Button className={style.addButton} 
                                    disabled={!this.state.column}
                                    onClick={this.addColumn}> Add Column </Button>
                            </FormGroup>
                        </Col>
                    </div>
                </div>}
            </BrowserRouter>
        );
    }
}

export { addTable };