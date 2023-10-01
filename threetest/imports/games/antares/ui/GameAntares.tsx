import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useSubscribe, useFind } from "meteor/react-meteor-data";
import { useState } from "react";
import { AllBuildings, BuildingFunctions, IBuilding } from "../api/Buildings";
import { TestPlanet } from "../api/Planets";


const range = (min, max) =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i);

const bld = AllBuildings;
const plt = TestPlanet;


export const GameAntares = () => {
  const [activeBld, setActiveBld] = useState(-1);
  const [activeSector, setActiveSector] = useState([-1, -1]);
  const [opexStr, setOPEXStr] = useState("none")

  // building selected building in the active sector
  // eventually this must go to the server as the server is the source of truth
  const build = () => {
    if ((activeBld !== -1) && 
        (activeSector[0] !== -1) && 
        (activeSector[1] !== -1)) {
            const b = bld[activeBld]
            console.log(`Building ${b.name} in the sector [${activeSector[0]}, ${activeSector[1]}]`)
            const s = plt.sectors[activeSector[0]][activeSector[1]]
            if (!s.buildings) {
                s.buildings = []
            }
            const bl : IBuilding = {
                template: b,
                currentInhabitants: [],
                currentWorkers: b.jobs.map(_ => [])
            }
            // need a clone or different way to handle this
            s.buildings.push(bl)
            const opx = BuildingFunctions.CalculateOPEX(bl,1)
            console.log(opx)
            const opexes = BuildingFunctions.CalculateOPEXList(s.buildings,1)
            console.log(opexes)
            setOPEXStr(opexes.reduce((acc,cv)=> acc + cv.name + ": " + cv.quantity.toString() + " | ",
            ""))
        }
  }

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
              {bld.map((b, i) => (
                <li key={i}>
                  <a href="#" onClick={() => setActiveBld(i)}>
                    {b.name}
                  </a>
                  {i === activeBld && (<>
                    <p className="text-muted">{b.description}</p>
                    <Button variant="outline-info" 
                        className="btn-sm"
                        onClick={build}>Build</Button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </Col>
          <Col md={6} lg={9} xl={10}>
            <h4>Planet {plt.name}</h4>
            <p>{plt.description}</p>
            Production:
            <br/>OPEX: {opexStr}
            <br/>
            {plt.sectors.map((r, i) => (
              <Row key={i} className="p-2">
                {r.map((s, j) => {
                    const cls = (activeSector[0] === i) && (activeSector[1] === j) ? "planet-sector selected p-2" : "planet-sector p-2"
                return (
                  <Col key={j} className={cls}
                  onClick={()=>setActiveSector([i,j])}>
                    <>{s.buildings?.map((b,l) => <span key={l}>{b.template.name}{" | "}</span>)}
                      {s.surfaceResources.length > 0
                        ? s.surfaceResources.map((r, k1) => (
                            <span key={k1}>{r.name} </span>
                          ))
                        : " -- "}
                      <hr />
                      {s.terrain}, {s.climate}
                      <hr />
                      {s.groundResources.length > 0
                        ? s.groundResources.map((r, k1) => (
                            <span key={k1}>{r.name} </span>
                          ))
                        : " -- "}
                    </>
                  </Col>
                )})}
              </Row>
            ))}
          </Col>
        </Row>
      </Container>
      

    </>
  );
};
