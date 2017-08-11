var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "Bamazon"
});


connection.connect(function(err) {
 if (err) throw err;
 console.log("Connected!");
 customerOrder();
});

var table = new Table({
    head: ['ID', 'Product','Price ($)', 'QTY'],
});

// Array of all the IDs to be used for validation later.
var idArr = [];

// Query Database for the relevant information.
connection.query('SELECT * FROM products', function (error, res, fields) {
  if (error) throw error;
  for (var i = 0; i < res.length; i++) {
    var tRow = [];
    tRow.push(res[i].item_id,res[i].product_name,res[i].price,res[i].stock_quantity);
    table.push(tRow);
    idArr.push(res[i].item_id);
  }
  // Push new rows to table.
  console.log(table.toString());
  customerOrder(idArr);
});


 // function which prompts the user for what action they should take
function customerOrder() {
   inquirer.prompt([
     {
       name: "item-id",
       type: "input",
       message: "What productId would you like to buy?"
     },
     {
       name:"stock_quantity",
       type:"input",
       message:"Enter the Quantity that you wish to purchase: ",
       default: 1
     }
     ]).then(function(choice){
         var pid = parseInt(choice.item_id);
         var sq = parseInt(choice.stock_quantity);

         // Check that both values are Numeric.
         if(pid || sq === NaN){
           console.log("\nPlease enter Numeric values for ID and QTY.\n")
           customerOrder(array);
         }else{
           // Check if customer entered a non-existant ID number.
           if(array.indexOf(pid) === -1){
             console.log("\nIt seems like that product doesn't exist. Please enter a valid ID.\n")
            customerOrder(array);
           }else{
             //checkQty(pid, sq, array);
             console.log("Congrats! we have what you want");
           }
       }

   });
}
