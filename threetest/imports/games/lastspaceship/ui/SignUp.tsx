import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Accounts } from 'meteor/accounts-base'

import Button from "react-bootstrap/Button";

export const SignUp = () => {
    const [e, se] = useState("")
    const [p, sp] = useState("")

    const create = () => {
        console.log("Creating ", e)
        Accounts.createUser({username:e, email:e, password:p}, (err)=> {
            console.log(err);
        })
    }

  return (
    <Col
      lg={{ offset: 4, span: 4 }}
      md={{ offset: 2, span: 8 }}
      sm={{ span: 12 }}
      style={{ height: "90%" }}
      className="px-4 py-5"
    >
        <span className="text-sci-fi-g">
            please identify yourself
        </span><br/>
        <input className="neu-2 mt-2 mb-4" 
        type="email" placeholder="Enter email"
        value={e} onChange={(e)=>se(e.target.value)} />
        <span className="text-sci-fi-g">
            choose secure password
        </span><br/>
        <input className="neu-2 mt-2" 
        type="password" placeholder="Enter password"
        value={p} onChange={(e)=>sp(e.target.value)} />
        <br/>
        <Button variant="outline-warning text-sci-fi-any mt-4"
        onClick={create}>enroll</Button>
      </Col>
  );
};
