import { Container, Col, Form, Row, Input, Button } from 'reactstrap';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './login.module.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mail: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        if (e.target.id === 'mail') {
            this.setState({ mail: e.target.value });
        } else if (e.target.id === 'password') {
            this.setState({ password: e.target.value });
        }
    }

    handleSubmit = async(e) => {
        e.preventDefault();
        const user  = this.state;
        try {
            const result = await fetch('http://localhost:10000/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });

            const content = await result.json();
            if (200 === content.status) {
                this.props.history.push('/home');
            } else {
                alert(content.message);
            }
        } catch (error) {
            alert('Incorrect username or password');
        }       
    }

    render() {
        return (
            <div className={style.App} >
                <Form className={style.form} onSubmit={this.handleSubmit}>
                    <Container>
                        <Row>
                            <Col >
                                <h2 className={style.header}>LOG IN</h2>
                            </Col>
                            <Col >
                                <Input type="mail" name="mail" id="mail"
                                    placeholder="mail-address"
                                    onChange={this.handleChange} required />
                            </Col>
                            <Col>
                                <Input type="password" name="password" id="password"
                                    placeholder="Password"
                                    onChange={this.handleChange} required />
                            </Col>
                                <Button className="loginButton" 
                                    onSubmit={this.onSubmit}> Log in </Button>
                        </Row>
                        <Row>
                            <Col><p>--- OR ---</p></Col>
                                <Link to="/registry" className="comp-class">
                                    <Button className="registryButton"> Regisration </Button>
                                </Link>                         
                        </Row>
                    </Container>
                </Form>
            </div>
        );
    }
}

export default Login;