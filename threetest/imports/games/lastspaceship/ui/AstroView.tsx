import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Outlet } from "react-router-dom";

import {useTracker} from 'meteor/react-meteor-data'

import Konva from 'konva'
import { AstroBody } from "../api/model/Astro";
import { AllHullTypes, Spaceship } from "../api/model/Spaceship";

import {useSubscribe, useFind} from 'meteor/react-meteor-data'
import { ColAstrobodies, fromAstroBodyId } from "../api/meteor/AstroBodies";
import { ColShips } from "../api/meteor/Player";

import {Meteor} from 'meteor/meteor'




export const AstroView = () => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const ref = useRef(null)

    const [timeScale, setTimeScale] = useState(0.01)

    const sysLoading = useSubscribe("systemByCurrentPlayer")
    const bodies = useFind(()=>ColAstrobodies.find({}), [])
    const ships = useFind(()=>ColShips.find({}), [])
    const star = bodies.find(b => b.type === "star")
    //console.log(bodies, ships, star)
    const planets = useFind(()=>ColAstrobodies.find({type: "planet"}), [])

    const sys = star? fromAstroBodyId(star._id) : null

    const [ae, setae] = useState(null)

    const myShip = sys?.findShipByName("Rakhmaninoff")
    console.log("My ship: ", myShip)
    console.log(sys)
    


  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
    //setScale(ae.children[0].orbit.radius * 1.2 /( Math.min(width,height) / 2))
    
  }, []);

  useEffect(()=> {
    if (sys) {
        setScale(sys.children[0].orbit.radius * 3 /( Math.min(width,height) / 2))
        setae(sys)
    }
  }, [star])

  


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

  const systemView = () => {
    if ((ae === null) || (sys === null)) return
  //i.e. value other than null or undefined
  console.log("Calculated: ", width, height)
  //setScale(ae.children[0].orbit.radius * 1.2 /( Math.min(width,height) / 2))

  window.addEventListener("keydown", handleKeys);
  var stage = new Konva.Stage({
      container: 'cont',
      width: width,
      height: height,
    });


    var layer = new Konva.Layer();

    
    const centralRad = 100

    const chld = ae.children.map( c => {
        //console.log(c.constructor.name)
        switch (c.constructor.name) {
            case AstroBody.name:
                const c1 = c as AstroBody
                return new Konva.Circle({
                  x: stage.width() / 2 + (Math.cos(c1.orbit.curAngle)*c1.orbit.radius)/scale,
                  y: stage.height() / 2 - (Math.sin(c1.orbit.curAngle)*c1.orbit.radius)/scale,
                  radius: c1.radius / scale,
                  fill: "green",
                  stroke: 'white',
                  strokeWidth: 1,
                });
            case Spaceship.name:
                const c2 = c as Spaceship
                return new Konva.Rect({
                  x: stage.width() / 2 + centralRad*Math.cos(c2.orbit.curAngle) + (Math.cos(c2.orbit.curAngle)*c2.orbit.radius)/scale,
                  y: stage.height() / 2 - centralRad*Math.sin(c2.orbit.curAngle) - (Math.sin(c2.orbit.curAngle)*c2.orbit.radius)/scale,
                  width: 4,
                  height: 4,
                  fill: 'green',
                  stroke: 'white',
                  strokeWidth: 1,
                });
        }
    })

    const txt = []
    chld.forEach((g,i) => {
        const c = ae.children[i];
      switch (c.constructor.name) {
          case AstroBody.name: 
          txt.push(new Konva.Text({
              x: g.x()+6,
              y: g.y(),
              text: (c as AstroBody).name,
              fontSize: 10,
              fontFamily: 'Orbitron',
              fill: '#33ff33',
            }));
          break;
          case Spaceship.name: 
          
          txt.push(new Konva.Text({
              x: g.x()+6,
              y: g.y(),
              text: (c as Spaceship).transponder,
              fontSize: 10,
              fontFamily: 'Orbitron',
              fill: '#33ff33',
            }));
          break;
          default: break;
      }
      // orbits:
      //console.log(c)
      layer.add(new Konva.Circle({
          x: stage.width() / 2,
          y: stage.height() / 2,
          radius: c.orbit.radius / scale,
          stroke: '#33ff33',
          dash:[2,2],
          strokeWidth: 1,
        }))
    })

    const earth = new Konva.Circle({
      x: stage.width() / 2,
      y: stage.height() / 2,
      radius: ae.radius / scale,
      fillRadialGradientStartPoint: { x: 0, y: 0 },
    fillRadialGradientStartRadius: 0,
    fillRadialGradientEndPoint: { x: 0, y: 0 },
    fillRadialGradientEndRadius: ae.radius / scale,
    fillRadialGradientColorStops: [0, 'green', 0.5, '#33ff33', 1, '#33eeee'],
      stroke: 'blue',
      strokeWidth: 1,
    });
    layer.add(earth);

    chld.forEach(c => layer.add(c))
    txt.forEach(c => layer.add(c))
    
    stage.add(layer);

    var anim = new Konva.Animation(function (frame) {
        if ((scale === 0) || (!isFinite(scale))) {
            setScale(ae.children[0].orbit.radius * 1.2 /( Math.min(width,height) / 2))
        }
      ae.advanceOrbit(frame.timeDiff * timeScale);

      //console.log("Current angle", ae.children[0].orbit.curAngle)
      chld.forEach( (g,i) => {
          const c = ae.children[i]
          g.x(stage.width() / 2 + (Math.cos(c.orbit.curAngle)*c.orbit.radius)/scale)
          g.y(stage.height() / 2 - (Math.sin(c.orbit.curAngle)*c.orbit.radius)/scale)
          txt[i].x(g.x()+6)
          txt[i].y(g.y())
      })
      
    }, layer);

    anim.start();

    return () => {
      anim.stop()
      window.removeEventListener("keydown", handleKeys);
  };
}



