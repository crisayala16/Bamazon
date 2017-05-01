var mysql = require("mysql");
var inquirer = require("inquirer");
var itemData;
//Creates the mySQL connection 
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Zazaza00!',
	database: 'bamazon'
});
//Function for buying an item and udpating the database
var buyItem = function(answer){
	//The item picked by the user
	var item = parseInt(answer.itemToBuy);
	//the amount of items picked from the user
	var amount = parseInt(answer.itemQuantity);
	//Conditional if the user trys to buy too many items
	if(itemData[item - 1].stock_quantity < amount){
		console.log('Insufficient quantity!');
		itemPrompt();
	}
	else{
		//The amount of stock difference after the user buys the amount of items
		var stockDiff = itemData[item-1].stock_quantity - amount;
		//Updating the database with the new stock amount on the user selected item
		connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [stockDiff, item]);
		//Multiplies amount by item price in order to show full price
		console.log('Total Cost: ' + (amount * parseFloat(itemData[item - 1].price)));
	}
}
function itemPrompt(){
	//Grabs the procducts table data
connection.query('SELECT * FROM products', function(err, res){
	if(err) throw err;
	console.log('All items available for sale:');
	itemData = res;
	//displays the items in order
	for(var i = 0; i < res.length; i++){
		console.log('Item #' + res[i].item_id + ' -' + res[i].department_name);
		console.log("$" + res[i].price + " " + res[i].product_name + ", " + 
		res[i].stock_quantity + " in stock.");
	}
	//prompts the user to buy an item
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




