/*
 *  StudentController.ts
 *  Project: Did-I-Pass
 *
 *  Author: Carolyn Seglem
 *  Created on: Feb 4, 2023
 */

import { Request, Response } from 'express';
import { getStudentData, getStudent, addStudent, calculateFinalExamScore, getLetterGrade, updateStudentGrade } from '../models/StudentModel';

/*
 * Sends back data for all students 
 */
function getAllStudents(req: Request, res: Response): void {
    res.json(getStudentData());
}

/* 
 * When adding a new student, checks that their grade weights add up to 100
 */
function validateWeights(assignments: CourseGrades): boolean {
    let sum = assignments.finalExamWeight;
    // loop through weights to get their sum
    for(const weight of assignments.assignmentWeights) {
        sum += weight.weight;
    }
    return sum === 100;
}

/*
 * Adds a new student to the StudentManager
 */
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

/*
 * Searches for and returns the student with the provided name
 */
function getStudentByName(req: Request, res: Response): void {
    const { studentName } = req.params as StudentNameParams;
    // find student in dataset
    const student = getStudent(studentName);

    if(! student) {  // failed to find
        res.sendStatus(404);
        return;
    }
    res.json(student);  // found
}

/* 
 * Returns the final exam scores needed to receive each letter grade
 */
function getFinalExamScores(req: Request, res: Response): void {
    const { studentName } = req.params as StudentNameParams;
    // find student in dataset
    const student = getStudent(studentName);
  
    if(! student) {  // failed to find
        res.sendStatus(404);
        return;
    }

    const { currentAverage, weights } = student;
    const finalScores: FinalExamScores = {
        neededForA: calculateFinalExamScore(currentAverage, weights.finalExamWeight, 90),
        neededForB: calculateFinalExamScore(currentAverage, weights.finalExamWeight, 80),
        neededForC: calculateFinalExamScore(currentAverage, weights.finalExamWeight, 70),
        neededForD: calculateFinalExamScore(currentAverage, weights.finalExamWeight, 60),
    };
    res.json(finalScores);
} 

/*
 * Calculates the final semester grade given a final exam grade
 */
function calcFinalScore(req: Request, res: Response): void {
    const { studentName } = req.params as StudentNameParams;
    // find student in dataset
    const student = getStudent(studentName);
  
    if(! student) {  // failed to find
        res.sendStatus(404);
        return;
    }

    const { grade } = req.body as AssignmentGrade;
    const { currentAverage, weights } = student;
  
    // calculate weight proportions
    const finalWeightProportion = weights.finalExamWeight / 100;
    const currentWeightProportion = 1 - finalWeightProportion;

    // average final and overall grades together
    const overallScore = (grade * finalWeightProportion) + (currentAverage * currentWeightProportion);
    const letterGrade = getLetterGrade(overallScore);

    const finalScore: FinalGrade = { overallScore, letterGrade };
    res.json(finalScore);
}

/*
 * Updates a student's grade record with a new value
 */
function updateGrade(req: Request, res: Response): void {
    const { studentName, assignmentName } = req.params as GradeUpdateParams;
    const { grade } = req.body as AssignmentGrade;
  
    const update = updateStudentGrade(studentName, assignmentName, grade);
    if (!update) {  // update not successful
        res.sendStatus(404);
        return;
    } 

    res.sendStatus(200);  // succesful update
  }


export default { 
    getAllStudents, 
    createNewStudent, 
    getStudentByName, 
    getFinalExamScores,
    calcFinalScore,
    updateGrade
};