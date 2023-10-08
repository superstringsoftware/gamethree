import React, { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Outlet, useParams } from "react-router-dom";

import { useTracker } from "meteor/react-meteor-data";

import Konva from "konva";
import { Stage, Layer, Rect, Text, Circle, Line } from "react-konva";

import { useSubscribe, useFind } from "meteor/react-meteor-data";
import { ColPlayer, ColShips } from "../api/meteor/Player";

import { Meteor } from "meteor/meteor";
import {
  AstroController,
  ColPlanetoids,
  ColStarsystems,
} from "../api/meteor/Astro";
import { Stars } from "../api/model/Astro/Stars";
import { IPlanetoidData, IStarData } from "../api/model/Astro/interfaces";

export const AstroView = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  const { id } = useParams();

  const [timeScale, setTimeScale] = useState(0.01);

  const sysLoading = useSubscribe("systemById", id);
  const bodies = useFind(() => ColPlanetoids.find({}), [id]);
  const ships = useFind(() => ColShips.find({}), [id]);
  const stars = useFind(() => ColStarsystems.find({}), [id]);
  console.log(bodies, ships, stars);
  const u = useTracker(() => Meteor.user(), [Meteor.userId()]);
  useSubscribe("userData");
  const player = ColPlayer.findOne({ _id: u?.playerId });
  //console.log(player)
  const myShip = ColShips.findOne({ _id: player?.currentShipId });
  //console.log(myShip)

  const [ss, setss] = useState(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [curCenter, setCurCenter] = useState(null);

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
    //setScale(ae.children[0].orbit.radius * 1.2 /( Math.min(width,height) / 2))
  }, []);

  useEffect(() => {
    if (!sysLoading()) {
      const ss1 = AstroController.starSystemFromData(id);
      ss1.calcScale(width, height);
      ss1.advanceOrbits(0.1);
      ss1.updateDecart();
      //console.log("SCALE:", ss1)
      setss(ss1);
      setScale(ss1.scale);
      setCurCenter(ss1.star);
    }
  }, [sysLoading()]);

  const canvasRef = useRef(null);

  const [scale, setScale] = useState(ss ? ss.scale : 1);

  const [selP, setSelP] = useState(null)

  const handleKeys = (e) => {
    console.log(e.key);
    switch (e.key) {
      case "z":
        setScale(scale * 1.1);
        break;
      case "x":
        setScale(scale * 0.9);
        break;
      case "q":
        console.log("Setting to ", timeScale * 1.1);
        setTimeScale(timeScale * 1.1);
        break;
      case "w":
        setTimeScale(timeScale * 0.9);
        break;
      //case "q": setScale(scale*0.9)
      case "o":
          setShowOrbits(!showOrbits);break;
      default:
        break;
    }
  };

  // dependencies here are crazy important for some unknown reason
  useEffect(() => {
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [width, height, scale, timeScale, showOrbits]);

  return (
    <Row>
      <Col md={4} lg={3} sm={12} style={{backgroundColor: "rgba(0,0,0,.25)", }}>
        
        {selP ? <PlanetCard planet={selP} /> : <StarCard star={ss?.star} />}
      </Col>

      <Col md={8} lg={6} sm={12} ref={ref} style={{ height: "85vh" }}>
        <Stage width={width} height={height}>
          <Layer>
            {ss && (
              <Circle
                x={width / 2}
                y={height / 2}
                radius={Math.max(20, curCenter.radius / scale)}
                fillRadialGradientEndRadius={Math.max(
                  20,
                  curCenter.radius / scale
                )}
                fillRadialGradientColorStops={
                  curCenter.visuals?.gradientStops
                    ? curCenter.visuals.gradientStops
                    : [0, "red", 0.8, "yellow", 1, "white"]
                }
                onClick={()=>{
                    //setSelP(null)
                    console.log("Selecting star")
                }}
              />
            )}
            {ss && showOrbits && 
            <Circle x={width / 2}
            y={height / 2}
            radius={ss.getHabitableZoneBorder().x / scale}
            stroke={"red"}
            dash={[1, 1]}
            strokeWidth={1}
          />
            }
            {ss && showOrbits && 
            <Circle x={width / 2}
            y={height / 2}
            radius={ss.getHabitableZoneBorder().y / scale}
            stroke={"blue"}
            dash={[1, 1]}
            strokeWidth={1}
          />
            }
            {showOrbits &&
              ss?.planetoids
                .filter((pf) => pf.orbit?.centerId === curCenter._id)
                .map((p, i) => {
                  //const coords = ss.toScreenCoords(p.coordsStar)

                  return (
                    <Circle
                      key={i}
                      x={width / 2}
                      y={height / 2}
                      radius={p.orbit.polar.x / scale}
                      stroke={"#33ff33"}
                      dash={[2, 2]}
                      strokeWidth={1}
                    />
                  );
                })}
            {ss?.planetoids
              .filter((pf) => pf.orbit?.centerId === curCenter._id)
              .map((p, i) => {
                ss.scale = scale;
                const coords = ss.toScreenCoords(p.coordsStar);

                return (
                  <>
                    <Circle
                      key={i}
                      x={coords.x}
                      y={coords.y}
                      radius={(10 * p.radius) / Stars.earthR}
                      fillRadialGradientEndRadius={
                        (10 * p.radius) / Stars.earthR
                      }
                      fillRadialGradientColorStops={
                        p.visuals?.gradientStops
                          ? p.visuals.gradientStops
                          : [0, "gray", 1, "#cccccc"]
                      }
                      onClick={()=>{
                          setSelP(p)
                          console.log(p)
                        }}
                    />
                    <Text
                      text={p.name}
                      x={coords.x + 6}
                      y={coords.y}
                      fontSize={10}
                      fontFamily={"Orbitron"}
                      fill={"#33ff33"}
                    />
                  </>
                );
              })}
          </Layer>
        </Stage>
      </Col>

      <Col md={4} lg={3} sm={12}>
        <h6>data2</h6>
      </Col>
    </Row>
  );
};

