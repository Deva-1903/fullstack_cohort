const { users } = require("../db");

exports.authCheck = (request, response, next) => {
  const headerId = request.headers["id"];
  const headerPassword = request.headers["password"];

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == headerId && users[i].password == headerPassword) {
      request.user = users[i];
      next();
    }
  }

  response.status(401).json({
    message: "unauthorised",
  });
};


// function validateUser(data) {
//   if (typeof data.name !== 'string' || data.name.trim() === '') {
//     return { valid: false, error: 'Name must be a non-empty string' };
//   }
  
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(data.email)) {
//     return { valid: false, error: 'Invalid email address' };
//   }
  
//   if (typeof data.age !== 'number' || data.age <= 18) {
//     return { valid: false, error: 'Age must be a number greater than 18' };
//   }
  
//   return { valid: true };
// }

// const userSchema = {
//   "name": "John Doe",
//   "email": "john.doe@example.com",
//   "age": 30
// };

// const validationResult = validateUser(user);
// if (!validationResult.valid) {
//   console.error(validationResult.error);
// } else {
//   console.log('User is valid');
// }



// const Ajv = require('ajv');
// const ajv = new Ajv();

// const userSchema = {
//   type: 'object',
//   properties: {
//     name: { type: 'string', minLength: 1 },
//     email: { type: 'string', format: 'email' },
//     age: { type: 'integer', minimum: 19 }
//   },
//   required: ['name', 'email', 'age'],
//   additionalProperties: false
// };

// const validate = ajv.compile(userSchema);

// const user = {
//   "name": "John Doe",
//   "email": "john.doe@example.com",
//   "age": 30
// };

// const valid = validate(user);
// if (!valid) {
//   console.error(validate.errors);
// } else {
//   console.log('User is valid');
// }
