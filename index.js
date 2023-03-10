const mysql = require("mysql");
const cTable = require("console.table");
const inquirer = require("inquirer");
require("dotenv").config();

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);

  // Starts the app
  runApp();
});

function runApp() {
  // Question prompts
  inquirer
    .prompt({
      name: "Questions",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Search an Employee",
        "Search Employee by Department",
        "Search Employee by Role",
        "Add Employee",
        "Remove Employee",
        "Add Department",
        "Add Role",
        "Quit",
      ],
    })
    .then(function (answer) {
      if (answer.Questions == "View All Employees") {
        showEmployees();
      }

      if (answer.Questions == "Search an Employee") searchEmployee();

      if (answer.Questions == "Search Employee by Department")
        searchEmployee_Department();

      if (answer.Questions == "Search Employee by Role") searchEmployee_Role();

      if (answer.Questions == "Add Employee") addEmployee();

      if (answer.Questions == "Remove Employee") removeEmployee();

      if (answer.Questions == "Add Department") addDepartment();

      if (answer.Questions == "Add Role") addRole();

      if (answer.Questions == "Quit") connection.end();
    });
}

function showEmployees() {
  var allEmployee = [];

  var query =
    "SELECT employee.id, first_name, last_name, title, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

  connection.query(query, function (err, res) {
    if (err) throw err;


    for (var i = 0; i < res.length; i++) {
      employee = res[i];


      allEmployee.push(employee);
    }

    console.log("\n\n\n");
    console.table(
      ["ID", "First Name", "Last Name", "Role", "Salary", "Department"],
      allEmployee
    );
    console.log("\n\n\n");

    promptQuit();
  });
}

function searchEmployee() {
  var query =
    "SELECT employee.id, first_name, last_name, title, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's First Name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's Last Name?",
      },
    ])
    .then(function (answer) {
      var fullEmployee = [];
  
      connection.query(query, function (err, res) {
        if (err) throw err;

        // database search for employee
        for (var i = 0; i < res.length; i++) {
          if (
            res[i].first_name === answer.firstName &&
            res[i].last_name === answer.lastName
          ) {

            fullEmployee.push(res[i]);
          }
        }

        console.log("\n\n\n");
        console.table(
          ["ID", "First Name", "Last Name", "Role", "Salary", "Department"],
          fullEmployee
        );
        console.log("\n\n\n");

        promptQuit();
      });
    });
}

// Employee search by department
function searchEmployee_Department() {
  var query =
    `SELECT employee.id, 
    first_name, 
    last_name, 
    title,
    salary, 
    
    department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)`;

  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "departmentName",
          type: "list",
          message: "What is the department you would like to view?",
          choices: function () {
            var Choices = [];

            for (var i = 0; i < res.length; i++) {
              Choices.push(res[i].department_name);
            }

            return Choices;
          },
        },
      ])
      .then(function (answer) {
        var fullDepartment = [];

        connection.query(query, function (err, res) {
          if (err) throw err;

          // Employee search by department
          for (var i = 0; i < res.length; i++) {
            if (res[i].department_name === answer.departmentName) {
        
              fullDepartment.push(res[i]);
            }
          }

          console.log("\n\n\n");
          console.table(
            ["ID", "First Name", "Last Name", "Role", "Salary", "Department"],
            fullDepartment
          );
          console.log("\n\n\n");

          promptQuit();
        });
      });
  });
}

// Employee search by role
function searchEmployee_Role() {
  var query =
    `SELECT employee.id, 
     first_name,
     last_name, 
     title,
     salary,
    
     department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)`;

  connection.query("SELECT * FROM employee_role", function (err, res) {
    if (err) throw err;

    console.log(res);

    inquirer
      .prompt([
        {
          name: "roleName",
          type: "rawlist",
          message: "What is the role you would like to view?",
          choices: function () {
            var choices = [];

             choices = res.map(role => {

            return role.title
            })

            return choices
          }
        },
      ])
      .then(function (answer) {
        var fullRole = [];

        connection.query(query, function (err, res) {
          if (err) throw err;

          // Searches for employees by role
          for (var i = 0; i < res.length; i++) {
            if (res[i].title === answer.roleName) {

              fullRole.push(res[i]);
            }
          }

          console.log("\n\n\n");
          console.table(
            ["ID", "First Name", "Last Name", "Role", "Salary", "Department"],
            fullRole
          );
          console.log("\n\n\n");

          promptQuit();
        });
      });
  });
}

// to add an employee to the database
function addEmployee() {
  connection.query("SELECT * FROM employee_role", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "Enter the employee's First Name:",
        },
        {
          name: "lastName",
          type: "input",
          message: "Enter the employee's Last Name:",
        },
        {
          name: "roleChoice",
          type: "rawlist",
          message: "Enter the employee's role",
          choices: function () {
           
              var choices = [];

              choices = res.map(role => {
 
             return role.title
             })
 
             return choices
          },
        },
      ])
      .then(function (answer) {
        connection.query(
          "SELECT * FROM employee_role WHERE ?",
          { title: answer.roleChoice },
          function (err, res) {
            if (err) throw err;

            connection.query("INSERT INTO employee SET ?", {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: res[0].id,
            });

            console.log("\n Employee added to database... \n");
          }
        );

        promptQuit();
      });
  });
}

// deletes an employee from the database
function removeEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the Employee's First Name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the Employee's Last Name?",
      },
    ])
    .then(function (answer) {
      connection.query(
        "DELETE FROM employee WHERE first_name = ? and last_name = ?",
        [answer.firstName, answer.lastName],
        function (err) {
          if (err) throw err;

          console.log(
            `\n ${answer.firstName} ${answer.lastName} has been deleted from the database... \n`
          );
          promptQuit();
        }
      );
    });
}

// adding the employee's department
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "addDepartment",
      message: "Which department?",
    })
    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        { department_name: answer.addDepartment },
        function (err) {
          if (err) throw err;
        }
      );

      console.log("\n Department added to database... \n");

      promptQuit();
    });
}

// adding an employee's role
function addRole() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "roleTitle",
          type: "input",
          message: "Enter the title for this role",
        },
        {
          name: "roleSalary",
          type: "input",
          message: "Enter the salary for this role",
        },
        {
          name: "departmentChoice",
          type: "rawlist",
          message: "Choose a department associated with this role",
          choices: function () {
            var Choices = [];

            for (var i = 0; i < res.length; i++) {
              Choices.push(res[i].department_name);
            }

            return Choices;
          },
        },
      ])
      .then(function (answer) {
        connection.query(
          "SELECT * FROM department WHERE ?",
          { department_name: answer.departmentChoice },
          function (err, res) {
            if (err) throw err;
            console.log(res[0].id);

            connection.query("INSERT INTO employee_role SET ?", {
              title: answer.roleTitle,
              salary: parseInt(answer.roleSalary),
              department_id: parseInt(res[0].id),
            });

            console.log("\n Role has been added to database... \n");
          }
        );

        promptQuit();
      });
  });
}

// option for the user to quit or restart the application
function promptQuit() {
  inquirer
    .prompt({
      type: "list",
      name: "promptQuit",
      message: "Would you like to quit or start over?",
      choices: ["start over", "Quit"],
    })
    .then(function (answer) {
      if (answer.promptQuit === "start over") {
        runApp();
      } else {
        connection.end();
      }
    });
}
