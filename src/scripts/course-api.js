// global variables
let prevSearchedCourseCode;
let searchedCourse;
let searchedCourseCode;
let searchedCoursePre;
let searchedCourseDepn;

/*  gets all courses, parsed onto JSON and displays the course code and 
    corresponding credits of all courses offerred in UBC */
function getAllCourses(){
    fetch('https://ubcexplorer.io/getAllCourses')
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log(data);
        data.forEach(course => {
            document.getElementById("courseList").innerHTML += "<li>" + course.code + "</li>" + "<ul>" + "<li>credits:" + course.cred + "</li>" + "</ul>";
            console.log("get all courses: done");
        });
    })
}

 /* get array containing: course Subject and Code from user input or button to be used 
    on the API searching for specific courses */
function getCourseArray(isFromInput, courseString){
    if (isFromInput){
        courseString = document.getElementById('courseInput').value; 
    } 
    const courseArray = courseString.toUpperCase().split(" ");
    return courseArray;
}

/*  dinamically adds a button linked to a specified function
    used for the "get pre-reqs" and "get depn" buttons*/
function addGetButton(buttonText, buttonFn, courseID, elementID){
    const preCond = searchedCoursePre.length != 0 && buttonText.includes("pre-requisites");
    const depnCond = searchedCourseDepn.length !=0 && buttonText.includes("dependents");
    if(preCond || depnCond){
        const btn = document.createElement('button');
        const brk = document.createElement('br');
        // set-up button and break id for deletion
        if(preCond){
            btn.id = "pre-"+courseID;
        } else {
            btn.id = "depn-"+courseID;
        }
        brk.id = "addedBrk";
        btn.innerHTML = buttonText;
        btn.addEventListener('click', () => {
            if(preCond){
                buttonFn();
            } else {
                buttonFn(courseID);
            }
        });
            document.getElementById(elementID).appendChild(btn);
            document.getElementById(elementID).appendChild(brk); 
    }
}

/*  dinamically adds "get info" button */
function addGetInfoButton(buttonText, courseID, elementID){
    const btn = document.createElement('button');
        btn.innerHTML = buttonText;
        btn.id = courseID;
        btn.addEventListener('click', () => {
            onSearchCourseButtonClick(courseID);
        });
    document.getElementById(elementID).appendChild(btn);
}

/*  adds a header */
function addHeader(headerID, headerText){
    document.getElementById(headerID).innerHTML = headerText;
}

/*  deletes HTML in a given item ID */
function deleteItem(itemID){
    const child = document.getElementById(itemID);
    if (child != null && child.hasChildNodes()){
        child.innerHTML = null;
    }
}

/*  on search course, make that course the input and search for info */
function onSearchCourseButtonClick(courseID){
    input = document.getElementById("courseInput");
    input.value = courseID;
    searchCourseInput();
}

/*  gets all the pre-requisite courses of the searched course */
function onPreReqsButtonClick(){
    addHeader("preReqTitle", "Course Pre-requisites:");
    searchedCoursePre.forEach(pre  => {
        searchCourseButton("preReqsCourseSearched", pre);
    });
}

/*  gets all the dependent courses of the searched course */
function onDepnsButtonClick(){
    addHeader("depnTitle", "Course Dependents:");
    searchedCourseDepn.forEach(depn => {
        searchCourseButton("depnCourseSearched", depn);
    });
}

/*  display course as a list with elements */
function displayCourse(deletePrevElements, elementID, code, name, cred, desc, prer){
    if(prer == undefined){
        prer = "No courses were listed as pre-requisites. However, there may be some other restrictions to take this course.";
    }
    if(deletePrevElements){
        // document.getElementById(elementID).innerHTML = 
        //     "<li style='font-weight: bold'>" + code + ": " + name + "</li>" + 
        //     "<ul>" + "<li>Credits: " + cred + "</li>" + "</ul>" +
        //     "<ul>" + "<li>Description: " + desc + "</li>" + "</ul>" +
        //     "<ul>" + "<li>Pre-requisites: " + prer + "</li>" + "</ul>";
        document.getElementById(elementID).innerHTML =
            "<p style='font-weight: bold'>" + code + ": " + name + "</p>" + 
            "<p>Description: " + desc + "</p>" + 
            "<p>Pre-requisites: " + prer + "</p>" + 
            "<p style='font-size:small'>Credits: " + cred + "</p>";
    } else {
        // const courseListItem = document.createElement("li");
        // courseListItem.innerHTML = 
        //     "<li style='font-weight: bold'>" + code + ": " + name + "</li>" + 
        //     "<ul>" + "<li>Course name: " + name + "</li>" + "</ul>" +
        //     "<ul>" + "<li>Credits: " + cred + "</li>" + "</ul>" +
        //     "<ul>" + "<li>Description: " + desc + "</li>" + "</ul>" +
        //     "<ul>" + "<li>Pre-requisites: " + prer + "</li>" + "</ul>";
        // document.getElementById(elementID).appendChild(courseListItem);
        const courseListItem = document.createElement("div");
        courseListItem.className = "row";
        courseListItem.id = "row-"+ code;
        courseListItem.innerHTML = 
            "<p style='font-weight: bold'>" + code + ": " + name + "</p>" + 
            "<p>Description: " + desc + "</p>" + 
            "<p>Pre-requisites: " + prer + "</p>" + 
            "<p style='font-size:small'>Credits: " + cred + "</p>";
        document.getElementById(elementID).appendChild(courseListItem);
    } 
}

/*  gets course from input */
function searchCourseInput(){
    courseArray = getCourseArray(true, '');
    searchedCourse = fetch('https://ubcexplorer.io/getCourseInfo/' + courseArray[0] + '%20' + courseArray[1]);
    searchedCourse
        .then(res => {return res.json(); })
        .then(cData => {
            console.log(cData);
            displayCourse(true, "courseSearched", cData.code, cData.name, cData.cred, cData.desc, cData.prer);
                // set global variables 
                searchedCourseCode = cData.code;
                searchedCoursePre = cData.preq;
                searchedCourseDepn = cData.depn;
                // add pre-reqs button and delete any prevs items
                addGetButton("Get pre-requisites for: " + searchedCourseCode, onPreReqsButtonClick, searchedCourseCode, "courseSearched");
                deleteItem("preReqTitle", "");
                deleteItem("preReqsCourseSearched", "");
                addGetButton("Get dependents of: " + searchedCourseCode, onDepnsButtonClick, searchedCourseCode, "courseSearched");
                deleteItem("depnTitle", "");
                deleteItem("depnCourseSearched", "");
                prevSearchedCourseCode = searchedCourseCode;
            }).catch(() => {
                window.alert("Course not found");
            });
}

/*  gets course from a button and searches it*/
function searchCourseButton(elementID, code){
    // make array = MATH, 200
    courseArray = getCourseArray(false, code);
    notSearchedCourse = fetch('https://ubcexplorer.io/getCourseInfo/' + courseArray[0] + '%20' + courseArray[1]);
    notSearchedCourse
        // parse into JSON
        .then(res => { return res.json(); })
        .then(cData => {
                displayCourse(false, elementID, code, cData.name, cData.cred, cData.desc, cData.prer);
                addGetInfoButton("Get course info: " + code, code,"row-"+ code);
        });
}