import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useSubscribe, useFind } from "meteor/react-meteor-data";
import { useState } from "react";


const range = (min, max) =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i);



export const GameLastSS = () => {
  

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
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
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Pricing
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  href="#"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Dropdown
                </a>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#">
                    Separated link
                  </a>
                </div>
              </li>
            </ul>
           </div>
        </div>
      </nav>

      <Container fluid>
        <Row className="mt-4">
          <Col xl={4} lg={6} md={6} sm={12}>
          <span className="text-sci-fi">this is your reactor</span>
              <div className="two-image-stacked">
              <div style={{position:"absolute", bottom: "8px", left: "8px",
                width: "70px",height: "70px", border:"solid 1px #55ff55",
                boxShadow: "0 0 10px 2px #55ff55", background: "black"}}
                className="text-center align-items-center">
             <span className="text-sci-fi">fuel</span>
          </div>
          <div style={{position:"absolute", bottom: "8px", left: "86px",
                width: "70px",height: "70px", border:"solid 1px #55ff55",
                boxShadow: "0 0 10px 2px #55ff55", background: "black"}}
                className="text-center align-items-center">
                    <span className="text-sci-fi">rods</span>
          </div>
          <div style={{position:"absolute", bottom: "8px", left: "164px",
                width: "70px",height: "70px", border:"solid 1px #55ff55",
                boxShadow: "0 0 10px 2px #55ff55", background: "black"}}
                className="text-center align-items-center">
                    <span className="text-sci-fi">cool</span>
          </div>
          <div style={{position:"absolute", bottom: "8px", left: "242px",
                width: "70px",height: "70px", border:"solid 1px #55ff55",
                boxShadow: "0 0 10px 2px #55ff55", background: "black"}}
                className="text-center align-items-center">
                    <span className="text-sci-fi">hull</span>
          </div>
          <div style={{position:"absolute", bottom: "8px", left: "320px",
                width: "70px",height: "70px", border:"solid 1px #55ff55",
                boxShadow: "0 0 10px 2px #55ff55", background: "black"}}
                className="text-center align-items-center">
                    <span className="text-sci-fi">comp</span>
          </div>
          <div style={{position:"absolute", bottom: "8px", left: "398px",
                width: "70px",height: "70px", border:"solid 1px #55ff55",
                boxShadow: "0 0 10px 2px #55ff55", background: "black"}}
                className="text-center align-items-center">
                    <span className="text-sci-fi">powr</span>
          </div>
              </div>
          </Col>
          
          
        </Row>
      </Container>
      

    </>
  );
};
