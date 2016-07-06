Not my work. Put here with the permission of the creator
See [here](https://www.npmjs.com/package/weso) for the original work
## weso

Universal websocket handler for both client and servers in JS

for more details on the protocol, 


    `npm install weso`


### Usage example :

checkout my [server](https://www.npmjs.com/package/weso-node) for node and [client](https://www.npmjs.com/package/weso-browser) for the browser


## the default `protocol` :

the `separator` is a colon (`':'`)

the websocket message MUST start with a key that doesn't contains the `separator`

    It is recommanded to use camelCase and only alphanumeric characters so the shorthands are handy to use later on in JS, but you are free to do what ever you want.

The part after the `separator` is then parsed in JSON

That's pretty much it.
