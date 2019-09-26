import { Container, Col, Row } from 'reactstrap';
import React, { Component } from 'react';
import style from './warning.module.css';

class Warning extends Component {
    render() {
        return (
            <div className={style.App}>
                    <Container>
                        <Row>
                            <Col>
                                <p className={style.p}>
                                    {this.props.value}
                                </p>
                            </Col>
                        </Row>
                    </Container>
            </div>
        );
    }
}

export { Warning };