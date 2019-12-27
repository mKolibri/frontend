import { Button, Container, FormGroup, Label, Input, Col } from 'reactstrap';
import React, { Component } from 'react';
import cookie from 'react-cookies';
import { BrowserRouter, Link } from 'react-router-dom';
import style from './addValues.module.css';
import { Alert } from '../../warnings/alert';
import SideNav from '@trendmicro/react-sidenav';
import { sendRequest } from '../../user/user.dao';
import { Warning } from '../../warnings/warning';
import PropTypes from 'prop-types';

class AddValues extends Component {
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
            tableID : cookie.load('tableName'),
            userID: cookie.load('userID'),
            values: [],
            disabled: true,
            columns: []
        };
        this.handleExit = this.handleExit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.logout = this.logout.bind(this);
        this.handleCancle = this.handleCancle.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        if (!this.state.userID) {
            this.props.history.push('/');
        }

        const content = await sendRequest('table/' + this.state.tableID, 'GET');
        const status = 200;
        if (content) {
            content.json().then((results) => {
                if (status === content.status) {
                    this.setState({
                        columns: results.schema,
                        table: results.table
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
        this.props.history.push('/showTable');
    }

    handleExit() {
        this.setState({
            isAlert: false,
            alertMess: ''
        });
    }

    getIndexByKey(values, field) {
        const badStatus = -1;
        if (values && values.length) {
            for (let i = 0; i < values.length; ++i) {
                if (values[i][field] === '' || values[i][field]) {
                    return i;
                }
            }
        }
        return badStatus;
    }

    isColumnExist() {
        const values = this.state.values;
        const count = 0;
        if (values && values.length) {
            let bool = false;
            for (let i = 0; i < values.length; ++i) {
                for (let [, value] of Object.entries(values[i])) {
                    if (value || value === count) {
                        bool = true;
                    }
                }
            }
            return bool;
        } else {
            return false;
        }
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            showResult: false,
            result: ''
        });
        const indexStat = -1;
        const values = this.state.values;
        const index = this.getIndexByKey(values, e.target.id);
        if (index > indexStat) {
            values[index][e.target.id] = e.target.value;
        } else {
            values.push({[e.target.id]: e.target.value});
        }

        this.setState({
            values: values
        });

        if (this.isColumnExist()) {
            this.setState({
                disabled: false
            });
        } else {
            this.setState({
                disabled: true
            });
        }
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

    async handleSave() {
        let body = {
            values: this.state.values,
            tableID: this.state.tableID
        };
        const content = await sendRequest('addValues', 'POST', body);
        const status = 200;
        const badStatus = 409;
        if (content) {
            content.json().then((results) => {
                if (status === content.status) {
                    this.props.history.push('/showTable');
                } else if (badStatus === content.status) {
                    this.setState({
                        showResult: true,
                        result: 'You can\'t add dublicate values in table'
                    });
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

    render() {
        const results = this.state.columns;
        const maxNum = 999999999;
        const minNum = -999999999;
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
                <Container>
                <FormGroup className={style.footer}>
                    {this.state.showResult ?
                        <Col className={style.form_warning}><Warning
                            value={this.state.result} className={style.form_warning_res}/>
                        </Col> : null}
                        <Label for="column">
                            <span className={style.cont_label_red}>If column type is number, then enter
                            number less then 999999999, otherwise the data will be stored with some inaccuracy</span>
                        </Label>
                    {Array.isArray(results) && results.length > count && results.map((r) => (
                        <FormGroup key={r.key}>
                            <Label for="column">
                                {r.column}({r.type})
                                <span className={style.cont_label_red}>*</span>
                            </Label>
                            <Input type={r.type === 'string'? 'text':r.type} id={r.column}
                                placeholder="Column name" maxLength="9"
                                max={maxNum} min={minNum}
                                onChange={this.handleChange} value={this.state.column}
                                className={style.cont_input} required/>
                        </FormGroup>
                    ))}
                    <Button className={style.footer_button}
                        disabled={this.state.disabled}
                        onClick={this.handleSave}>Save</Button>
                    <Button className={style.footer_button_warn}
                        onClick={this.handleCancle}>Cancle</Button>
                    </FormGroup>
                </Container>
                </Container>}
            </BrowserRouter>
        );
    }
}

export { AddValues };

