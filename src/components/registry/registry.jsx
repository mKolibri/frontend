import React, { Component } from 'react';
import { Container, Col, Form, Row, Input, Button, Label, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import style from './registry.module.css';
import { Warning } from '../warnings/warning';
import { Alert } from '../warnings/alert';
import cookie from 'react-cookies';
import { registry } from '../configs/config';

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

    handleExit = () => {
        this.setState({
            isAlert: false,
            allertMessage: ''
        });

        cookie.remove('userID', { path: '/' });
        cookie.remove('token', { path: '/' });
        this.props.history.push('/');
    }

    handleSubmit = async(e) => {
        e.preventDefault();
        const curentUser = {
            'name': this.state.name,
            'surname': this.state.surname,
            'password': this.state.password,
            'mail': this.state.mail,
            'age': this.state.age
        };

        const content = await registry(curentUser);
        if (200 === content.status) {
            cookie.save('userID', content.userID, { path: '/' });
            cookie.save('token', content.token, { path: '/' });
            this.props.history.push('/home');
        } else if (content[0]) {
                this.setState({
                    showResults: true,
                    results: content[0].msg
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
                    <Container className={style.block-cont}>
                        <Alert className={style.block-cont-alert} value={this.state.allertMessage}/>
                        <Button className={style.block-cont-button} onClick={this.handleExit}> OK </Button>
                    </Container>
                :
                <Form className={style.form} onSubmit={this.handleSubmit}>
                    <Container>
                        <Row>
                            <Col>
                                <h1 className={style.form-header}> REGISTRATION </h1>
                            </Col>
                            {this.state.showResults ? 
                                <Warning value={this.state.results} className={style.form-warning}></Warning> : null }
                            <Col md="12">
                            <FormGroup>
                                    <Label for="name" className={style.form-label}>
                                        Name
                                        <span className={style.form-label-red}>*</span>
                                    </Label><br/>
                                    <Input type="text" id="name" placeholder="Firstst symbol- uppercase"
                                        onChange={this.handleChange} required/>
                            </FormGroup>
                             </Col>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="surname" className={style.form-label}>Surname</Label><br/>
                                    <Input type="text" id="surname" placeholder="Not required" 
                                        onChange={this.handleChange}/>
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="age" className={style.form-label}>Age</Label><br/>
                                    <Input type="number" id="age" placeholder="Only number"
                                    onChange={this.handleChange}/>
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <Label for="mail" className={style.form-label}>
                                    E-mail
                                    <span className={style.form-label-red}>*</span>
                                </Label><br/>
                                <Input type="mail" id="mail" placeholder="Example@index.com"
                                    onChange={this.handleChange} required/>
                            </Col>

                            <Col md="12">
                                <FormGroup>
                                    <Label for="password" className={style.form-label}>
                                        Password
                                        <span className={style.form-label-red}>*</span>
                                    </Label><br/>
                                    <Input type="password" id="password"
                                        className={style.form-input}
                                        placeholder="Secret-Password"
                                        onChange={this.handleChange} required/>
                                </FormGroup>
                            </Col>
                            <Col >
                                <Button to="/" onSubmit={this.handleSubmit} className={style.block-cont-button}
                                disabled={!this.state.email && !this.state.password && !this.state.name}
                                > Sign up </Button>
                            </Col>
                            <Col><p className={style.form-text}>--- OR ---</p></Col>
                            <Link to="/">
                                <Button className={style.block-cont-button}>Log in</Button>
                            </Link>
                        </Row>
                    </Container>
                </Form>}
            </Container>
        );
    }
}

export { Registry };