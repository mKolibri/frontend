import React, { Component } from 'react';
import { Container, Col, Form, Row, Input, Button, Label, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import style from './registry.module.css';
import { Warning } from '../warnings/warning';
import { Alert } from '../warnings/alert';
import { url } from '../configs/config';

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
        
        fetch(  url + 'registration', {
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
        });
    }

    render() {
        return (
            <div className={style.App} >
                { this.state.isAlert ? 
                    <div className={style.div}><Alert className={style.alert} value={this.state.alertMess}/>
                        <Button className={style.Button} onClick={this.handleExit}> OK </Button>
                    </div>
                :
                <Form className={style.form} onSubmit={this.handleSubmit}>
                    <Container>
                        <Row>
                            <Col>
                                <h1 className={style.header}> REGISTRATION </h1>
                            </Col>
                            { this.state.showResults ? 
                                    <Warning value={this.state.results} className={style.warning}></Warning> : null }
                            <Col md="12">
                            <FormGroup>
                                    <Label for="name" className={style.label}>
                                        Name
                                        <span className={style.red}>*</span>
                                    </Label><br/>
                                    <Input type="text" id="name" placeholder="Firstst symbol- uppercase"
                                        onChange={this.handleChange} required/>
                            </FormGroup>
                             </Col>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="surname" className={style.label}>Surname</Label><br/>
                                    <Input type="text" id="surname" placeholder="Not required" 
                                        onChange={this.handleChange}/>
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="age" className={style.label}>Age</Label><br/>
                                    <Input type="number" id="age" placeholder="Only number"
                                    onChange={this.handleChange}/>
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <Label for="mail" className={style.label}>
                                    E-mail
                                    <span className={style.red}>*</span>
                                </Label><br/>
                                <Input type="mail" id="mail" placeholder="Example@index.com"
                                    onChange={this.handleChange} required/>
                            </Col>

                            <Col md="12">
                                <FormGroup>
                                    <Label for="password" className={style.label}>
                                        Password
                                        <span className={style.red}>*</span>
                                    </Label><br/>
                                    <Input type="password" id="password"
                                        className={style.Input}
                                        placeholder="Secret-Password"
                                        onChange={this.handleChange} required/>
                                </FormGroup>
                            </Col>
                            <Col >
                                <Button to="/" onSubmit={this.handleSubmit} className={style.Button}
                                disabled={!this.state.email && !this.state.password && !this.state.name}
                                > Sign up </Button>
                            </Col>
                            <Col><p>--- OR ---</p></Col>
                            <Link to="/" className="comp-class">
                                <Button className={style.Button}>Log in</Button>
                            </Link>
                        </Row>
                    </Container>
                </Form>}
            </div>
        );
    }
}

export { Registry };