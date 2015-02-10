var express      = require("express");
var morgan       = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser   = require("body-parser");
var path         = require("path");
var fs           = require("fs");

function WebServer(app, router, logger) {
  if (!app)
    throw new Error("Missing app");
  if (!router)
    throw new Error("Missing router");
  if (!logger)
    throw new Error("Missing logger");

  this.app    = app;
  this.router = router;
  this.logger = logger;

  this.port   = this.app.port;
  this.express = express();

  this.express.use(morgan("dev"));
  this.express.use(bodyParser.json());
  this.express.use(cookieParser());
};

WebServer.prototype.start = function(callback) {
  var self = this;
  this.server = this.express.listen(this.port, function() {
    self.logger.info("WebServer listening on port " + self.port);
    self._loadControllers();
    callback();
  });
};

WebServer.prototype.stop = function(callback) {
  this.server.close();
  this.server = null;
  callback();
};

WebServer.prototype._loadControllers = function() {
  var directoryPath = path.resolve(__dirname, "..", "controllers");
  var attributes    = {
    router    : this.router,
    webServer : this.express,
    logger    : this.logger,
    app       : this.app
  };

  loadDir(directoryPath, function(err, Module) {
    if (err) throw(err);
    new Module(attributes);
  });
};

function loadDir(directory, callback) {
  fs.readdirSync(directory).forEach(function(entry) {
    var absolutePath = path.resolve(directory, entry);
    if (entry.match(/\.coffee$|\.js$/)) {
      var module = require(absolutePath);
      callback(null, module);
    } else if (fs.statSync(absolutePath).isDirectory()) {
      loadDir(absolutePath, callback);
    }
  });
};

module.exports = WebServer;
