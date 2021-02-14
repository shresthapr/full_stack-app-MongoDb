const addBtn = document.getElementById("add-todo-btn");
const updateBtn = document.getElementById("update-todo-btn");
const searchBtn = document.getElementById("search-btn");
const showBtn = document.getElementById("show-todo-list");
document.querySelector("tbody").addEventListener("click", function (event) {
  if (event.target.className === "delete-btn") {
    remove(event.target.dataset.id);
  }
  if (event.target.className === "edit-btn") {
    editlist(event.target.dataset.id);
  }
});

addBtn.onclick = function () {
  const input = document.getElementById("todo-input");
  const note = input.value;
  input.value = "";
  if (note.length === 0) {
    return;
  } else {
    fetch("http://localhost:5000/insert", {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ Note: note }),
    })
      .then((res) => res.json())
      .then((data) => insertNew(data));
  }
};

function insertNew(data) {
  console.log("hello from the other side", data);
  fetch("http://localhost:4000/getall")
    .then((res) => res.json())
    .then((abd) => loadHtmllist(abd));
}

showBtn.onclick = function () {
  fetch("http://localhost:4000/getall")
    .then((res) => res.json())
    .then((abd) => loadHtmllist(abd));
};

function loadHtmllist(data) {
  const display = document.getElementById("display-onload");
  display.setAttribute("style", "display: block;");

  const resultarea = document.querySelector("tbody");
  if (data.length === 0) {
    return;
  }
  let addhtml = "";
  data.forEach(function ({ Id, Note, Entry, Status }) {
    addhtml += `<tr>
      <td> ${Id}</td> 
      <td> ${Note} </td>
      <td> ${Entry} </td>
      <td> ${Status}</td>
      <td> <button class="delete-btn" data-id=${Id}>Delete</button> </td>
      <td> <button class="edit-btn" data-id=${Id}>Edit</button> </p> </td>
      </tr>`;
  });
  resultarea.innerHTML = addhtml;
}

searchBtn.onclick = function () {
  const input = document.querySelector("#search-input");
  const inputvalue = input.value;
  input.value = "";
  if (inputvalue === NaN) {
    return;
  } else {
    fetch("http://localhost:4000/search/" + inputvalue)
      .then((res) => res.json())
      .then((resp) => loadHtmllist(resp));
  }
};

function remove(Id) {
  fetch('"http://localhost:4000/remove/' + Id, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}

function editlist(id) {
  const editsection = document.getElementById("update-todo");
  editsection.hidden = false;
  document.querySelector("#update-todo-btn").dataset.id = id;
}

updateBtn.onclick = function () {
  const updateNoteValue = document.querySelector("#update-todo-list");
  fetch("http://localhost:4000/update", {
    method: "PATCH",
    "Content-type": "application/json",
    body: JSON.stringify(),
    Id: updateNoteValue.dataset.id,
    Note: updateNoteValue.value,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
};
