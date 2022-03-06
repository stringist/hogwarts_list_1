"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let expelledStudents = [];
let familiesObj = {
    half: [],
    pure: [],
};
// let filteredArray = [];
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
    squad: false,
    expelled: false,
    imgURL: "",
};

function start() {
    console.log("ready");
    loadJSON();
    addEventListeners();
}

function addEventListeners() {
    // window.addEventListener("keyup", (e) => {
    //     if (e.code === 32) { hackTheSystem() }
    // });
    // document.body.onkeyup = function(e) {
    //     if (e.code == 32) {
    //         hackTheSystem();
    //     }
    // }

    document.querySelector("h1").addEventListener("click", hackTheSystem)

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

    const famResponse = await fetch("families.json");
    const famData = await famResponse.json();

    await makeFamObj(famData);
    cleanData(jsonData);
}

async function makeFamObj(famData) {
    famData.half.forEach((name) => {
        familiesObj.half.push(name);
    });
    famData.pure.forEach((name) => {
        familiesObj.pure.push(name);
    });
}

function getBloodStatus(student) {
    const halfBloodArr = familiesObj.half;
    const pureBloodArr = familiesObj.pure;
    const lastName = student.lastName;
    if (settings.hacked === true) {
        const random = Math.floor(Math.random() * 3);

        const bloodArr = ["half", "full", "muggle"];

        return bloodArr[random];
    } else {
        if (isNameListed(halfBloodArr, lastName)) {
            return "half";
        } else if (isNameListed(pureBloodArr, lastName)) {
            return "full";
        } else {
            return "muggle";
        }

        function isNameListed(arr, name) {
            return arr.includes(name);
        }
    }
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
    } else if (cleanNameArr.length < 2) {
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
        const capString = `"` + string[1].toUpperCase() + string.substring(2, string.lastIndexOf(`"`)).toLowerCase() + `"`;
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
        const capString = string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
        return capString;
    }
}

function prepareObjects(jsonData) {
    allStudents = jsonData.map(prepareObject);
    buildList();
    // displayList(allStudents);
}

function prepareObject(jsonObject) {
    const student = Object.create(Student);
    student.firstName = jsonObject.fullname.firstName;
    student.middleName = jsonObject.fullname.middleName;
    student.lastName = jsonObject.fullname.lastName;
    student.nickName = jsonObject.fullname.nickName;
    student.house = jsonObject.house;
    student.gender = jsonObject.gender;
    student.blood = getBloodStatus(student);
    student.imgURL = `./images/${student.lastName}.toLowerCase()_${student.firstName[0]}.toLowerCase().png`;
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
        //console.log(student);
        if (student.house.toLowerCase() === settings.filterBy) {
            return true;
        } else {
            return false;
        }
    }
    return filteredList;
}

function selectSort(event) {
    console.log(`global sortBy going into selectsort is ${settings.sortBy}`);
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;
    console.log(`select sort function sortby is ${sortBy}, sortDir is ${sortDir}`);
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
    console.log(`setSort sortBY is ${sortBy}, sortDir is ${sortDir}`);
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

    if (settings.hacked === true) {
        const hacker = {
            firstName: "Kalle",
            middleName: "",
            lastName: "Tiihonen",
            nickName: "",
            house: "Ravenclaw",
            blood: "muggle",
            gender: "boy",
            prefect: false,
            squad: false,
            expelled: false,
            hacker: true,
        };
        if (allStudents.length + expelledStudents.length < 35 === true) {
            sortedList.push(hacker);
            buildList();
        }
    }

    displayList(sortedList);
    displayExpelledList(expelledStudents);
    updateCounters();
}

function displayList(students) {
    document.querySelector("#currentStudents").innerHTML = "";
    students.forEach(displayStudent);
}

