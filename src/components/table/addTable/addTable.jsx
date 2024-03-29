import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import style from './addTable.module.css';
import { Alert } from '../../warnings/alert';
import SideNav from '@trendmicro/react-sidenav';
import PropTypes from 'prop-types';
import { Col, Input, Button, Label, FormGroup, Table, Container } from 'reactstrap';
import cookie from 'react-cookies';
import { sendRequest } from '../table.dao';
import { Warning } from '../../warnings/warning';

class AddTable extends Component {
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
            showResult: false,
            result: '',
            results: [],
            showType: 'Number',
            type: 'INTEGER',
            num : 1,
            isColumnsExist: false,
            userID: cookie.load('userID', {path: '/'})
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.logout = this.logout.bind(this);
        this.addColumn = this.addColumn.bind(this);
        this.remove = this.remove.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(e) {
        this.setState({
            showResult: false,
            result: ''
        });
        const count = 0;
        const { value, maxLength } = e.target;
        const message = value.slice(count, maxLength);
        if (e.target.id === 'column' && /\d/.test(e.target.value)) {
            this.setState({
                showResult: true,
                result: 'Column name must contain only letters'
            });
        } else if (e.target.id === 'showType') {
            const type = (e.target.value === 'Number')? 'Integer': 'Varchar(255)';
            this.setState({
                [e.target.id]: message,
                type: type
            });
        } else if (e.target.id === 'tableName' && /\d/.test(e.target.value)) {
            this.setState({
                showResult: true,
                result: 'Table name must contain only letters'
            });
        } else {
            this.setState({ [e.target.id]: message });
        }
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
    }

    addColumn() {
        const add = 1;
        this.setState((state) => {
            const value = {
                column: this.state.column,
                num: this.state.num,
                type: this.state.type,
                showType: this.state.showType
            };
            const results = state.results.concat(value);
            const name = this.state.column;
            const array = this.state.results;
            for (let i = 0; i < array.length; ++i) {
                if (array[i].column === name) {
                    this.setState({
                        showResult: true,
                        result: 'Column name must not be duplicated'
                    });
                    return {};
                }
            }
            return { results };
        });

        this.setState({
            column: '',
            num: this.state.num + add,
            isColumnsExist: true
        });
    }

    remove(e) {
        let id = e.target.id;
        let array = [...this.state.results];
        const count = 1;
        for (let i = 0; i < array.length; ++i) {
            if (Number(array[i].num) === Number(id)) {
                array.splice(i, count);
                --i;
            }
        }
        const number = 1;
        if (Number(array.length) < number) {
            this.setState({
                isColumnsExist: false
            });
        }
        this.setState({results: array});
    }

    handleClick() {
        window.location.reload();
    }

    async handleSubmit(e) {
        e.preventDefault();
        const table = {
            'name': this.state.tableName,
            'description': this.state.description,
            'columns' : this.state.results
        };

        const content = await sendRequest('addTable', 'POST', table);
        const status = 200;
        const cutNumber = 1;
        if (content) {
            content.json().then((result) => {
                if (status === content.status) {
                    cookie.save('tableName', result.name.substr(cutNumber ), { path: '/' });
                    this.props.history.push('/showTable');
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
        const count = 0;
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
                        <Link to="/home">
                            <Button className={style.block_button}>Home</Button>
                        </Link>
                        <Link to="/tables">
                            <Button className={style.block_button}>Tables</Button>
                        </Link>
                        <Link to="/addTable">
                            <Button className={style.block_button} disabled>Add table</Button>
                        </Link>
                        <Link to="/" onClick={this.logout}>
                            <Button className={style.sidenav_button_logout}>Log out</Button>
                        </Link>
                    </SideNav>
                    <Col className={style.col_head}>
                        <h1 className={style.col_head_header}>Create Table</h1>
                    </Col>
                    <Container className={style.cont}>
                        <Col>
                            <FormGroup>
                                <Label for="name" className={style.form_label}>Name
                                    <span className={style.cont_label_red}>*</span>
                                </Label>
                                <Input type="text" id="tableName" maxLength="50" placeholder="Table name"
                                    onChange={this.handleChange} className={style.cont_input}
                                    value={this.state.tableName} required/>
                                <h6 className={style.cont_link_info}>Name must contain only letters</h6>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="description" className={style.form_label}>Description</Label>
                                    <Input type="text" id="description" placeholder="Not required"
                                        maxLength="100" className={style.cont_input} onChange={this.handleChange}/>
                            </FormGroup>
                        </Col>
                        <Col>
                            <Label for="createTable" className={style.form_label}>If your table ready, then press...</Label>
                            <Link to="/showTable" onClick={this.handleSubmit}>
                                <Button className={style.cont_link_button}
                                    disabled={ (this.state.tableName)? ((this.state.isColumnsExist)? false: true): true}>
                                    Create Table</Button>
                            </Link>
                            <h6 className={style.cont_link_info}>You must have one column at least!</h6>
                        </Col>
                    </Container>
                    <Container className={style.cont}>
                        <Table bordered lassName={style.cont_table}>
                        <thead>
                            <tr>
                                <th className={style.col_head}>Column Name</th>
                                <th className={style.col_head}>Column Type</th>
                                <th className={style.col_head}>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(results) && results.length > count && results.map(r => (
                                <tr key={r.id} >
                                    <td className={style.col_row}>{r.column}</td>
                                    <td className={style.col_row}>{r.showType}</td>
                                    <td className={style.col_row_del}><Button className={style.cont_table_name}
                                        onClick={this.remove} id={r.num}
                                    >X</Button></td>
                                </tr>
                            ))}
                        </tbody>
                        </Table>
                    </Container>
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
                                    className={style.cont_input} maxLength="20" required/>
                                <Label for="type">
                                    Type
                                    <span className={style.cont_label_red}>*</span>
                                </Label>
                                <Input type="select" id="showType" value={this.state.showType}
                                    onChange={this.handleChange} className={style.footer_select} required>
                                        <option onChange={this.handleSelect} id="INTEGER">Number</option>
                                        <option onChange={this.handleSelect} id="VARCHAR(255)">String</option>
                                </Input>
                                <Button className={style.footer_button}
                                    disabled={!this.state.column}
                                    onClick={this.addColumn}>Add Column</Button>
                            </FormGroup>
                        </Col>
                    </Container>
                </Container>}
            </BrowserRouter>
        );
    }
}

export { AddTable };