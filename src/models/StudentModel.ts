/*
 *  StudentModel.ts
 *  Project: Did-I-Pass
 *
 *  Author: Carolyn Seglem
 *  Created on: Feb 4, 2023
 */

const students: StudentManager = {};

/* 
 * Returns all student data
 */ 
function getStudentData(): StudentManager {
    return students;
}

/* 
 * Returns one student record based on name
 */
function getStudent(name: string): Student | undefined {
    return students[name.toLowerCase()] ?? undefined;
}

/* 
 * Calculates the average of a student's grades (excluding final)
 */
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

/* 
 * Creates a new student record
 */
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

/* 
 * Calculates the final exam score needed to get the target score 
 */
function calculateFinalExamScore(currentAverage: number, finalExamWeight: number, targetScore: number): number {
    // get proportions for final and overall grades
    const finalWeightProportion = finalExamWeight / 100;
    const currentWeightProportion = 1 - finalWeightProportion;

    // adjust current average value according to its proportion of the student's complete grade
    const currentWeightedAverage = currentAverage * currentWeightProportion;

    // calculate and return the required exam score from the current weighted average 
    return (targetScore - currentWeightedAverage) / finalWeightProportion;
}

/*
 * Converts numerical grades to letter grades
 */
function getLetterGrade(score: number): string {
    if (score >= 90) {
        return 'A';
    } 
    if (score >= 80) {
        return 'B';
    } 
    if (score >= 70) {
        return 'C';
    } 
    if (score >= 60) {
        return 'D';
    } 
    return 'F';
}

/*
 * Updates a student's grade for the assignment with the provided name
 */
function updateStudentGrade( studentName: string, assignmentName: string, newGrade: number): boolean {
    // find student in dataset
    const student = getStudent(studentName);
    if (!student) {  // not found
        return false;
    }
  
    // search for assignment with provided name
    const assignment = student.weights.assignmentWeights.find(weight => weight.name === assignmentName);
    if (!assignment) {
        return false;
    }

    // update grade and average records for student
    assignment.grade = newGrade;
    student.currentAverage = calculateAverage(student.weights);
    return true;
  }

export {
    getStudentData,
    getStudent,
    addStudent,
    calculateFinalExamScore,
    getLetterGrade,
    updateStudentGrade
};