var inq = require("inquirer");
var db = require("./sqlConnect.js");
var Table = require("cli-table");


welcome();


function welcome(){

  console.log(
`
***********************************************************
                  WELCOME TO bAMAZON!
        Here is a list of our current Merchandise.
***********************************************************

`
);

  // Create new Table Object.
  var table = new Table({
      head: ['ID', 'Product','Price ($)', 'QTY'],
  });


  var id = [];

  // Query Database for the relevant information.
  db.query('SELECT * FROM products', function (error, res, fields) {
    if (error) throw error;
    for (var i = 0; i < res.length; i++) {
      var tRow = [];
      tRow.push(res[i].item_id,res[i].product_name,res[i].price,res[i].stock_quantity);
      table.push(tRow);
      id.push(res[i].item_id);
    }
    // Push new rows to table.
    console.log(table.toString());
    customerOrder(id);
  });

}


// Grab Customer Input
function customerOrder(array){
  inq.prompt([
    {
      name:"productID",
      type:"input",
      message:"Enter the ID number of the product you wish to purchase: ",
    },
    {
      name:"productQTY",
      type:"input",
      message:"Enter the Quantity that you wish to purchase: ",
      default: 1,
    }
    ]).then(function(choice){
        var pid = parseInt(choice.productID);
        var pq = parseInt(choice.productQTY);

        // Check that both values are Numeric.
        if(isNaN(pid) || isNaN(pq)){
          console.log("\nPlease enter Numeric values for ID and QTY.\n")
          customerOrder();
        }else{
          // Check if customer entered a non-existant ID number.
          if(array.indexOf(pid) === -1){
            console.log("\nIt seems like that product doesn't exist. Please enter a valid ID.\n")
            customerOrder(array);
          }else{
            checkQty(pid, pq, array);
          }
        }

    });
}


// Check Quantity
function checkQty(id, qty, array){

  db.query('SELECT * FROM products WHERE item_id=?',id, function (error, res, fields) {
    if (error) throw error;

    var leftOverQty = res[0].stock_quantity - qty;
    var itemPrice = res[0].price;
    var deptId = res[0].department_id;
    var prodId = id;

    if (leftOverQty < 0){
      console.log("\nInsufficient Quantity!\n");
      customerInput(array);
    } else {
      let totalPrice = itemPrice * qty;
      fulfillOrder(prodId, leftOverQty, totalPrice);
    }

  });
}

// Fulfill Order
function fulfillOrder(id, qty, price){
  db.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?',[qty, id], function (error, res, fields) {
    if (error) throw error;

    console.log('<h2>Thank you for Shopping with us today! Your total is: $ </h2>' + [price.toFixed(2)]

);


  });
}
