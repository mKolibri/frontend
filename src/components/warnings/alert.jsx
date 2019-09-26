import { Container, Col, Row } from 'reactstrap';
import React, { Component } from 'react';
import style from './alert.module.css';

class Alert extends Component {
    render() {
        return (
            <div className={style.App}>
                    <Container className={style.Cont}>
                        <Row>
                            <Col>
                              <h1 className={style.header}> Hello) </h1>
                            </Col>
                            <Col>
                                <p className={style.text}>
                                    {this.props.value}
                                </p>
                            </Col>
                        </Row>
                    </Container>
            </div>
        );
    }
}

export { Alert };