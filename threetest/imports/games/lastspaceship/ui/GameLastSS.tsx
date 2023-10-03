import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useSubscribe, useFind } from "meteor/react-meteor-data";
import { useState } from "react";


const range = (min, max) =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i);



export const GameLastSS = () => {
  

  return (
    <>
      <nav className="navbar navbar-expand-md bg-dark" data-bs-theme="dark">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor01"
            aria-controls="navbarColor01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                <i className="fa-thin fa-gear" style={{color: "#0eff4c"}}></i>
                </a>
              </li>
            </ul>
           </div>
        </div>
      </nav>

      <Container fluid>
        <Row className="mt-4">
          <Col xl={{span: 4, offset: 4}}
               lg={{span: 6, offset: 3}}
               md={{span: 8, offset: 2}}
               sm={{span: 12}} >
                   <Row>
          <span className="text-sci-fi">this is your reactor</span>
              <div className="two-image-stacked">
              </div>
              </Row>
              <Row>
                  <Col sm={2} style={{border:"solid 1px #55ff55",
                boxShadow: "0 0 10px 2px #55ff55", background: "black"}}
                className="text-center align-items-center">
                    <span className="text-sci-fi">fuel</span>
                </Col>
                <Col sm={2} style={{border:"solid 1px #55ff55",
                boxShadow: "0 0 10px 2px #55ff55", background: "black"}}
                className="text-center align-items-center">
                    <span className="text-sci-fi">rods</span>
                </Col>
                <Col sm={2} style={{border:"solid 1px #55ff55",
                boxShadow: "0 0 10px 2px #55ff55", background: "black"}}
                className="text-center align-items-center">
                    <span className="text-sci-fi">cool</span>
                </Col>
                <Col sm={2} style={{border:"solid 1px #55ff55",
                boxShadow: "0 0 10px 2px #55ff55", background: "black"}}
                className="text-center align-items-center">
                    <span className="text-sci-fi">hull</span>
                </Col>
                <Col sm={2} style={{border:"solid 1px #55ff55",
                boxShadow: "0 0 10px 2px #55ff55", background: "black"}}
                className="text-center align-items-center">
                    <span className="text-sci-fi">comp</span>
                </Col>
                <Col sm={2} style={{border:"solid 1px #55ff55",
                boxShadow: "0 0 10px 2px #55ff55", background: "black"}}
                className="text-center align-items-center">
                    <span className="text-sci-fi">powr</span>
                </Col>
              </Row>
          </Col>

          
              
          
          
        </Row>
        <Row className="mt-4">
            <Col xl={{span: 2, offset: 2}}
               lg={{span: 2, offset: 1}}
               md={{span: 4}}
               sm={{span: 12}}>
                   <Row className="ship-detail-box ship-detail-drive">
                       <span className="text-sci-fi">
                           drive
                       </span>
                   </Row>
                   <Row className="ship-detail-box ship-detail-reactor">
                       <span className="text-sci-fi">
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
                       <span className="text-sci-fi">
                           ftl drive
                       </span>
                   </Row>
                   <Row className="ship-detail-box ship-detail-computer">
                       <span className="text-sci-fi">
                           computer
                       </span>
                   </Row>
                   
            </Col>
        </Row>
      </Container>
      

    </>
  );
};
