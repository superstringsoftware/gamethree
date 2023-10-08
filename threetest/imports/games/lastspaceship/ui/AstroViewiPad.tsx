import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Outlet } from "react-router-dom";

import {useTracker} from 'meteor/react-meteor-data'

import Konva from 'konva'
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';




import {useSubscribe, useFind} from 'meteor/react-meteor-data'
import { ColPlayer, ColShips } from "../api/meteor/Player";

import {Meteor} from 'meteor/meteor'
import { AstroController, ColPlanetoids, ColStarsystems } from "../api/meteor/Astro";




export const AstroViewIPad = () => {
    console.log("RERENDER")
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

    const [ss, setss] = useState(null)    
    const [showOrbits, setShowOrbits] = useState(true)
    const [curCenter, setCurCenter] = useState(null)

    


  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
    //setScale(ae.children[0].orbit.radius * 1.2 /( Math.min(width,height) / 2))
  }, []);

  useEffect(() => {
    if (!sysLoading()) {
        const ss1 = AstroController.starSystemFromData(myShip?.systemId)
        ss1.calcScale(width, height)
        ss1.advanceOrbits(0.1)
        ss1.updateDecart()
        console.log("SCALE:", ss1)
        setss(ss1)
        setScale(ss1.scale)
        setCurCenter(ss1.star)
    }
  }, [sysLoading()]);

  
  const canvasRef = useRef(null);

  const [scale, setScale] = useState(ss ? ss.scale : 1)

  const handleKeys = (e)=> {
    console.log(e.key)
    switch(e.key) {
        case "z": setScale(scale*1.1); break;
        case "x": setScale(scale*0.9); break;
        case "q": 
            console.log("Setting to ", timeScale*1.1);
            setTimeScale(timeScale*1.1); 
            break;
        case "w": setTimeScale(timeScale*0.9); break;
        //case "q": setScale(scale*0.9)
        default: break;
    } 
  }

  // dependencies here are crazy important for some unknown reason
  useEffect(()=> {
    window.addEventListener("keydown", handleKeys);
    return ()=>window.removeEventListener("keydown", handleKeys);
  },[width, height, scale, timeScale])


    
    
  return (
      <Row >
          <Col sm={12} md={6} lg={3} xl={3} >
              <h4>stuff</h4>
          Scale: {scale}<br/>
          Time scale: {timeScale}
          </Col>
          
          <Col sm={12} md={6} lg={3} xl={3} 
          style={{border: "solid 1px #006600"}}>
              <img src="/lastspaceship/ships/sparrow01edges.png"
              width="100%" />
              <p className="text-sci-fi">
                  <span className="text-sci-fi-g">hull:</span> falcon<br/>
                  <span className="text-sci-fi-g">transponder:</span> P-F173<br/>
                  <span className="text-sci-fi-g">owner:</span> unknown<br/>
                  <span className="text-sci-fi-g">category:</span> police patrol
              </p>
              
          </Col>
          <Col sm={12} md={6} lg={6} xl={6} ref={ref} 
          style={{height: "90vh", border: "solid 1px #006600"}}
          className="terminal-ship">
    <Stage width={width} height={height}>
      <Layer>
        {ss && <Circle x={width/2} y={height/2} radius={Math.max(20,curCenter.radius/scale)} 
        fillRadialGradientEndRadius={Math.max(20,curCenter.radius/scale)}
        fillRadialGradientColorStops ={curCenter.visuals?.gradientStops? curCenter.visuals.gradientStops : [0, 'red', 0.8, 'yellow', 1, 'white']} />}
        {
            showOrbits && ss?.planetoids.filter(pf=> pf.orbit?.centerId === curCenter._id).map((p,i)=> {
                //const coords = ss.toScreenCoords(p.coordsStar)
                
                return <Circle key={i} x={width/2} y={height/2} 
                    radius={p.orbit.polar.x/scale} 
                    stroke={'#33ff33'}
                    dash={[2,2]}
                    strokeWidth={1}
                />
            })
        }
        {
            ss?.planetoids.filter(pf=> pf.orbit?.centerId === curCenter._id).map((p,i)=>{
                ss.scale=scale
                const coords = ss.toScreenCoords(p.coordsStar)
                
                
            return <><Circle key={i}
            x={coords.x} y={coords.y} radius={Math.max(10,p.radius/scale)} 
            fillRadialGradientEndRadius={Math.max(10,p.radius/scale)}
            fillRadialGradientColorStops ={p.visuals?.gradientStops? p.visuals.gradientStops : [0, 'gray', 1, '#cccccc']} />
            <Text text={p.name}
                  x={coords.x+6} y={coords.y}
                  fontSize={10}
                  fontFamily={'Orbitron'}
                  fill={'#33ff33'} />
            </>
            })
        }
        
      </Layer>
    </Stage>
  </Col>
  </Row>
  );
};


