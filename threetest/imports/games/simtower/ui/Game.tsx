import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import {useSubscribe, useFind} from 'meteor/react-meteor-data'
import { IFloorState, IJobsFacility, ITowerState } from "../api/Tower";
import { useState } from "react";


const colB = new Mongo.Collection<IJobsFacility>("allAvailableBuildings");

const range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

export const Game = () => {

    const bload = useSubscribe("allBuildings")
    const bld = useFind(()=>{
        return colB.find({})
    }, [])

    console.log(bld)

    const [tower, setTower] = useState<IFloorState[]>([
        {
            floorNumber: 0,
            facilities: []
        },
        {
            floorNumber: -1,
            facilities: []
        }
    ])

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Navbar
          </a>
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
                  Home
                  <span className="visually-hidden">(current)</span>
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
            <form className="d-flex">
              <input
                className="form-control me-sm-2"
                type="search"
                placeholder="Search"
              />
              <button className="btn btn-secondary my-2 my-sm-0" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      <Container fluid>
          <Row className="mt-4">
          <Col md={6} lg={3} xl={2}>
              <h4>Facilities</h4>
              <ul>
              {bld.map((b,i) => <li key={i}><a href="#">
                  {b.name}
              </a></li>)}
              </ul>
          </Col>
          <Col md={6} lg={9} xl={10}>
              <Row>
                  <Col md={12} className="text-center align-items-center">
                      <Button variant="primary">Build Top Floor</Button>
                  </Col>
              </Row>
              {tower.map((f,i) => {
                  const l = 12 - f.facilities.length
                  return (<Row key={i} className="mt-2">
                      
                     {f.facilities.map((b,j) => <Col key={j} lg={1}>
                         {b.name}
                     </Col>)} 
                     {range(0,l-1).map(k => {
                         return <Col lg={1}><Button>Build</Button></Col>
                     })}          
                  </Row>)
              })}
              <Row className="mt-2">
                  <Col md={12} className="text-center align-items-center">
                      <Button variant="info">Build Bottom Floor</Button>
                  </Col>
              </Row>
          </Col>
          </Row>
      </Container>
    </>
  );
};
