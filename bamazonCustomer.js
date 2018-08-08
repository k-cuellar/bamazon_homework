// Require mysql and inquirer packages
var mysql = require("mysql");
var inquirer = require("inquirer");

// Create database connection
var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

// function to list whats in stock
function listProducts () {
    console.log("Here's what we have in stock: ");
    connection.query("SELECT * FROM products", function(err, response) {
        if (err) throw err;
        for (var i = 0; i < response.length; i++) {
            console.log("| ID: " + response[i].item_id + " | " + response[i].product_name + " | $" + response[i].price)
        }
        promptUser();
    })
};

// function used to prompt user what they want to buy
function promptUser() {
    // inquirer prompts
    inquirer.prompt([{
        name: "item_id",
        type: "input",
        message: "What is the ID number of the product you'd like to buy?"
    }, {
        name: "quantity",
        type: "input",
        message: "How many would you like to buy?"
    // "then" promise function to use answer
    }]).then(function(answer) {
        // query database for specific items using user answer
        connection.query("SELECT stock_quantity FROM products WHERE ?", {item_id: answer.item_id}, function(err, response){
            if (err) throw err;

            // makes sure they enter a valid item ID, if not it runs listProducts again
            if (response.length === 0) {
                console.log("INVALID ITEM ID. Please select a valid Item ID.");
                listProducts();

            // if input is valid item ID
            } else {
                // if the quantity the user wants is less than or equal to stock_quantity in Database
                if (answer.quantity <= response[0].stock_quantity) {
                    // notify user that item is in stock and order is placed
                    console.log("The product you requested is in stock! Placing order now.");

                    // create new query to update database
                    var updateQuery = "UPDATE products SET stock_quantity = " + (response[0].stock_quantity - answer.quantity) + " WHERE item_id = " + answer.item_id;

                    // update database with new stock quantity
                    connection.query(updateQuery, function(err, data){
                        if (err) throw err;
                        console.log('Your order has been placed! Your total is $' + (response[0].price * answer.quantity));
						console.log('Thank you for shopping with us!');
                        console.log("\n---------------------------------------------------------------------\n");
                        
                        connection.end();
                    })
                // if there is not enough quantity in Database, alert not enough in stock.    
                } else {
                    console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
					console.log('Please modify your order.');
					console.log("\n---------------------------------------------------------------------\n");

					listProducts();
                }
            }
        })
    })
}


// connect to database and run listProducts function
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as " + connection.threadId);
    listProducts();
})