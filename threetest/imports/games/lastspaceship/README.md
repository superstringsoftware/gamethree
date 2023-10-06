# implementation notes

Ok so for web games there's always tradeoff to be made - on one hand, we want to move simulation as much to the client as possible, on the other - it opens up for hacking and cheating. So initial thought was to do ticks on the server that would simulate system behavior, but now we are trying a different hybrid approach:

- most of the sim on the client
- key actions (orbit changes, warfare etc) - are double checked on the server

But systems this way only keep parent-child info, exact ship locations don't matter at all (can be defined at the moment of entry), while planets can be approximately positioned based on some estimation of current time.