INSERT INTO department(name)
VALUES
    ('Engineering'), 
    ('Finance'), 
    ('Legal'), 
    ('Sales');

INSERT INTO role(title, salary, department)
VALUES
    ('Software Engineer', 100000, 1),
    ('Accountant', 80000, 2),
    ('Lawyer', 120000, 3),
    ('Salesperson', 60000, 4);

INSERT INTO employee(first_name, last_name, role_id)
VALUES
    ('Alice', 'Johnson', 1),
    ('Bob', 'Smith', 2),
    ('Charlie', 'Brown', 3),
    ('David', 'White', 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ('TestFirst', 'TestLast', 1, 1);