function Controller(options) {
  if (!options.webServer)
    throw new Error("Missing web server");
  if (!options.router)
    throw new Error("Missing router");
  if (!options.logger)
    throw new Error("Missing logger");
  if (!options.app)
    throw new Error("Missing app");

  this.webServer = options.webServer;
  this.router    = options.router;
  this.logger    = options.logger;
  this.app       = options.app;
}

Controller.prototype._getServerCallArgs = function(unnamedArgs) {
  var tmp, args, callback, resource, placeHolders, middlewares, pathToResource;

  tmp      = extractUnnamedArguments(unnamedArgs);
  args     = tmp.shift();
  callback = tmp.shift();

  var extractedArgs = this._extractArgs(args);

  resource       = extractedArgs.shift();
  placeHolders   = extractedArgs.shift();
  middlewares    = extractedArgs.shift();
  pathToResource = this._getTemplatePathToResource(resource, placeHolders);

  return [pathToResource, middlewares, callback];
}

Controller.prototype.get = function() {
  var args = this._getServerCallArgs(arguments);
  this.webServer.get(args.shift(), args.shift(), args.shift());
}

Controller.prototype.post = function() {
  var args = this._getServerCallArgs(arguments);
  this.webServer.post(args.shift(), args.shift(), args.shift());
}

Controller.prototype.put = function() {
  var args = this._getServerCallArgs(arguments);
  this.webServer.put(args.shift(), args.shift(), args.shift());
}

Controller.prototype.delete = function() {
  var args = this._getServerCallArgs(arguments);
  this.webServer.del(args.shift(), args.shift(), args.shift());
}

Controller.prototype._getTemplatePathToResource = function(resourceName, placeHolders) {
  if (!placeHolders)
    placeHolders = [];

  var params = {};
  var placeHolder;

  for (i = 0; i < placeHolders.length; i++) {
    placeHolder = placeHolders[i];
    params[placeHolder] = ":" + placeHolder;
  }

  return this.router.getPathToResource(resourceName, params);
}

Controller.prototype._extractArgs = function(args) {
  var resource = args.shift();
  var placeHolders;
  if (args[0] instanceof Array)
    placeHolders = args.shift();

  return [resource, placeHolders, args];
}

var _slice = [].slice;

function extractUnnamedArguments(unnamedArgs) {
  var args, callback, i;
  if (unnamedArgs.length >= 2)
    args = _slice.call(unnamedArgs, 0, i = unnamedArgs.length - 1);
  else {
    args = [];
    i    = 0;
  }
  callback = unnamedArgs[i++];
  return [args, callback];
}

module.exports = Controller;
