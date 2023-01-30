INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Operations"),
       ("T & L"),
       ("Shipping");

INSERT INTO employee_role (title, salary, department_id)
VALUES ("Sales Manager", 150000, 1),
       ("Sales Lead", 75000, 1),
       ("Sales Representative", 40000, 1),
       ("Operations Manager", 45000, 2),
       ("Operations Lead", 40000, 2),
       ("Operations Team Member", 30000, 2),
       ("T & L Manager", 960000, 3),
       ("T & L Lead", 60000, 3),
       ("T & L Specialist", 50000, 3),
       ("Shipping Manager", 75000, 4),
       ("Shipping Supervisor", 45000, 4),
       ("Shipping Team Member", 40000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("David", "Lee", 1, NULL),
       ("John ", "Johnson", 2, 1),
       ("Kenneth", "Rogers", 3, 1),
       ("Phil", "Marquez", 4, NULL),
       ("Robert", "Schneider", 5, 2),
       ("John", "DeVine", 6, 2),
       ("Tony", "Macias", 7, NULL),
       ("Abel", "Hernandez", 8, 3),
       ("Jesse", "Barcarla", 9, 3),
       ("Elias", "Rodriguez", 10, NULL),
       ("Anthony", "Mills", 11, 4),
       ("Caleb", "LaVue", 12, 4);