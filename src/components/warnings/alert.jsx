import { Container, Col, Row } from 'reactstrap';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './alert.module.css';

class Alert extends Component {
    static get propTypes() {
        return {
            value: PropTypes.isRequired
        };
    }

    render() {
        return (
            <Container className={style.block}>
                <Row>
                    <Col>
                        <h1 className={style.block_cont_header}> Hello) </h1>
                    </Col>
                    <Col>
                        <p className={style.block_con_text}>
                            {this.props.value}
                        </p>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export { Alert };