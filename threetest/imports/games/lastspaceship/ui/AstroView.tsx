import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Outlet } from "react-router-dom";

import {useTracker} from 'meteor/react-meteor-data'

import Konva from 'konva'



import {useSubscribe, useFind} from 'meteor/react-meteor-data'
import { ColPlayer, ColShips } from "../api/meteor/Player";

import {Meteor} from 'meteor/meteor'
import { AstroController, ColPlanetoids, ColStarsystems } from "../api/meteor/Astro";




export const AstroView = () => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const ref = useRef(null)

    const [timeScale, setTimeScale] = useState(0.01)

    const sysLoading = useSubscribe("systemByCurrentPlayer")
    //const bodies = useFind(()=>ColPlanetoids.find({}), [])
    //const ships = useFind(()=>ColShips.find({}), [])
    //const stars = useFind(()=>ColStarsystems.find({}), [])
    //console.log(bodies, ships, stars)
    const u = useTracker(()=> Meteor.user(), [Meteor.userId()])
    useSubscribe("userData")
    const player = ColPlayer.findOne({_id: u?.playerId})
    //console.log(player)
    const myShip = ColShips.findOne({_id:player?.currentShipId})
    //console.log(myShip)

    const ss = AstroController.starSystemFromData(myShip?.systemId)
    console.log(ss)

    


  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
    //setScale(ae.children[0].orbit.radius * 1.2 /( Math.min(width,height) / 2))
    
  }, []);

  
  const canvasRef = useRef(null);

  const [scale, setScale] = useState(1)

  const handleKeys = (e)=> {
    console.log(e.key)
    switch(e.key) {
        case "z": setScale(scale*1.1); break;
        case "x": setScale(scale*0.9); break;
        case "q": setTimeScale(timeScale*1.1); break;
        case "w": setTimeScale(timeScale*0.9); break;
        //case "q": setScale(scale*0.9)
        default: break;
    }
    
  }


    
    
  return (
      <Row >
          <Col sm={12} md={6} lg={3} xl={3} style={{backgroundColor: "black"}}>
              <h4>stuff</h4>
          Scale: {scale}<br/>
          Time scale: {timeScale}
          </Col>
          
          <Col sm={12} md={6} lg={3} xl={3} 
          style={{backgroundColor: "black", border: "solid 1px #006600"}}>
              <img src="/lastspaceship/ships/sparrow01edges.png"
              width="100%" />
              <p className="text-sci-fi">
                  <span className="text-sci-fi-g">hull:</span> falcon<br/>
                  <span className="text-sci-fi-g">transponder:</span> P-F173<br/>
                  <span className="text-sci-fi-g">owner:</span> unknown<br/>
                  <span className="text-sci-fi-g">category:</span> police patrol
              </p>
              
          </Col>
          <Col sm={12} md={6} lg={6} xl={6} ref={ref} style={{height: "90vh"}}
          >
    <div id="cont" style={{ border: "solid 1px #006600"}} 
    className="terminal-ship"></div>
  </Col>
  </Row>
  );
};



