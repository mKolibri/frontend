import { Container, Col, Row } from 'reactstrap';
import React, { Component } from 'react';
import style from './alert.module.css';

class Alert extends Component {
    render() {
        return (
            <Container className={style.block}>
                <Container className={style.block-cont}>
                    <Row>
                        <Col>
                          <h1 className={style.block-cont-header}> Hello) </h1>
                        </Col>
                        <Col>
                            <p className={style.block-cont-text}>
                                {this.props.value}
                            </p>
                        </Col>
                    </Row>
                </Container>
            </Container>
        );
    }
}

export { Alert };