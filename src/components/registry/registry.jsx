import React, { Component } from 'react';
import { Container, Col, Form, Row, Input, Button} from 'reactstrap';
import { Link } from 'react-router-dom';
import style from './registry.module.css';

class Registry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            surname: '',
            mail: '',
            age:'',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const elementId = e.target.id;
        switch (elementId) {
            case 'name': this.setState({ name: e.target.value }); break;
            case 'surname': this.setState({ surname: e.target.value }); break;
            case 'mail': this.setState({ mail: e.target.value }); break;
            case 'password': this.setState({ password: e.target.value }); break;
            case 'age': this.setState({ age: e.target.value }); break;
            default: break;
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const curentUser ={
            "name": this.state.name,
            "surname": this.state.surname,
            "password": this.state.password,
            "mail": this.state.mail,
            "age": this.state.age,
        };
        
        fetch('http://localhost:10000/registration', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:  JSON.stringify(curentUser)
        }).then(async (result) => {
            const content = await result.json();
            if (200 === result.status) {
                localStorage.setItem('token', content.token);
                localStorage.setItem('userID', content.userID);
                this.props.history.push('/home');
            } else {
                if (content[0]) {
                    alert(content[0].msg);
                } else {
                    alert(content.message);
                }
            }
        });
    }

    render() {
        return (
            <div className={style.App} >
                <Form className={style.form} onSubmit={this.handleSubmit}>
                    <Container>
                        <Row>
                            <Col>
                                <h1 className={style.header}> REGISTRATION </h1>
                            </Col>
                            <Col md="12">
                                <Input type="text" name="name" id="name" placeholder="Name"
                                onChange={this.handleChange} required />
                            </Col>
                            <Col md="12">
                                <Input type="text" name="surname" id="surname" 
                                    placeholder="Surname"
                                    onChange={this.handleChange} required />
                            </Col>
                            <Col md="12">
                                <Input type="number" name="age" id="age" placeholder="Age"
                                    onChange={this.handleChange} required />
                            </Col>
                            <Col md="12">
                                <Input type="mail" name="mail" id="mail" placeholder="mail"
                                    onChange={this.handleChange} required />
                            </Col>

                            <Col md="12">
                                <Input type="password" name="password"
                                    id="password" placeholder="Password"
                                    onChange={this.handleChange} required />
                            </Col>
                            <Col >
                                <Button to="/" onSubmit={this.handleSubmit}> Sign up </Button>
                            </Col>
                            <Col><p>--- OR ---</p></Col>
                            <Link to="/" className="comp-class">
                                <Button>Log in</Button>
                            </Link>
                        </Row>
                    </Container>
                </Form>
            </div>
        );
    }
}

export default Registry;