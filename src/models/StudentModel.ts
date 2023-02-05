/*
 *  StudentModel.ts
 *  Project: Did-I-Pass
 *
 *  Author: Carolyn Seglem
 *  Created on: Feb 4, 2023
 */

const students: StudentManager = {};

function getStudentData(): StudentManager {
    return students;
}

function getStudent(name: string): Student | undefined {
    return students[name.toLowerCase()] ?? undefined;
}

function calculateAverage(weights: CourseGrades): number {
    let avg = 0;
    const weightAdjustment = 100 - weights.finalExamWeight;  // for calculating without final grade input
    // loop through all assignment weights for student
    for (let i = 0; i < weights.assignmentWeights.length; i += 1) {
        const { weight, grade } = weights.assignmentWeights[i] as CourseGrade;
        avg += (weight / weightAdjustment * grade);
    }
    return avg;
}

function addStudent(newStudentData: NewStudentRequest): boolean {
    const { name, weights } = newStudentData;
    // student exists in record
    if (students[name.toLowerCase()]) {
        return false;
    }
    
    // create new student
    const newStudent: Student = {
        name,
        weights,
        currentAverage: calculateAverage(weights)
    }
    students[name.toLowerCase()] = newStudent;
    return true;
}

export {
    getStudentData,
    getStudent,
    addStudent,
};