function displayStudent(student) {
    // create clone
    const clone = document.querySelector("template#currentStudentTable").content.cloneNode(true);

    // set clone data
    //  tr NAME
    if (settings.firstNamelastName === true) {
        if (!student.lastName) {
            clone.querySelector("[data-field=name]").textContent = student.firstName;
        } else {
            clone.querySelector("[data-field=name]").textContent = student.firstName + " " + student.lastName;
        }
    } else {
        if (!student.lastName) {
            clone.querySelector("[data-field=name]").textContent = student.firstName;
        } else {
            clone.querySelector("[data-field=name]").textContent = student.lastName + ", " + student.firstName;
        }
    }
    //  tr HOUSE
    clone.querySelector("[data-field=house]").textContent = student.house;

    // tr BLOOD
    if (getBloodStatus(student) === "half") {
        clone.querySelector(".blood_container").classList.add("half_blood");
    } else if (getBloodStatus(student) === "full") {
        clone.querySelector(".blood_container").classList.add("full_blood");
    } else {
        clone.querySelector(".blood_container").classList.add("muggle_blood");
    }

    // tr PREFECT
    if (student.prefect === true) {
        clone.querySelector(".prefect_container").classList.add("prefect_selected");
    } else {
        clone.querySelector(".prefect_container").classList.remove("prefect_selected");
    }

    // tr SQUAD
    if (student.squad === true) {
        console.log(`studenst squad check class list`);
        clone.querySelector(".squad_container").classList.remove("squad_unselected");
        clone.querySelector(".squad_container").classList.add("squad_selected");
    } else {
        clone.querySelector(".squad_container").classList.remove("squad_selected");
        clone.querySelector(".squad_container").classList.add("squad_unselected");
    }

    // PREFECT & TOGGLE Prefect
    clone.querySelector(".prefect_container").addEventListener("click", togglePrefect);

    function togglePrefect() {
        if (student.prefect) {
            student.prefect = false;
            buildList();
        } else {
            tryToMakePrefect(student);
        }
        buildList();
    }

    // SQUAD & TOGGLE
    clone.querySelector(".squad_container").addEventListener("click", toggleSquad);

    function toggleSquad() {
        if (student.squad) {
            student.squad = false;
            buildList();
        } else {
            tryToAddToSquad(student);
        }
        buildList();
    }

    clone.querySelector(`[data-field=name]`).addEventListener("click", detailsPopUp);

    function detailsPopUp() {
        if (student.hacker) {
            buildList();
        }
        console.log(`pop up is displaying ${student.firstName}  ${student.house}  ${student.prefect}`);
        document.querySelector(".modal").classList.remove("hidden");

        // add event listeners
        document.querySelector("#makePrefect").addEventListener("click", togglePrefect);
        document.querySelector("#makePrefect").addEventListener("click", detailsPopUp);

        document.querySelector("#inquisitorial").addEventListener("click", toggleSquad);
        document.querySelector("#inquisitorial").addEventListener("click", detailsPopUp);

        document.querySelector("#expel").addEventListener("click", tryToExpel);
        document.querySelector("button.closebutton").addEventListener("click", closeDetails);
        // fill in details:
        // NAME
        document.querySelector("#detailFirstName span").textContent = " " + student.firstName;
        if (student.middleName !== undefined) {
            document.querySelector("#detailMiddleName span").textContent = " " + student.MiddleName;
        } else {
            document.querySelector("#detailMiddleName span").textContent = " -----";
        }
        if (student.lastName !== undefined) {
            document.querySelector("#detailSurname span").textContent = " " + student.lastName;
        } else {
            document.querySelector("#detailSurname span").textContent = " -----";
        }
        if (student.nickName !== undefined) {
            document.querySelector("#detailnickName span").textContent = " " + student.nickName;
        } else {
            document.querySelector("#detailNickname span").textContent = " -----";
        }

        // GENDER
        document.querySelector("#detailGender span").textContent = " " + student.gender;

        // HOUSE
        document.querySelector("#detailHouse span").textContent = " " + student.house;

        // BLOOD
        if (getBloodStatus(student) === "half") {
            document.querySelector("#detailBlood span").textContent = "Half-blood";
            document.querySelector("#detailBlood .big_blood_container").classList.remove("muggle_blood");
            document.querySelector("#detailBlood .big_blood_container").classList.remove("full_blood");
            document.querySelector("#detailBlood .big_blood_container").classList.add("half_blood");
        } else if (getBloodStatus(student) === "full") {
            document.querySelector("#detailBlood .big_blood_container").classList.remove("muggle_blood");
            document.querySelector("#detailBlood .big_blood_container").classList.remove("half_blood");
            document.querySelector("#detailBlood .big_blood_container").classList.add("full_blood");
            document.querySelector("#detailBlood span").textContent = "Full-blood";
        } else {
            document.querySelector("#detailBlood .big_blood_container").classList.remove("half_blood");
            document.querySelector("#detailBlood .big_blood_container").classList.remove("full_blood");
            document.querySelector("#detailBlood .big_blood_container").classList.add("muggle_blood");
            document.querySelector("#detailBlood span").textContent = "Muggle-blood";
        }

        // PREFECT
        if (student.prefect) {
            document.querySelector("#detailPrefect span").textContent = "Yes";
            document.querySelector("#detailPrefect .big_prefect_container").classList.remove("prefect_unselected");
            document.querySelector("#detailPrefect .big_prefect_container").classList.add("prefect_selected");
            document.querySelector("#makePrefect").textContent = "Remove Prefect";
        }
        if (student.prefect === false) {
            document.querySelector("#detailPrefect span").textContent = "No";
            document.querySelector("#detailPrefect .big_prefect_container").classList.remove("prefect_selected");
            document.querySelector("#detailPrefect .big_prefect_container").classList.add("prefect_unselected");
            document.querySelector("#makePrefect").textContent = "Appoint as Prefect";
        }

        // SQUAD

        if (student.squad) {
            document.querySelector("#detailSquad span").textContent = "Yes";
            document.querySelector("#detailSquad .big_squad_container").classList.remove("squad_unselected");
            document.querySelector("#detailSquad .big_squad_container").classList.add("squad_selected");
            document.querySelector("#inquisitorial").textContent = "Remove from Inquisitorial Squad";
        }
        if (student.squad === false) {
            document.querySelector("#detailSquad span").textContent = "No";
            document.querySelector("#detailSquad .big_squad_container").classList.remove("squad_selected");
            document.querySelector("#detailSquad .big_squad_container").classList.add("squad_unselected");
            document.querySelector("#inquisitorial").textContent = "Add to Inquisitorial Squad";
        }

        function closeDetails() {
            document.querySelector(".modal").classList.add("hidden");

            document.querySelector("#makePrefect").removeEventListener("click", togglePrefect);
            document.querySelector("#inquisitorial").removeEventListener("click", toggleSquad);
            document.querySelector("#expel").removeEventListener("click", tryToExpel);
            document.querySelector("button.closebutton").removeEventListener("click", closeDetails);
            clone.querySelector(`[data-field=name]`).addEventListener("click", detailsPopUp);
            buildList();
        }
        buildList();
    }
    // // append clone to list
    document.querySelector("#list tbody").appendChild(clone);

    function tryToMakePrefect(selectedStudent) {
        const prefects = allStudents.filter((student) => student.prefect);

        const prefectsOfSameHouse = prefects.filter((student) => student.house === selectedStudent.house);

        let studentOfSameGender;
        const isOtherPrefectOfSameGender = prefectsOfSameHouse.some(function(student) {
            if (student.gender === selectedStudent.gender) {
                studentOfSameGender = student;
                return true;
            }
        });

        if (isOtherPrefectOfSameGender) {
            removeOtherSameGender(studentOfSameGender);
        } else {
            makePrefect(selectedStudent);
        }

        function removeOtherSameGender(studentOfSameGender) {
            // ask user to ignore or remove 'other'
            document.querySelector("#sexistdialog").classList.remove("hidden");
            document.querySelector("#sexistdialog .closebutton").addEventListener("click", closeDialog);
            document.querySelector("#removeother").addEventListener("click", clickRemoveOther);
            document.querySelector(
                "#removeother .prefect1"
            ).textContent = `Replace ${studentOfSameGender.firstName} with ${student.firstName}`;

            // if ignore, do nothing

            function closeDialog() {
                document.querySelector("#sexistdialog").classList.add("hidden");
                document.querySelector(".closebutton").removeEventListener("click", closeDialog);
                document.querySelector("#removeother").removeEventListener("click", clickRemoveOther);
            }
            // if remove other:

            function clickRemoveOther() {
                console.log("removeOther is clicked");
                removePrevPrefect(studentOfSameGender);
                makePrefect(selectedStudent);
                buildList();
                closeDialog();
            }
            // buildList();
        }

        function removePrevPrefect(prevPrefect) {
            prevPrefect.prefect = false;
        }

        function makePrefect() {
            selectedStudent.prefect = true;
        }
    }

    function tryToAddToSquad(selectedStudent) {
        const bloodResult = getBloodStatus(selectedStudent);
        console.log(bloodResult, selectedStudent.lastName);
        if (bloodResult === "full" || selectedStudent.house === "Slytherin") {
            addToSquad(selectedStudent);
        } else {
            document.querySelector("#racistdialog").classList.remove("hidden");
            racistDialog();
        }

        function racistDialog() {
            document.querySelector("#racistdialog .dialogcontent .closebutton").addEventListener("click", closeDialog);
        }

        function closeDialog() {
            document.querySelector("#racistdialog").classList.add("hidden");
            document.querySelector("#racistdialog .dialogcontent .closebutton").removeEventListener("click", closeDialog);
        }

        function addToSquad(selectedStudent) {
            selectedStudent.squad = true;
            if (settings.hacked) {
                setTimeout(removeFromSquad, 5000);

                function removeFromSquad() {
                    selectedStudent.squad = false;
                    document.querySelector(
                        "#leftsquad .squadMember"
                    ).textContent = `${selectedStudent.firstName} ${selectedStudent.lastName}`;
                    document.querySelector("#leftsquad").classList.remove("hidden");
                    document.querySelector("#leftsquad div button").addEventListener("click", closeLeftSquad);
                }
            }

            function closeLeftSquad() {
                document.querySelector("#leftsquad").classList.add("hidden");
                document.querySelector("#leftsquad div button").removeEventListener("click", closeLeftSquad);
                buildList();
            }
        }
    }

    function tryToExpel() {
        if (!student.hacker) {
            console.log(`${student.firstName} is being expelled.`);
            student.expelled = true;
            const studentIndex = allStudents.indexOf(student);
            console.log(studentIndex);
            const newExpelledStudent = allStudents.splice(studentIndex, 1);
            expelledStudents.push(newExpelledStudent[0]);
            console.log(expelledStudents);
            buildList();
            closeExpelDialog();
        } else {
            document.querySelector("#cantexpel").classList.remove("hidden");
            document.querySelector("#cantexpel div button.closebutton").addEventListener("click", closeExpelDialog);
        }

        function closeExpelDialog() {
            document.querySelector("#cantexpel").classList.add("hidden");
            document.querySelector("button.closebutton").removeEventListener("click", closeExpelDialog);
            document.querySelector("#expel").removeEventListener("click", tryToExpel);
            document.querySelector("div.modal").classList.add("hidden");
        }
    }
}

