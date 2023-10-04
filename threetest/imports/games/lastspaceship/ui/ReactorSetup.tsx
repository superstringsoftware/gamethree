import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { AllReactorData, ReactorData } from "../api/model/Reactors";

const hulls = AllReactorData
const humanSizes = ["tiny", "small", "medium", "large", "huge"]

export const ReactorSetup = (props: {
    onPick: (r:ReactorData) => void,
    onCancel: ()=> void
}) => {

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
           sm={{span: 6}} >
               <span className="text-sci-fi">
                   pick the reactor:
               </span>
               
           </Col>
        <Col xl={{span: 2}}
           lg={{span: 2}}
           md={{span: 4}}
           sm={{span: 6}}>
               
               <span className="text-sci-fi">size:</span><br/>
               <span className="text-sci-fi">fuel type:</span><br/>
               <span className="text-sci-fi">fuel mass:</span><br/>
               <span className="text-sci-fi">dry mass:</span><br/>
               
        </Col>
        <Col xl={{span: 2}}
           lg={{span: 2}}
           md={{span: 4}}
           sm={{span: 6}} >
               
               <span className="text-sci-fi-w">{humanSizes[hulls[selSh].size]}</span><br/>
               <span className="text-sci-fi-w">{hulls[selSh].fuelType[0].name}</span><br/>
               <span className="text-sci-fi-w">{hulls[selSh].fuelStorage} kg</span><br/>
               <span className="text-sci-fi-w">{hulls[selSh].dryMass / 1000} tonnes</span><br/>
        </Col>
        <Col xl={{span: 2}}
           lg={{span: 2}}
           md={{span: 4}}
           sm={{span: 6}}>    
           <span className="text-sci-fi">min power:</span><br/>
               <span className="text-sci-fi">max power:</span><br/>
               <span className="text-sci-fi">mc2 efficiency:</span><br/>
               
               
        </Col>
        <Col xl={{span: 2}}
           lg={{span: 2}}
           md={{span: 4}}
           sm={{span: 6}} >
               
               <span className="text-sci-fi-w">{hulls[selSh].minPower} MW</span><br/>
               <span className="text-sci-fi-w">{hulls[selSh].maxPower / 1000} GW</span><br/>
               <span className="text-sci-fi-w">{hulls[selSh].mc2coef} %</span><br/>
               
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
               
        </Col>
    </Row>
    <Row className="mt-4">
    <Col xl={{span: 2}}
           lg={{span: 2}}
           md={{span: 4}}
           sm={{span: 12}}></Col>
        <Col>
        <Button variant="outline-success text-sci-fi"
        onClick={()=>props.onPick(hulls[selSh])}>
            install</Button>&nbsp;
            <Button variant="outline-warning text-sci-fi-any"
        onClick={()=>props.onCancel()}>
            cancel</Button>
        </Col>
        
    </Row>
  </Container>

    )
}