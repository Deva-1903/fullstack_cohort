document.addEventListener("DOMContentLoaded", () => {
  fetchTodos();
});

function fetchTodos() {
  fetch("http://localhost:3000/todos")
    .then((response) => response.json())
    .then((data) => {
      // selecting the ul element
      const todoList = document.getElementById("todoList");
      todoList.innerHTML = "";
      let i = 1;
      data.forEach((todo) => {
        // creating li for each todo
        const li = document.createElement("li");

        // setting textContent
        li.textContent = todo;

        // appending a button as child
        li.appendChild(createDeleteButton(todo, classValue));

        li.classList(i++);

        // appending li as ul's child
        todoList.appendChild(li);
      });
    });
}

function addTodo() {
  const newTodo = document.getElementById("newTodo").value;
  if (newTodo.trim() === "") return;

  fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todo: newTodo }),
  })
    .then((response) => response.json()) // asynchornous task
    .then(() => {
      fetchTodos();
      document.getElementById("newTodo").value = "";
    });
}

function deleteTodo(todo) {
  // todo --> todo1
  // todo --> deva
  fetch(`http://localhost:3000/todos/${encodeURIComponent(todo)}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => fetchTodos());
}

function createDeleteButton(todo, classValue) {
  // creating button element
  const button = document.createElement("button");
  button.textContent = "Delete";
  console.log(todo);

  // adding onclick event to the button
  button.onclick = () => deleteTodo(classValue);
  return button;
}
