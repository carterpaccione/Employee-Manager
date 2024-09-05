-- View Employees

SELECT
    e1.id,
    e1.first_name,
    e1.last_name,
    role.title,
    department.name AS department,
    role.salary,
    CONCAT(e2.first_name, ' ', e2.last_name) AS manager
FROM employee e1
JOIN role
    ON e1.role_id = role.id
JOIN department
    ON role.department = department.id
LEFT JOIN employee e2
    ON e1.manager_id = e2.id;

-- View Roles

SELECT
    role.id,
    role.title,
    role.salary,
    department.name AS department
FROM role
JOIN department
    ON role.department = department.id;

-- View Departments

SELECT * FROM department;