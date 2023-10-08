export class Vector2g {
    x: number
    y: number

    constructor(x:number, y:number) {
        this.x = x
        this.y = y
    }

    static Add(v1:Vector2g, v2:Vector2g):Vector2g {
        return new Vector2g(v1.x+v2.x, v1.y+v2.y)
    }

    static Sub(v1:Vector2g, v2:Vector2g):Vector2g {
        return Vector2g.Add(v1, Vector2g.MulScalar(v2, -1))
    }

    static MulScalar(v:Vector2g, a:number):Vector2g {
        return new Vector2g(v.x*a, v.y*a)
    }

    static Size(v:Vector2g): number {
        return Math.sqrt(v.x*v.x + v.y*v.y)
    }

    static Distance(v1:Vector2g, v2: Vector2g):number {
        return Vector2g.Size(Vector2g.Sub(v1,v2))
    }

    /**
     * By convention, returns (r, angle) vector
     */
    static ToPolar(p:Vector2g):Vector2g {
        const r = Math.sqrt(p.x*p.x + p.y*p.y)
        const angle = Math.acos(p.x/r)
        return new Vector2g(r,angle)
    }

    static FromPolar(p:Vector2g):Vector2g {
        return new Vector2g(p.x*Math.cos(p.y), p.x*Math.sin(p.y))
    }
}