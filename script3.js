"use strict";

const allStudents = [];

window.addEventListener("DOMContentLoaded", start);

function start() {
    console.log("ready");
    loadJSON();
}

function loadJSON() {
    fetch("./students.json")
        .then(response => response.json())
        .then(jsonData => cleanData(jsonData));
}

function cleanData(jsonData) {
    jsonData.forEach(obj => {
        const fullNameUnCap = obj.fullname.trim();
        const unCapNameArr = fullNameUnCap.split(" ");
        const capNameArr = unCapNameArr.map(name => {
            if (name.includes(`"`)) {
                const capName = name[1].toUpperCase() + name.substring(2, name.lastIndexOf(`"`)).toLowerCase();
                return capName;
            } else {
                const capName = name[0].toUpperCase() + name.substring(1).toLowerCase();
                return capName;
            };


        });
        console.log(capNameArr);
    });
}


const Student = {
    firstName: "firstName",
    lastName: "lastName",
    middleName: "middleName",
    nickname: "nickName",
    image: "img",
    house: "house",
};