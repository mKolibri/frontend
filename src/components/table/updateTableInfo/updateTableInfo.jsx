import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import style from './updateTableInfo.module.css';
import { Alert } from '../../warnings/alert';
import SideNav from '@trendmicro/react-sidenav';
import PropTypes from 'prop-types';
import { Col, Input, Button, Label, FormGroup, Container } from 'reactstrap';
import cookie from 'react-cookies';
import { sendRequest } from '../table.dao';
import { Warning } from '../../warnings/warning';

class UpdateTableInfo extends Component {
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
            userID: cookie.load('userID', {path: '/'}),
            name: cookie.load('tableName', {path: '/'}),
            disable: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.logout = this.logout.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleCancle = this.handleCancle.bind(this);
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
                        description: results.description
                    });
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

    handleCancle() {
        cookie.remove('tableName', {path: '/'});
        this.props.history.push('/tables');
    }

    handleChange(e) {
        const { value, maxLength } = e.target;
        const count = 0;
        const message = value.slice(count, maxLength);
        if (e.target.id === 'table' && /\d/.test(e.target.value)) {
            this.setState({
                showResult: true,
                result: 'Table name must contain only letters'
            });
        } else if (e.target.id === 'table' && e.target.value === '') {
                this.setState({
                    showResult: true,
                    result: 'Table name must contain at least 1 letter',
                    disable: true,
                    [e.target.id]: message
                });
        } else {
            this.setState({
                [e.target.id]: message,
                disable: false
            });
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

    handleClick() {
        window.location.reload();
    }

    async handleSubmit(e) {
        e.preventDefault();
        const table = {
            name: this.state.table,
            description: this.state.description,
            tableID: this.state.name
        };

        const content = await sendRequest('updateTableInfo', 'PUT', table);
        const status = 200;
        if (content) {
            content.json().then((result) => {
                if (status === content.status) {
                    cookie.save('tableName', this.state.name, { path: '/' });
                    this.props.history.push('/tables');
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
                        <h1 className={style.col_head_header}>Update Table Information</h1>
                    </Col>
                    <Container className={style.cont}>
                        {this.state.showResult ?
                            <Col><Warning value={this.state.result}/></Col> : null}
                        <FormGroup>
                            <Label className={style.cont_label} for="name">Table name</Label>
                            <Input type="text" id="table" placeholder="Table name"
                                onChange={this.handleChange} className={style.cont_input}
                                value={this.state.table} maxLength="50"/>
                        </FormGroup>
                        <FormGroup>
                            <Label className={style.cont_label} for="description">Description</Label>
                                <Input type="text" id="description" placeholder="About Table"
                                    value={this.state.description} maxLength="100"
                                    className={style.cont_input} onChange={this.handleChange}/>
                        </FormGroup>
                        <Col className={style.cont_label_button}>
                            <Link to="/showTable" className={style.cont_link} onClick={this.handleSubmit}>
                                <Button className={style.cont_link_button_update}
                                    disabled={this.state.disable}>Update Table</Button>
                            </Link>
                            <Button className={style.cont_link_button_cancle}
                                onClick={this.handleCancle}>Cancle</Button>
                        </Col>
                    </Container>
                </Container>}
            </BrowserRouter>
        );
    }
}

export { UpdateTableInfo };