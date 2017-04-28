var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Zazaza00!',
	database: 'bamazon'
});
function listMenu(){
	inquirer.prompt([
	{
		name: 'action',
		message: 'List of menu options:',
		type: 'list',
		choices: ['View products for sale', 'View low inventory', 'Add to Inventory', 'Add New Product']
	}
	]).then(function(answer){
		if(answer.action === 'View products for sale'){
			connection.query('SELECT * FROM products', function(err, res){
				if(err) throw err;
				console.log('All items available for sale:');
				itemData = res;
				for(var i = 0; i < res.length; i++){
					console.log('Item #' + res[i].item_id + ' -' + res[i].department_name);
					console.log("$" + res[i].price + " " + res[i].product_name + ", " + 
						res[i].stock_quantity + " in stock.");
				}
				listMenu();
			});
		}
		else if(answer.action === 'View low inventory'){
			connection.query('SELECT * FROM products', function(err, res){
				if(err) throw err;
				console.log('Low Inventory Items:');
				for(var i = 0; i < res.length; i++){
					if(res[i].stock_quantity < 5){
						console.log('Item #' +  res[i].item_id + " " + res[i].product_name + " - " + res[i].stock_quantity + " in stock.");
					}
				}
				listMenu();
			})
		}
		else if(answer.action === 'Add to Inventory'){
			inquirer.prompt([
			{
				name: 'addToItem',
				message: 'Which item number would you like to add more inventory to?'
			},
			{
				name: 'amountOfInventory',
				message: 'How many more items would you like to add?'
			}
			]).then(function(answer){
				var item = parseInt(answer.addToItem);
				var amountOfInventory = parseInt(answer.amountOfInventory);
				connection.query('SELECT * FROM products', function(err, tableData){
					if(err) throw err;
					var stockSum = parseInt(tableData[item - 1].stock_quantity) + amountOfInventory;
					connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [stockSum, item]);
					connection.query('SELECT stock_quantity, product_name FROM products WHERE item_id=?', item, function(err, res){
					console.log('New inventory value:');
					console.log(res[0].product_name + " - " + res[0].stock_quantity);
					listMenu();
				})
					
				})
				
			})
		}
		else if(answer.action === 'Add New Product'){
			inquirer.prompt([
			{
				name: 'productName',
				message: 'What is the name of this product?'
			},
			{
				name: 'departmentName',
				message: 'What is the department of this product?'
			},
			{
				name: 'price',
				message: 'What is the price of this product?'
			},
			{
				name: 'stockQuantity',
				message: 'How many do we have in stock?'
			}
			]).then(function(response){
				var productName = response.productName;
				var departmentName = response.departmentName;
				var price = parseFloat(response.price);
				var stockQuantity = parseInt(response.stockQuantity);
				connection.query('INSERT INTO products SET ?', {
					product_name: productName,
					department_name: departmentName,
					price: price,
					stock_quantity: stockQuantity
				}, function(err){
					if(err) throw err;
				});
				console.log('New product added.');
				listMenu();
			})
		}
	})
}
listMenu();