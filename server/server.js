const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express(); //server instance

const port = 3000; //port

//middleware
app.use(bodyParser.json()); //tcp protocol --> json
app.use(cors());

let todos = ["hello"];

// methods - get, post, put, delete

// server - method, route, res body

// function (arg1, arg2, arg3)

// express get("route", callback function)

app.get("/todos", function (request, response) {
  response.json(todos);
});

app.post("/todos", function (req, res) {
  const todoItem = req.body.todo;

  if (todoItem) {
    todos.push(todoItem);

    res.status(200).json({ message: "Todo added" });
  } else {
    res.status(400).json({ message: "Invalid input" });
  }
});

app.delete("/todos/:id", (req, res) => {
  const todo = decodeURIComponent(req.params.id);
  todos = todos.filter((t) => t !== todo);
  res.json({ message: "Todo deleted" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// body -->
// query -->

// params --> req.params.todo;
