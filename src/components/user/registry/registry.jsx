import { Container, Col, Form, Row, Input, Button, Label, FormGroup } from 'reactstrap';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './registry.module.css';
import { Warning } from '../../warnings/warning';
import { Alert } from '../../warnings/alert';
import { sendRequest } from '../user.dao';
import cookie from 'react-cookies';
import PropTypes from 'prop-types';

class Registry extends Component {
    static get propTypes() {
        return {
            history: PropTypes.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            surname: '',
            mail: '',
            age:'',
            password: '',
            confirmPassword: '',
            showResults: false,
            results: '',
            isAlert: false,
            alertMessage : '',
            disabled: false,
            status: 200,
            userID: cookie.load('userID', {path: '/'})
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.closeWarnings = this.closeWarnings.bind(this);
        this.getWarnings = this.getWarnings.bind(this);
    }

    componentDidMount() {
        if (this.state.userID) {
            this.props.history.push('/home');
        }
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            showResults: false,
            results: null
        });
        const { value, maxLength } = e.target;
        const count = 0;
        const message = value.slice(count, maxLength);
        this.setState({ [e.target.id]: message });
    }

    handleExit() {
        const status = 500;
        if (status === this.state.status) {
            this.setState({
                mail: ''
            });
        }
        this.setState({
            isAlert: false,
            allertMessage: ''
        });
        this.props.history.push('/registry');
    }

    closeWarnings() {
        this.setState({
            result: '',
            showResults: false
        });
    }

    getWarnings() {
        const warnings = this.state.results;
        const size = warnings.length;
        let messages = '';
        for (let i = 0; i < size; ++i) {
            messages += '\n' + warnings[i].msg;
            if (String(warnings[i].param) === 'password') {
                this.setState({
                    confirmPassword: ''
                });
            }
            this.setState({
                [warnings[i].param]: ''
            });
        }
        return messages;
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.setState({
            disabled: true
        });
        if (this.state.password === this.state.confirmPassword) {
            const user = {
                name: this.state.name,
                surname: this.state.surname,
                password: this.state.password,
                mail: this.state.mail,
                age: this.state.age
            };

            const content = await sendRequest('registration', 'POST', user);
            const normalStatus = 200;
            const badStatus = 502;
            if (content) {
                this.setState({
                    status: content.status
                });
                content.json().then((result) => {
                    if (normalStatus === content.status) {
                        cookie.save('userID', result.userID, {path: '/'});
                        this.props.history.push('/home');
                    } else if (badStatus === content.status) {
                        let warningArr = [];
                        for (let i = 0; i < result.length; ++i) {
                            warningArr.push(result[i]);
                        }
                        this.setState({results: warningArr});
                        const warnings = this.getWarnings();
                        this.setState({
                            showResults: true,
                            disabled: false,
                            results: warnings
                        });
                    } else if (result.message === 'Failed to fetch') {
                        this.setState({
                            isAlert: true,
                            disabled: false,
                            alertMessage: 'Error 404, server not found. Please, try again.'
                        });
                    } else {
                        this.setState({
                            isAlert: true,
                            disabled: false,
                            alertMessage: result.message
                        });
                    }
                });
            } else {
                this.setState({
                    isAlert: true,
                    disabled: false,
                    alertMessage: 'Error 404, server not found. Please, try again.'
                });
            }
        } else {
            this.setState({
                showResults: true,
                disabled: false,
                results: 'Confirm password is failed.',
                confirmPassword: '',
                password: ''
            });
        }
    }

    render() {
        return (
            <Container className={style.block} >
                {this.state.isAlert ?
                    <Container className={style.block_cont}>
                        <Alert className={style.block_cont_alert} value={this.state.alertMessage}/>
                        <Button className={style.block_cont_button} onClick={this.handleExit}>OK</Button>
                    </Container>
                :
                <Form className={style.form} onSubmit={this.handleSubmit}>
                    <Container>
                        <Row>
                            <Col>
                                <h4 className={style.form_header}>REGISTRATION</h4>
                            </Col>
                            {this.state.showResults ?
                                <Col className={style.form_warning}><Warning
                                    value={this.state.results}/>
                                <Button className={style.form_warning_exit} onClick={this.closeWarnings}>
                                    X</Button></Col> : null }
                            <Col md="12">
                            <FormGroup>
                                    <Label for="name" className={style.form_label}>
                                        Name<span className={style.form_label_red}>*</span>
                                    </Label><br/>
                                    <Input type="text" id="name" placeholder="Firstst symbol- uppercase"
                                        value={this.state.name} onChange={this.handleChange}
                                        className={style.form_input} maxLength="20" required/>
                            </FormGroup>
                             </Col>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="surname" className={style.form_label}>Surname</Label><br/>
                                    <Input type="text" id="surname" placeholder="Not required" maxLength="30"
                                        value={this.state.surname}
                                        onChange={this.handleChange} className={style.form_input}/>
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="age" className={style.form_label}>Age</Label><br/>
                                    <Input type="number" min={6} id="age" placeholder="Only number"
                                        value={this.state.age} maxLength="2"
                                        onChange={this.handleChange} className={style.form_input}/>
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <Label for="mail" className={style.form_label}>
                                    E-mail<span className={style.form_label_red}>*</span>
                                </Label><br/>
                                <Input type="mail" id="mail" placeholder="Example@index.com"
                                    value={this.state.mail} maxLength="50"
                                    onChange={this.handleChange} className={style.form_input} required/>
                            </Col>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="password" className={style.form_label}>
                                        Password<span className={style.form_label_red}>*</span>
                                    </Label><br/>
                                    <Input type="password" id="password" maxLength="50"
                                        className={style.form_input} placeholder="Secret-Password"
                                        value={this.state.password} onChange={this.handleChange} required/>
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="confirmPassword" className={style.form_label}>
                                        Confirm Password<span className={style.form_label_red}>*</span>
                                    </Label><br/>
                                    <Input type="password" id="confirmPassword" maxLength="50"
                                        className={style.form_input} placeholder="Confirm-Password"
                                        value={this.state.confirmPassword} onChange={this.handleChange} required/>
                                </FormGroup>
                            </Col>
                            <Col >
                                <Button to="/" onSubmit={this.handleSubmit} className={style.block_cont_button}
                                    disabled={(!this.state.mail || !this.state.password) || this.state.disabled}>
                                    Sign up</Button>
                            </Col>
                            <Col><p className={style.form_text}>--- OR ---</p></Col>
                            <Link to="/">
                                <Button className={style.block_cont_button}>Login</Button>
                            </Link>
                        </Row>
                    </Container>
                </Form>}
            </Container>
        );
    }
}

export { Registry };