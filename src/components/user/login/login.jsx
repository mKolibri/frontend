import { Container, Col, Form, Row, Input, Button, Label, FormGroup } from 'reactstrap';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../../warnings/alert';
import style from './login.module.css';
import { sendRequest } from '../user.dao';
import cookie from 'react-cookies';
import PropTypes from 'prop-types';

class Login extends Component {
    static get propTypes() {
        return {
            history: PropTypes.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            mail: null,
            password: null,
            isAlert: false,
            alertMess: '',
            disabled: false,
            userID: cookie.load('userID', {path: '/'})
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (cookie.load('userID', {path: '/'})) {
            this.props.history.push('/home');
        }
    }

    handleChange(e) {
        e.preventDefault();
        const { value, maxLength } = e.target;
        const count = 0;
        const message = value.slice(count, maxLength);
        this.setState({ [e.target.id]: message });
    }

    handleExit() {
        this.setState({
            isAlert: false,
            alertMess: '',
            mail: null,
            password: null
        });
        this.props.history.push('/');
    }

    async handleSubmit(e) {
        e.preventDefault();
        const user = {
            mail: this.state.mail,
            password: this.state.password
        };
        this.setState({
            disabled: true
        });

        const content = await sendRequest('login', 'POST', user);
        const status = 200;
        if (content) {
            content.json().then((result) => {
                if (status === content.status) {
                    cookie.save('userID', result.userID, { path: '/'});
                    this.props.history.push('/home');
                } else {
                    this.setState({
                        isAlert: true,
                        disabled: false,
                        alertMess: result.message + '. Please, try again.'
                    });
                }
            });
        } else {
            this.setState({
                isAlert: true,
                disabled: false,
                alertMess: 'Error 404, server not found. Please, try again.'
            });
        }
    }

    render() {
        return (
            <Container className={style.block}>
                { this.state.isAlert ?
                    <Container className={style.block_cont}>
                        <Alert className={style.block_cont_alert} value={this.state.alertMess}/>
                        <Button className={style.block_cont_button_error} onClick={this.handleExit}>OK</Button>
                    </Container>
                :
                    <Form className={style.form} onSubmit={this.handleSubmit}>
                        <Container>
                            <Row>
                            <Col>
                                <h2 className={style.form_header}>LOGIN</h2>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="mail" className={style.form_label}>E-Mail</Label><br/>
                                    <Input type="mail" id="mail" maxLength="50"
                                        placeholder="Example@index.com"
                                        className={style.form_input}
                                        onChange={this.handleChange} required/>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="password" className={style.form_label}>Password</Label><br/>
                                    <Input type="password" id="password" maxLength="50"
                                        className={style.form_input}
                                        placeholder="Secret-Password"
                                        onChange={this.handleChange} required/>
                                </FormGroup>
                            </Col>
                                <Button className={style.block_cont_button}
                                    disabled={(!this.state.email && !this.state.password) || this.state.disabled}
                                    onSubmit={this.handleSubmit}>Log in</Button>
                        </Row>
                        <Row>
                            <Col><p className={style.form_text}>--- OR ---</p></Col>
                            <Link to="/registry">
                                <Button className={style.block_cont_button}>Regisration</Button>
                            </Link>
                        </Row>
                    </Container>
                </Form>}
            </Container>
        );
    }
}

export { Login };