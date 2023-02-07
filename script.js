"use strict";
var apiData = [];
let newData = {};
let newdata;
let userid = document.querySelector("#userid");
let id = document.querySelector("#id");
let title = document.querySelector("#tittle");
let submit = document.querySelector(".submit");
const sortAsc = document.getElementById("sortase");
const sortDes = document.getElementById("sortdse");
const searchButton = document.getElementById("search-button");
const form = document.querySelector("#formdata");
var btnedit = document.querySelector("#table-data").querySelector(".edit");
const create = document.querySelector("#create-button");
create.addEventListener("click", (e) => {
  e.preventDefault();
  form.style.opacity = "100%";
  create.style.opacity = "0%";
});
const displaydata = function (apiData) {
  let html = "<table>";
  for (let i = 0; i < apiData.length; i++) {
    html += "<tr>";
    html += "<td>" + (i + 1) + "</td>";
    html += "<td>" + apiData[i].userId + "</td>";
    html += "<td>" + apiData[i].id + "</td>";
    html += "<td>" + apiData[i].title + "</td>";
    html +=
      '<td><button  onclick="deleteData(' +
      i +
      ')" class="delete"><i class="fa fa-trash-o"></i></button> <button onclick="updaterow(' +
      i +
      ')" class="edit"><i class="fa fa-edit"></i></button></td>';
    html += "</tr>";
  }
  html += "</table>";
  document.getElementById("table-data").innerHTML = html;
};
const api = async function () {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  let data = await response.json();
  data = data.splice(0, 10);
  window.localStorage.setItem("todosdata", JSON.stringify(data));
  let apidata = window.localStorage.getItem("todosdata");
  apiData.push(JSON.parse(apidata));
  let printdata = apiData.flat(1);
  // console.log("printdata");
  displaydata(printdata);
};
if (
  window.localStorage.getItem("todosdata") &&
  window.localStorage.getItem("todosdata").length > 2
) {
  const apidata = JSON.parse(window.localStorage.getItem("todosdata"));
  // apiData = apidata.slice(0, 20);
  displaydata(apidata);
} else {
  api();
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.style.opacity = "0%";
  create.style.opacity = "100%";
  const newdata = {
    userId: userid.value,
    id: id.value,
    title: title.value,
  };
  fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newdata),
  })
    .then((response) => response.json())
    .then((data) => {
      newData = JSON.parse(window.localStorage.getItem("todosdata"));
      newData.push(newdata);
      window.localStorage.setItem("todosdata", JSON.stringify(newData));
      console.log(newData);
      displaydata(newData);
    });
  userid.value = id.value = title.value = "";
});
function deleteData(index) {
  const data1 = JSON.parse(localStorage.getItem("todosdata"));
  const d1 = data1.splice(index, 1);
  window.localStorage.setItem("todosdata", JSON.stringify(data1));
  //console.log(data1);
  fetch(`https://jsonplaceholder.typicode.com/todos/${d1}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then(data1);
  displaydata(data1);
}
function updaterow(index) {
  const datau = JSON.parse(localStorage.getItem("todosdata"));
  let updatedata = datau[index].title;
  // console.log(updatedata);
  updatedata = prompt("enter new value");
  console.log(updatedata);
  //change in api
  fetch(`https://jsonplaceholder.typicode.com/todos/${index}`, {
    method: "PATCH",
    body: JSON.stringify({
      title: updatedata,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
  newdata = JSON.parse(localStorage.getItem("todosdata"));
  newdata[index].title = updatedata;
  localStorage.setItem("todosdata", JSON.stringify(newdata));
  //console.log(newdata);
  displaydata(newdata);
}

searchButton.addEventListener("click", function (e) {
  e.preventDefault();
  let searchInputdata = document
    .querySelector("#search-input")
    .value.toLowerCase();
  console.log(searchInputdata);
  if (searchInputdata === "") {
    alert("No data found or please enter valid data");
  }
  newdata = JSON.parse(localStorage.getItem("todosdata"));
  let f = newdata.filter((el) =>
    el.title.toLowerCase().includes(searchInputdata)
  );
  displaydata(f);
  document.getElementById("search-input").value = "";
});

sortAsc.addEventListener("click", function (e) {
  e.preventDefault();
  newdata = JSON.parse(localStorage.getItem("todosdata"));
  newdata.sort(function (a, b) {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1;
    }
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return 1;
    }
    return 0;
  });
  //console.log(newdata);
  localStorage.setItem("todosdata", JSON.stringify(newdata));
  displaydata(newdata);
});
sortDes.addEventListener("click", function (e) {
  e.preventDefault();
  newdata = JSON.parse(localStorage.getItem("todosdata"));
  newdata.sort(function (a, b) {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return 1;
    }
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return -1;
    }
    return 0;
  });
  //console.log(newdata);
  localStorage.setItem("todosdata", JSON.stringify(newdata));
  displaydata(newdata);
});
