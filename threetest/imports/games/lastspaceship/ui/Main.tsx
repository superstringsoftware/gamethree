import React, { useEffect, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, Outlet } from "react-router-dom";

import {useTracker, useSubscribe} from 'meteor/react-meteor-data'
import { ColPlayer } from "../api/meteor/Player";
import {Meteor} from 'meteor/meteor'


// full screen layout
export const Main = () => {
  
  const u = useTracker(()=> Meteor.user(), [Meteor.userId()])
  useSubscribe("userData")
  const player = ColPlayer.findOne({_id: u?.playerId})
  console.log(player)

  //useEffect(()=>document.body.classList.add("terminal-ship"),[])

  const [showMainMenu, setShowMainMenu] = useState(false)

  const genGalaxy = () => {
      Meteor.call("galaxy.generate", 
        40, 1200, 800, (err,res)=> {
            console.log(err,res)
            setShowMainMenu(false)
        })
  }

  const deleteGalaxy = (id) => {
      console.log("Deleting", id)
      Meteor.call("galaxy.remove", id, 
        (err,res)=> {
            console.log(err,res)
            setShowMainMenu(false)
        })
  }

  return (
    <Container fluid={"xxl"} className="py-2">
      <Row
        className="text-sci-fi-o py-3 px-4"
        style={{zIndex:-1500000}}
      >
          <Col>
        <Button onClick={()=>setShowMainMenu(true)}>main</Button>
        </Col>
      </Row>
      
        <Outlet />

        <Modal show={showMainMenu} onHide={()=>setShowMainMenu(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Main Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
            <Col>
        <h6>Current Galaxy</h6>
        {player?.currentGalaxyId}
        <h6>My Galaxies</h6>
        <ul className="list-group">
            {
                player?.galaxies?.map((g,i)=> <li key={i} 
                className="list-group-item">
                    <Link to={"/galaxy/"+g}
                    onClick={()=>setShowMainMenu(false)}>
                        {g}</Link>
                        <Button size={"sm"} variant="outline-danger"
                        onClick={()=>deleteGalaxy(g)}>
                            Delete</Button>
                </li>)
            }
        </ul>
        </Col>
        <Col>
        <h6>New Galaxy</h6>
        <Button onClick={genGalaxy}>Generate Galaxy</Button>
        </Col>
        </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowMainMenu(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={null}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      
    </Container>
  );
};

// layout with neumorphic "ipad"
export const MainPad = () => {
    useEffect(() => {
      document.body.style.backgroundColor = "#663010";
    }, []);
  
    const u = useTracker(()=> Meteor.user(), [Meteor.userId()])
  
    return (
      <Container fluid={"xl"} className="neu-1 py-2 ">
        <Row
          className="text-sci-fi-o py-3 px-4"
          style={{ borderBottom: "solid 1px #303030" }}
        >{u?<span>{u.username}</span> :
        <a href="#">enroll</a>}
          
        </Row>
        <Row className="overflow-auto" style={{ height: "90%" }}>
          <Outlet />
        </Row>
      </Container>
    );
  };
  
