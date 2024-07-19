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
    function, eliminates other buttons that may exist */
function addPreReqButton(buttonText){
    if (prevSearchedCourseCode != null){
        const child = document.getElementById(prevSearchedCourseCode);
        document.body.removeChild(child);
    }
    const btn = document.createElement('button');
    btn.innerHTML = buttonText;
    btn.id = searchedCourseCode;
    document.body.appendChild(btn);
    btn.addEventListener('click', () => {
        onPreReqsButtonClick();
      });
    console.log("created button id: " + btn.id);
}

/*  adds and deletes and header a header */
function addHeader(headerID, headerText){
    document.getElementById(headerID).innerHTML = headerText;
}

function deleteHeader(headerID){
    if (document.getElementById(headerID).hasChildNodes()){
        const child = document.getElementById(headerID);
        child.innerHTML = null;
    }
}

/*  gets all the pre-requisite courses of the searched course */
function onPreReqsButtonClick(){
    addHeader("preReqTitle", "Course Pre-requisites:");
    alert("button clicked! " + searchedCourseCode);
    searchedCoursePre.forEach(course  => {
        fetchCourse(course);
    })
    // fetchCourse(searchedCoursePre);
}

/*  display course as a list with  */
function displayCourse(elementID, code, name, cred, desc, prer){
    document.getElementById(elementID).innerHTML = 
    "<li>" + code + "</li>" + 
        "<ul>" + "<li>Course name: " + name + "</li>" + "</ul>" +
        "<ul>" + "<li>Credits: " + cred + "</li>" + "</ul>" +
        "<ul>" + "<li>Description: " + desc + "</li>" + "</ul>" +
        "<ul>" + "<li>Pre-requisites: " + prer + "</li>" + "</ul>";
    }

function fetchCourse(courseName){
    courseArray = getCourseArray(false, courseName);
    searchedCourse = fetch('https://ubcexplorer.io/getCourseInfo/' + courseArray[0] + '%20' + courseArray[1]);
    searchedCourse
    .then(res => {
        return res.json();
    })
    .then(cData => {
        searchedCourseCode = cData.code;
        // displayCourse("preReqsCourseSearched", cData.code, cData.name, cData.cred, cData.desc, cData.prer);
        // addPreReqButton("Get pre-requisites for: " + searchedCourseCode);
        document.getElementById("preReqsCourseSearched").innerHTML += 
        "<li>" + cData.code + "</li>" + 
        "<ul>" + "<li>Course name: " + cData.name + "</li>" + "</ul>" +
        "<ul>" + "<li>Credits: " + cData.cred + "</li>" + "</ul>" +
        "<ul>" + "<li>Description: " + cData.desc + "</li>" + "</ul>" +
        "<ul>" + "<li>Pre-requisites: " + cData.prer + "</li>" + "</ul>";
    })
}
    
/*  gets course from user input and searches 
    TODO: expand the function so that it can work with a course as a parameter instead */

function searchCourse(){
    courseArray = getCourseArray(true, "");
    searchedCourse = fetch('https://ubcexplorer.io/getCourseInfo/' + courseArray[0] + '%20' + courseArray[1]);
    searchedCourse
    .then(res => {
        return res.json();
    })
    .then(cData => {
        console.log(cData);
        searchedCourseCode = cData.code;        
        addHeader("courseSearchTitle","Course Searched:");
        displayCourse("courseSearched", cData.code, cData.name, cData.cred, cData.desc, cData.prer);
        addPreReqButton("Get pre-requisites for: " + searchedCourseCode);
        deleteHeader("preReqTitle");
        searchedCoursePre = cData.preq;
        console.log(searchedCoursePre);
        prevSearchedCourseCode = searchedCourseCode;
    })
    
}