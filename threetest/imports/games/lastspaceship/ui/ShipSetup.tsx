import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { AllHullTypes } from "../api/model/Spaceship";

const hulls = AllHullTypes

const humanSizes = ["tiny", "small", "medium", "large", "huge"]

export const ShipSetup = () => {

    const [selSh, setSelSh] = useState(0)
    useEffect(()=> {
        document.body.classList.add('terminal-ship');
    }, [])

    return (
        <Container fluid>
            <Row className="mt-4">
            <Col xl={{span: 2}}
           lg={{span: 2}}
           md={{span: 4}}
           sm={{span: 12}} >
               <span className="text-sci-fi">
                   pick the hull:
               </span>
               
           </Col>
        <Col xl={{span: 2}}
           lg={{span: 2}}
           md={{span: 4}}
           sm={{span: 12}}>
               <span className="text-sci-fi">hull type:</span><br/>
               <span className="text-sci-fi">hull size:</span><br/>
               <span className="text-sci-fi">hull material:</span><br/>
               <span className="text-sci-fi">dry mass:</span><br/>
               
        </Col>
        <Col xl={{span: 2}}
           lg={{span: 2}}
           md={{span: 4}}
           sm={{span: 12}} >
               <span className="text-sci-fi-w">{hulls[selSh].name}</span><br/>
               <span className="text-sci-fi-w">{humanSizes[hulls[selSh].size]}</span><br/>
               <span className="text-sci-fi-w">{hulls[selSh].materials[0].name}</span><br/>
               <span className="text-sci-fi-w">{hulls[selSh].dryMass / 1000} tonnes</span><br/>
        </Col>
        <Col xl={{span: 4}}
           lg={{span: 4}}
           md={{span: 4}}
           sm={{span: 12}}>    
           <p className="text-sci-fi-g">{hulls[selSh].description}</p>  
        </Col>
    </Row>
  

            <Row className="mt-4">
            <Col xl={{span: 2}}
           lg={{span: 2}}
           md={{span: 4}}
           sm={{span: 12}}>
               <ul className="list-group">
               {hulls.map((h,i) => {
                   const cls = (selSh === i) ? "list-group-item active" : "list-group-item"
                   return <li className={cls} key={i}>
                       <a href="#" onClick={()=>setSelSh(i)} className="text-sci-fi">
                           {h.name}</a></li>
               })}
  
</ul>
           </Col>
        <Col xl={{span: 2}}
           lg={{span: 2}}
           md={{span: 4}}
           sm={{span: 12}}>
               <Row className="ship-detail-box ship-detail-drive">
                   <span className="text-sci-fi-g">
                       sublight drive
                   </span>
               </Row>
               <Row className="ship-detail-box ship-detail-reactor">
                   <span className="text-sci-fi-g">
                       reactor
                   </span>
               </Row>
               
        </Col>
        <Col xl={{span: 4}}
           lg={{span: 6}}
           md={{span: 8}}
           sm={{span: 12}} className="ship-box" >
               <img src={hulls[selSh].pictures?.normal}
               width="100%" height="100%" />
        </Col>
        <Col xl={{span: 2}}
           lg={{span: 2}}
           md={{span: 4}}
           sm={{span: 12}}>
               <Row className="ship-detail-box ship-detail-ftl">
                   <span className="text-sci-fi-g">
                       ftl drive
                   </span>
               </Row>
               <Row className="ship-detail-box ship-detail-computer">
                   <span className="text-sci-fi-g">
                       computer
                   </span>
               </Row>
               
        </Col>
    </Row>
  </Container>

    )
}