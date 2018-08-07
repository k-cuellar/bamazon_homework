// Require mysql and inquirer packages
var mysql = require("mysql");
var inquirer = require("inquirer");

//Create database connection
var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 8889,
    user: "root",
    password: "",
    database: "bamazon"
});

// 

function listProducts () {
    console.log("Here's what we have in stock: ");
    connection.query("SELECT * FROM products", function(err, response) {
        if (err) throw err;
        for (var i = 0; i < response.length; i++) {
            console.log("| ID: " + response[i].item_id + " | " + response[i].product_name + " | " + response[i].price)
        }
        promptUser();
    })
};

function promptUser() {
    inquirer.prompt([{
        name: id,
        type: input,
        message: "What is the ID number of the product you'd like to buy?"
    }, {
        name: quantity,
        type: input,
        message: "How many would you like to buy?"
    }]).then(function(answer) {
        
    })
}

