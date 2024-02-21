
-- database
CREATE DATABASE stonescroll
-- ss_userdetails
CREATE TABLE ss_userdetails (
    id INT AUTO_INCREMENT,
    userid INT PRIMARY KEY,
    fname VARCHAR(150),
    lname VARCHAR(150),
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
    UNIQUE KEY (id)
);
