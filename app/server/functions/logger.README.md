# Custom API Endpoint Logger

## Getting Started

- Ensure the route you are creating uses the 'initLogger' middleware in express.js

- At the very beginning of an endpoint function that requires a request body, create an instance of Logger and set the request body like the example below.  
  `log.setRequestBody(req.body, true);` Params: {requestBody, maskIds}.  
  Note: The second field of setRequestBody() specifies if id fields should be masked in the request body. You may wish to show these in the log for say post ids.

- In the 'finally' of the try-catch block, print the log like the example below.  
  `log.print();`

- Set a response, right before the response is returned, like in the example below.  
  `log.setResponse(400, "Error", err);` Params: {statusCode, logLevel, errorMessage}.

## Adding Actions

Add an action before or after something happens so it can be shown in console, like the example below.  
`log.addAction("User created.");`

Show that there was an error on the last action.  
`log.setLastActionError();`
