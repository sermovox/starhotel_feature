/* 

to activate websocket on web_adapter adapter we need a http server , use retify like below advice :
To use with Botkit:
* ```javascript
* const adapter = new WebAdapter();
* const controller = new Botkit({
*      adapter: adapter,
*      // other options
* });
* ```
*
* To use with BotBuilder:
* ```javascript
* const adapter = new WebAdapter();
* const server = restify.createServer();
* server.use(restify.plugins.bodyParser());
* // instead of binding processActivity to the incoming request, pass in turn handler logic to createSocketServer
* let options = {}; // socket server configuration options
* adapter.createSocketServer(server, options, async(context) => {
*  // handle turn here
* });

or use http like following 
*/

// const http_ = require("http");
const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");

module.exports=//
function(http_,port){

let httpserver,webserver;

if (http_) {
    // Create HTTP server
   //  this.addDep('webserver');
    let webserver = express();
    // capture raw body
    webserver.use((req, res, next) => {
        req.rawBody = '';
        req.on('data', function (chunk) {
            req.rawBody += chunk;
        });
        next();
    });
    webserver.use(bodyParser.json());
    webserver.use(bodyParser.urlencoded({ extended: true }));
    httpserver = http_.createServer(webserver);
    hbs.localsAsTemplateData(webserver);
    // From https://stackoverflow.com/questions/10232574/handlebars-js-parse-object-instead-of-object-object
    hbs.registerHelper('json', function (context) {
        return JSON.stringify(context);
    });
    webserver.set('view engine', 'hbs');
    httpserver.listen(port || 3000, () => {
        //if (this._config.disable_console !== true) 
        {
            console.log(`Webhook endpoint online:  http://localhost:${port || 3000} at /webhook_uri`);
        }
        // this.completeDep('webserver');
    });
    return {httpserver,webserver};
}
}
