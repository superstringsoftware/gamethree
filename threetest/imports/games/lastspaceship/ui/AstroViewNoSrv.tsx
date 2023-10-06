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
import { ColAstrobodies } from "../api/meteor/AstroBodies";


let AstroEarth = new AstroBody({
    name: "Earth",
    mass: 5.972e24,
    radius: 6370000
})

AstroEarth.addChild(new AstroBody({
    name: "Moon",
    mass: 7.347e22,
    radius: 1730000
}), 384000000,0)

console.log(AllHullTypes)

var _station1 = new Spaceship({hullData:AllHullTypes[3],
transponder: "M-F41", shipName:"Nicole",
description: "Battlestar orbiting the planet for base protection" })

var _station2 = new Spaceship({hullData:AllHullTypes[2],
    transponder: "M-OF317", shipName:"Jo-4",
    description: "Communications satellite for the military" })
    
var _station3 = new Spaceship({hullData:AllHullTypes[0],
    transponder: "P-219", shipName:"Merger",
    description: "Police patrol ship" })

AstroEarth.addChild(_station1, 7370000, Math.PI / 17)
AstroEarth.addChild(_station2, 16400000, Math.PI / 2.7)
AstroEarth.addChild(_station3, 8520000, -Math.PI / 3.4)

let sun = new AstroBody({
    name: "Sun",
    mass: 2e30,
    radius: 696340000
})

sun.addChild(AstroEarth, 150000000000, 0)
sun.addChild(new AstroBody({
    name: "Mercury",
    mass: 3.285e23,
    radius: 2440000
}), 52000000000, -1.2)
sun.addChild(new AstroBody({
    name: "Venus",
    mass: 4.86e24,
    radius: 6051000
}), 108000000000, -1.9)
sun.addChild(new AstroBody({
    name: "Mars",
    mass: 0.64e24,
    radius: 3380000
}), 239000000000, 2)

const ae = AstroEarth//sun//AstroEarth

export const AstroViewNoSrv = () => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const ref = useRef(null)

    const [timeScale, setTimeScale] = useState(0.1)

    const sysLoading = useSubscribe("systemById", 'BzAcNRzxTnuCQTbba')
    const bodies = useFind(()=>ColAstrobodies.find({}), [])
    console.log(bodies)

    //useEffect(()=>document.body.classList.add("terminal-ship"), [])

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
    setScale(ae.children[0].orbit.radius * 1.2 /( Math.min(width,height) / 2))
    
  }, []);

  const canvasRef = useRef(null);

  const [scale, setScale] = useState(ae.children[0].orbit.radius * 1.2 /( Math.min(width,height) / 2))

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

  

  //console.log(ae.children[0].orbit)
    
    useEffect(() => {
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
    }, [width, height, scale, timeScale]);

  return (
      <Row >
          <Col sm={12} md={6} lg={4} xl={3}><h4>stuff</h4>
          Scale: {scale}<br/>
          Time scale: {timeScale}
          </Col>
          <Col sm={12} md={6} lg={8} xl={9} ref={ref} style={{height: "90vh"}}>
    <div id="cont" style={{
              border: "solid 2px #00cc00",
              
              
          }} ></div>
  </Col>
  </Row>
  );
};

