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
import { Stars } from "../api/model/Astro/Stars";


const gal = []
for (let i=0; i<100; i++) {
    gal.push(Stars.generateStar(1200,800))
}

//console.log(gal)


export const GalaxyView = () => {
    
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const ref = useRef(null)

    const [timeScale, setTimeScale] = useState(0.01)

    //const sysLoading = useSubscribe("systemByCurrentPlayer")
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

    
    


  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
    //setScale(ae.children[0].orbit.radius * 1.2 /( Math.min(width,height) / 2))
  }, []);


  const [scale, setScale] = useState(1)

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
      <Row style={{height: "92vh"}}
      ref={ref}>
          
    <Stage width={width} height={height}>
      <Layer>
        {
            gal.map((g,i)=> {
                let r = 2 + g.radius / Stars.solarR * 4
                if (r>12) r = 12
                return <><Circle x={g.galacticCoords.x*scale} y={g.galacticCoords.y*scale} 
                radius={r} 
                fillRadialGradientEndRadius={r}
                fillRadialGradientColorStops ={[0, g.spectralColor, 0.8, g.spectralColor, 1, 'white']} />
                <Text text={g.name}
                  x={g.galacticCoords.x*scale+6} y={g.galacticCoords.y*scale}
                  fontSize={10}
                  
                  fill={'gray'} />
                </>
            })
        }
      </Layer>
    </Stage>
  
  </Row>
  );
};



