import React, { Component } from 'react';
import { Container, Col, Form, Row, Input, Button, Label, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import style from './registry.module.css';
import { Warning } from '../warnings/warning';
import { Alert } from '../warnings/alert';
import { registration } from './registry.dao';

class Registry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            surname: '',
            mail: '',
            age:'',
            password: '',
            showResults: false,
            isAlert: false,
            allertMessage : ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleExit = this.handleExit.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.id]: e.target.value });
    }

    handleExit() {
        this.setState({
            isAlert: false,
            allertMessage: ''
        });

        this.props.history.push('/registry');
    }

    async handleSubmit(e) {
        e.preventDefault();
        const user = {
            'name': this.state.name,
            'surname': this.state.surname,
            'password': this.state.password,
            'mail': this.state.mail,
            'age': this.state.age
        };

        const content = await registration(user);
        const results = content.json();
        if (200 === content.status) {
            this.props.history.push('/home');
        } else if (content[0]) {
            this.setState({
                showResults: true,
                results: content[0].msg
            });
        } else if (results.message === 'Failed to fetch') {
            this.setState({
                isAlert: true,
                alertMess: 'Error 404, server not found. Please, try again.'
            });
        } else {
            this.setState({
                showResults: true,
                results: content.message
            });
        }
    }

    render() {
        return (
            <Container className={style.block} >
                { this.state.isAlert ?
                    <Container className={style.block_cont}>
                        <Alert className={style.block_cont_alert} value={this.state.allertMessage}/>
                        <Button className={style.block_cont_button} onClick={this.handleExit}> OK </Button>
                    </Container>
                :
                <Form className={style.form} onSubmit={this.handleSubmit}>
                    <Container>
                        <Row>
                            <Col>
                                <h1 className={style.form_header}> REGISTRATION </h1>
                            </Col>
                            {this.state.showResults ?
                                <Warning value={this.state.results} className={style.form_warning}></Warning> : null }
                            <Col md="12">
                            <FormGroup>
                                    <Label for="name" className={style.form_label}>
                                        Name
                                        <span className={style.form_label_red}>*</span>
                                    </Label><br/>
                                    <Input type="text" id="name" placeholder="Firstst symbol- uppercase"
                                        onChange={this.handleChange} className={style.form_input} required/>
                            </FormGroup>
                             </Col>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="surname" className={style.form_label}>Surname</Label><br/>
                                    <Input type="text" id="surname" placeholder="Not required"
                                        onChange={this.handleChange} className={style.form_input}/>
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="age" className={style.form_label}>Age</Label><br/>
                                    <Input type="number" id="age" placeholder="Only number"
                                    onChange={this.handleChange} className={style.form_input}/>
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <Label for="mail" className={style.form_label}>
                                    E-mail
                                    <span className={style.form_label_red}>*</span>
                                </Label><br/>
                                <Input type="mail" id="mail" placeholder="Example@index.com"
                                    onChange={this.handleChange} className={style.form_input} required/>
                            </Col>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="password" className={style.form_label}>
                                        Password
                                        <span className={style.form_label_red}>*</span>
                                    </Label><br/>
                                    <Input type="password" id="password"
                                        className={style.form_input}
                                        placeholder="Secret-Password"
                                        onChange={this.handleChange} required/>
                                </FormGroup>
                            </Col>
                            <Col >
                                <Button to="/" onSubmit={this.handleSubmit} className={style.block_cont_button}
                                disabled={!this.state.email && !this.state.password && !this.state.name}
                                > Sign up </Button>
                            </Col>
                            <Col><p className={style.form_text}>--- OR ---</p></Col>
                            <Link to="/">
                                <Button className={style.block_cont_button}>Log in</Button>
                            </Link>
                        </Row>
                    </Container>
                </Form>}
            </Container>
        );
    }
}

export { Registry };