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
    fetch("http://localhost:4000/insert", {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ Note: note }),
    })
      .then((res) => res.json())
      .then((data) => insertNew(data["abcd"]));
  }
};

function insertNew(data) {
  console.log("hello from the other side", data);
  const table = document.querySelector("tbody");
  const istable = table.querySelector(".no-data");

  let tableHtml = "<tr>";

  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === "dateAdded") {
        data[key] = new Date(data[key]).toLocalString();
      }
      tableHtml += `<td>${data[key]}</td>`;
      tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
      tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

      tableHtml += "</tr>";
      if (isTableData) {
        table.innerHTML = tableHtml;
      } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
      }
    }
  }
  view();
}

showBtn.onclick = function view() {
  fetch("http://localhost:4000/getall")
    .then((res) => res.json())
    .then((data) => loadHtmllist(data.todos));
};

function loadHtmllist(data) {
  console.log("This is the data received", data);
  const display = document.getElementById("display-onload");
  display.setAttribute("style", "display: block;");

  const resultarea = document.querySelector("tbody");
  if (data.length === 0) {
    resultarea.innerHTML =
      "<tr><td class='no-data' colspan='10'>Nothing on your list</td></tr>";
    return;
  }
  let addhtml = "";
  data.forEach(function ({ _id, note, entry, status, type }) {
    addhtml += `<tr>
      <td> ${_id}</td> 
      <td> ${note} </td>
      <td> ${new Date(entry).toLocaleString()} </td>
      <td> ${status}</td>
      <td> ${type}</td>
      <td> <button class="delete-btn" data-id=${_id}>Delete</button> </td> 
      <td> <button class="edit-btn" data-id=${_id}> Edit</button> </p> </td>

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
      .then((data) => loadHtmllist(data));
  }
};

function remove(Id) {
  fetch("http://localhost:4000/remove/" + Id, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });

  view();
}

function editlist(id) {
  const editsection = document.getElementById("update-todo");
  editsection.hidden = false;
  document.querySelector("#update-todo-list").dataset.id = id;
  console.log("My Id", updateNoteValue.dataset.id);
}

updateBtn.onclick = function () {
  const updateNoteValue = document.querySelector("#update-todo-list");
  fetch("http://localhost:4000/update", {
    headers: {
      "Content-type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      id: updateNoteValue.dataset.id,
      note: updateNoteValue.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
  view();
};
