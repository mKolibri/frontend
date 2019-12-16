import { Col, Button, Table, Container, Input, FormGroup, Label } from 'reactstrap';
import React, { Component } from 'react';
import cookie from 'react-cookies';
import { BrowserRouter, Link } from 'react-router-dom';
import style from './showTable.module.css';
import { Alert } from '../../warnings/alert';
import SideNav from '@trendmicro/react-sidenav';
import { sendRequest } from '../table.dao';
import PropTypes from 'prop-types';
import { Warning } from '../../warnings/warning';

class ShowTable extends Component {
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
            name : cookie.load('tableName'),
            userID: cookie.load('userID'),
            addColumn: false,
            warning: false,
            showType: 'Number',
            results: [],
            type: 'Integer',
            columns: [],
            update: false,
            sortASC: false,
            sortDESC: false,
            sortBy: '',
            open: false,
            selectedFile: null,
            updateValues: []
        };
        this.handleExit = this.handleExit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.logout = this.logout.bind(this);
        this.saveResults = this.saveResults.bind(this);
        this.handleAddValues = this.handleAddValues.bind(this);
        this.getValue = this.getValue.bind(this);
        this.addColumn = this.addColumn.bind(this);
        this.handleCancle = this.handleCancle.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAddColumn = this.handleAddColumn.bind(this);
        this.handleChangeUpdate = this.handleChangeUpdate.bind(this);
        this.handleDeleteColumn = this.handleDeleteColumn.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleSortByColumn = this.handleSortByColumn.bind(this);
    }

    async componentDidMount() {
        if (!this.state.userID) {
            this.props.history.push('/');
        }
        const content = await sendRequest('table/' + this.state.name, 'GET');
        const status = 200;
        if (content) {
            content.json().then((results) => {
                if (status === content.status) {
                    this.setState({
                        table: results.table,
                        description: results.description,
                        columns: results.schema
                    });
                    this.saveResults(results.columns);
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

    async handleDeleteColumn(e) {
        e.preventDefault();
        const body = {
            colName: e.target.id,
            name: this.state.name
        };

        const content = await sendRequest('deleteColumn', 'POST', body);
        const badStatus = 402;
        const status = 200;
        if (content) {
            content.json().then((results) => {
                if (status === content.status) {
                    window.location.reload(true);
                } else if (results.message === 'Failed to fetch') {
                    this.setState({
                        isAlert: true,
                        alertMess: 'Error 404, server not found. Please, try again.'
                    });
                } else if (badStatus === content.status) {
                    this.setState({
                        warning: true
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

    saveResults(results) {
        for (let i = 0; i < results.length; ++i) {
            results[i].number = i;
        }
        this.setState({values: results});
    }

    handleExit() {
        this.setState({
            isAlert: false,
            alertMess: ''
        });
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

    handleAddValues() {
        this.props.history.push('/addValues');
    }

    getValue(id) {
        const values = this.state.values;
        let value;
        for (let i = 0; i < values.length; ++i) {
            if (Number(values[i].number) === Number(id)) {
                value = {delValue: values[i]};
            }
        }
        return value;
    }

    async handleDelete(e) {
        e.preventDefault();
        const body = this.getValue(e.target.id);
        body.table = cookie.load('tableName');
        const content = await sendRequest('deleteValue', 'POST', body);
        const status = 200;
        if (content) {
            content.json().then((results) => {
                if (status === content.status) {
                    window.location.reload(true);
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

    handleAddColumn() {
        this.setState({
            addColumn: !this.state.addColumn,
            update: false
        });
    }

    handleChange(e) {
        if (e.target.id === 'column' && /\d/.test(e.target.value)) {
            this.setState({
                showResult: true,
                result: 'Column name must contain only letters'
            });
        } else if (e.target.id === 'showType') {
            const type = (e.target.value === 'Number')? 'Integer': 'Varchar(255)';
            this.setState({
                [e.target.id]: e.target.value,
                type: type
            });
        } else {
            this.setState({ [e.target.id]: e.target.value });
        }
    }

    async addColumn() {
        const body = {
            column: this.state.column,
            type: this.state.type,
            tableID: this.state.name
        };
        const name = this.state.column;
        const array = this.state.columns;
        for (let i = 0; i < array.length; ++i) {
            if (array[i].column === name) {
                this.setState({
                    showResult: true,
                    result: 'Column name must not be duplicated'
                });
                return {};
            }
        }

        const content = await sendRequest('addColumn', 'POST', body);
        const status = 200;
        if (content) {
            content.json().then((results) => {
                if (status === content.status) {
                    window.location.reload(true);
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
        return {};
    }

    handleUpdate(e) {
        e.preventDefault();
        const columns = this.state.values;
        let result = {};
        for (let i = 0; i < columns.length; ++i) {
            if (Number(columns[i].number) === Number(e.target.id)) {
                result = columns[i];
            }
        }
        this.setState({
            updateValues: result,
            update: true,
            addColumn: false
        });
    }

    handleChangeUpdate(e) {
        e.preventDefault();
        const newData = e.target.value;
        const columnName = e.target.id;
        this.setState((prevState) => {
            let updateValues = Object.assign({}, prevState.updateValues);
            updateValues[columnName] = newData;
            return { updateValues };
        });
    }

    async handleSave() {
        const number = this.state.updateValues.number;
        const columns = this.state.values;
        let result = {};
        for (let i = 0; i < columns.length; ++i) {
            if (Number(columns[i].number) === Number(number)) {
                result = columns[i];
            }
        }
        const body = {
            oldData: result,
            newData: this.state.updateValues,
            tableID: this.state.name
        };

        const content = await sendRequest('updateData', 'POST', body);
        const status = 200;
        if (content) {
            content.json().then((results) => {
                if (status === content.status) {
                    this.setState({
                        update: false
                    });
                    window.location.reload(true);
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

    handleCancle() {
        this.setState({
            addColumn: false,
            update: false
        });
    }

    handleSort(e) {
        e.preventDefault();
        if (String(e.target.id) === 'ASC') {
            this.setState({
                open: true,
                sortASC: true,
                sortDESC: false
            });
        } else if (String(e.target.id) === 'DESC') {
            this.setState({
                open: true,
                sortASC: false,
                sortDESC: true
            });
        } else {
            this.setState({
                open: false,
                sortASC: false,
                sortDESC: false
            });
        }
    }

    handleOpen() {
        this.setState({open: !this.state.open});
    }

    async handleSortByColumn(e) {
        e.preventDefault();
        const address = this.state.name + '?sortASC=' + this.state.sortASC +
            '&sortDESC=' + this.state.sortDESC + '&sortBy=' + e.target.id;
        const content = await sendRequest('sortTable/' + address, 'GET');
        const status = 200;
        if (content) {
            content.json().then((results) => {
                if (status === content.status) {
                    this.setState({
                        table: results.table,
                        description: results.description,
                        columns: results.schema,
                        open: false,
                        sortASC: false,
                        sortDESC: false
                    });
                    this.saveResults(results.columns);
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

    render() {
        const results = this.state.columns;
        const values = this.state.values;
        const count = 0;
        let header = [];
        if (Array.isArray(results) && results.length > count) {
            results.map((r) => (header.push(r.column)));
        }
        const columns = this.state.updateValues;

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
                    <Col className={style.col_desc}>
                        {this.state.description ? <h1 className={style.col_desc_text}>Description:
                            {this.state.description}</h1> : null}
                    </Col>
                    <Col className={style.col_buttons}>
                        <Button className={style.col_desc_button} onClick={this.handleAddValues}>
                            + Add Values</Button>
                        <Button className={style.col_desc_button} onClick={this.handleAddColumn}>
                            + Add Column</Button>
                        <Button className={style.col_desc_button} id="ASC" onClick={this.handleSort}
                            disabled={this.state.sortASC}>
                            Sort z-A</Button>
                        <Button className={style.col_desc_button} id="DESC" onClick={this.handleSort}
                            disabled={this.state.sortDESC}>
                            Sort A-z</Button>
                        <Button className={style.col_desc_button} id="NONE" onClick={this.handleSort}
                            disabled={!this.state.sortASC && !this.state.sortDESC}>
                            No-Sort</Button>
                    </Col >
                    {this.state.open ?
                        <Col className={style.col_enter}>
                            <span className={style.col_enter_span}>Sort by...Select the column: </span>
                            <Col className={style.col_enter_buttons}>
                                {Array.isArray(results) && results.length > count && results.map((r) => (
                                    <Button className={style.col_desc_button_column} key={r.key}
                                        onClick={this.handleSortByColumn} id={r.column}>{r.column}</Button>
                                ))}
                            </Col>
                    </Col> : null}
                    {this.state.warning ? <Col className={style.cont}>
                        <span className={style.col_desc_text_red}>
                            You can&quot;t delete last column!
                        </span>
                    </Col>: null}
                    <Container className={style.cont}>
                        <Table className={style.cont_table}>
                            <thead>
                                <tr>
                                    {Array.isArray(results) && results.length > count && results.map((r) => (
                                        <th key={r.id} className={style.cont_column}>
                                            <span className={style.cont_table_text}>{r.column} ({r.type})
                                                <Button className={style.cont_table_column_delete}
                                                    onClick={this.handleDeleteColumn} id={r.column}>X</Button>
                                            </span>
                                        </th>
                                    ))}
                                    <th className={style.cont_table_update}>Delete</th>
                                    <th className={style.cont_table_update}>Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(values) && values.length > count && values.map(res => (
                                    <tr key={res.key}>
                                        {Array.isArray(header) && header.length > count && header.map(r => (
                                            <td key={r.key} className={style.cont_table_value}>{res[r]}</td>
                                        ))}
                                        <td><Button className={style.cont_table_button}
                                            onClick={this.handleDelete} id={res.number}>X</Button>
                                        </td>
                                        <td><Button className={style.cont_table_button}
                                            onClick={this.handleUpdate} id={res.number}>...</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                    {this.state.addColumn ?
                        <Container className={style.footer}>
                            <Col>
                                {this.state.showResult ?
                                    <Col className={style.form_warning}><Warning
                                        value={this.state.result} className={style.form_warning_res}/>
                                    </Col> : null}
                                    <FormGroup>
                                        <Label for="column">
                                            Name<span className={style.cont_label_red}>*</span>
                                        </Label>
                                        <Input type="text" id="column" placeholder="Column name"
                                            onChange={this.handleChange} value={this.state.column}
                                            className={style.cont_input} required/>
                                        <Label for="type">
                                            Type<span className={style.cont_label_red}>*</span>
                                        </Label>
                                        <Input type="select" id="showType" value={this.state.showType}
                                            onChange={this.handleChange} className={style.footer_select} required>
                                                <option id="Integer">Number</option>
                                                <option id="Varchar(255)">String</option>
                                        </Input>
                                        <Button className={style.footer_button}
                                            disabled={this.state.column === ''}
                                            onClick={this.addColumn}>Add Column</Button>
                                        <Button className={style.footer_button_close}
                                            onClick={this.handleAddColumn}>Close</Button>
                                    </FormGroup>
                            </Col>
                        </Container>: (this.state.update)? <Col className={style.left_block}>
                            <FormGroup>
                                {this.state.showResult ?
                                    <Col className={style.form_warning}><Warning
                                        value={this.state.result} className={style.form_warning_res}/>
                                    </Col> : null}
                                    {Array.isArray(results) && results.length > count && results.map((r) => (
                                        <FormGroup key={r.key}>
                                            <Label for="column">
                                                {r.column}({r.type})<span className={style.cont_label_red}>*</span>
                                            </Label>
                                            <Input type={r.type === 'string'? 'text':r.type} id={r.column}
                                                placeholder="Column name"
                                                onChange={this.handleChangeUpdate} value={columns[r.column]}
                                                className={style.cont_input} required/>
                                        </FormGroup>
                                    ))}
                                    <Button className={style.footer_button}
                                        disabled={this.state.disabled}
                                        onClick={this.handleSave}>Save</Button>
                                    <Button className={style.footer_button_close}
                                        onClick={this.handleCancle}>Cancle</Button>
                            </FormGroup>
                        </Col>: null}
                </Container>}
            </BrowserRouter>
        );
    }
}

export { ShowTable };