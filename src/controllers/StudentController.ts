/*
 *  StudentController.ts
 *  Project: Did-I-Pass
 *
 *  Author: Carolyn Seglem
 *  Created on: Feb 4, 2023
 */

import { Request, Response } from 'express';
import { getStudentData, getStudent, addStudent } from '../models/StudentModel';

function getAllStudents(req: Request, res: Response): void {
    res.json(getStudentData());
}

function validateWeights(assignments: CourseGrades): boolean {
    let sum = assignments.finalExamWeight;
    for(const weight of assignments.assignmentWeights) {
        sum += weight.weight;
    }
    return sum === 100;
}

function createNewStudent(req: Request, res: Response): void {
    const studentData = req.body as NewStudentRequest;

    // check that all weights add to 100
    if(! validateWeights(studentData.weights)) {  
        // invalid weights
        res.sendStatus(400);
        return;
    }

    // try adding student to dataset
    const didAddStudent = addStudent(studentData);
    if(! didAddStudent) {   // student already exists
        res.sendStatus(409);
        return;
    }

    res.sendStatus(201);  // successful add
}

function getStudentByName(req: Request, res: Response): void {
    const { studentName } = req.params as StudentNameParam;
    // find student in dataset
    const student = getStudent(studentName);

    if(! student) {  // failed to find
        res.sendStatus(404);
        return;
    }
    res.json(student);  // found
}

export default { getAllStudents, createNewStudent, getStudentByName };