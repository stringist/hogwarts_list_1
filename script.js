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

// Create an object prototype - name it Animal.
// In the prepareObjects function's forEach:
//     Create a new object (named animal) from the Animal prototype
//     Find the values for name, desc, and type from the jsonObject (it is recommended to create temporary variables for them)
//     Set the properties in the new object to those values
//     Add the new object to the array of animals


function loadJSON() {
    fetch("./students.json")
        .then(response => response.json())
        .then(jsonData => cleanData(jsonData));
}

function cleanData(jsonData) {
    console.log(jsonData);

    jsonData.forEach(student => {
        // get rid of spaces
        let fullName = student.fullname.trim();
        if (fullName.includes("-")) { fullName[indexOf("-") + 1].toUpperCase(); }
        // get name parts
        if (fullName.includes(" ")) {
            const firstName = fullName[0].toUpperCase() + fullName.substring(1, fullName.indexOf(" ")).toLowerCase();
            console.log(firstName);
        } else {
            const firstName = fullName[0].toUpperCase() + fullName.substring(1);
            console.log(firstName);
        };






        // const middleName = fullName.substring((fullName.indexOf(" ") + 1), fullName.lastIndexOf(" "));
        // console.log(middleName);


        const lastName = fullName.charAt(fullName.lastIndexOf(" ") + 1).toUpperCase() + fullName.substring(fullName.lastIndexOf(" ") + 2).toLowerCase();
        console.log(lastName);

        // allStudents.push(student);
    });
}

// function prepareObjects(jsonData) {
//     console.log("prepareObjects", allStudents);
//     jsonData.forEach(jsonObject => {
//         // TODO: Create new object with cleaned data - and store that in the allAnimals array
//         const student = Object.create(Student);
//         allStudents.push(student);
//         // TODO: MISSING CODE HERE !!!

//         student.firstName = jsonData.fullName.
//        student.lastName =
//             student.middleName =
//             house = jsonData.age;
//     });

//     displayList();
// }

// function displayList() {
// console.log(allStudents);}

// function displayList() {
//     // clear the list
//     document.querySelector("#list tbody").innerHTML = "";

//     // build a new list
//     allStudents.forEach(displayStudent);
// }

// function displayStudent(student) {
//     // create clone
//     const clone = document.querySelector("template#animal").content.cloneNode(true);

//     // set clone data
//     clone.querySelector("[data-field=name]").textContent = animal.name;
//     clone.querySelector("[data-field=desc]").textContent = animal.desc;
//     clone.querySelector("[data-field=type]").textContent = animal.type;
//     clone.querySelector("[data-field=age]").textContent = animal.age;

//     // append clone to list
//     document.querySelector("#list tbody").appendChild(clone);