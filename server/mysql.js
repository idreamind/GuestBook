/*
 * Nose.JS Express WEB-server: MySQL
 */
'use strict';

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234'
});

connection.connect();

function MySQL() {

    

}