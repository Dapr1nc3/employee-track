
const inquirer = require("inquirer");



function allQuestions() {
    return inquirer.prompt([
        {
            type: 'checkbox',
            name: 'allQuestions',
            message: 'What would you like to do?',
            choices: ['View all Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
        }
    ])
};

allQuestions();