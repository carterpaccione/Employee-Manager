DO $$
    DECLARE
    
    BEGIN
        
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

        INSERT INTO employee(first_name, last_name, role_id, manager_id)
        VALUES
            ('Alice', 'Johnson', 1, null),
            ('Bob', 'Smith', 2, null),
            ('Charlie', 'Brown', 3, null),
            ('David', 'White', 4, null);

        INSERT INTO employee(first_name, last_name, role_id, manager_id)
        VALUES
            ('TestFirst', 'TestLast', 1, 1);

RAISE NOTICE 'Seeds have been planted';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Seeds have not been planted %', SQLERRM;
        ROLLBACK;
END $$;