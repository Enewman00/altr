var PROTO_PATH = __dirname + '/proto/packages.proto';

var fs = require('fs');
var parseArgs = require('minimist');
var path = require('path');
var _ = require('lodash');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
//var routeguide = grpc.loadPackageDefinition(packageDefinition).routeguide;
var packageguide = grpc.loadPackageDefinition(packageDefinition);
var package_return;

/**
 * Get a package object at the given empty.
 * @param {empty}  The empty to check
 * @return {package} The feature object
 */
 function checkPackage(empty) {
    return package_return;
  }


/**
 * getServer request handler. Gets an empty request, and responds with a
 * Package object.
 * @param {EventEmitter} call Call object for the handler to process
 * @param {function(Error, feature)} callback Response callback
 */
function getPackage(call, callback)
{
    /* The service determines if the requesting client has exceeded the request limit
     of 3 requests per IP address per 30 seconds. If the limit has been exceeded, 
     the gRPC service is expected to reject the request. If the limit is not exceeded,
      the gRPC service is expected to successfully service the request.  
    */
    callback(null, package_return);
}




/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return {Server} The new server object
 */
function getServer() {
    var server = new grpc.Server();
    server.addService(packageguide.PackageService.service, {
      getPackage: getPackage
    });
    return server;
}



if (require.main === module) {
    // If this is run as a script, start a server on an unused port
    var packageServer = getServer();
    packageServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        var argv = parseArgs(process.argv, {
            string: 'db_path'
        });
        fs.readFile(path.resolve(argv.db_path), function(err, data) {
            if (err) throw err;
            package_return = JSON.parse(data);
            packageServer.start();
        });
    });
}



exports.getServer = getServer;