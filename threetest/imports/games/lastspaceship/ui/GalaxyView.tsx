import React, {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Col, Container, Row } from "react-bootstrap";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { useTracker } from "meteor/react-meteor-data";

import Konva from "konva";
import { Stage, Layer, Rect, Text, Circle, Line, Image } from "react-konva";

import useImage from "use-image";

import { useSubscribe, useFind } from "meteor/react-meteor-data";
import { ColPlayer, ColShips } from "../api/meteor/Player";

import { Meteor } from "meteor/meteor";
import {
  AstroController,
  ColPlanetoids,
  ColStarsystems,
} from "../api/meteor/Astro";
import { Stars } from "../api/model/Astro/Stars";
import { Vector2g } from "../api/model/Astro/Physics";

export const GalaxyView = () => {
  const { id } = useParams();

  const navigate=useNavigate()

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  const [timeScale, setTimeScale] = useState(0.01);

  //const sysLoading = useSubscribe("systemByCurrentPlayer")
  //const bodies = useFind(()=>ColPlanetoids.find({}), [])
  //const ships = useFind(()=>ColShips.find({}), [])
  //const stars = useFind(()=>ColStarsystems.find({}), [])
  //console.log(bodies, ships, stars)
  const u = useTracker(() => Meteor.user(), [Meteor.userId()]);
  useSubscribe("userData");
  const player = ColPlayer.findOne({ _id: u?.playerId });
  //console.log(player)
  const myShip = ColShips.findOne({ _id: player?.currentShipId });
  //console.log(myShip)
  const galLoading = useSubscribe("galaxyById", id);
  const gal = useFind(() => ColStarsystems.find({}), [id]);

  const [ssel1, setssel1] = useState(-1);
  const [ssel2, setssel2] = useState(-1);
  const [namesOn, setNamesOn] = useState(true);

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
    //setScale(ae.children[0].orbit.radius * 1.2 /( Math.min(width,height) / 2))
  }, []);

  const [scale, setScale] = useState(1);

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
      case "Escape":
        setssel1(-1);
        setssel2(-1);
        break;
      case "n":
        setNamesOn(!namesOn);
        break;
      case "i": 
        console.log(ssel1)
        if (ssel1 > -1) {
            navigate("/system/"+gal[ssel1]._id)
        };
        break;
      default:
        break;
    }
  };

  // dependencies here are crazy important for some unknown reason
  useEffect(() => {
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [width, height, scale, timeScale, namesOn, ssel1]);

  //if (galLoading()) return <h4>Loading galaxy...</h4>;
  //else
    return (
      <Row style={{ height: "85vh" }} ref={ref}>
        <Stage width={width} height={height}>
          <Layer>
            {gal.map((g, i) => {
              let r = 2 + (g.radius / Stars.solarR) * 4;
              if (r > 12) r = 12;
              return (
                <Fragment key={i}>
                  <Circle
                    x={g.galacticCoords.x * scale}
                    y={g.galacticCoords.y * scale}
                    radius={r}
                    fillRadialGradientEndRadius={r}
                    fillRadialGradientColorStops={[
                      0,
                      g.spectralColor,
                      0.8,
                      g.spectralColor,
                      1,
                      "white",
                    ]}
                    onDblClick={()=>{
                        console.log("opening system", g.name)
                    }}
                    onClick={(e) => {
                      console.log(g.name);
                      if (i === ssel1) setssel1(-1);
                      else if (i === ssel2) setssel2(-1);
                      else {
                        if (ssel1 === -1) setssel1(i);
                        else setssel2(i);
                        
                      }
                    }}
                  />
                  {ssel1 === i && (
                    <Circle
                      x={g.galacticCoords.x * scale}
                      y={g.galacticCoords.y * scale}
                      radius={r}
                      stroke="green"
                      strokeWidth={4}
                    />
                  )}
                  {ssel2 === i && (
                    <Circle
                      x={g.galacticCoords.x * scale}
                      y={g.galacticCoords.y * scale}
                      radius={r}
                      stroke="red"
                      strokeWidth={4}
                    />
                  )}
                  {ssel1 > -1 && ssel2 > -1 && (
                    <>
                      <Line
                        points={[
                          gal[ssel1].galacticCoords.x * scale,
                          gal[ssel1].galacticCoords.y * scale,
                          gal[ssel2].galacticCoords.x * scale,
                          gal[ssel2].galacticCoords.y * scale,
                        ]}
                        stroke="green"
                        strokeWidth={1}
                      />
                      <Text
                        text={
                          "distance, l.y.:" +
                          Vector2g.Distance(
                            gal[ssel1].galacticCoords,
                            gal[ssel2].galacticCoords
                          )
                        }
                        x={gal[ssel1].galacticCoords.x * scale}
                        y={gal[ssel1].galacticCoords.y * scale + 10}
                        fontSize={10}
                        fill={"green"}
                      />
                    </>
                  )}
                  {namesOn && (
                    <Text
                      text={g.name}
                      x={g.galacticCoords.x * scale + r + 2}
                      y={g.galacticCoords.y * scale - r / 2}
                      fontSize={10}
                      fill={"#ffffff"}
                    />
                  )}
                </Fragment>
              );
            })}
            {/*<ShipIcon x={350} y={250} scaleX={0.05} scaleY={0.05} />*/}
          </Layer>
        </Stage>
      </Row>
    );
};

const ShipIcon = (props) => {
  const [image] = useImage("/lastspaceship/ships/falcon01.png");
  return <Image image={image} {...props} />;
};
