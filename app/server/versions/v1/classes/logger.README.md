# Custom API Endpoint Logger

Sends a log to the console for each endpoint request.  
Displays:

- Log level (ex: `Error`)
- Status code
- Method
- Endpoint
- Error message (if there was an error)
- UTC date and time
- PT date and time (automatically switches between PDT and PST)
- Request body (masks fields specified in logger.js)
- Actions (also shows the timer value, ex: `"Creating user." (time: 15ms)`)
- Duration (in milliseconds)

## Getting Started

- Ensure the route you are creating uses the 'initLogger' middleware in express.js

- In the 'finally' of the try-catch block, print the log like the example below.  
  `log.print();`

- Set a response, right before the response is returned, like in the example below.  
  `log.setResponse(400, "Error", err);` Params: {statusCode, logLevel, errorMessage}.

## Adding Actions

Add an action before or after something happens so it can be shown in console, like the example below.  
`log.addAction("User created.");`
