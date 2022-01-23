
const inquirer = require("inquirer");
const displayData = require("./query");

function allQuestions() {
    return inquirer.prompt([
        {
            type: 'checkbox',
            name: 'allQuestions',
            message: 'What would you like to do?',
            choices: ['View all Departments', 'View all Employees', 'View all Roles', 'Add Department', 'Add Employee','Add Role', 'Update Employee Role']
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
            }  else if (allQuestions == 'Add Role') {
                addRole();
            }
        })

};


function viewAllDepartment() {
    displayData(`SELECT * FROM department`);
};

function viewAllEmployees() {
    displayData(`SELECT
    employee.employee_id,
    employee.first_name,
    employee.last_name,
    role.title AS title,
    role.salary AS salary,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.role_id
    LEFT JOIN department ON role.department_id = department.department_id
    LEFT JOIN employee manager ON employee.manager_id = manager.employee_id`);
};

function viewAllRoles() {
    displayData(`SELECT 
    role_id,
    title, 
    department.name AS department,
    salary
    FROM role
    LEFT JOIN department
    ON role.department_id = department.department_id`)
};

function addDepartment() {
    return inquirer.prompt([
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
    ])
};

function addRole() {
    return inquirer.prompt([
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
            message: 'Which department does this role belong to?',
            validate: addRoleDepartmentInput => {
                if (addRoleDepartmentInput) {
                    return true;
                } else {
                    console.log('Please give a department for this role!');
                    return false;
                }
            }
        }
    ])
};


module.exports = allQuestions;

