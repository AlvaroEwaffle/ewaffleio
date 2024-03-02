const fs = require('fs');

class CourseManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.courses = this.loadCourses();
    }

    loadCourses() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            // If the file doesn't exist or is empty, return an empty array
            return [];
        }
    }

    saveCourses() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.courses, null, 2));
    }

    getNextId() {
        // Find the maximum ID in the existing courses and increment it
        const maxId = this.courses.reduce((max, course) => Math.max(max, course.id), 0);
        return maxId + 1;
    }

    addCourse(title, courseObjective, description, lessons,) {
        const id = this.getNextId();
        const course = { id, title, courseObjective, description, lessons, recommendationsDone: false };
        this.courses.push(course);
        this.saveCourses();
        return course;
    }

    addLesson(courseId, lessonTitle, learningObjective) {
        const course = this.courses.find(course => course.id === courseId);
        if (course) {
            const lesson = { title: lessonTitle, learningObjective };
            course.lessons.push(lesson);
            this.saveCourses();
            return lesson;
        }
        return null;
    }

    getAllCourses() {
        return this.courses;
    }

    getCourseById(id) {
        return this.courses.find(course => course.id === id);
    }

    updateCourseById(id, newData) {
        const index = this.courses.findIndex(course => course.id === id);
        if (index !== -1) {
            this.courses[index] = { ...this.courses[index], ...newData };
            this.saveCourses();
            return true;
        }
        return false;
    }

    async addRecommendation(courseId, recommendation) {
        const course = this.getCourseById(courseId);
        if (!course) {
            res.status(404).send('Course not found');
            return;
        }
        //Push recommendation ton the course object in the file
        course.recommendations.push(recommendation);
        course.recommendationsDone = true;
        this.saveCourses();
        return true;
    }
}


module.exports = CourseManager;