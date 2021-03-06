var PROTO_PATH = __dirname + '/proto/packages.proto';

var async = require('async');
var fs = require('fs');
var parseArgs = require('minimist');
var path = require('path');
//var _ = require('lodash');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
    
var packageguide = grpc.loadPackageDefinition(packageDefinition);
var client = new packageguide.PackageService('localhost:50051', grpc.credentials.createInsecure());

/**
 * Run the getFeature demo. Calls getFeature with a point known to have a
 * feature and a point known not to have a feature.
 * @param {function} callback Called when this demo is complete
 */
function runGetPackage(time = 1) {
    ////var next = _.after(2, callback);
    async function packageCallback(error, package) {
        if (error) {

            if ( time < 30)
            {
                console.error(error.toString());
                console.error("trying again in " + time + " seconds");
                await new Promise(resolve => setTimeout(resolve, time * 1000));
                time = time * 2;
                runGetPackage(time);
            }
            else 
            {
                console.error("Request timed out");
            }
        } 
        else {
            console.log('Found package called "' + package.name + '" at ' +
                package.version + ', ' +
                package.license + ', ' +
                package.repository
            );
        }
    }
    var empty1 = {};
    
    client.getPackage(empty1, packageCallback);
 
}

/**
 * Run all of the demos in order
 */
function main() {
    runGetPackage(1);
}

if (require.main === module) {
    main();
}

exports.runGetPackage = runGetPackage;