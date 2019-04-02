# Simple lottery game using Nodejs/MongoDb

Run `npm-install`

Install MongoBd and run start the mongo instance

Run `npm run test` to Run the test

Run `npm start` to start the production server

Run `npm run local` to start the local server

#Configuration

The configuration file is located in helpers/config.js. The default values can be assigned/changed here

#Description
This is a simple lottery game REST API to generate tickets and lottery lines. 

#Rules
You have a series of lines on a ticket with 3 numbers, each of which has a value of 0, 1, or 2.
For each ticket if the sum of the values on a line is 2, the result for that line is 10. Otherwise
if they are all the same, the result is 5. Otherwise so long as both 2nd and 3rd numbers are
different from the 1st, the result is 1. Otherwise the result is 0.

#Implementation
There is an API call to generate a ticket with n number of lines. More lines can be added after a ticket is created. The status of a ticket fetches the outcomes of each line according to the rules. Once a ticket's status is retrieved, no more lines can be added to that ticket.

#API

| Route | Method | Params | Description | 
| ------------- | ------------- | ------------- | ------------- |
| `/ticket`  | POST  | `noOfLines` (optional) | Creates a ticket with n number of lines. Defaults to `defaultNoOfLines` |
| `/ticket`  | GET  | NA | Gets list of all the tickets
| `/ticket/:id`  | GET  | NA | Gets single ticket using id from request
| `/ticket/:id`  | PUT  | `noOfLines` (mandatory) | Adds additional lines to the ticket.
| `/status/:id`  | PUT  | NA | Retrieves the status of a ticket with outcomes
 
