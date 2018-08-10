/* Create Bamazon database */
CREATE DATABASE Bamazon;

USE Bamazon;

/* Bamazon product table */
CREATE TABLE Products(
    ItemID INT(10) AUTO_INCREMENT NOT NULL,
    ProductName VARCHAR(100) NOT NULL,
    DepartmentName VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT(10) NOT NULL,
    PRIMARY KEY(ItemID)
);

/* Select (all) from Products */
SELECT * FROM Products;

/* Insert mock products to table */
INSERT INTO Products(ProductName, DepartmentName, Price, StockQuantity)
Values
("playstation 4", "technology", 249.99, 100),
("macbook pro", "technology", 1999.99, 50),
("galaxy s7", "technology", 499.99, 50),
("venus fly trap", "gardening", 7.99, 30),
("potting soil", "gardening", 14.99, 20),
("basket ball", "sports", 19.99, 40),
("hand wraps". "sports", 10.99, 35),
("dog food", "pets", 19.99, 40),
("cat litter", "pets", 15.99, 20),
("slippers", "clothing", 19.99, 25),
("hoodie", "clothing", 24.99, 25),
("nike sb", "clothing", 99.99, 20);