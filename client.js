var PROTO_PATH = __dirname + '/proto/packages.proto';

var async = require('async');
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

//var client = new routeguide.RouteGuide('localhost:50051',
//                                       grpc.credentials.createInsecure());
var packageguide = grpc.loadPackageDefinition(packageDefinition);
var client = new packageguide.PackageService('localhost:50051', grpc.credentials.createInsecure());

/**
 * Run the getFeature demo. Calls getFeature with a point known to have a
 * feature and a point known not to have a feature.
 * @param {function} callback Called when this demo is complete
 */
function runGetPackage(callback) {
    var next = _.after(2, callback);
    function packageCallback(error, package) {
        if (error) {
            callback(error);
            return;
        }
        if (package.name === '') {
            console.log('Found no package for ' +
                package.name + ', ' +
                package.version + ', ' +
                package.license + ', ' +
                package.repository
            );
        } else {
            console.log('Found package called "' + package.name + '" at ' +
                package.version + ', ' +
                package.license + ', ' +
                package.repository
            );
        }
        next();
    }
    var empty1 = {
    };
    client.getPackage(empty1, packageCallback);
}

/**
 * Run all of the demos in order
 */
function main() {
    async.series([
        runGetPackage
    ]);
}

if (require.main === module) {
    main();
}

exports.runGetPackage = runGetPackage;
