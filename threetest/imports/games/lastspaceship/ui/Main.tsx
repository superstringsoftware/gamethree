import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Outlet } from "react-router-dom";

import {useTracker} from 'meteor/react-meteor-data'


// full screen layout
export const Main = () => {
  
  const u = useTracker(()=> Meteor.user(), [Meteor.userId()])

  return (
    <Container fluid={"xl"} className="py-2 ">
      <Row
        className="text-sci-fi-o py-3 px-4"
      >{u?<span>{u.username}</span> :
      <a href="#">enroll</a>}
        
      </Row>
      <Row className="overflow-auto" style={{ height: "90vh" }}>
        <Outlet />
      </Row>
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
  
