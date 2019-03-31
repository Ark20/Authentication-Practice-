'use strict';

const express = require('express');
//require this validation library
//import check and validationResult methods  
const { check, validationResult } = require('express-validator/check');
const bcryptjs = require('bcryptjs');

const auth = require('basic-auth');


//call check and pass in name 
//check returns validation chain 
//we can call validation methods on this chain
//.exists is one of those methods which can be passed options to check for types of values
//with message contains error message if val fails 
const nameValidator = check('name')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "name"');


  const authenticateUser = (req, res, next) => {
    let message = null;
    //pass req into auth method to parse credentials from auth header 
    //credentials will be set to object with key & secret 
    const credentials = auth(req);

if (credentials) {
//search for user data in list of users if credentials exists
const user = users.find(u => u.username === credentials.name)

if(user){
  //if user exists to hash password from credentials and compare it to stored user value
//returns true if match 
const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

console.log(credentials.pass)
console.log(user.password)



console.log(authenticated)
if(authenticated) {
//return user on request object 
  req.currentUser = user;
} else {
  message = `Authentication failure for username: ${user.username}`;
}
} else {
message = `User not found for username: ${credentials.name}`;
}
} else {
message = 'Auth header not found';
}

// If user authentication failed...
if (message) {
console.warn(message);

// Return a response with a 401 Unauthorized HTTP status code.
//res.status(401).json({ message: 'Access Denied' });
res.status(401).json({ message: message });
} else {
// Or if user authentication succeeded...
// Call the next() method.

    // TODO
    next();
  }


}






// This array is used to keep track of user records
// as they are created.
const users = [];

// Construct a router instance.
const router = express.Router();

// Route that returns the current authenticated user.
router.get('/users', authenticateUser, (req, res) => {
  const user = req.currentUser;

  res.json({
    name: user.name,
    username: user.username,
  });
});



// Route that creates a new user.
router.post('/users', [
  check('name')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "name"'),
  check('username')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "username"'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "password"'),
], (req, res) => {
//if validation fails , request object recieves info 
//validationResult method can take request object and extract validation errors 
const errors = validationResult(req);
//isEmpty is a method of ValidationResult that returns true if no errors
if(!errors.isEmpty()){
  //if errors map over them and create new array of error messages 
  const errorMessages = errors.array().map(error => error.msg);
//return bad request status and json body 
  return res.status(400).json({ errors: errorMessages});
}
  // Get the user from the request body.
  const user = req.body;

  // Add the user to the `users` array.
  users.push(user);

  user.password = bcryptjs.hashSync(user.password);


  // Set the status to 201 Created and end the response.
  res.status(201).end();
});

module.exports = router;