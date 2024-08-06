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
        document.getElementById('courseInput').value = courseString.toUpperCase();
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
        // set-up button and break id for deletion
        if(preCond){
            btn.id = "pre-"+courseID;
        } else {
            btn.id = "depn-"+courseID;
        }
        btn.innerHTML = buttonText;
        btn.addEventListener('click', () => {
            if(preCond){
                buttonFn();
                document.getElementById("pre-column").style.width = "66.66%";
            } else {
                buttonFn(courseID);
                document.getElementById("depn-column").style.width = "66.66%";
            }
            btn.remove();
        });
        document.getElementById(elementID).appendChild(btn);
    }
}

/*  dinamically adds "get info" button */
function addGetInfoButton(buttonText, courseID){
    const btn = document.getElementById("button-"+courseID);
    console.log(btn);
    btn.innerHTML = buttonText;
    console.log(btn);
    btn.addEventListener('click', () => {
            onSearchCourseButtonClick(courseID);
            document.getElementById("pre-column").style.width = "auto";
            document.getElementById("depn-column").style.width = "auto";
    });
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

/*  display course with its elements. If it is a pre-req or dependent, 
    creates a toggle item */
function displayCourse(deletePrevElements, elementID, code, name, cred, desc, prer){
    if(prer == undefined){
        prer = "No courses were listed as pre-requisites. However, there may be some other restrictions to take this course.";
    }
    if(deletePrevElements){
        const courseItem = document.getElementById(elementID);
        courseItem.className = "row";
        courseItem.innerHTML =
            "<p style='font-weight: bold; margin:0px'>" + code + ": " + name + "</p>" + 
            "<p>Description: " + desc + "</p>" + 
            "<p>Pre-requisites: " + prer + "</p>" + 
            "<p style='font-size:small'>Credits: " + cred + "</p>";
    } else {
        const courseListItem = document.createElement("div");
        courseListItem.className = "row";
        courseListItem.id = "row-"+ code;
        courseListItem.innerHTML = 
            "<details close>" + 
            "<summary style='margin:0px'>" + code + ": " + name + "</summary>"+
            "<p>Description: " + desc + "</p>" + 
            "<p>Pre-requisites: " + prer + "</p>" + 
            "<p style='font-size:small'>Credits: " + cred + "</p>" + 
            "<button type='button'></button>"
            "</details>";
        document.getElementById(elementID).appendChild(courseListItem);
        const row = document.getElementById(courseListItem.id);
        const button = row.getElementsByTagName("button");
        button[0].id = "button-"+code;
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
                // set global variables, removing pre and depn duplicates 
                searchedCourseCode = cData.code;
                searchedCoursePre = [... new Set(cData.preq)];
                searchedCourseDepn = [... new Set(cData.depn)];
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
                addGetInfoButton("Get course info: " + code, code);
        });
}