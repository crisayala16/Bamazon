var mysql = require("mysql");
var inquirer = require("inquirer");
var isDone = false;
var itemData;

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Zazaza00!',
	database: 'bamazon'
});
var buyItem = function(answer){
	var item = parseInt(answer.itemToBuy);
	var amount = parseInt(answer.itemQuantity);
	if(itemData[item - 1].stock_quantity < amount){
		console.log('Insufficient quantity!');
		itemPrompt();
	}
	else{
		var stockDiff = itemData[item-1].stock_quantity - amount;
		connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [stockDiff, item]);
		connection.query('SELECT * FROM products', function(err, res){
			console.log('Total Cost: ' + (amount * parseFloat(itemData[item - 1].price)));
		})
	}
}
function itemPrompt(){
connection.query('SELECT * FROM products', function(err, res){
	if(err) throw err;
	console.log('All items available for sale:');
	itemData = res;
	for(var i = 0; i < res.length; i++){
		console.log('Item #' + res[i].item_id + ' -' + res[i].department_name);
		console.log("$" + res[i].price + " " + res[i].product_name + ", " + 
		res[i].stock_quantity + " in stock.");
	}
	inquirer.prompt([
	{
		name: 'itemToBuy',
		message: "Which item number would you like to buy?"
	},
	{
		name: 'itemQuantity',
		message: 'How many would you like to buy?'
	}
	]).then(buyItem);
})
};
itemPrompt();




