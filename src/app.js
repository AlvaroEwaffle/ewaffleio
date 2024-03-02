const express = require('express');
const bodyParser = require('body-parser');
const CourseManager = require('./CourseManager'); // Assuming CourseManager is defined in a separate file
const OpenAIRecommendation = require('./OpenAIRecommendation');
const cors = require('cors'); // Import the cors middleware

const http = require('http');
var fs = require('fs');


const app = express();
// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Create a public express folder use dirname
app.use(express.static(__dirname + '/../public'));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Create a new instance of CourseManager
const courseManager = new CourseManager("../assets/courses.json");

// Create a new instance of OpenAiRecommendation
const openAIRecommendation = new OpenAIRecommendation();

// Route to get all courses
app.get('/courses', (req, res) => {
    const courses = courseManager.getAllCourses();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(courses, null, 2)); // 2 espacios de sangría para una mejor legibilidad
});

// Route to get a course by ID
app.get('/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courseManager.getCourseById(courseId);
    if (course) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(course, null, 2)); // 2 espacios de sangría para una mejor legibilidad
    } else {
        res.status(404).send('Course not found');
    }
});

// Route to add a new course
app.post('/courses', (req, res) => {
    console.log(req.body);
    const {title, courseObjective, description, lessons} = req.body;
    if (!title || !courseObjective || !description ) {
        res.status(400).send('Title, courseObjective, and description are required');
        return;
    }
    const newCourse = courseManager.addCourse(title, courseObjective, description, lessons);
    console.log('New Course:', newCourse);
    res.json(newCourse);
});

// Route to add lessons to a course
app.post('/courses/:id/lessons', (req, res) => {
    const courseId = parseInt(req.params.id);
    const lessons = req.body; // Assuming req.body is an array of lessons

    if (!Array.isArray(lessons)) {
        res.status(400).send('Request body must be an array of lessons');
        return;
    }

    const course = courseManager.getCourseById(courseId);
    if (!course) {
        res.status(404).send('Course not found');
        return;
    }

    lessons.forEach(lesson => {
        const { title, learningObjective } = lesson;
        if (!title || !learningObjective) {
            res.status(400).send('Each lesson must have a title and learningObjective');
            return;
        }
        courseManager.addLesson(courseId, title, learningObjective);
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(courseManager.getCourseById(courseId), null, 2)); // 2 espacios de sangría para una mejor legibilidad
});

// Route to update a course by ID
app.put('/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const { title, courseObjective, description } = req.body;
    const updated = courseManager.updateCourseById(courseId, { title, courseObjective, description });
    if (updated) {
        res.send('Course updated successfully');
    } else {
        res.status(404).send('Course not found');
    }
});


//Route to add a recommendation from OpenAI to a course given its ID
app.post('/courses/:id/recommendations', async (req, res) => {
    const courseId = parseInt(req.params.id);
    //const { title } = req.body;
    const course = courseManager.getCourseById(courseId);
    if (!course) {
        res.status(404).send('Course not found');
        return;
    }
    const recommendation = await openAIRecommendation.getRecommendation(course.title, course.description, course.lessons);
    if(!recommendation){res.status(404).send('Error generating recommendation'); return;}
    const result = await courseManager.addRecommendation(courseId,recommendation);
    if(result){res.send('Recommendation added successfully');}
    else {res.status(404).send('Error adding recommendation');}
    
})


app.listen(port,"0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
    console.log(__dirname + '/../public');
});
