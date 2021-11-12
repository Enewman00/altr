## Run Notes
Open two terminal windows and navigate to the "altr" directory. 
In one terminal run "node server.js --db_path=package.json"
In the other terminal run "node client.js --db_path=package.json"
- Running the client will make one request to the server. To make multiple (to test the request limit feature), just run it multiple times

To test, run "npm test".
Note: I ran out of time so I'm unable to finish the unit tests, but I got some in, as well as the basic outline for the rest of the tests.

A couple assumptions I made while working on this:
- An unsuccessful request doesn't count towards request limit
- exponential back off times out after 30 seconds (just picked an arbitrary limit)

## Sample run
TERMINAL 1
$ node server.js --db_path=package.json


TERMINAL 2
$ node client.js --db_path=package.json
Found package called "altr_technical_challenge_grpc" at 1.0.0, ISC,

$ node client.js --db_path=package.json
Found package called "altr_technical_challenge_grpc" at 1.0.0, ISC,

$ node client.js --db_path=package.json
Found package called "altr_technical_challenge_grpc" at 1.0.0, ISC,

$ node client.js --db_path=package.json
Error: 2 UNKNOWN: Exceeded request limit of 3 requests per 30 seconds
trying again in 1 seconds
Error: 2 UNKNOWN: Exceeded request limit of 3 requests per 30 seconds
trying again in 2 seconds
Error: 2 UNKNOWN: Exceeded request limit of 3 requests per 30 seconds
trying again in 4 seconds
Error: 2 UNKNOWN: Exceeded request limit of 3 requests per 30 seconds
trying again in 8 seconds
Error: 2 UNKNOWN: Exceeded request limit of 3 requests per 30 seconds
trying again in 16 seconds
Found package called "altr_technical_challenge_grpc" at 1.0.0, ISC,




## ALTR's DATA & Platform Technical Challenge - GRPC  

Please complete the user stories below:

---

Scenario: gRPC Service Implementation     
Given: A `.proto` file that can be located in `./proto/packages.proto`  
When: A gRPC request is received  
Then: The service determines if the requesting client has exceeded the request limit of 3 requests per IP address per 30 seconds. If the limit has been exceeded, the gRPC service is expected to reject the request. If the limit is not exceeded, the gRPC service is expected to successfully service the request.  


---

Scenario: gRPC Client Implementation    
Given: A `.proto` file that can be located in `./proto/packages.proto`  
When: A Node.js application calls the gRPC client to retrieve an NPM package    
Then: The gRPC client issues a request to the aforementioned gRPC service. If the gRPC request is rejected, the request is expected to be retried with exponential back off. If the request is serviced successfully, the results are expected to be returned to the invoking function.  

---

Scenario: Unit tests  
Given: A `.proto` file that can be located in `./proto/packages.proto`  
When: The command `npm test` is executed in the parent directory  
Then: Unit test(s) will successfully pass with code coverage that exceeds 95%. Tests are expected to be written for both the gRPC client as well as the gRPC service.