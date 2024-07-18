// global variables
let prevSearchedCourseCode;
let searchedCourse;
let searchedCourseCode;
let searchedCoursePre;
let searchedCourseDep;

// gets all courses, parsed onto JSON and displays the course code and 
// corresponding credits of all courses offerred in UBC
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

// get array containing: course Subject and Code to be used on the API
// searching for specific courses
function getCourseSubjectAndCode(){
    const course = document.getElementById('courseInput');
    const courseArray = course.value.toUpperCase().split(" ");
    return courseArray;
}

// dynamically adds a button with a text and links it to a corresponding
// function
function addButton(buttonText, buttonFn){
    if (prevSearchedCourseCode != null){
        const child = document.getElementById(prevSearchedCourseCode);
        document.body.removeChild(child);
    }
    // console.log("button id to delete: " + prevSearchedCourseCode);
    const btn = document.createElement('button');
    btn.innerHTML = buttonText;
    btn.id = searchedCourseCode;
    document.body.appendChild(btn);
    btn.addEventListener('click', () => {
        buttonFn();
      });
    // console.log("created button id: " + btn.id);
}

function onPreReqsButtonClick(){
     alert('Button pressed!' + searchedCourseCode);
}
    
/*  gets course from suer input and searches 
    TODO: expand the function so that it can work with a course as a parameter instead */

function searchCourse(){
    courseArray = getCourseSubjectAndCode();
    searchedCourse = fetch('https://ubcexplorer.io/getCourseInfo/' + courseArray[0] + '%20' + courseArray[1]);
    searchedCourse
    .then(res => {
        return res.json();
    })
    .then(cData => {
        console.log(cData);
        searchedCourseCode = cData.code;
        document.getElementById("courseList").innerHTML =
            "<li>" + cData.code + "</li>" +
            "<ul>" + "<li>Course name: " + cData.name + "</li>" + "</ul>" +
            "<ul>" + "<li>Credits: " + cData.cred + "</li>" + "</ul>" +
            "<ul>" + "<li>Description: " + cData.desc + "</li>" + "</ul>" +
            "<ul>" + "<li>Pre-requisites: " + cData.prer + "</li>" + "</ul>";
        addButton("Get pre-requisites for: " + searchedCourseCode, onPreReqsButtonClick);
        prevSearchedCourseCode = searchedCourseCode;
    })
    
}