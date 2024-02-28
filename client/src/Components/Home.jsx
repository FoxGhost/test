import { Col, Row } from "react-bootstrap";
import {ArrowLeftCircleFill, AirplaneEnginesFill} from 'react-bootstrap-icons'

const Home = () => {
    return(
        <>
            <Row>
                <Col>
                    <h1>
                        Select an Airplane
                    </h1>
                </Col>
                <Col>
                </Col>
            </Row>
            <Row>
            <Col>
                <ArrowLeftCircleFill width="78" height="78"/>
            </Col>
            </Row>
            <Row>
                <Col></Col>
                <Col><AirplaneEnginesFill width="128" height="128"/></Col>
                <Col></Col>
            </Row>
        </>
    )
}

export default Home;