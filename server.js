const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employees"
});


con.connect((err) => {
    if (err) throw err;
    getUserInput();
});
console.log("Welcome to the Employee DB!\n Use the list below to get started.")

function getUserInput() {
    inquirer.prompt(
        [
            {
                name: "startOptions",
                type: "list",
                message: "Make a selection: ",
                choices: [
                    "Add Data",
                    "View Data",
                    "Update Data",
                    "Delete Data",
                    "Exit"
                ]
            }
        ]).then((answer) => {
            if (answer.startOptions === "View Data") {
                viewData();
            }
            else if (answer.startOptions === "Add Data") {
                addData();
            }
            else if (answer.startOptions === "Update Data") {
                updateData();
            }
            else if (answer.startOptions === "Delete Data") {
                deleteData();
            }
            else if (answer.startOptions === "Exit"){
                process.exit(1);
            }
        })
}

function addData() {
    inquirer.prompt([
        {
            name: "add",
            type: "list",
            message: "Select what you want to ADD: ",
            choices: [
                "Add Employee",
                "Add Role",
                "Add Department",
                "Exit"
            ]
        }
    ]).then(function (answer) {
        if (answer.add === "Add Employee") {
            inquirer.prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "First Name: "
                },

                {
                    name: "last_name",
                    type: "input",
                    message: "Last Name: "
                },
                {
                    name: "role_id",
                    type: "number",
                    message: "Role ID #: "
                }
            ]).then(function (answer) {
                con.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: answer.role_id
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(`Added employee, ${answer.first_name} ${answer.last_name}`);
                        getUserInput();
                    }
                )
            })
        } else if (answer.add === "Add Role") {
            inquirer.prompt([
                {
                    name: "title",
                    type: "input",
                    message: "Enter Title"
                },
                {
                    name: "salary",
                    type: "number",
                    message: "Enter Salary"
                },
                {
                    name: "department_id",
                    type: "number",
                    message: "Enter Department"
                },
            ]).then(function (answer) {
                con.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.department_id
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(`Added role, ${answer.title} at salary ${answer.salary}`);
                        getUserInput();
                    }
                )
            });
        }
        else if (answer.add === "Add Department") {
            inquirer.prompt([
                {
                    name: "name",
                    type: "input",
                    message: "Enter Department Name: "
                },
            ]).then(function (answer) {
                con.query(
                    "INSERT INTO department SET ?",
                    {
                        name: answer.name,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(`Added department, ${answer.name}`);
                        getUserInput();
                        
                    }
                )
            });
        }
        else if (answer.add === "Exit"){
            getUserInput();
        }
    });
}


function viewData() {
    inquirer.prompt([
        {
            name: "view",
            type: "list",
            message: "Select the data you want to VIEW: ",
            choices: [
                "View All Employees",
                "View All Roles",
                "View All Departments",
                "View All Employees, Roles, Departments",
                "Exit"
            ]
        }
    ]).then(function (answer) {
        switch (answer.view) {
            case "View All Employees":
                con.query("SELECT * FROM employee", function (err, result) {
                    console.table(result);
                    getUserInput();
                });
                break;
            case "View All Roles":
                con.query("SELECT * FROM role", function (err, result) {
                    console.table(result);
                    getUserInput();
                });
                break;
            case "View All Departments":
                con.query("SELECT * FROM department", function (err, result) {
                    console.table(result);
                    getUserInput();
                });
                break;
            case "View All Employees, Roles, Departments":
                con.query("SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name FROM employee e INNER JOIN role r on e.role_id = r.id INNER JOIN department d on r.department_id = d.id ORDER BY d.name;", function (err, result) {
                    console.table(result);
                    getUserInput();
                })
                break;
            case "Exit":
                getUserInput();
            break;
        }
    });
}

function updateData(){
    inquirer.prompt([
        {
            name: "update",
            type: "list",
            message: "Select the data you want to UPDATE: ",
            choices: [
                "Update Employee Role"
            ]
        },
    ]).then(function(answer){
        if (answer.update === "Update Employee Role"){
            inquirer.prompt([
                {
                    name: "role_id",
                    type: "number",
                    message: "Enter the role id: "
                 },
                {
                   name: "id",
                   type: "number",
                   message: "Enter the employee id: "
                }
            ]).then(function(answer){
                con.query("UPDATE employee SET role_id = ? WHERE ?;", [
                    {
                        role_id: answer.role_id
                    },
                    {
                        id: answer.id
                    }
                ],
                function(error){
                    if (error) throw error;
                    console.log(`Updated employee with id ${answer.id} to role ${answer.role_id}`)
                    getUserInput();
                });
            });
        }
    });
}


function deleteData(){
    inquirer.prompt([
        {
            name: "delete",
            type: "list",
            message: "Select the data to DELETE: ",
            choices: [
                "Delete Employee",
                "Delete Role",
                "Delete Department"
            ]
        }
    ]).then(function(answer){
        if (answer.delete === "Delete Employee"){
            inquirer.prompt([
                {
                    name: "id",
                    type: "number",
                    message: "Enter Employee ID #: "
                },
            ]).then(function(answer){
                con.query("DELETE FROM employee WHERE ? ",[
                    {id: answer.id}
                ], function(error){
                    if (error) throw error;
                    console.log(`Employee with id ${answer.id} deleted`);
                    getUserInput();
                }
                )
            });
        }
        else if (answer.delete === "Delete Role"){
            inquirer.prompt([
                {
                    name: "id",
                    type: "number",
                    message: "Enter Role ID #: "
                },
            ]).then(function(answer){
                con.query("DELETE FROM role WHERE ? ",[
                    {id: answer.id}
                ], function(error){
                    if (error) throw error;
                    console.log(`Role with id ${answer.id} deleted`);
                    getUserInput();
                });
            });
        }
        else if (answer.delete === "Delete Department"){
            inquirer.prompt([
                {
                    name: "id",
                    type: "number",
                    message: "Enter Department ID #: "
                },
            ]).then(function(answer){
                con.query("DELETE FROM department WHERE ? ",[
                    {id: answer.id}
                ], function(error){
                    if (error) throw error;
                    console.log(`Employee with id ${answer.id} deleted`);
                    getUserInput();
                }
                )
            });
        }
    });
}