// Save required packages in a variable.
const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table');

// Connect to Bamazon database.
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'Bamazon'
});

// Check for errors during connection.
connection.connect((err) => {
    if (err) throw err;

    // Console log thread id if connection is successful.
    console.log('Connected as: ' + connection.threadId);

    // Run if connection is successful.
    managerPrompt();
});

// Begin prompt for user when "node BamazonManager.js" command is run.
const managerPrompt = () => {

    inquirer.prompt([{

        type: 'list',
        name: 'actionList',
        message: 'What would you like to review manager? Enter a number to choose an option.',
        choices: ['1: View Products', '2: View Low Stock Items', '3: Order New Inventory', '4: Order New Product']
    }]).then((user) => {
        if (user.actionList == '1: View Products') {
            inventoryView();
        } else if (user.actionList == '2: View Low Stock Items') {
            lowInventory();
        } else if (user.actionList == '3: Order New Inventory') {
            addInventory();
        } else if (user.actionList == '4: Order New Product') {
            addProduct();
        } else {
            console.log('That was not a valid choice, please try again.');
            managerPrompt();
        }
    });
}

const inventoryView = () => {

    var table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
        coldWidths: [10, 30, 30, 30, 30]
    });

    const listInventory = () => {

        connection.query('SELECT * FROM Products', (err, res) => {
            for (let i = 0; i < res.length; i++) {
                var itemId = res[i].ItemID,
                    productName = res[i].ProductName,
                    departmentName = res[i].DepartmentName,
                    price = res[i].Price,
                    quantity = res[i].StockQuantity

                table.push(
                    [itemId, productName, departmentName, price, quantity]
                );
            }
            console.log("");
            console.log("====================================================== Current Bamazon Inventory ======================================================");
            console.log("");
            console.log(table.toString());
            console.log("");
            managerPrompt();
        });
    }
    listInventory();
}

const lowInventory = () => {

    var table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
        colWidths: [10, 30, 30, 30, 30]
    });

    const listLowInventory = () => {

        connection.query('SELECT * FROM Products', (err, res) => {

            for (let i = 0; i < res.length; i++) {
                if (res[i].StockQuantity <= 5) {
                    var itemId = res[i].ItemID,
                        productName = res[i].ProductName,
                        departmentName = res[i].DepartmentName,
                        price = res[i].Price,
                        quantity = res[i].StockQuantity

                    table.push(
                        [itemId, productName, departmentName, price, quantity]
                    );
                }
            }
            console.log("");
            console.log("============================================= Low Bamazon Inventory (5 or Less in Stock) ===============================================");
            console.log("");
            console.log(table.toString());
            console.log("");
            managerPrompt();
        });
    }
    listLowInventory();
}

const addInventory = () => {

    inquirer.prompt([{
            type: 'input',
            name: 'inputId',
            message: 'Please enter the ID of the item you would like to order.'
        },
        {
            type: 'input',
            name: 'inputNumber',
            message: 'How many would you like to order?'
        }
    ]).then((managerAdd) => {

        connection.query('Update Products SET ? WHERE ?', [{

                StockQuantity: managerAdd.inputNumber
            },
            {
                ItemID: managerAdd.inputId
            }
        ], (err, res) => {});
        managerPrompt();
    });
}


const addProduct = () => {

    inquirer.prompt([{

            type: 'input',
            name: 'inputName',
            message: 'Please enter the name of the new product for sale.'
        },
        {
            type: 'input',
            name: 'inputDepartment',
            message: 'Which department does this product belong in?'
        },
        {
            type: 'input',
            name: 'inputPrice',
            message: 'What is the selling price of the new product?'
        },
        {
            type: 'input',
            name: 'inputQty',
            message: 'How many are in stock?'
        }
    ]).then((managerNew) => {

        connection.query('INSERT INTO Products SET ?', {
            ProductName: managerNew.inputName,
            DepartmentName: managerNew.inputDepartment,
            Price: managerNew.inputPrice,
            StockQuantity: managerNew.inputQty
        }, (err, res) => {});
        managerPrompt();
    })
}