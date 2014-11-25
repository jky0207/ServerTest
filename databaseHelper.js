/**
 * Created by jung on 2014-11-25.
 */
var mysql = require('mysql');

// var userTableColum = {}


var connection = mysql.createConnection({
    host: 'ec2-54-169-108-131.ap-southeast-1.compute.amazonaws.com',
    user: 'root',
    password: 'wnrrltkfrl',
    database: 'phonemon'
});

connection.connect();

exports.showUserInfo = function (callback) {
    connection.query('SELECT * FROM member', function (err, rows, fields) {
        if (err) throw err;

        callback(rows);
        for (var i in rows) {
            console.log('username: ', rows[i].username);
        }
    });
}


exports.insertUserInfo = function (data) {
    connection.query('INSERT INTO user (username, password, email,created_on) VALUES (?,?,?,?)', [data.username, data.password, data.email, data.date], function (err, rows, fields) {
        if (err) throw err;

        console.log('success join');
    });
}


exports.disconnectDB = function () {
    connection.end();
}