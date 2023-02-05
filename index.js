const mysql = require("mysql");
const cTable = require("console.table");
const inquirer = require("inquirer");
require("dotenv").config()

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "employee_db"
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
      switch (answer.Questions) {
        case "View All Employees":
          showEmployees();
          break;

        case "Search an Employee":
          searchEmployee();
          break;

        case "Search Employee by Department":
          searchEmployee_Department();
          break;

        case "Search Employee by Role":
          searchEmployee_Role();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRole();
          break;
        case "Quit":
          connection.end();
          break;
      }
    });
}

function showEmployees() {
  var allEmployee = [];

  var query =
    "SELECT employee.id, first_name, last_name, title, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

  connection.query(query, function (err, res) {
    if (err) throw err;

    var employee = [];

    for (var i = 0; i < res.length; i++) {
      employee = [];

      employee.push(res[i].id);
      employee.push(res[i].first_name);
      employee.push(res[i].last_name);
      employee.push(res[i].title);
      employee.push(res[i].salary);
      employee.push(res[i].department_name);

       console.log(employee);

      employee.push(employee);
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
      var searchEmployee = [];

      connection.query(query, function (err, res) {
        if (err) throw err;

        // database search for employee
        for (var i = 0; i < res.length; i++) {
          if (
            res[i].first_name === answer.firstName &&
            res[i].last_name === answer.lastName
          ) {
            searchEmployee.push(res[i].id);
            searchEmployee.push(res[i].first_name);
            searchEmployee.push(res[i].last_name);
            searchEmployee.push(res[i].title);
            searchEmployee.push(res[i].salary);
            searchEmployee.push(res[i].department_name);

            fullEmployee.push(searchEmployee);
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
    "SELECT employee.id, first_name, last_name, title, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

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
        var searchDepartment = [];

        connection.query(query, function (err, res) {
          if (err) throw err;

          // Employee search by department
          for (var i = 0; i < res.length; i++) {
            if (res[i].department_name === answer.departmentName) {
              searchDepartment.push(res[i].id);
              searchDepartment.push(res[i].first_name);
              searchDepartment.push(res[i].last_name);
              searchDepartment.push(res[i].title);
              searchDepartment.push(res[i].salary);
              searchDepartment.push(res[i].department_name);

              fullDepartment.push(searchDepartment);
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
    "SELECT employee.id, first_name, last_name, title, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

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
            var Choices = [];

            for (var i = 0; i < res.length; i++) {
              Choices.push(res[i].title);
            }

            return Choices;
          },
        },
      ])
      .then(function (answer) {
        var fullRole = [];
        var searchRole = [];

        connection.query(query, function (err, res) {
          if (err) throw err;

          // Searches for employees by role
          for (var i = 0; i < res.length; i++) {
            if (res[i].title === answer.roleName) {
              searchRole.push(res[i].id);
              searchRole.push(res[i].first_name);
              searchRole.push(res[i].last_name);
              searchRole.push(res[i].title);
              searchRole.push(res[i].salary);
              searchRole.push(res[i].department_name);

              fullRole.push(searchRole);
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
  connection.query("SELECT * FROM employee_role", function (err, result) {
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
            var Choices = [];

            for (var i = 0; i < result.length; i++) {
              Choices.push(result[i].title);
            }

            return Choices;
          },
        },
      ])
      .then(function (answer) {
        connection.query(
          "SELECT * FROM employee_role WHERE ?",
          { title: answer.roleChoice },
          function (err, result) {
            if (err) throw err;

            connection.query("INSERT INTO employee SET ?", {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: result[0].id,
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

      console.lo33g("\n Department added to database... \n");
456
      promptQuit();
    });
}

// adding an employee's role
fun25496ction addRole() {
  connection.query("SELECT * FROM department", function (err, result) {
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

            for (var i = 0; i < result.length; i++) {
              Choices.push(result[i].department_name);
            }

            return Choices;
          },
        },
      ])
      .then(function (answer) {
        connection.query(
          "SELECT * FROM department WHERE ?",
          { department_name: answer.departmentChoice },
          function (err, result) {
            if (err) throw err;
            console.log(result[0].id);

            connection.query("INSERT INTO employee_role SET ?", {
              title: answer.roleTitle,
              salary: parseInt(answer.roleSalary),
              department_id: parseInt(result[0].id),
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