const radarView = () => {
    if ((ae === null) || (sys === null) || (!myShip)) return
  
  window.addEventListener("keydown", handleKeys);
  var stage = new Konva.Stage({
      container: 'cont',
      width: width,
      height: height,
    });


    var layer = new Konva.Layer();

    
    const centralRad = 100

    const center = myShip.toDecart(true);

    const coord2 = ae.toDecart(true)
    const bd = new Konva.Circle({
        x: stage.width() / 2 + (coord2.x - center.x)/scale,
        y: stage.height() / 2 - (coord2.y - center.y)/scale,
        radius: (ae as AstroBody).radius / scale,
        fill: "green",
        stroke: 'white',
        strokeWidth: 1,
      });

    const chld = ae.children.map( c => {
        //console.log(c.constructor.name)
        switch (c.constructor.name) {
            case AstroBody.name:
                const c1 = c as AstroBody
                const coord = c1.toDecart(true)
                return new Konva.Circle({
                  x: stage.width() / 2 + (coord.x - center.x)/scale,
                  y: stage.height() / 2 - (coord.y - center.y)/scale,
                  radius: c1.radius / scale,
                  fill: "green",
                  stroke: 'white',
                  strokeWidth: 1,
                });
            case Spaceship.name:
                const c2 = c as Spaceship
                const coord1 = c2.toDecart(true)
                return new Konva.Rect({
                    x: stage.width() / 2 + (coord1.x - center.x)/scale,
                    y: stage.height() / 2 - (coord1.y - center.y)/scale,
                  width: 4,
                  height: 4,
                  fill: 'green',
                  stroke: 'white',
                  strokeWidth: 1,
                });
        }
    })

    const txt = []
    chld.forEach((g,i) => {
        const c = ae.children[i];
      switch (c.constructor.name) {
          case AstroBody.name: 
          txt.push(new Konva.Text({
              x: g.x()+6,
              y: g.y(),
              text: (c as AstroBody).name,
              fontSize: 10,
              fontFamily: 'Orbitron',
              fill: '#33ff33',
            }));
          break;
          case Spaceship.name: 
          
          txt.push(new Konva.Text({
              x: g.x()+6,
              y: g.y(),
              text: (c as Spaceship).transponder,
              fontSize: 10,
              fontFamily: 'Orbitron',
              fill: '#33ff33',
            }));
          break;
          default: break;
      }
      
    })

    
    layer.add(bd)
    chld.forEach(c => layer.add(c))
    txt.forEach(c => layer.add(c))
    
    stage.add(layer);

    var anim = new Konva.Animation(function (frame) {
        if ((scale === 0) || (!isFinite(scale))) {
            setScale(ae.children[0].orbit.radius * 1.2 /( Math.min(width,height) / 2))
        }
      ae.advanceOrbit(frame.timeDiff * timeScale);

      const ms = ae.findShipByName("Rakhmaninoff")
      const center = ms.toDecart(true);

      const coord3 = ae.toDecart(true)
      bd.x(stage.width() / 2 + (coord3.x - center.x)/scale),
      bd.y(stage.height() / 2 - (coord3.y - center.y)/scale),

      //console.log("Current angle", ae.children[0].orbit.curAngle)
      chld.forEach( (g,i) => {
          const c = ae.children[i]
          const coord = c.toDecart(true)
          g.x(stage.width() / 2 + (coord.x - center.x)/scale),
          g.y(stage.height() / 2 - (coord.y - center.y)/scale),
          txt[i].x(g.x()+6)
          txt[i].y(g.y())
      })
      
    }, layer);

    anim.start();

    return () => {
      anim.stop()
      window.removeEventListener("keydown", handleKeys);
  };
}

  

  //console.log(ae.children[0].orbit)
  useEffect(() => systemView(), 
  [width, height, scale, timeScale, bodies, ships, ae]);

    
    
  return (
      <Row >
          <Col sm={12} md={6} lg={3} xl={3} style={{backgroundColor: "black"}}>
              <h4>stuff</h4>
          <ul className="list-group">
              <li className="list-group-item">
                  <a href="#" onClick={()=>{
                      setae(sys)
                      setScale(sys.children[0].orbit.radius * 3 /( Math.min(width,height) / 2))
                      }}>{star?.name}</a>
              </li>
              {ae?.children.map((p,i)=> {
              if (p.constructor.name === AstroBody.name) {
              return <li className="list-group-item" key={i}>
              <a href="#" onClick={()=>{
                  const b = sys.findChildByName(p.name)
                  console.log("Found: ", b)
                  setae(b)
                  setScale(b.radius * 100 /( Math.min(width,height) / 2))
              }}>{p.name}</a>
              </li>}
            })}
          </ul>
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



