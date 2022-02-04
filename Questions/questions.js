
const inquirer = require("inquirer");
const { parse } = require("path/posix");
const Connection = require("../db/connection");
const displayData = require("./query");

function allQuestions() {
    return inquirer.prompt([
        {
            type: 'checkbox',
            name: 'allQuestions',
            message: 'What would you like to do?',
            choices: ['View all Departments', 'View all Employees', 'View all Roles', 'Add Department', 'Add Employee', 'Add Role', 'Update Employee Role']
        }
    ])
        .then(({ allQuestions }) => {
            if (allQuestions == 'View all Departments') {
                viewAllDepartment();
            } else if (allQuestions == 'View all Employees') {
                viewAllEmployees();
            } else if (allQuestions == 'View all Roles') {
                viewAllRoles();
            } else if (allQuestions == 'Add Department') {
                addDepartment();
            } else if (allQuestions == 'Add Role') {
                addRole();
            } else if (allQuestions == 'Add Employee') {
                addEmployee();
            } else if (allQuestions == 'Update Employee Role') {
                updateEmployee();
            }
        })

};


function viewAllDepartment() {
    const sql = `SELECT * FROM department`;
    Connection.query(sql, (err, rows) => {
        if (err)
            throw err;
        console.table(rows);
        allQuestions();
    })
    // allQuestions();
};

function viewAllEmployees() {
    const sql = `SELECT
    employee.employee_id,
    employee.first_name,
    employee.last_name,
    role.title AS title,
    role.salary AS salary,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.role_id
    LEFT JOIN department ON role.department_id = department.department_id
    LEFT JOIN employee manager ON employee.manager_id = manager.employee_id`;
    Connection.query(sql, (err, rows) => {
        if (err)
            throw err;
        console.table(rows);
        allQuestions();
    })
    // allQuestions();
};

function viewAllRoles() {
    const sql = `SELECT 
    role_id,
    title, 
    department.name AS department,
    salary
    FROM role
    LEFT JOIN department
    ON role.department_id = department.department_id`;
    Connection.query(sql, (err, rows) => {
        if (err)
            throw err;
        console.table(rows);
        allQuestions();
    })
    // allQuestions();
};

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'What is the name of the department?',
            validate: addDepartmentInput => {
                if (addDepartmentInput) {
                    return true;
                } else {
                    console.log('Please give this department a name!');
                    return false;
                }
            }
        }
    ]).then(userAnswer => {
        const sql = `INSERT INTO department (name) VALUES(?)`;
        Connection.query(sql, userAnswer.addDepartment, (err, rows) => {
            if (err) throw err;
            console.log('Your department was added:)');
            allQuestions();
        });
    });
};

function addRole() {
    displayData(`SELECT * FROM department`);
    inquirer.prompt([
        {
            type: 'input',
            name: 'addRole',
            message: 'What is the name of the role?',
            validate: addroleInput => {
                if (addroleInput) {
                    return true;
                } else {
                    console.log('Please give this role a name!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'addRoleSalary',
            message: 'What is the salary of the role?',
            validate: addRoleSalaryInput => {
                if (addRoleSalaryInput) {
                    return true;
                } else {
                    console.log('Please give a salary for this role!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'addRoleDepartment',
            message: 'Select a department by number from the table above',
            validate: addRoleDepartmentInput => {
                if (addRoleDepartmentInput) {
                    return true;
                } else {
                    console.log('Please give a department for this role!');
                    return false;
                }
            }
        }
    ]).then(userAnswer => {
        const sql = `INSERT INTO role (title, salary, department_id ) VALUES(?,?,?)`;
        Connection.query(sql, [userAnswer.addRole, parseInt(userAnswer.addRoleSalary), parseInt(userAnswer.addRoleDepartment)], (err, rows) => {
            if (err) throw err;
            console.log('Your role was added:)');
            allQuestions();
        });
    });
};

function addEmployee() {
    const sql = `SELECT 
    role_id,
    title, 
    department.name AS department,
    salary
    FROM role
    LEFT JOIN department
    ON role.department_id = department.department_id`;
    Connection.query(sql, (err, rows) => {
        if (err)
            throw err;
        console.table(rows);
    })
    inquirer.prompt([
        {
            type: 'input',
            name: 'addEmployeeName',
            message: 'What is the first name of the employee?',
            validate: addroleInput => {
                if (addroleInput) {
                    return true;
                } else {
                    console.log('Please give this person a name!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'addEmployeeLast',
            message: 'What is the last name of the employee?',
            validate: addroleInput => {
                if (addroleInput) {
                    return true;
                } else {
                    console.log('Please give this person a last name!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'addEmployeeTitle',
            message: 'What is the id number of the role they are for?',
            validate: addRoleSalaryInput => {
                if (addRoleSalaryInput) {
                    return true;
                } else {
                    console.log('Please give a id number for this role!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'addRoleDepartment',
            message: 'What is your employees manager id?',
            validate: addRoleDepartmentInput => {
                if (addRoleDepartmentInput) {
                    return true;
                } else {
                    console.log('Please give a manager if for this employee!');
                    return false;
                }
            }
        }
    ]).then(userAnswer => {
        const sql = `INSERT INTO employee ( first_name, last_name, role_id, manager_id ) VALUES(?,?,?,?)`;
        Connection.query(sql, [userAnswer.addEmployeeName, userAnswer.addEmployeeLast, parseInt(userAnswer.addEmployeeTitle), parseInt(userAnswer.addRoleDepartment)], (err, rows) => {
            if (err) throw err;
            console.log('Your employee was added:)');
            allQuestions();
        });
    });
};

function updateEmployee() {
    const sql = `SELECT
    employee.employee_id,
    employee.first_name,
    employee.last_name,
    role.title AS title,
    role.salary AS salary,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.role_id
    LEFT JOIN department ON role.department_id = department.department_id
    LEFT JOIN employee manager ON employee.manager_id = manager.employee_id`;
    Connection.query(sql, (err, rows) => {
        if (err)
            throw err;
        console.table(rows);
    })
    const sql2 = `SELECT 
    role_id,
    title, 
    department.name AS department,
    salary
    FROM role
    LEFT JOIN department
    ON role.department_id = department.department_id`;
    Connection.query(sql2, (err, rows) => {
        if (err)
            throw err;
        console.table(rows);
    })
    inquirer.prompt([
        {
            type: 'input',
            name: 'updateEmployeeid',
            message: 'Which employee id would you like to update?',
            validate: addroleInput => {
                if (addroleInput) {
                    return true;
                } else {
                    console.log('Please give a response!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'updateEmployeeRole',
            message: 'Update the selected employee role',
            validate: addRoleSalaryInput => {
                if (addRoleSalaryInput) {
                    return true;
                } else {
                    console.log('Please give a response!');
                    return false;
                }
            }
        }
    ]).then(userAnswer => {
        const sql = `UPDATE employee SET employee_id = ? WHERE role_id = ?`;
        Connection.query(sql, [parseInt(userAnswer.updateEmployeeid), parseInt(userAnswer.updateEmployeeRole)], (err, rows) => {
            if (err) throw err;
            console.log('Your employee was updated:)');
            allQuestions();
        });
    });
};



module.exports = allQuestions;

