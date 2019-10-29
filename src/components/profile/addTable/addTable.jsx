import React, { Component } from 'react';
import { BrowserRouter, Link} from 'react-router-dom';
import { style } from './addTable.module.css';
import { Alert } from '../../warnings/alert';
import SideNav from '@trendmicro/react-sidenav';
import { Col, Input, Button, Label, FormGroup, Table, Container } from 'reactstrap';
import cookie from 'react-cookies';
import { post, get } from '../../configs/dao';

class addTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAlert: false,
            alertMess: '',
            type: 'Number',
            num : 1,
            results: []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.id]: e.target.id });
    }

    logout = async() => {
        await get('logout');
        cookie.remove('userID', { path: '/' });
        cookie.remove('token', { path: '/' });
        localStorage.removeItem('tableName');
        this.props.history.push('/');
    }

    handleExit = () => {
        this.setState({
            isAlert: false,
            alertMess: ''
        });
    }

    toHome = () => {
        this.props.history.push('/home');
    }

    toTables = () => {
        this.props.history.push('/tables');
    }

    toAddTable = () => {
        this.props.history.push('/addTable');
    }

    addColumn = () => {
        this.setState((state) => {
            const value = {
                column: this.state.column,
                type: this.state.type,
                num: this.state.num
            };
            const results = state.results.concat(value);
            return { results };
        });

        this.setState({
            column: '',
            num: this.state.num + 1
        });
    }

    remove = (e) => {
        const id = e.target.id;
        let array = [...this.state.results];
        for (let i = 0; i < array.length; ++i) {
            if (Number(array[i].num) === Number(id)) {
                array.splice(i, 1);
                --i;
            }
        }
        this.setState({results: array});
    }

    handleSelect = (e) => {
        e.preventDefault();
        this.setState({
            type: e.target.value
        })
    }

    handleSubmit = async(e) => {
        e.preventDefault();
        const table = {
            'name': this.state.tableName,
            'description': this.state.description,
            'columns' : this.state.results
        };

        const content = post(table, 'addTable');
        if (200 === content.status) {
            localStorage.setItem('tableName', content.name);
            this.props.history.push('/showTable');
        } else {
            this.setState({
                isAlert: true,
                allertMess: content.message
            });
        }
    }

    render() {
        const results = this.state.results;
        return (
            <BrowserRouter>
                {this.state.isAlert ?
                    <Container className={style.block}>
                        <Alert className={style.block_alert} value={this.state.alertMess}/>
                        <Button className={style.block_button} onClick={this.handleExit}> OK </Button>
                    </Container>
                :
                <Container>
                    <SideNav className={style.sidenav}>
                        <Link to="/home" onClick={this.toHome}>
                            <Button className={style.block_button}> Home </Button>
                        </Link>
                        <Link to="/tables" onClick={this.toTables}>
                            <Button className={style.block_button}> Tables </Button>
                        </Link>
                        <Link to="/addTable" onClick={this.toAddTable}>
                            <Button className={style.block_button}> Add table </Button>
                        </Link>
                        <Link to="/" onClick={this.logout}>
                            <Button className={style.sidenav_button_logout}> Log out </Button>
                        </Link>
                    </SideNav>
                    <Col className={style.col_head}>
                        <h1 className={style.col_head_header}> Create Table </h1>
                    </Col>
                    <Container className={style.cont}>
                        <Col>
                            <FormGroup>
                                <Label for="name">
                                    Name
                                    <span className={style.cont_label_red}>*</span>
                                </Label>
                                <Input type="text" id="tableName" placeholder="Table name"
                                    onChange={this.handleChange} className={style.cont_input} required/>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                    <Input type="text" id="description" placeholder="Not required"
                                        className={style.cont_input} onChange={this.handleChange}/>
                            </FormGroup>
                        </Col>
                        <Col>
                            <Label for="createTable">If your table ready, then press...</Label>
                            <Link to="/showTable" onClick={this.handleSubmit}>
                                <Button className={style.cont_link_button}
                                    disabled={!this.state.tableName}> Create Table </Button>
                            </Link>
                        </Col>
                    </Container>
                    <Container className={style.cont}>
                        <Table bordered lassName={style.cont_table}>
                        <thead>
                            <tr>
                                <th className={style.col_head}>Column Name</th>
                                <th className={style.col_head}>Column Type</th>
                                <th className={style.col_head}>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(results) && results.length > 0 && results.map(r => (
                                <tr key={r.id}>
                                    <td>{r.column}</td>
                                    <td>{r.type}</td>
                                    <td><Button className={style.cont_table_name}
                                        onClick={this.remove} id={r.num}
                                    >X</Button></td>
                                </tr>
                            ))}
                        </tbody>
                        </Table>
                    </Container>
                    <Container className={style.footer}>
                        <Col>
                            <FormGroup>
                                <Label for="column">
                                    Name
                                    <span className={style.cont_label_red}>*</span>
                                </Label>
                                <Input type="text" id="column" placeholder="Column name"
                                    onChange={this.handleChange} value={this.state.column}
                                    className={style.cont_input} required/>
                                <Label for="type">
                                    Type
                                    <span className={style.cont_label_red}>*</span>
                                </Label>
                                <Input type="select" name="type" id="type" value={this.state.type}
                                    onChange={this.handleChange} className={style.footer_select}>
                                        <option onSelect={this.handleSelect} value="INTEGER">Number</option>
                                        <option onSelect={this.handleSelect} value="VARCHAR(255)">String</option>
                                        <option onSelect={this.handleSelect} value="DATE">Date</option>
                                </Input>
                                <Button className={style.footer_button}
                                    disabled={!this.state.column}
                                    onClick={this.addColumn}> Add Column </Button>
                            </FormGroup>
                        </Col>
                    </Container>
                </Container>}
            </BrowserRouter>
        );
    }
}

export { addTable };