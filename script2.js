"use strict";

const Student = {
    firstName: "firstName",
    lastName: "lastName",
    middleName: "middleName",
    nickname: "nickName",
    image: "img",
    house: "house",
};
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
    jsonData.forEach(student => {
        const fullName = student.fullname.trim();
        const nameArr = fullName.split(" ");
        const fixedNamesArr = []
            // const  = nameArr.forEach(name => { const capName = name.charAt(0).toUpperCase + name.substring(1).toLowerCase(); }
            // return capName;).join(", ");

        const firstName = nameArr[0].charAt(0).toUpperCase() + nameArr[0].substring(1).toLowerCase();
        fixedNamesArr.push(firstName);
        // console.log(firstName);
        // console.log(firstName);
        if (nameArr.length > 2) {
            const middleName = nameArr[1].charAt(0).toUpperCase() + nameArr[1].substring(1).toLowerCase();
            const lastName = nameArr[2].charAt(0).toUpperCase() + nameArr[2].substring(1).toLowerCase();
            fixedNamesArr.push(middleName, lastName);

        }
        if (nameArr.length === 2) {
            const lastName = nameArr[1].charAt(0).toUpperCase() + nameArr[1].substring(1).toLowerCase();
            fixedNamesArr.push(lastName);
            // console.log(firstName, lastName);
        }
        prepareObjects(fixedNamesArr);
    })
}

function prepareObjects(fixedNamesArr) {
    console.log(fixedNamesArr);
    fixedNamesArr.forEach(student => {
        // TODO: Create new object with cleaned data - and store that in the allAnimals array
        const studentObj = Object.create(Student);

        studentObj.firstName = student.firstName;
        console.log(studentObj);
        // TODO: MISSING CODE HERE !!!
        allStudents.push(studentObj);

    });
}