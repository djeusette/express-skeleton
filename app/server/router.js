var url = require("url");

var routes = {
  "hello": "/hello"
};

function Router(logger, ssl) {
  if (!logger)
    throw new Error("Missing logger");

  this.logger = logger;
  this.ssl    = ssl;
};

Router.prototype.getPathToResource = function(resource, args) {
  if (!args)
    args = {};

  var arg, regexp, value;
  var path = routes[resource];

  for (arg in args) {
    value  = args[arg];
    regexp = new RegExp("\{" + arg + "\}", 'g');
    path   = path.replace(regexp, value);
  }

  if (!path)
    this.logger.warning("route", "unknown resource " + resource + ", with args " + args)

  return path;
};

Router.prototype.getUrlToResource = function(host, resource, args) {
  if (!args)
    args = {};

  var path = this.getPathToResource(resource, args);
  var protocol;
  if (ssl)
    protocol = "https";
  else
    protocol = "http";
  "#{protocol}://#{host}#{path}"
};

module.exports = Router