// expelled student stuff

function displayExpelledList(expelledStudents) {
    console.log("trying to display expelled list");
    document.querySelector("#expelledStudents").innerHTML = "";
    expelledStudents.forEach(displayExpelledStudent);
}

function displayExpelledStudent(student) {
    console.log(`displayExpelled student is displaying ${student.firstName}, ${expelledStudents}`);
    // create clone
    const clone = document.querySelector("template#expelledStudentTable").content.cloneNode(true);

    // set clone data
    //  tr NAME
    if (settings.firstNamelastName === true) {
        if (!student.lastName) {
            clone.querySelector("[data-field=name]").textContent = student.firstName;
        } else {
            clone.querySelector("[data-field=name]").textContent = student.firstName + " " + student.lastName;
        }
    } else {
        if (!student.lastName) {
            clone.querySelector("[data-field=name]").textContent = student.firstName;
        } else {
            clone.querySelector("[data-field=name]").textContent = student.lastName + ", " + student.firstName;
        }
    }
    //  tr HOUSE
    clone.querySelector("[data-field=house]").textContent = student.house;

    // tr BLOOD
    if (getBloodStatus(student) === "half") {
        clone.querySelector(".blood_container").classList.add("half_blood");
    } else if (getBloodStatus(student) === "full") {
        clone.querySelector(".blood_container").classList.add("full_blood");
    } else {
        clone.querySelector(".blood_container").classList.add("muggle_blood");
    }

    clone.querySelector(`[data-field=name]`).addEventListener("click", detailsPopUp);

    function detailsPopUp() {
        document.querySelector("div.modal").classList.remove("hidden");

        // add event listeners
        document.querySelector("#makePrefect").addEventListener("click", togglePrefect);
        document.querySelector("#makePrefect").addEventListener("click", detailsPopUp);

        document.querySelector("#inquisitorial").addEventListener("click", toggleSquad);
        document.querySelector("#inquisitorial").addEventListener("click", detailsPopUp);

        document.querySelector("#expel").addEventListener("click", tryToExpel);
        document.querySelector("button.closebutton").addEventListener("click", closeDetails);
        // fill in details:
        // NAME
        document.querySelector("#detailFirstName span").textContent = " " + student.firstName;
        if (student.middleName !== undefined) {
            document.querySelector("#detailMiddleName span").textContent = " " + student.MiddleName;
        } else {
            document.querySelector("#detailMiddleName span").textContent = " -----";
        }
        if (student.lastName !== undefined) {
            document.querySelector("#detailSurname span").textContent = " " + student.lastName;
        } else {
            document.querySelector("#detailSurname span").textContent = " -----";
        }
        if (student.nickName !== undefined) {
            document.querySelector("#detailnickName span").textContent = " " + student.nickName;
        } else {
            document.querySelector("#detailNickname span").textContent = " -----";
        }

        // GENDER
        document.querySelector("#detailGender span").textContent = " " + student.gender;

        // HOUSE
        document.querySelector("#detailHouse span").textContent = " " + student.house;

        // BLOOD
        if (getBloodStatus(student) === "half") {
            document.querySelector("#detailBlood span").textContent = "Half-blood";
            document.querySelector("#detailBlood .big_blood_container").classList.remove("muggle_blood");
            document.querySelector("#detailBlood .big_blood_container").classList.remove("full_blood");
            document.querySelector("#detailBlood .big_blood_container").classList.add("half_blood");
        } else if (getBloodStatus(student) === "full") {
            document.querySelector("#detailBlood .big_blood_container").classList.remove("muggle_blood");
            document.querySelector("#detailBlood .big_blood_container").classList.remove("half_blood");
            document.querySelector("#detailBlood .big_blood_container").classList.add("full_blood");
            document.querySelector("#detailBlood span").textContent = "Full-blood";
        } else {
            document.querySelector("#detailBlood .big_blood_container").classList.remove("half_blood");
            document.querySelector("#detailBlood .big_blood_container").classList.remove("full_blood");
            document.querySelector("#detailBlood .big_blood_container").classList.add("muggle_blood");
            document.querySelector("#detailBlood span").textContent = "Muggle-blood";
        }

        // PREFECT
        if (student.prefect) {
            document.querySelector("#detailPrefect span").textContent = "Yes";
            document.querySelector("#detailPrefect .big_prefect_container").classList.remove("prefect_unselected");
            document.querySelector("#detailPrefect .big_prefect_container").classList.add("prefect_selected");
            document.querySelector("#makePrefect").textContent = "Remove Prefect";
        }
        if (student.prefect === false) {
            document.querySelector("#detailPrefect span").textContent = "No";
            document.querySelector("#detailPrefect .big_prefect_container").classList.remove("prefect_selected");
            document.querySelector("#detailPrefect .big_prefect_container").classList.add("prefect_unselected");
            document.querySelector("#makePrefect").textContent = "Appoint as Prefect";
        }

        // SQUAD

        if (student.squad) {
            document.querySelector("#detailSquad span").textContent = "Yes";
            document.querySelector("#detailSquad .big_squad_container").classList.remove("squad_unselected");
            document.querySelector("#detailSquad .big_squad_container").classList.add("squad_selected");
            document.querySelector("#inquisitorial").textContent = "Remove from Inquisitorial Squad";
        }
        if (student.squad === false) {
            document.querySelector("#detailSquad span").textContent = "No";
            document.querySelector("#detailSquad .big_squad_container").classList.remove("squad_selected");
            document.querySelector("#detailSquad .big_squad_container").classList.add("squad_unselected");
            document.querySelector("#inquisitorial").textContent = "Add to Inquisitorial Squad";
        }

        function closeDetails() {
            document.querySelector(".modal").classList.add("hidden");

            document.querySelector("#makePrefect").removeEventListener("click", togglePrefect);
            document.querySelector("#inquisitorial").removeEventListener("click", toggleSquad);
            document.querySelector("#expel").removeEventListener("click", tryToExpel);
            document.querySelector("button.closebutton").removeEventListener("click", closeDetails);
            buildList();
        }
        buildList();
    }
    // // append clone to list
    document.querySelector("#list tbody").appendChild(clone);

    function tryToMakePrefect(selectedStudent) {
        const prefects = allStudents.filter((student) => student.prefect);

        const prefectsOfSameHouse = prefects.filter((student) => student.house === selectedStudent.house);

        let studentOfSameGender;
        const isOtherPrefectOfSameGender = prefectsOfSameHouse.some(function(student) {
            if (student.gender === selectedStudent.gender) {
                studentOfSameGender = student;
                return true;
            }
        });

        if (isOtherPrefectOfSameGender) {
            removeOtherSameGender(studentOfSameGender);
        } else {
            makePrefect(selectedStudent);
        }

        function removeOtherSameGender(studentOfSameGender) {
            // ask user to ignore or remove 'other'
            document.querySelector("#sexistdialog").classList.remove("hidden");
            document.querySelector("#sexistdialog .closebutton").addEventListener("click", closeDialog);
            document.querySelector("#removeother").addEventListener("click", clickRemoveOther);
            document.querySelector(
                "#removeother .prefect1"
            ).textContent = `Replace ${studentOfSameGender.firstName} with ${student.firstName}`;

            // if ignore, do nothing

            function closeDialog() {
                document.querySelector("#sexistdialog").classList.add("hidden");
                document.querySelector(".closebutton").removeEventListener("click", closeDialog);
                document.querySelector("#removeother").removeEventListener("click", clickRemoveOther);
            }
            // if remove other:

            function clickRemoveOther() {
                console.log("removeOther is clicked");
                removePrevPrefect(studentOfSameGender);
                makePrefect(selectedStudent);
                buildList();
                closeDialog();
            }
            // buildList();
        }

        function removePrevPrefect(prevPrefect) {
            prevPrefect.prefect = false;
        }

        function makePrefect() {
            selectedStudent.prefect = true;
        }
    }

    function tryToAddToSquad(selectedStudent) {
        const bloodResult = getBloodStatus(selectedStudent);
        console.log(bloodResult, selectedStudent.lastName);
        if (bloodResult === "full" || selectedStudent.house === "Slytherin") {
            addToSquad(selectedStudent);
            // addedToSquadDialogue(selectedStudent);
        } else {
            document.querySelector("#racistdialog").classList.remove("hidden");
            racistDialog();
        }

        function racistDialog() {
            document.querySelector("#racistdialog .dialogcontent .closebutton").addEventListener("click", closeDialog);
        }

        function closeDialog() {
            document.querySelector("#racistdialog").classList.add("hidden");
            document.querySelector("#racistdialog .dialogcontent .closebutton").removeEventListener("click", closeDialog);
        }

        function addToSquad(selectedStudent) {
            selectedStudent.squad = true;
        }
    }

    function tryToExpel() {
        if (!student.hacker) {
            console.log(`${student.firstName} is being expelled.`);
            student.expelled = true;
            const studentIndex = allStudents.indexOf(student);
            console.log(studentIndex);
            const newExpelledStudent = allStudents.splice(studentIndex, 1);
            expelledStudents.push(newExpelledStudent);
            console.log(expelledStudents);
            buildList();
            closeExpelDialog();
        }

        function closeExpelDialog() {
            document.querySelector("#expel").removeEventListener("click", tryToExpel);
            document.querySelector("div .modal").classList.add("hidden");
        }
    }
}

function hackTheSystem() {
    console.log("The system is hacked! ")
    document.querySelector("body").classList.add("hacked");
    settings.hacked = true;
    buildList();
}


function updateCounters() {
    document.querySelector("#allStudentsCount").textContent = allStudents.length;
    document.querySelector("#expelledCount").textContent = expelledStudents.length;
    // document.querySelector("#gryffindorCount").textContent = allStudents.filter();

    //     document.querySelector("#hufflepuffCount").textContent = allStudents.filter(countFilter(gryffindor));

    //     document.querySelector("#ravenclawCount").textContent = ;

    //     document.querySelector("#slytherinCount").textContent = ;
    // }

    // function countFilter(house) {

    //        const filteredList = allStudents.filter(houseFilter);


    //     function houseFilter(student) {
    //         //console.log(student);
    //         if (student.house.toLowerCase() === settings.filterBy) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }
    //     return filteredList;
    // 
}