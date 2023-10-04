import React, { useEffect } from "react"
import { Container, Row } from "react-bootstrap"
import { ShipSetup } from "./ShipSetup";
import { ShipSetupNeu } from "./ShipSetupNeu";

export const Main = () => {

    useEffect(()=> {
        document.body.style.backgroundColor = "#663010";
    }, [])

    return (
        <Container fluid={"xl"} className="neu-1 py-2 ">
            <Row className="text-sci-fi-o py-3 px-4"
            style={{borderBottom: "solid 1px #606060"}}>
                welcome, john
            </Row>
            <Row className="overflow-auto" style={{height: "90%"}}>
                
            <ShipSetupNeu />
            <p>asfasfasf</p>
            <p>asfasfasf</p>
            <p>asfasfasf</p>
            <p>asfasfasf</p>
            <p>asfasfasf</p>
            <p>asfasfasf</p>
            <p>asfasfasf</p>
            <p>asfasfasf</p>
            
            </Row>
        </Container>
    )
}