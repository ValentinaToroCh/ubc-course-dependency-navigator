// global variables
let prevSearchedCourseCode;
let searchedCourse;
let searchedCourseCode;
let searchedCoursePre;
let searchedCourseDep;

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

 /* get array containing: course Subject and Code from user input to be used 
    on the API searching for specific courses */
function getCourseArray(isFromInput, courseString){
    if (isFromInput){
        courseString = document.getElementById('courseInput').value; 
    } 
    const courseArray = courseString.toUpperCase().split(" ");
    return courseArray;
}

/*  dynamically adds a button with a text and links it to a corresponding
    function */
function addPreReqButton(buttonText){
    const btn = document.createElement('button');
    btn.innerHTML = buttonText;
    btn.id = searchedCourseCode;
    document.body.appendChild(btn);
    btn.addEventListener('click', () => {
        onPreReqsButtonClick();
      });
    console.log("created button id: " + btn.id);
}

/*  adds a header */
function addHeader(headerID, headerText){
    document.getElementById(headerID).innerHTML = headerText;
}

/*  deletes HTML in a given item ID or if it's itemType = "button", eliminates it */
function deleteItem(itemID, itemType){
    const child = document.getElementById(itemID);
    if (itemType == "button" && child != null){
        document.body.removeChild(child);
    } else if (child != null && child.hasChildNodes()){
        child.innerHTML = null;
    }
}

/*  gets all the pre-requisite courses of the searched course */

function onPreReqsButtonClick(){
    addHeader("preReqTitle", "Course Pre-requisites:");
    alert("button clicked! " + searchedCourseCode);
    searchedCoursePre.forEach(pre  => {
        searchCourse(false, "preReqsCourseSearched", pre);
    })
    deleteItem(searchedCourseCode, "button");
}

/*  display course as a list with  */
function displayCourse(deletePrevElements, elementID, code, name, cred, desc, prer){
    if(deletePrevElements){
        document.getElementById(elementID).innerHTML = 
        "<li>" + code + "</li>" + 
            "<ul>" + "<li>Course name: " + name + "</li>" + "</ul>" +
            "<ul>" + "<li>Credits: " + cred + "</li>" + "</ul>" +
            "<ul>" + "<li>Description: " + desc + "</li>" + "</ul>" +
            "<ul>" + "<li>Pre-requisites: " + prer + "</li>" + "</ul>";
    } else {
        document.getElementById(elementID).innerHTML += 
            "<li>" + code + "</li>" + 
            "<ul>" + "<li>Course name: " + name + "</li>" + "</ul>" +
            "<ul>" + "<li>Credits: " + cred + "</li>" + "</ul>" +
            "<ul>" + "<li>Description: " + desc + "</li>" + "</ul>" +
            "<ul>" + "<li>Pre-requisites: " + prer + "</li>" + "</ul>";
    }
    }

/*  gets course from input either the form or a button and searches it*/
function searchCourse(isSearchedCourse, elementID, code){
    if(!isSearchedCourse){
        courseArray = getCourseArray(false, code);
        notSearchedCourse = fetch('https://ubcexplorer.io/getCourseInfo/' + courseArray[0] + '%20' + courseArray[1]);
        notSearchedCourse
        .then(res => {
            return res.json();
        })
        .then(cData => {
            displayCourse(false, elementID, code, cData.name, cData.cred, cData.desc, cData.prer);
        })
    } else {
        deleteItem(prevSearchedCourseCode, "button");
        courseArray = getCourseArray(true, '');
        searchedCourse = fetch('https://ubcexplorer.io/getCourseInfo/' + courseArray[0] + '%20' + courseArray[1]);
        searchedCourse
        .then(res => {
            return res.json();
        })
        .then(cData => {
            console.log(cData);
            searchedCourseCode = code = cData.code;  
            addHeader("courseSearchTitle","Course Searched:");
            displayCourse(true, elementID, code, cData.name, cData.cred, cData.desc, cData.prer);
            console.log(cData.preq.length);
            if(cData.preq.length != 0){
                addPreReqButton("Get pre-requisites for: " + searchedCourseCode);
            }
            deleteItem("preReqTitle", "");
            deleteItem("preReqsCourseSearched", "");
            searchedCoursePre = cData.preq;
            console.log(searchedCoursePre);
            prevSearchedCourseCode = searchedCourseCode;
        })
    }
}