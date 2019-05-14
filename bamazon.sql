CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

CREATE TABLE items (
item_id INTEGER AUTO_INCREMENT,

product_name VARCHAR (100),

department_name VARCHAR (100), 

price FLOAT, 

stock_quantity INTEGER (6), 

PRIMARY KEY (item_id)

); 