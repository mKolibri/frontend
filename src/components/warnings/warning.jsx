import { Container, Col, Row } from 'reactstrap';
import React, { Component } from 'react';
import style from './warning.module.css';
import PropTypes from 'prop-types';

class Warning extends Component {
    static get propTypes() {
        return {
            value: PropTypes.isRequired
        };
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col className={style.text}>
                        {this.props.value}
                    </Col>
                </Row>
            </Container>
        );
    }
}

export { Warning };