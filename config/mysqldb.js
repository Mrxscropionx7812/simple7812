//need to add ORM or use promises 



require('dotenv').config();
const mysql = require('mysql');

const dbConfig = {
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
};

const con = mysql.createConnection(dbConfig);

con.connect(function(err) {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);

    } else {
        console.log('Connected to MySQL ');

    }
});

const insertOne = (sql) => {
    return new Promise((resolve, reject) => {
        con.query(sql, function(err, result) {
            if (err) {
                console.error('Error executing insert query:', err.stack);
                reject(false);
            } else {
                resolve(true);
            }
        });

    })

};

const find = (sqlQuery) => {
    con.query(sqlQuery, function(err, result, fields) {
        if (err) {
            console.error('Error executing find query:', err.stack);
        } else {
            return result;
        }
    });
};

const update = (sqlQuery, ) => {
    con.query(sqlQuery, function(err, result) {
        if (err) {
            console.error('Error executing update query:', err.stack);
            return false;
        } else {
            console.log(result.affectedRows);
            return result.affectedRows > 0;
        }
    });
};

module.exports = {
    connection: con,
    insertOne: insertOne,
    find: find,
    update: update,
};