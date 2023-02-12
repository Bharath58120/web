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
const form = document.querySelector("#formdata");
const create = document.querySelector("#create-button");
create.addEventListener("click", (e) => {
  e.preventDefault();
  form.style.opacity = "100%";
  create.style.opacity = "0%";
});
const displaydata = function (apiData) {
  let html = "<table>";
  for (let i = 0; i < apiData.length; i++) {
    html += `<tr>`;
    html += `<td>${i + 1}</td>`;
    html += `<td>${apiData[i].userId}</td>`;
    html += `<td>${apiData[i].id}</td>`;
    html += `<td>${apiData[i].title}</td>`;
    html += `<td class ="x"><div class="btn${i}" ><button  onclick="deleteData(${i})" class="delete"><i class="fa fa-trash-o"></i></button> <button onclick="updaterow(${i})" class="edit"><i class="fa fa-edit"></i></button></div>
      <div class ="up${i}" id="abc">
        <input type="text" name="ids" id="id"  placeholder="enter new title" />
        <button  class="save">save</button>
      </div>
      </td>`;
    html += "</tr>";
  }
  html += "</table>";
  document.getElementById("table-data").innerHTML = html;
};
const api = async function () {
  const response = await fetch("http://localhost:58120/users");
  let data = await response.json();
  data = data.splice(0, 10);
  window.localStorage.setItem("todosdata", JSON.stringify(data));
  let apidata = window.localStorage.getItem("todosdata");
  apiData.push(JSON.parse(apidata));
  let printdata = apiData.flat(1);
  displaydata(printdata);
};
if (
  window.localStorage.getItem("todosdata") &&
  window.localStorage.getItem("todosdata").length > 2
) {
  const apidata = JSON.parse(window.localStorage.getItem("todosdata"));
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
  fetch("http://localhost:58120/users", {
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
var btnedit = document.querySelector("#table-data");
var btneditd = document.querySelector("#table-data").querySelector(".delete");
function deleteData(index) {
  let del;
  const data1 = JSON.parse(localStorage.getItem("todosdata"));
  data1.forEach((ele, i) => {
    if (i === index) {
      del = ele.id;
    }
  });
  console.log(parseInt(del));
  fetch(`http://localhost:58120/users/${del}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.ok) {
      console.log("Resource successfully deleted");
    } else {
      console.log("Unable to delete resource");
    }
  });
  data1.splice(index, 1);
  localStorage.setItem("todosdata", JSON.stringify(data1));
  displaydata(data1);
}
function updaterow(index) {
  var x = document.querySelector("#table-data").querySelector(`.up${index}`);
  var y = document.querySelector("#table-data").querySelector(`.btn${index}`);
  console.log(x, y);
  y.style.display = "none";
  x.style.display = "inline";
  var p = x.querySelector("#id");
  var s = x.querySelector(".save");
  s.addEventListener("click", () => {
    const updatedata = p.value;
    console.log(updatedata);
    const data2 = JSON.parse(localStorage.getItem("todosdata"));
    let del1;
    data2.forEach((ele, i) => {
      console.log(ele.id, i);
      if (i === index) {
        del1 = ele.id;
      }
    });
    console.log(parseInt(del1));
    let updateName = updatedata;
    if (updateName === "") return;
    fetch(`http://localhost:58120/users/${del1}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: updateName,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .catch((e) => console.error(e));
    newdata = JSON.parse(localStorage.getItem("todosdata"));
    newdata[index].title = updateName;
    localStorage.setItem("todosdata", JSON.stringify(newdata));
    displaydata(newdata);
  });
}
const searchButton = document.querySelector("#search-bar");
searchButton.addEventListener("input", function (e) {
  e.preventDefault();
  let searchInputdata = searchButton.value.toLowerCase();
  console.log(searchInputdata);
  newdata = JSON.parse(localStorage.getItem("todosdata"));
  let f = newdata.filter((el) =>
    el.title.toLowerCase().includes(searchInputdata)
  );
  displaydata(f);
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
  localStorage.setItem("todosdata", JSON.stringify(newdata));
  displaydata(newdata);
});
