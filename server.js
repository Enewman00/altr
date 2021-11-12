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
var packageguide = grpc.loadPackageDefinition(packageDefinition);
var package_return;

let ipRequests = new Object();

/**
 * checks if the rate limit of 3 requests per 30 seconds is exceeded
 * @param {ip} ip address of the client
 */
exports.isUnderLimit = function(ip)
{
    if (ipRequests.hasOwnProperty(ip) && ipRequests[ip].length >= 3)
    {
        //ipRequests[ip].push(Date.now());
        let arrayLength = ipRequests[ip].length;
        let timeDiff = Date.now() - ipRequests[ip][arrayLength - 3];
        if ((timeDiff / 1000) >= 30)
        {
            ipRequests[ip].push(Date.now());
            return true;
        }
        return false;
    }
    else if (ipRequests.hasOwnProperty(ip) && ipRequests[ip].length < 3)
    {
        ipRequests[ip].push(Date.now());
        return true;
    }
    else
    {
        ipRequests[ip] = [Date.now()];
        return true;
    }
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

    if (exports.isUnderLimit(call.getPeer().split(':')[0]))
    {
        callback(null, package_return);
    }
    else
    {
        callback(new Error("Exceeded request limit of 3 requests per 30 seconds"), null);
    }
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