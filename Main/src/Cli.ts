import inquirer from "inquirer";
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection';

await connectToDb();

import Employee from "./employees";
import Role from "./roles";
import Department from "./departments";

const startQuestions = [
    'View All Employees',
    'Add Employee',
    'Update Employee Role',
    'View All Roles',
    'Add Role',
    'View All Departments',
    'Add Department',
    'Quit',
];

const addEmployeeQuestions = [
    'What is the employee\'s first name?',
    'What is the employee\'s last name?',
    'What is the employee\'s role?',
    'Who is the employee\'s manager?',
];

const addDepartmentQuestions = [
    'What is the name of the department?',
];

const addRoleQuestions = [
    'What is the name of the role?',
    'What is the salary of the role?',
    'Which department does the role belong to?',
];

const updateEmployeeRoleQuestions = [
    'Which employee\'s role do you want to update?',
    'Which role do you want to assign the selected employee?',
];

class Cli {

    employees: Employee[] = [];
    roles: Role[] = [];
    departments: Department[] = [];

    startCli(): void {
        inquirer.prompt([
            {
                type: 'list',
                name: 'StartQuestions',
                message: 'What would you like to do?',
                choices: startQuestions,
            }
        ])
        .then((answers: any) => {
            console.log(answers);
        });
    }

    addEmployee(): void{
        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: addEmployeeQuestions[0],
            },
            {
                type: 'input',
                name: 'lastName',
                message: addEmployeeQuestions[1],
            },
            {
                type: 'input',
                name: 'role',
                message: addEmployeeQuestions[2],
            },
            {
                type: 'input',
                name: 'manager',
                message: addEmployeeQuestions[3],
            }
        ])
        .then((answers: any) => {
            pool.query(`INSERT INTO employees (first_name, last_name, role, manager) VALUES ('${answers.firstName}', '${answers.lastName}', '${answers.role}', '${answers.manager}')`, 
                (err: Error, res: QueryResult) => {
                    if (err) {
                        console.error(err);
                    } else if (res) {
                        console.log(res)
                    }
                });    
        });
    }
}

export default Cli;