
-- database
CREATE DATABASE stonescroll
USE stonescroll
-- ss_userdetails
CREATE TABLE ss_userdetails (
    userid INT AUTO_INCREMENT,
    fname VARCHAR(150),
    lname VARCHAR(150),
    uname VARCHAR(255) NOT NULL,
    phonenumber VARCHAR(180),
    email VARCHAR(200),
    taddress VARCHAR(250),
    paddress VARCHAR(250),
    plan VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2),
    user_status ENUM('ACTIVE', 'INACTIVE') NOT NULL,
    modifieddate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createddate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_userid (userid),
    UNIQUE KEY (userid)
);

-- scroll_tracking
CREATE TABLE scroll_tracking (
  userid INT NOT NULL,
  uname VARCHAR(250),
  nocopy INT NOT NULL,
  papertype VARCHAR(150),
  side INT,
  doc_name VARCHAR(255),
  delivarydate TIMESTAMP,
  createddate TIMESTAMP,
  modifieddate TIMESTAMP
);


ALTER TABLE scroll_tracking ADD COLUMN tracking_docid VARCHAR(255); 



SELECT * from ss_userdetails where phonenumber = '91-7788227711';

INSERT INTO ss_userdetails (fname,lname,uname,phonenumber,email,taddress,paddress,plan,amount,user_status,password) VALUES ('test3 demo', 'demo3', 'testuser2', '91-7788227713', 'test3@gmail.com', 'paid address', 'address in bill', 'D', '0', 'ACTIVE', 'undefined');
$2b$12$f9OOK2eVx/qw4k9NJPwEgOxaEuV6b1bi/Od.HRFiTMFFWgjYmB7t6


ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'root';