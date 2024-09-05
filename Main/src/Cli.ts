import inquirer from "inquirer";
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

import Employee from "./employees.js";
import Role from "./roles.js";
import Department from "./departments.js";

await connectToDb();

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

const queries = [
    `SELECT e1.id, e1.first_name, e1.last_name, role.title, department.name AS department, role.salary, CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM employee e1 JOIN role ON e1.role_id = role.id JOIN department ON role.department = department.id LEFT JOIN employee e2 ON e1.manager_id = e2.id;`,
    'SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department = department.id;',
    'SELECT department.id AS id, department.name AS name FROM department;',
]

class Cli {

    employees: Employee[] = [];

    roles: Role[] = [];

    departments: Department[] = [];

    constructor() {
        this.getEmployees();
        this.getRoles();
        this.getDepartments();
    }

    async getEmployees() {
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
            // this.employees = res.rows;
            this. employees = [];
            res.rows.forEach((employee: Employee) => {
                const update = new Employee(employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id);
                this.employees.push(update);
            });
            // console.log(this.employees);
        } catch (err) {
            console.error(err);
        }
    };

    async getRoles() {
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
            // this.roles = res.rows;
            this.roles = [];
            res.rows.forEach((role: Role) => {
                const update = new Role(role.id, role.title, role.salary, role.department);
                this.roles.push(update);
            });
            // console.log(this.roles);
        } catch (err) {
            console.error(err);
        }
    };

    async getDepartments() {
        try {
            const res: QueryResult = await new Promise((resolve, reject) => {
                pool.query(`SELECT * FROM department`, (err: Error, res: QueryResult) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
            // this.departments = res.rows;
            this.departments = [];
            res.rows.forEach((department: Department) => {
                const update = new Department(department.id, department.name);
                this.departments.push(update);
            });
            // console.log(this.departments);
        } catch (err) {
            console.error(err);
        }
    };

    async startCli(): Promise<void> {
        
        await this.getRoles();
        await this.getEmployees();
        await this.getDepartments();

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
                pool.query(`${queries[0]}`, (err: Error, res: QueryResult) => {
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
                name: 'first_name',
                message: addEmployeeQuestions[0],
            },
            {
                type: 'input',
                name: 'last_name',
                message: addEmployeeQuestions[1],
            },
            {
                type: 'list',
                name: 'role_id',
                message: addEmployeeQuestions[2],
                choices: this.roles.map(role => role.title),
            },
            {
                type: 'list',
                name: 'manager_id',
                message: addEmployeeQuestions[3],
                choices: ['None', ...this.employees.map(employee => employee.first_name)],
            }
        ])
        .then((answers: any) => {
            if(answers.manager_id === 'None') {
                answers.manager_id = null;
                answers.role_id = this.roles.findIndex(role => role.title === answers.role_id)+1;
                
                try {
                    pool.query(
                    `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                    VALUES
                    ('${answers.first_name}', '${answers.last_name}', ${answers.role_id}, ${answers.manager_id});`, 
                    (err: Error, res: QueryResult) => {
                        if (err) {
                            console.error(err);
                        } else if (res) {
                            console.log(`Employee ${answers.first_name} ${answers.last_name} added successfully!`)
                        }
                    });
                } catch(err) {
                    console.error(err);
                }
                this.startCli();
            } else {
                answers.role_id = this.roles.findIndex(role => role.title === answers.role_id)+1;
                answers.manager_id = this.employees.findIndex(employee => employee.first_name === answers.manager_id)+1;

               try{
                pool.query(
                    `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                    VALUES
                    ('${answers.first_name}', '${answers.last_name}', ${answers.role_id}, ${answers.manager_id})`, 
                    (err: Error, res: QueryResult) => {
                        if (err) {
                            console.error(err);
                        } else if (res) {
                            console.log(`Employee ${answers.first_name} ${answers.last_name} added successfully!`)
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
                choices: [...this.employees.map(employee => employee.first_name)],
            },
            {
                type: 'list',
                name: 'role',
                message: updateEmployeeRoleQuestions[1],
                choices: [...this.roles.map(role => role.title)],
            }
        ])
        .then((answers: any) => {
            const roleIndex = this.roles.findIndex(role => role.title === answers.role)+1;
            pool.query(`UPDATE employee SET role_id = ${roleIndex} WHERE first_name = '${answers.employeeName}';`, 
                (err: Error, res: QueryResult) => {
                    if (err) {
                        console.error(err);
                    } else if (res) {
                        console.log(`Employee ${answers.employeeName}'s role has been updated to ${answers.role}!`)
                    }
                });
            this.startCli();
        });
    };

    async viewAllRoles(): Promise<void> {
        try {
            const res: QueryResult = await new Promise((resolve, reject) => {
                pool.query(`${queries[1]}`, (err: Error, res: QueryResult) => {
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
                type: 'list',
                name: 'roleDepartment',
                message: addRoleQuestions[2],
                choices: [...this.departments.map(department => department.name)],
            }
        ])
        .then((answers: any) => {

            const departmentIndex = this.departments.findIndex(department => department.name === answers.roleDepartment)+1;
            
            pool.query(`INSERT INTO role (title, salary, department) VALUES ('${answers.roleName}', ${answers.roleSalary}, ${departmentIndex});`, 
                (err: Error, res: QueryResult) => {
                    if (err) {
                        console.error(err);
                    } else if (res) {
                        console.log(`Role ${answers.roleName} added successfully!`);
                    }
                });
            this.startCli();
        });
    };
    
    viewAllDepartments(): void {
        pool.query(`${queries[2]}`, (err: Error, res: QueryResult) => {
            if (err) {
                console.error(err);
            } else if (res) {
                console.table(res.rows);
            }
            this.startCli();
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

            pool.query(`INSERT INTO department (name) VALUES ('${answers.departmentName}');`, 
                (err: Error, res: QueryResult) => {
                    if (err) {
                        console.error(err);
                    } else if (res) {
                        console.log(`Department ${answers.departmentName} added successfully!`);
                    }
                });
            this.startCli();
        });
    };

}

export default Cli;