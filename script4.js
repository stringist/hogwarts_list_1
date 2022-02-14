"use strict";

const allStudents = [];

window.addEventListener("DOMContentLoaded", start);

function start() {
    console.log("ready");
    loadJSON();
}

function loadJSON() {
    fetch("./students.json")
        .then((response) => response.json())
        .then((jsonData) => cleanData(jsonData));
}

function cleanData(jsonData) {
    jsonData.forEach((obj) => {
        // clean name data
        const fullNameUnCap = obj.fullname.trim();
        const unCapNameArr = fullNameUnCap.split(" ");
        // fix capitalization of name parts
        const capNameArr = unCapNameArr.map((name) => {
            if (name.includes(`"`)) {
                const capName =
                    name[1].toUpperCase() +
                    name.substring(2, name.lastIndexOf(`"`)).toLowerCase();
                return capName;
            }
            // try to manage hyphens
            if (name.includes("-")) {
                const hyphPos = name.indexOf("-");
                const capName =
                    name[0].toUpperCase() +
                    name.substring(1, hyphPos + 1).toLowerCase() +
                    name.charAt(hyphPos + 1).toUpperCase() +
                    name.substring(hyphPos + 2).toLowerCase();
                return capName;
            } else {
                const capName = name[0].toUpperCase() + name.substring(1).toLowerCase();
                return capName;
            }
        });

        // clean house data
        const houseUnCap = obj.house.trim();
        const house = houseUnCap[0].toUpperCase() + houseUnCap.substring(1).toLowerCase();

        const gender = obj.gender;
        // console.log(gender);
        // set up student object to be passed
        if (capNameArr.length > 2) {
            const cleanStudentObj = {
                firstName: capNameArr[0],
                middleName: capNameArr[1],
                lastName: capNameArr[2],
                gender: gender,
                house: house,
            };
            createObj(cleanStudentObj);
        } else if (capNameArr.length === 2) {
            const cleanStudentObj = {
                firstName: capNameArr[0],
                middleName: "N/A",
                lastName: capNameArr[1],
                gender: gender,
                house: house,
            };
            createObj(cleanStudentObj);
        } else {
            const cleanStudentObj = {
                firstName: capNameArr[0],
                middleName: "N/A",
                lastName: "N/A",
                gender: gender,
                house: house,
            };
            createObj(cleanStudentObj);
        }
    });
}

function createObj(cleanStudentObj) {
    const student = Object.create(Student);
    student.firstName = cleanStudentObj.firstName;
    student.lastName = cleanStudentObj.lastName;
    student.middleName = cleanStudentObj.middleName;
    student.house = cleanStudentObj.house;
    student.gender = cleanStudentObj.gender;
    student.image =
        "./images/" +
        cleanStudentObj.lastName.toLowerCase() +
        "_" +
        cleanStudentObj.firstName[0].toLowerCase() +
        ".png";
    allStudents.push(student);
    console.table(allStudents);
}
console.log(allStudents);

const Student = {
    firstName: "firstName",
    lastName: "lastName",
    middleName: "middleName",
    nickname: "nickName",
    gender: "gender",
    image: "img",
    house: "house",
};