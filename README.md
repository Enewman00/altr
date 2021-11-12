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