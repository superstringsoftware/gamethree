import React from 'react'

const ttest = `Hello world, (c) 1987
terminal asceta v2.5

Documentation: help

wafs
asf
fas
afs
asf
asf
asf
asf
asf
asf
asf
asf
asf
asf
asf
asf
asf
asf
asf
asf
asfas
fa
sfa
sf
asf
asf
asf
asf
asf
asf
asf
asf
asf
asf
asf
`


export const Terminal = ()=> {

    return (
        <pre className="terminal" style={{overflowY: "auto"}}><output>
          {ttest}
</output><br/>
$<input type="text" className="term-input"></input>
</pre>
    )
}