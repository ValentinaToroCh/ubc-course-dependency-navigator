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
        // searched course
        if(elementID == "") {
            document.body.appendChild(btn);
            document.body.appendChild(brk); 
        } else {
            document.getElementById(elementID).appendChild(btn); 
        }
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

/*  deletes HTML in a given item ID or if it's itemType = "button", eliminates it */
function deleteItem(itemID, itemType){
    const child = document.getElementById(itemID);
    const breakAdded = document.getElementById("addedBrk");
    if (itemType == "button" && child != null){
        document.body.removeChild(breakAdded);
        document.body.removeChild(child);
    } else if (child != null && child.hasChildNodes()){
        child.innerHTML = null;
    }
}

/*  on search course, make that course the input and search for info */
function onSearchCourseButtonClick(courseID){
    input = document.getElementById("courseInput");
    input.value = courseID;
    searchCourse(true,  'courseSearched','');
}

/*  gets all the pre-requisite courses of the searched course */
function onPreReqsButtonClick(){
    addHeader("preReqTitle", "Course Pre-requisites:");
    searchedCoursePre.forEach(pre  => {
        searchCourse(false, "preReqsCourseSearched", pre);
    });
    deleteItem("pre-"+searchedCourseCode, "button");
    deleteItem("depn-"+searchedCourseCode, "button");
}

/*  gets all the dependent courses of the searched course */
function onDepnsButtonClick(){
    addHeader("depnTitle", "Course Dependents:");
    searchedCourseDepn.forEach(depn => {
        searchCourse(false, "depnCourseSearched", depn);
    });
    deleteItem("pre-"+searchedCourseCode, "button");
    deleteItem("depn-"+searchedCourseCode, "button");
}

/*  display course as a list with elements */
function displayCourse(deletePrevElements, elementID, code, name, cred, desc, prer){
    if(prer == undefined){
        prer = "No courses were listed as pre-requisites. However, there may be some other restrictions to take this course.";
    }
    if(deletePrevElements){
        document.getElementById(elementID).innerHTML = 
            "<li style='font-weight: bold'>" + code + ": " + name + "</li>" + 
            "<ul>" + "<li>Credits: " + cred + "</li>" + "</ul>" +
            "<ul>" + "<li>Description: " + desc + "</li>" + "</ul>" +
            "<ul>" + "<li>Pre-requisites: " + prer + "</li>" + "</ul>";
    } else {
        const courseListItem = document.createElement("li");
        courseListItem.innerHTML = 
            "<li style='font-weight: bold'>" + code + ": " + name + "</li>" + 
            "<ul>" + "<li>Course name: " + name + "</li>" + "</ul>" +
            "<ul>" + "<li>Credits: " + cred + "</li>" + "</ul>" +
            "<ul>" + "<li>Description: " + desc + "</li>" + "</ul>" +
            "<ul>" + "<li>Pre-requisites: " + prer + "</li>" + "</ul>";
        document.getElementById(elementID).appendChild(courseListItem);
    }
}

/*  gets course from input either the form or a button and searches it*/
function searchCourse(isSearchedCourse, elementID, code){
    if(!isSearchedCourse){
        // make array = MATH, 200
        courseArray = getCourseArray(false, code);
            notSearchedCourse = fetch('https://ubcexplorer.io/getCourseInfo/' + courseArray[0] + '%20' + courseArray[1]);
            notSearchedCourse
            // parse into JSON
            .then(res => {
                return res.json();
            })
            .then(cData => {
                    displayCourse(false, elementID, code, cData.name, cData.cred, cData.desc, cData.prer);
                    addGetInfoButton("Get course info: " + code, code, elementID);
            });
    } else {
        // course from search, delete button from prev-searched course
        deleteItem("pre-"+searchedCourseCode, "button");
        deleteItem("depn-"+searchedCourseCode, "button");
        deleteItem(prevSearchedCourseCode, "button");
        // make array = MATH, 200
            courseArray = getCourseArray(true, '');
            searchedCourse = fetch('https://ubcexplorer.io/getCourseInfo/' + courseArray[0] + '%20' + courseArray[1]);
            searchedCourse
            .then(res => {
                return res.json();
            })
            .then(cData => {
                console.log(cData);
                // make search course, the button info 
                searchedCourseCode = code = cData.code;  
                // add header and display course 
                addHeader("courseSearchTitle","Course Searched:");
                displayCourse(true, elementID, code, cData.name, cData.cred, cData.desc, cData.prer);
                // add pre and depn to global variable 
                searchedCoursePre = cData.preq;
                searchedCourseDepn = cData.depn;
                // add pre-reqs button and delete any prevs items
                addGetButton("Get pre-requisites for: " + searchedCourseCode, onPreReqsButtonClick, searchedCourseCode, "");
                deleteItem("preReqTitle", "");
                deleteItem("preReqsCourseSearched", "");
                addGetButton("Get dependents of: " + searchedCourseCode, onDepnsButtonClick, searchedCourseCode, "");
                deleteItem("depnTitle", "");
                deleteItem("depnCourseSearched", "");
                prevSearchedCourseCode = searchedCourseCode;
            }).catch(() => {
                window.alert("Course not found");
            });
    }
}