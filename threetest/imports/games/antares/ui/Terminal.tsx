import React from 'react'
import { useState } from 'react'

const ttest = `Hello world, (c) 1987
terminal asceta v2.5

Documentation: help

`


export const Terminal = ()=> {

    const [term, setTerm] = useState(ttest)
    const [inp, setInp] = useState("")

    const kp = (e) => {
        //console.log(e.code)
        if (e.code === "Enter") {
            e.preventDefault()
            setTerm(term+"\n"+inp)
            switch (inp) {
                case "help": 
                    setTerm(term+inp+`
This is the terminal system ascetos v2.5. 
Available commands:

help: this message
`); break;
                default: setTerm(term+inp+`
Unknown command. Try "help" for help.

`); break;
            }
            setInp("")
            
        }
    }

    return (
        <pre className="terminal" style={{overflowY: "auto"}}><output>
          {term}
</output><br/>
$<input type="text" className="term-input" 
value={inp}
onChange={(e)=>setInp(e.target.value)}
onKeyDown={(e)=>kp(e)}></input>
</pre>
    )
}