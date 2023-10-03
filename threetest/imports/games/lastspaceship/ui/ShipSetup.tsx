import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

export const ShipSetup = () => {

    return (
        <Container><Row className="mt-4">
        <Col xl={{span: 2, offset: 2}}
           lg={{span: 2, offset: 1}}
           md={{span: 4}}
           sm={{span: 12}}>
               <Row className="ship-detail-box ship-detail-drive">
                   <span className="text-sci-fi-g">
                       sublight drive
                   </span>
               </Row>
               <Row className="ship-detail-box ship-detail-reactor">
                   <span className="text-sci-fi-g">
                       reactor
                   </span>
               </Row>
               
        </Col>
        <Col xl={{span: 4}}
           lg={{span: 6}}
           md={{span: 8}}
           sm={{span: 12}} className="ship-box" >
               <img src="/lastspaceship/ships/falcon01.png"
               width="100%" height="100%" />
        </Col>
        <Col xl={{span: 2}}
           lg={{span: 2}}
           md={{span: 4}}
           sm={{span: 12}}>
               <Row className="ship-detail-box ship-detail-ftl">
                   <span className="text-sci-fi-g">
                       ftl drive
                   </span>
               </Row>
               <Row className="ship-detail-box ship-detail-computer">
                   <span className="text-sci-fi-g">
                       computer
                   </span>
               </Row>
               
        </Col>
    </Row>
  </Container>

    )
}