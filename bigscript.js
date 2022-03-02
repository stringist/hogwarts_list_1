"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let expelledStudents = []; // let filteredArray = [];
// The prototype for all animals:

const settings = {
    filterBy: "*",
    sortBy: "name",
    sortDir: "asc",
    hacked: false,
    firstNamelastName: true,
};

// The prototype for all sudents:
const Student = {
    firstName: "",
    middleName: "",
    lastName: "",
    nickName: "",
    house: "",
    blood: "",
    gender: "",
    prefect: false,
    inquisitor: false,
    expelled: false,
};

function start() {
    console.log("ready");
    loadJSON();
    addEventListeners();
}

function addEventListeners() {
    const sortingButtons = document.querySelectorAll("[data-action=sort]");
    const filterOptions = document.querySelectorAll("[data-action=filter]");

    filterOptions.forEach((option) => {
        option.addEventListener("click", selectFilter);
    });

    sortingButtons.forEach((category) => {
        category.addEventListener("click", selectSort);
    });

    const nameToggle = document.querySelector("#nametoggle");
    nameToggle.addEventListener("click", toggleName);
}

async function loadJSON() {
    const response = await fetch("students.json");
    const jsonData = await response.json();

    cleanData(jsonData);
}

// cleaning the data
function cleanData(jsonData) {
    jsonData.forEach((obj) => {
        obj.fullname = getNameParts(obj);
        obj.house = cleanHouse(obj);
    });
    prepareObjects(jsonData);
}

function getNameParts(jsonObject) {
    const fullName = jsonObject.fullname.trim();
    const nameArr = fullName.split(" ");
    const cleanNameArr = nameArr.map((namePart) => {
        const trimName = namePart.trim();
        const cleanName = capitalize(trimName);
        return cleanName;
    });
    const firstName = cleanNameArr[0];
    if (cleanNameArr.length === 2) {
        const lastName = cleanNameArr[1];
        return { firstName, lastName };
    }

    if (cleanNameArr.length === 3) {
        if (cleanNameArr[1].includes(`"`)) {
            const nickName = cleanNameArr[1];
            const lastName = cleanNameArr[2];
            return { firstName, nickName, lastName };
        } else {
            const middleName = cleanNameArr[1];
            const lastName = cleanNameArr[2];
            return { firstName, middleName, lastName };
        }
    } else {
        return { firstName };
    }
}

function cleanHouse(jsonObj) {
    const house = jsonObj.house.trim();
    const cleanHouse = capitalize(house);
    return cleanHouse;
}

function capitalize(string) {
    if (string.includes(`"`)) {
        const capString =
            `"` +
            string[1].toUpperCase() +
            string.substring(2, string.lastIndexOf(`"`)).toLowerCase() +
            `"`;
        return capString;
    }
    if (string.includes("-")) {
        const hyphPos = string.indexOf("-");
        const capString =
            string[0].toUpperCase() +
            string.substring(1, hyphPos + 1).toLowerCase() +
            string.charAt(hyphPos + 1).toUpperCase() +
            string.substring(hyphPos + 2).toLowerCase();
        return capString;
    } else {
        const capString =
            string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
        return capString;
    }
}

function prepareObjects(jsonData) {
    allStudents = jsonData.map(prepareObject);
    console.table(allStudents);
    // buildList();
    displayList(allStudents);
}

function prepareObject(jsonObject) {
    const student = Object.create(Student);
    student.firstName = jsonObject.fullname.firstName;
    student.middleName = jsonObject.fullname.middleName;
    student.lastName = jsonObject.fullname.lastName;
    student.nickName = jsonObject.fullname.nickName;
    student.house = jsonObject.house;
    student.gender = jsonObject.gender;
    // blood: "",
    return student;
}

function toggleName() {
    if (settings.firstNamelastName === true) {
        settings.firstNamelastName = false;
        document.querySelector("#nametoggle").textContent = "Last ⇋ First";
    } else {
        settings.firstNamelastName = true;
        document.querySelector("#nametoggle").textContent = "First ⇋ Last";
    }
    buildList();
}

function selectFilter(event) {
    const filter = event.target.dataset.filter;
    setFilter(filter);
}

function setFilter(filter) {
    settings.filterBy = filter;
    buildList();
}

function filterList(filteredList) {
    console.log("filterList global filterBy is", settings.filterBy);
    if (
        settings.filterBy === "gryffindor" ||
        settings.filterBy === "hufflepuff" ||
        settings.filterBy === "ravenclaw" ||
        settings.filterBy === "slytherin"
    ) {
        filteredList = allStudents.filter(houseFilter);
    } else {
        filteredList = allStudents;
    }

    function houseFilter(student) {
        console.log(student);
        if (student.house.toLowerCase() === settings.filterBy) {
            return true;
        } else {
            return false;
        }
    }
    return filteredList;
}

