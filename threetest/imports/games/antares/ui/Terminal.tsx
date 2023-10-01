import React from 'react'

const ttest = `Hello world, (c) 1987
terminal asceta v2.5

Documentation: help
`


export const Terminal = ()=> {

    return (
        <pre className="terminal"><output>
          {ttest}
</output><br/>
$><input type="text" className="term-input"></input>
</pre>
    )
}