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
    beginPrompt();
});

// Begin prompt for user when "node BamazonCustomer.js" command is run.
const beginPrompt = () => {

    inquirer.prompt([{

        type: 'confirm',
        name: 'confirm',
        message: 'Welcome to Bamazon! Would you like to view our inventory?',
        default: true

    }]).then((user) => {
        if (user.confirm === true) {
            inventory();
        } else {
            console.log('Thank you! Come back soon!');
        }
    });
}

const inventory = () => {

    // Create table and set column width.
    const table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'Qty'],
        colWidths: [10, 30, 30, 30, 30]
    });

    const listInventory = () => {
        // Query Bamazon database for (all) rows in Products table.
        connection.query("SELECT * FROM Products", (err, res) => {
            // Loop through Products table and push items to table array.
            for (let i = 0; i < res.length; i++) {

                let itemId = res[i].ItemID,
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
        });
    }

    const userPrompt = () => {
        // Ask user if they would like to purchase any products.
        inquirer.prompt([{

            type: 'confirm',
            name: 'confirm',
            message: 'Would you like to purchase any products?',
            default: true

        }]).then((user) => {
            if (user.continue === true) {
                selectionPrompt();
            } else {
                console.log('Thank you! Come back soon!');
            }
        });
    }
    // Allows user to make a selection of products they would like to order, and how much they would like to order.
    const selectPrompt = () => {

        inquirer.prompt([{

                type: 'input',
                name: 'inputId',
                message: 'Please enter the ID number of the item you would like to order.'
            },
            {
                type: 'input',
                name: 'inputNumber',
                message: 'How many units of this item would you like to order?'
            }
        ]).then((userPurchase) => {

            connection.query('SELECT * FROM Products WHERE ItemID=?', userPurchase.inputId, function (err, res) {

                for (let i = 0; i < res.length; i++) {

                    if (userPurchase.inputNumber > res[i].StockQuantity) {
                        console.log("===================================================");
                        console.log("Sorry! Not enough in stock. Please try again at a later date.");
                        console.log("===================================================");
                        beginPrompt();
                    } else {
                        console.log("===================================");
                        console.log("Looks like we have that in stock, so we can fulfill your order.");
                        console.log("===================================");
                        console.log("You've selected:");
                        console.log("----------------");
                        console.log("Item: " + res[i].ProductName);
                        console.log("Department: " + res[i].DepartmentName);
                        console.log("Price: " + res[i].Price);
                        console.log("Quantity: " + userPurchase.inputNumber);
                        console.log("----------------");
                        console.log("Total: " + res[i].Price * userPurchase.inputNumber);
                        console.log("===================================");

                        var newStock = (res[i].StockQuantity - userPurchase.inputNumber);
                        var purchaseId = (userPurchase.inputId);
                        //console.log(newStock);
                        confirmPrompt(newStock, purchaseId);
                    }
                }
            });
        });
    }


    const confirmPrompt = (newStock, purchaseId) => {

        inquirer.prompt([{

            type: 'confirm',
            name: 'confirmPurchase',
            message: 'Are you sure you want this item and quantity?',
            default: true

        }]).then((userConfirm) => {
            if (userConfirm.confirmPurchase === true) {

                connection.query('UPDATE products SET ? WHERE ?', [{
                        StockQuantity: newStock
                    },
                    {
                        ItemID: purchaseId
                    }
                ], (err, res) => {});

                console.log("=================================");
                console.log("Transaction completed! Thank you!");
                console.log("=================================");
                beginPrompt();
            } else {
                console.log("=================================");
                console.log("Not a problem! See you soon!");
                console.log("=================================");
                beginPrompt();
            }
        })
    }
    listInventory();
    selectPrompt();
}