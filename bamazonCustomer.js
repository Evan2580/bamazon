var inquirer = require('inquirer');
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "2171EVan",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  itemsPrint();
});

function itemsPrint() {
  console.log("Here are the items available from the Warehouse!\n\n");
  console.log("ITEM ID | PRODUCT_NAME | DEPARTMENT NAME | PRICE | QUANTITY\n");
  connection.query("SELECT * FROM items", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      // Log all results of the SELECT statement
      console.log(res[i].item_id + "       |" + res[i].product_name + "       | " + res[i].department_name + '       | ' + res[i].price + '      | ' + res[i].stock_quantity);
    }

    initialInput();
  });

}

function initialInput() {
  inquirer.prompt([{
      type: 'input',
      name: 'bamazonId',
      message: 'What is the id of the product you would like to buy?'
    },
    {
      type: 'input',
      name: 'units',
      message: 'How many would you like to buy?'
    }

  ]).then(function (response) {

    checkQuantity(response.bamazonId, response.units)
  }).catch(function (err) {
    console.log(err);
  });
}

function checkQuantity(id, units) {
  connection.query(
    "SELECT * FROM items WHERE ?", {
      item_id: id
    },
    function (err, res) {

      handleTransaction(res[0].stock_quantity, units, id, res[0].price)
      // Call readProducts AFTER the DELETE completes
    }
  );

}

function handleTransaction(stock, units, id, price) {
  console.log(stock);
  if (stock > units) {
    var query = connection.query(
      "UPDATE items SET ? WHERE ?",
      [{
          stock_quantity: parseInt(stock - units),
        },
        {
          item_id: id
        }
      ],
      function (err, res) {
        totalCost(units,price);
        
        initialInput();
      }
    );
  } else {
    console.log("Quantity is not available!")
    initialInput();
  }
}

function totalCost(units, price) {
  console.log("Total Cost of all the units you bought is: " + units * price);

}
