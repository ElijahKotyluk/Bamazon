// Save required packages in a variable.
var mysql = require('mysql');
var inquirer = require('inquirer');

// Connect to Bamazon database.
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'Bamazon'
});

// Check for errors during connection.
connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected!');
});