import inquirer from "inquirer";
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

await connectToDb();

import Employee from "./employees.js";
import Role from "./roles.js";
import Department from "./departments.js";

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

    employees: Employee[] = [
        new Employee ('Alice', 'Johnson', 'Engineer'),
        new Employee ('Bob', 'Smith', 'Accountant'),
        new Employee ('Charlie', 'Brown', 'Lawyer'),
        new Employee ('David', 'White', 'Salesperson')
    ];

    roles: Role[] = [
        new Role('Engineer', 100000, 'Engineering'), 
        new Role('Accountant', 80000, 'Finance'), 
        new Role('Lawyer', 120000, 'Legal'), 
        new Role('Salesperson', 70000, 'Sales')
    ];
    departments: Department[] = [
        new Department('Engineering'), 
        new Department('Finance'), new Department('Legal'), 
        new Department('Sales')
    ];

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
            if(answers.StartQuestions === startQuestions[0]) {
                this.viewAllEmployees();
            } else if(answers.StartQuestions === startQuestions[1]) {
                this.addEmployee();
            } else if(answers.StartQuestions === startQuestions[2]) {
                this.updateEmployeeRole();
            } else if(answers.StartQuestions === startQuestions[3]) {
                this.viewAllRoles();
            } else if(answers.StartQuestions === startQuestions[4]) {
                this.addRole();
            } else if(answers.StartQuestions === startQuestions[5]) {
                this.viewAllDepartments();
            } else if(answers.StartQuestions === startQuestions[6]) {
                this.addDepartment();
            } else if(answers.StartQuestions === startQuestions[7]) {
                pool.end();
            }
        });
    };

    viewAllEmployees(): void {
        pool.query('SELECT * FROM employee', (err: Error, res: QueryResult) => {
            if (err) {
                console.error(err);
            } else if (res) {
                console.log(res.rows);
            }
        });
        this.startCli();
    };

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
                type: 'list',
                name: 'role',
                message: addEmployeeQuestions[2],
                choices: this.roles.map(role => role.name),
            },
            {
                type: 'list',
                name: 'manager',
                message: addEmployeeQuestions[3],
                choices: this.employees.map(employee => employee.firstName),
            }
        ])
        .then((answers: any) => {
            const employee = new Employee(answers.firstName, answers.lastName, answers.role, answers.manager);
            this.employees.push(employee);

            pool.query(`INSERT INTO employee (first_name, last_name, role, manager) VALUES ('${answers.firstName}', '${answers.lastName}', '${answers.role}', '${answers.manager}')`, 
                (err: Error, res: QueryResult) => {
                    if (err) {
                        console.error(err);
                    } else if (res) {
                        console.log(res)
                    }
                });
            this.startCli();
        });
    };

    updateEmployeeRole(): void {
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeName',
                message: updateEmployeeRoleQuestions[0],
                choices: this.employees,
            },
            {
                type: 'input',
                name: 'role',
                message: updateEmployeeRoleQuestions[1],
            }
        ])
        .then((answers: any) => {
            pool.query(`UPDATE employee SET role = '${answers.role}' WHERE first_name = '${answers.employeeName}'`, 
                (err: Error, res: QueryResult) => {
                    if (err) {
                        console.error(err);
                    } else if (res) {
                        console.log(res)
                    }
                });
            this.startCli();
        });
    };

    viewAllRoles(): void {
        pool.query('SELECT * FROM role', (err: Error, res: QueryResult) => {
            if (err) {
                console.error(err);
            } else if (res) {
                console.table(res.rows);
            }
        });
    };

    addRole(): void {
        inquirer.prompt([
            {
                type: 'input',
                name: 'roleName',
                message: addRoleQuestions[0],
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: addRoleQuestions[1],
            },
            {
                type: 'input',
                name: 'roleDepartment',
                message: addRoleQuestions[2],
            }
        ])
        .then((answers: any) => {
            pool.query(`INSERT INTO role (title, salary, department) VALUES ('${answers.roleName}', '${answers.roleSalary}', '${answers.roleDepartment}')`, 
                (err: Error, res: QueryResult) => {
                    if (err) {
                        console.error(err);
                    } else if (res) {
                        console.log(res)
                    }
                });
            this.startCli();
        });
    };
    
    viewAllDepartments(): void {
        pool.query('SELECT * FROM department', (err: Error, res: QueryResult) => {
            if (err) {
                console.error(err);
            } else if (res) {
                console.table(res.rows);
            }
        });
    };

    addDepartment(): void {
        inquirer.prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: addDepartmentQuestions[0],
            }
        ])
        .then((answers: any) => {
            pool.query(`INSERT INTO department (name) VALUES ('${answers.departmentName}')`, 
                (err: Error, res: QueryResult) => {
                    if (err) {
                        console.error(err);
                    } else if (res) {
                        console.log(res)
                    }
                });
            this.startCli();
        });
    };

}

export default Cli;