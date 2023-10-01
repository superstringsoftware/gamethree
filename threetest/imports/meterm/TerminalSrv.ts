import {Meteor} from 'meteor/meteor'
import util from 'node:util'

Meteor.methods({
    "meterm.execute"(cmd:string) {
        const cmds = cmd.split(' ')
        let ret = "Unknown command. Try 'help' for help."
        switch(cmds[0]) {
            case "inspect":
                const ins = cmds[1].split('.')
                let arg = global[ins[0]]
                for (let i = 1; i<ins.length; i++) {
                    arg = arg[ins[i]]
                }
                const res = util.inspect(arg)
                ret = "Inspecting " + cmds[1] +":\n"
                ret+= res
                break;
            default:
        }
        return ret
    }
})