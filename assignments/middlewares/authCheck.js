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
