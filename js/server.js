/*eslint no-console: 0, no-unused-vars: 0, no-undef:0*/
/*eslint-env node, es6 */

"use strict";
var xsenv = require("@sap/xsenv");
var port = process.env.PORT || 3000;
var server = require("http").createServer();
global.__base = __dirname + "/";

 
var xssec = require("@sap/xssec");
var xsHDBConn = require("@sap/hdbext");
var express = require("express");

//logging
var logging = require("@sap/logging");
var appContext = logging.createAppContext();
var logger = appContext.getLogger("/Application");

//Initialize Express App for XS UAA and HDBEXT Middleware
var app = express();
 
app.use(logging.expressMiddleware(appContext));
 
var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});
 

//Setup Routes
var router = require("./router")(app, server);

//Start the Server 
server.on("request", app);
server.listen(port, function() {
	logger.info(`HTTP Server: ${server.address().port}`);
	console.info(`HTTP Server: ${server.address().port}`);
});