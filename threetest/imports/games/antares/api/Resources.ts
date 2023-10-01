export const StrategicResources = [
    {
        shortName: "CE",
        name: "Computer Equipment",
        description: ""
    },
    {
        shortName: "HeIII",
        name: "Helum III",
        description: "Needed for energy etc"
    },
    {
        shortName: "FF",
        name: "Fossil Fuels - oil, gas, etc",
        description: "Needed for energy and chemical industry"
    }
]

export const ResFunctions = {

    // straightforward addition of 2 vectors
    AddVectors: (x:{name:string, quantity: number}[],
        y:{name:string, quantity: number}[]) => {
            let res = x.map( r => {
                const r1 = y.find( el => el.name === r.name)
                if (r1) {
                    return {name: r.name, quantity: r.quantity + r1.quantity}
                } else return r
            })
            y.forEach(r => {
                const r1 = x.find( el => el.name === r.name)
                if (!y) {
                    res.push(r)
                }
            })
            return res;
        },

    // multiply vector by scalar
    MulScalar: (x:{name:string, quantity: number}[], a:number) => 
        x.map( r => {return {name: r.name, quantity: r.quantity * a}}),

    // subtract 2 vectors
    SubVectors: (x:{name:string, quantity: number}[],
        y:{name:string, quantity: number}[]) => 
        ResFunctions.AddVectors(x, ResFunctions.MulScalar(y,-1))
    
}