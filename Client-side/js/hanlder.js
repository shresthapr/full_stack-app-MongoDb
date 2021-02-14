(function () {
  document.addEventListener("DOMContentLoaded", init);

  const addBtn = document.getElementById("add-todo-btn");
  const updateBtn = document.getElementById("update-todo-btn");
  const searchBtn = document.getElementById("search-btn");
  const showBtn = document.getElementById("show-todo-list");

  function init() {
    console.log("hello");
  }
  addBtn.onclick = function () {
    let id = new Date();
    const input = document.getElementById("todo-input").value;
    if (input.length === 0) {
      return;
    } else {
      fetch("http://localhost:5000/insert", {
        headers: {
          "Content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ note: input }),
      });
    }
  };

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
    data.map((item) => {
      addhtml += `<tr>
      <td> ${item.Id}</td> 
      <td> ${item.Note} </td>
      <td> ${item.Entry} </td>
      <td> ${item.Status}</td>
      <td> <button class="delete-btn" data-id=${item.Id}>Delete</button> </td>
      <td> <button class="edit-btn" data-id=${item.Id}>Edit</button> </p> </td>
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
})();
