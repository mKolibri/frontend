import { Container, Col, Row } from 'reactstrap';
import React, { Component } from 'react';
import style from './warning.module.css';

class Warning extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <p className={style.text}>
                            {this.props.value}
                        </p>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export { Warning };