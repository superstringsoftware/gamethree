import React, { useEffect } from 'react'
import { useState } from 'react'

const ttest = `Hello world, (c) 1987
terminal asceta v2.5

Documentation: help

`

var cmdHist = []
var cmdHistIndex = -1;

export const Terminal = ()=> {

    const [term, setTerm] = useState(ttest)
    const [inp, setInp] = useState("")

    /*
    useEffect(()=> {
        const canvas = document.getElementById("tutorial") as HTMLCanvasElement;
        if (canvas.getContext) {
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "rgb(200, 0, 0)";
          ctx.fillRect(10, 10, 50, 50);

          ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
          ctx.fillRect(30, 30, 50, 50);
        }
    }, [])*/

    const kp = (e) => {
        //console.log(e.code)
        if (e.code === "ArrowUp") {
            cmdHistIndex -= 1
            if (cmdHistIndex < 0) cmdHistIndex = cmdHist.length - 1
            //console.log("Changing index to ", cmdHistIndex, cmdHist)
            setInp(cmdHist[cmdHistIndex])
        }
        if (e.code === "Enter") {
            e.preventDefault()
            setTerm(term+"\n"+inp)
            if (cmdHist.length < 50)
                cmdHist.push(inp)
            else {
                cmdHist.shift()
                cmdHist.push(inp)
            }
            cmdHistIndex = cmdHist.length
            switch (inp) {
                case "help": 
                    setTerm(term+inp+`
This is the terminal system ascetos v2.5. 
Available commands:

help: this message
`); break;
                default: 
                Meteor.call("meterm.execute", inp, (err,res)=> {
                    if (err) {
                        setTerm(term+inp+`
Error happened:
${err.toString()}
`)
                    } else {
                        setTerm(term+inp+`
Server results:
${res}
`)
                    }
                })
                break;
            }
            setInp("")
            
        }
    }

    return (<>
        <pre className="terminal" style={{overflowY: "auto"}}><output>
          {term}
</output><br/>
$<input type="text" className="term-input" 
value={inp}
onChange={(e)=>setInp(e.target.value)}
onKeyDown={(e)=>kp(e)}></input>
</pre>
<canvas id="tutorial" width="100%" height="100%"
style={{position: "absolute", top: 0, left: 0}}></canvas>
</>
    )
}