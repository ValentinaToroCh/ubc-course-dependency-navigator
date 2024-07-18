// eventually migrate course api functions here
function getAllCourses(){
    fetch('https://ubcexplorer.io/getAllCourses')
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log(data);
        data.forEach(course => {
            document.getElementById("courseList").innerHTML += "<li>" + course.code + "</li>" + "<ul>" + "<li>credits:" + course.cred + "</li>" + "</ul>";
            console.log("done");
        });
    })
}

// get array containing: course Subject and Code 
function getCourseSubjectAndCode(){
    const course = document.getElementById('courseInput');
    const courseArray = course.value.toUpperCase().split(" ");
    return courseArray;
}

function searchCourse(){
    courseArray = getCourseSubjectAndCode();
    fetch('https://ubcexplorer.io/getCourseInfo/' + courseArray[0] + '%20' + courseArray[1])
    .then(res => {
        return res.json();
    })
    .then(cData => {
        console.log(cData);
        document.getElementById("courseList").innerHTML +=
            "<li>" + cData.code + "</li>" +
            "<ul>" + "<li>Course name: " + cData.name + "</li>" + "</ul>" +
            "<ul>" + "<li>Credits: " + cData.cred + "</li>" + "</ul>" +
            "<ul>" + "<li>Description: " + cData.desc + "</li>" + "</ul>" +
            "<ul>" + "<li>Pre-requisites: " + cData.prer + "</li>" + "</ul>";
            // "<ul>" + "<li>Depedents: " + cData.dep + "</li>" + "</ul>";
    })
}