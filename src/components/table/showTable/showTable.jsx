import { Col, Button, Table, Container, Input, FormGroup, Label} from 'reactstrap';
import React, { Component } from 'react';
import cookie from 'react-cookies';
import { BrowserRouter, Link } from 'react-router-dom';
import style from './showTable.module.css';
import { Alert } from '../../warnings/alert';
import SideNav from '@trendmicro/react-sidenav';
import { sendRequest } from '../../user/user.dao';
import PropTypes from 'prop-types';
import {Warning} from '../../warnings/warning';

class ShowTable extends Component {
    static get propTypes() {
        return {
            history: PropTypes.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            isAlert: false,
            alertMess: '',
            name : cookie.load('tableName'),
            userID: cookie.load('userID'),
            addColumn: false,
            showType: 'Number',
            results: [],
            type: 'Integer'
        };
        this.handleExit = this.handleExit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.logout = this.logout.bind(this);
        this.saveResults = this.saveResults.bind(this);
        this.handleAddValues = this.handleAddValues.bind(this);
        this.getValue = this.getValue.bind(this);
        this.addColumn = this.addColumn.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAddColumn = this.handleAddColumn.bind(this);
    }

    async componentDidMount() {
        if (!this.state.userID) {
            this.props.history.push('/');
        }

        const content = await sendRequest('table/' + this.state.name, 'GET');
        const status = 200;
        if (content) {
            content.json().then((results) => {
                if (status === content.status) {
                    this.setState({
                        table: results.table,
                        description: results.description,
                        columns: results.schema
                    });
                    this.saveResults(results.columns);
                } else if (content.message === 'Failed to fetch') {
                    this.setState({
                        isAlert: true,
                        alertMess: 'Error 404, server not found. Please, try again.'
                    });
                } else {
                    this.setState({
                        isAlert: true,
                        alertMess: content.message + '. Please, try again.'
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

    saveResults(results) {
        for (let i = 0; i < results.length; ++i) {
            results[i].number = i;
        }
        this.setState({values: results});
    }

    handleExit() {
        this.setState({
            isAlert: false,
            alertMess: ''
        });
    }

    async logout() {
        await sendRequest('logout', 'GET');
        cookie.remove('tableName', { path: '/' });
        cookie.remove('userID', { path: '/' });
        cookie.remove('loggedin', { path: '/' });
        this.props.history.push('/');
    }

    handleClick() {
        window.location.reload(true);
    }

    handleAddValues() {
        this.props.history.push('/addValues');
    }

    getValue(id) {
        const values = this.state.values;
        let value;
        for (let i = 0; i < values.length; ++i) {
            if (Number(values[i].number) === Number(id)) {
                value = {delValue: values[i]};
            }
        }
        return value;
    }

    async handleDelete(e) {
        e.preventDefault();
        const body = this.getValue(e.target.id);
        body.table = this.state.name;
        const content = await sendRequest('deleteValue', 'POST', body);
        const status = 200;
        if (content) {
            content.json().then((results) => {
                if (status === content.status) {
                    window.location.reload(true);
                } else if (results.message === 'Failed to fetch') {
                    this.setState({
                        isAlert: true,
                        alertMess: 'Error 404, server not found. Please, try again.'
                    });
                } else {
                    this.setState({
                        isAlert: true,
                        alertMess: results.message + '. Please, try again.'
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

    handleAddColumn() {
        this.setState({
            addColumn: !this.state.addColumn
        });
    }

    handleChange(e) {
        if (/\d/.test(e.target.value)) {
            this.setState({
                showResult: true,
                result: 'Column name must contain only letters'
            });
        } else if (e.target.id === 'showType') {
            const type = (e.target.value === 'Number')? 'Integer': 'Varchar(255)';
            this.setState({
                [e.target.id]: e.target.value,
                type: type
            });
        } else {
            this.setState({ [e.target.id]: e.target.value });
        }
    }

    async addColumn() {
        const body = {
            column: this.state.column,
            type: this.state.type,
            tableID: this.state.name
        };
        const name = this.state.column;
        const array = this.state.columns;
        for (let i = 0; i < array.length; ++i) {
            if (array[i].column === name) {
                this.setState({
                    showResult: true,
                    result: 'Column name must not be duplicated'
                });
                return {};
            }
        }

        const content = await sendRequest('addColumn', 'POST', body);
        const status = 200;
        if (content) {
            content.json().then((results) => {
                if (status === content.status) {
                    window.location.reload(true);
                } else if (results.message === 'Failed to fetch') {
                    this.setState({
                        isAlert: true,
                        alertMess: 'Error 404, server not found. Please, try again.'
                    });
                } else {
                    this.setState({
                        isAlert: true,
                        alertMess: results.message + '. Please, try again.'
                    });
                }
            });
        } else {
            this.setState({
                isAlert: true,
                alertMess: 'Error 404, server not found. Please, try again.'
            });
        }
        return {};
    }


    render() {
        const results = this.state.columns;
        const values = this.state.values;
        const count = 0;
        let header = [];
        if (Array.isArray(results) && results.length > count) {
            results.map((r) => (header.push(r.column)));
        }

        return (
            <BrowserRouter>
                {this.state.isAlert ?
                    <Container className={style.block}>
                        <Alert className={style.block_alert} value={this.state.alertMess}/>
                        <Button className={style.error_button} onClick={this.handleExit}>OK</Button>
                    </Container>
                :
                <Container>
                    <SideNav className={style.sidenav} onClick={this.handleClick}>
                        <Link replace={true} to="/home">
                            <Button className={style.block_button} onClick={this.handleClick}>Home</Button>
                        </Link>
                        <Link replace={true} to="/tables">
                            <Button className={style.block_button} onClick={this.handleClick}>Tables</Button>
                        </Link>
                        <Link to="/addTable">
                            <Button className={style.block_button} onClick={this.handleClick}>Add table</Button>
                        </Link>
                        <Link to="/" onClick={this.logout}>
                            <Button className={style.sidenav_button_logout}>Log out</Button>
                        </Link>
                    </SideNav>
                    <Col className={style.col}>
                        <h1 className={style.col_header}>Table name: {this.state.table}</h1>
                    </Col>
                    <Col className={style.col_desc}>
                        {this.state.description ? <h1 className={style.col_desc_text}>Description:
                            {this.state.description}</h1> : null}
                            <Col className={style.col_buttons}>
                                <Button className={style.col_desc_button} onClick={this.handleAddValues}>+ Add Value</Button>
                                <Button className={style.col_desc_button} onClick={this.handleAddColumn}>+ Add Column</Button>
                            </Col>
                    </Col>
                    <Container className={style.cont}>
                        <Table className={style.cont_table}>
                            <thead>
                                <tr>
                                    {Array.isArray(results) && results.length > count && results.map((r) => (
                                        <th key={r.id} className={style.cont_column}>{r.column} ({r.type})</th>
                                    ))}
                                    <th className={style.cont_table_update}>Delete</th>
                                </tr>
                            </thead>
                                <tbody>
                                    {Array.isArray(values) && values.length > count && values.map(res => (
                                        <tr key={res.key}>{Array.isArray(header) && header.length > count && header.map(r => (
                                                <td key={r.key} className={style.cont_table_value}>{res[r]}</td>
                                            ))}
                                            <td><Button className={style.cont_table_button}
                                                onClick={this.handleDelete} id={res.number}>X</Button>
                                            </td>
                                        </tr>
                                        ))}
                                </tbody>
                        </Table>
                    </Container>
                    {this.state.addColumn ?
                        <Container className={style.footer}>
                            <Col>
                                {this.state.showResult ?
                                    <Col className={style.form_warning}><Warning
                                        value={this.state.result} className={style.form_warning_res}/>
                                    </Col> : null}
                                <FormGroup>
                                    <Label for="column">
                                        Name
                                        <span className={style.cont_label_red}>*</span>
                                    </Label>
                                    <Input type="text" id="column" placeholder="Column name"
                                        onChange={this.handleChange} value={this.state.column}
                                        className={style.cont_input} required/>
                                    <Label for="type">
                                        Type
                                        <span className={style.cont_label_red}>*</span>
                                    </Label>
                                    <Input type="select" id="showType" value={this.state.showType}
                                        onChange={this.handleChange} className={style.footer_select} required>
                                            <option id="Integer">Number</option>
                                            <option id="Varchar(255)">String</option>
                                    </Input>
                                    <Button className={style.footer_button}
                                        disabled={this.state.column === ''}
                                        onClick={this.addColumn}>Add Column</Button>
                                    <Button className={style.footer_button_close}
                                        onClick={this.handleAddColumn}>Close</Button>
                                </FormGroup>
                            </Col>
                        </Container> : null}
                </Container>}
            </BrowserRouter>
        );
    }
}

export { ShowTable };