const StarCard = (props: {
    star: IStarData
}) => {
    const s = props.star
    if (!s) return null
    return <div className="text-sci-fi-w">
        <hr/>{s.name} <hr/>
        <ED t="class" v={s.starClass} />
        <ED t="temperature" v={s.surfaceTemp.toFixed(0)} />
        <ED t="mass" v={(s.mass/Stars.solarM).toFixed(2) + " Sun"} />
        <ED t="radius" v={(s.radius/Stars.solarR).toFixed(2) + " Sun"} />
        </div>
}


const PlanetCard = (props:{
    planet: IPlanetoidData
}) => {

    const p = props.planet
    const g = p.gOnSurface / 9.81;
    let gclr = "red"
    if (g > 0.2) gclr = "yellow"
    if (g > 0.5) gclr = "green"
    if (g > 1.2) gclr = "yellow"
    if (g > 2) gclr = "red"

    const ap = p.atmoPressure
    let apclr = "red"
    if (ap > 0.5) apclr = "yellow"
    if (ap > 0.8) apclr = "green"
    if (ap > 2) apclr = "yellow"
    if (ap > 5) apclr = "red"

    let aclr = "red"
    switch(p.atmosphere) {
        case "breathable": aclr = "yellow"; break;
        case "earth": 
        case "abundant": aclr = "green"; break;
    }

    let sclr = "red"
    if (p.soilSimple > 15) sclr = "yellow"
    if (p.soilSimple > 50) sclr = "green"

    let tclr = "green"
    if ((p.minT < 220) || (p.maxT > 323)) tclr = "yellow"
    if ((p.minT < 170) || (p.maxT > 353)) tclr = "red"



    return <div className="text-sci-fi-w">
        <hr/>{p.name} <hr/>
        <ED t="type" v={p.type} />
        <ED t="mass" v={(p.mass/Stars.earthM).toFixed(2) + " Earth"} />
        <ED t="radius" v={(p.radius/Stars.earthR).toFixed(2) + " Earth"} />
        <ED t="orbit R" v={(p.orbit?.polar.x / 150000000000).toFixed(2)+ " a.u."} />
        <hr/>Habitation <hr/>
        <ED t="gravity" v={g.toFixed(2)+ " Earth"} clr={gclr} />
        <ED t="atm pressure" v= {(ap).toFixed(2)+ " Earth"} clr={apclr} />
        <ED t="atm quality" v= {p.atmosphere} clr={aclr} />
        <ED t="T range, C" 
        v= {(p.minT-273).toFixed(1) + " to "+ (p.maxT-273).toFixed(1)} 
        clr={tclr} />
        <ED t="soil quality" v= {(p.soilSimple).toFixed(1)+ " %"} clr={sclr}/>
        <hr/>Terrain<hr/>
        <ED t="oceans" v= {(p.terrain.oceans*100).toFixed(1)+ " %"} />
        <ED t="plains" v= {(p.terrain.plains*100).toFixed(1)+ " %"} />
        <ED t="hills" v= {(p.terrain.hills*100).toFixed(1)+ " %"} />
        <ED t="mountains" v= {(p.terrain.mountains*100).toFixed(1)+ " %"} />
        
        
        
    </div>
}

const ED = (props: {
    t: string, v: string, clr?: string
}) => {
    return <>{props.t}{": "} 
    {props.clr ? <span style={{color: props.clr}}>{props.v}</span> :
    <span className="text-sci-fi-o">{props.v}</span>}
    <br/></>
}