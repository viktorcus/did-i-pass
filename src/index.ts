/*
 *  index.ts
 *  Project: Did-I-Pass
 *
 *  Author: Carolyn Seglem
 *  Created on: Feb 4, 2023
 */

import express, { Express } from 'express';
import StudentController from './controllers/StudentController';

const app: Express = express();
const PORT = 8091;

app.use(express.json());

app.get('/api/students', StudentController.getAllStudents);
app.get('/api/students/:studentName', StudentController.getStudentByName);
// app.get('/api/students/:studentName/finalExam');

app.post('/api/students', StudentController.createNewStudent);
// app.post('/api/students/:studentName/finalExam');
// app.post('/api/students/:studentName/grades/:assignmentName');

app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
});