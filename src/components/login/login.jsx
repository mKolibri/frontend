import { Container, Col, Form, Row, Input, Button, Label, FormGroup } from 'reactstrap';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../warnings/alert';
import style from './login.module.css';
import { url } from '../configs/config';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mail: '',
            password: '',
            isAlert: false,
            alertMess: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        if (e.target.id === 'mail') {
            this.setState({ mail: e.target.value });
        } else if (e.target.id === 'password') {
            this.setState({ password: e.target.value });
        }
    }

    handleExit(e) {
        this.props.history.push('/');
        localStorage.setItem('token', '');
        localStorage.setItem('userID', '');
    
        this.setState({
            isAlert: false,
            alertMess: ''
        });
    }


    handleSubmit = async(e) => {
        e.preventDefault();
        const user = {
            mail: this.state.mail,
            password: this.state.password
        }

        try {
            const result = await fetch(url + 'login', {
                method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
            });

            const content = await result.json();
            if (200 === result.status) {
                localStorage.setItem('token', content.token);
                localStorage.setItem('userID', content.userID);
                this.props.history.push('/home');
            } else {
                this.setState({
                    isAlert: true,
                    alertMess: content.message + '. Please, try again.'
                });
            }
        } catch(error) {
            this.setState({
                isAlert: true,
                alertMess: `${error.message}. Problem with server! Please, try again.`
            });
        }
    }

    render() {
        return (
            <div className={style.App}>
                { this.state.isAlert ? 
                    <div className={style.div}><Alert className={style.alert} value={this.state.alertMess}/>
                        <Button className={style.Button} onClick={this.handleExit}> OK </Button>
                    </div>
                :
                    <Form className={style.form} onSubmit={this.handleSubmit}>
                    <Container>
                        <Row  className={style.cont}>
                            <Col>
                                <h2 className={style.header}> LOG IN </h2>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="mail" className={style.label}>E-Mail</Label><br/>
                                    <Input type="mail" id="mail"
                                        placeholder="Example@index.com"
                                        className={style.Input}
                                        onChange={this.handleChange} required/>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="password" className={style.label}>Password</Label><br/>
                                    <Input type="password" id="password"
                                        className={style.Input}
                                        placeholder="Secret-Password"
                                        onChange={this.handleChange} required/>
                                </FormGroup>
                            </Col>
                                <Button className={style.Button} disabled={!this.state.email && !this.state.password}
                                    onSubmit={this.handleSubmit}> Log in </Button>
                        </Row>
                        <Row>
                            <Col><p>--- OR ---</p></Col>
                                <Link to="/registry" className="comp-class">
                                    <Button className={style.Button}> Regisration </Button>
                                </Link>
                        </Row>
                    </Container>
                </Form>}
            </div>
        );
    }
}

export { Login };