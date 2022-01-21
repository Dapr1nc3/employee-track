INSERT INTO department (name)
VALUES 
    ('Heros'),
    ('Villains'),
    ('Good'),
    ('Bad');

    INSERT INTO role (department_id, title, salary)
    VALUES 
    (4, 'Bad Guy', '10.00'),
    (1, 'Spiderman', '25.00'),
    (3, 'Cop', '10.00'),
    (2, 'Joker', '50.00');

    INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES 
    ('The', 'Joker', 4, NULL),
    ('Robber', '1', 1, 1);
    