function selectSort(event) {
    console.log(`global sortBy going into selectsort is ${settings.sortBy}`)
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;
    console.log(
        `select sort function sortby is ${sortBy}, sortDir is ${sortDir}`
    );
    // find old sortBy elelment
    console.log(`oldElememt is [data-sort='${settings.sortBy}']`);
    const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
    oldElement.classList.remove("sortby");
    // indicate active sort
    event.target.classList.add("sortby");
    // toggle direction
    if (sortDir === "asc") {
        event.target.dataset.sortDirection = "desc";
    } else {
        event.target.dataset.sortDirection = "asc";
    }
    console.log(`User selected ${settings.sortBy} - ${settings.sortDir}`);
    setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildList();
}

function sortList(sortedList) {
    let direction = 1;

    if (settings.sortDir === "desc") {
        direction = -1;
    } else {
        direction = 1;
    }

    if (settings.sortBy === "name") {
        if (settings.firstNamelastName === true) {
            sortedList = sortedList.sort(sortByFirstName);
        } else {
            sortedList = sortedList.sort(sortByLastName);
        }
    } else {
        sortedList = sortedList.sort(sortByProperty);
    }

    function sortByFirstName(studentA, studentB) {
        if (studentA.firstName < studentB.firstName) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }

    function sortByLastName(studentA, studentB) {
        if (studentA.lastName < studentB.lastName) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }

    function sortByProperty(studentA, studentB) {
        if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }
    return sortedList;
}

function buildList() {
    const currentList = filterList(allStudents);
    const sortedList = sortList(currentList);
    displayList(sortedList);
}

function displayList(students) {
    // clear the display
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    students.forEach(displayStudent);
}

function displayStudent(student) {
    // create clone
    const clone = document
        .querySelector("template#studentTable")
        .content.cloneNode(true);

    // set clone data
    if (settings.firstNamelastName === true) {
        clone.querySelector("[data-field=name]").textContent =
            student.firstName + " " + student.lastName;
    } else {
        clone.querySelector("[data-field=name]").textContent =
            student.lastName + ", " + student.firstName;
    }

    clone.querySelector("[data-field=house]").textContent = student.house;

    // // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}

function tryToMakePrefect(selectedstudent) {
    const winners = allstudents.filter((student) => student.winner);

    const numberOfWinners = winners.length;
    const other = winners
        .filter((student) => student.type === selectedStudent.type)
        .shift();
    // if there is another of the same type
    if (other !== undefined) {
        console.log("There can only be one winner of each type!");
        removeOther(other);
    } else if (numberOfWinners >= 2) {
        console.log("There can only be two winners!");
        removeAOrB(winners[0], winners[1]);
    } else {
        makeWinner(selectedStudent);
    }
    console.log(`There are ${numberOfWinners} winners`);

    console.log(other);

    function removeOther(other) {
        // ask user to ignore or remove 'other'
        document.querySelector("#onlyonekind").classList.remove("dialog");
        document.querySelector("#onlyonekind").classList.add("dialog.show");
        document
            .querySelector("#onlyonekind .closebutton")
            .addEventListener("click", closeDialog);
        document
            .querySelector("#removeother")
            .addEventListener("click", clickRemoveOther);
        document.querySelector(
            "#removeother .student1"
        ).textContent = `${other.name}?`;

        // if ignore, do nothing

        function closeDialog() {
            document.querySelector("#onlyonekind").classList.add("dialog");
            document
                .querySelector("#onlyonekind .closebutton")
                .removeEventListener("click", closeDialog);
            document
                .querySelector("#removeother")
                .removeEventListener("click", clickRemoveOther);
        }
        // if remove other:

        function clickRemoveOther() {
            console.log("removeOther is clicked");
            removePrevWinner(other);
            makeWinner(selectedStudent);
            buildList();
            closeDialog();
        }
    }

    function removeAOrB(winnerA, winnerB) {
        document.querySelector("#onlytwowinners").classList.remove("dialog");
        document.querySelector("#onlytwowinners").classList.add("dialog.show");
        document
            .querySelector("#onlytwowinners .closebutton")
            .addEventListener("click", closeDialog);
        document.querySelector("#removeA").addEventListener("click", clickRemoveA);
        document.querySelector("#removeB").addEventListener("click", clickRemoveB);
        document.querySelector(
            "#removeA [data-field=winnerA]"
        ).textContent = `${winnerA.name} the ${winnerA.type}`;
        document.querySelector(
            "#removeB [data-field=winnerB]"
        ).textContent = `${winnerB.name} the ${winnerB.type}`;

        function closeDialog() {
            document.querySelector("#onlytwowinners").classList.add("dialog");
            document.querySelector("#onlytwowinners").classList.remove("dialog.show");
            document
                .querySelector("#onlytwowinners .closebutton")
                .removeEventListener("click", closeDialog);
            document
                .querySelector("#removeA")
                .removeEventListener("click", clickRemoveA);
            document
                .querySelector("#removeB")
                .removeEventListener("click", clickRemoveB);
        }

        function clickRemoveA() {
            removePrevWinner(winnerA);
            makeWinner(selectedStudent);
            buildList();
            closeDialog();
        }

        function clickRemoveB() {
            removePrevWinner(winnerB);
            makeWinner(selectedStudent);
            buildList();
            closeDialog();
        }
    }

    function removePrevWinner(winnerAnimal) {
        winnerAnimal.winner = false;
    }

    function makeWinner(animal) {
        animal.winner = true;
    }
}