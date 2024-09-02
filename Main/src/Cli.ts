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
        new Employee ('Alice', 'Johnson', 1),
        new Employee ('Bob', 'Smith', 2),
        new Employee ('Charlie', 'Brown', 3),
        new Employee ('David', 'White', 4)
    ];

    roles: Role[] = [
        new Role('Software Engineer', 100000, 1), 
        new Role('Accountant', 80000, 2), 
        new Role('Lawyer', 120000, 3), 
        new Role('Salesperson', 60000, 4)
    ];
    departments: Department[] = [
        new Department('Engineering'),
        new Department('Finance'), 
        new Department('Legal'), 
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

    async viewAllEmployees(): Promise<void> {
        try {
            const res: QueryResult = await new Promise((resolve, reject) => {
                pool.query('SELECT * FROM employee', (err: Error, res: QueryResult) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
            console.table(res.rows);
        } catch (err) {
            console.error(err);
        }
        this.startCli();
    };

    async addEmployee(): Promise<void>{
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
                choices: ['None', ...this.employees.map(employee => employee.firstName)],
            }
        ])
        .then((answers: any) => {
            if(answers.manager === 'None') {
                answers.manager = null;
                answers.role = this.roles.findIndex(role => role.name === answers.role)+1;
                const employee = new Employee(answers.firstName, answers.lastName, answers.role, answers.manager);
                this.employees.push(employee);
                
                try {
                    pool.query(
                    `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                    VALUES
                    ('${employee.firstName}', '${employee.lastName}', ${employee.role}, ${employee.manager});`, 
                    (err: Error, res: QueryResult) => {
                        if (err) {
                            console.error(err);
                        } else if (res) {
                            console.log(`Employee ${employee.firstName} ${employee.lastName} added successfully!`)
                        }
                    });
                } catch(err) {
                    console.error(err);
                }
                this.startCli();
            } else {
                answers.role = this.roles.findIndex(role => role.name === answers.role)+1;
                answers.manager = this.employees.findIndex(employee => employee.firstName === answers.manager)+1;
                const employee = new Employee(answers.firstName, answers.lastName, answers.role, answers.manager);
                this.employees.push(employee);

               try{
                pool.query(
                    `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                    VALUES
                    ('${employee.firstName}', '${employee.lastName}', ${employee.role}, ${employee.manager})`, 
                    (err: Error, res: QueryResult) => {
                        if (err) {
                            console.error(err);
                        } else if (res) {
                            console.log(`Employee ${employee.firstName} ${employee.lastName} added successfully!`)
                        }
                    });
                } catch(err) {
                console.log(err);
                }
                this.startCli();
            }
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

    async viewAllRoles(): Promise<void> {
        try {
            const res: QueryResult = await new Promise((resolve, reject) => {
                pool.query('SELECT * FROM role', (err: Error, res: QueryResult) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
            console.table(res.rows);
        } catch (err) {
            console.error(err);
        }
        this.startCli();
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