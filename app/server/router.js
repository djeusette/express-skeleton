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

Router.prototype.getUriToResource = function(host, resource, args) {
  if (!args)
    args = {};

  var key, value, query;

  if (args.query) {
    query = "?";

    for (key in args.query) {
      value = args.query[key];
      if (query !== "?")
        query = query + "&";
      query = query + key + "=" + value;
    }

    delete args.query;
  }

  var path = this.getPathToResource(resource, args);

  var protocol;
  if (this.ssl)
    protocol = "https";
  else
    protocol = "http";

  var uri = protocol + "://" + host + path;
  if (query)
    uri = uri + query;
  return uri;
};

module.exports = Router
