var Router    = require("./server/router");
var WebServer = require("./server/web_server");

function App(options) {
  if (!options.port)
    throw new Error("Missing port");
  if (!options.logger)
    throw new Error("Missing logger");
  if (!options.assembler)
    throw new Error("Missing assembler");
  if (!options.env)
    throw new Error("Missing environment");

  this.port      = options.port;
  this.logger    = options.logger;
  this.assembler = options.assembler;
  this.env       = options.env;
  this.webServer = undefined;
  this.router    = undefined;

};

App.prototype.start = function(callback) {
  this.router    = new Router(this.logger);
  this.webServer = new WebServer(this, this.router, this.logger);
  this.webServer.start(callback);
};

App.prototype.stop = function(callback) {
  var self    = this;
  this.router = null;

  this.webServer.stop(function(err) {
    if (err) return callback(err);
    self.webServer = null;
    callback();
  });
};

module.exports = App;
