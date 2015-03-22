/*
 * Nose.JS Express WEB-server: MySQL
 */
'use strict';

var mysql = require('mysql'),
    fs    = require('fs'),
    pool  = mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : '1234',
        database : 'guestbook'
    }),
    images = [],
    names  = [];

function MySQL() {
    var sql = this;

    sql.getSignInArticleList = getSignInArticleList;
    sql.getSignInUserList    = getSignInUserList;
    sql.getAuthorization     = getAuthorization;
    sql.getHash              = getHash;
    sql.getMsg               = getMsg;
    sql.addArticle           = addArticle;

//----------------------------------------------------------------------------------------------------------------------
    // Simple User-list: img + name, - return this:
    function getSignInUserList( res ) {
        connectionQuery_( res, 'SELECT userId, firstName, lastName, imgSrc FROM users', simpleUsers );

        function simpleUsers( res, rows ) {
            res.json( rows.map(function (el) {
                return {
                    author: makeName_(el),
                    img: el.imgSrc,
                    id: el.userId
                };
            }) );
        }
    }
//----------------------------------------------------------------------------------------------------------------------
    // Get Article:
    function getSignInArticleList( res ) {
        connectionQuery_( res, 'SELECT idArticle, user, time, imgSrc, text FROM guestbook', articles );

        function articles( res, rows ) {
            res.json( rows );
        }
    }
//----------------------------------------------------------------------------------------------------------------------
    // Get Authorization data:
    function getAuthorization( req, res ) {

        var mail   = req.body.mail,
            pass   = req.body.pass,
            type   = req.body.type,
            count  = 0,
            isNew  = 1,
            resObj = {
                isIn: -1,
                page: null,
                user: ' You should to check your information ',
                hash: null
            };

        if( typeof mail == "string" && typeof pass == "string" ) {

            mail = mail.replace(/'/g, "").replace(/"/g, "").trim();
            pass = pass.replace(/'/g, "").replace(/"/g, "").trim();

            if( mail.length > 5 && pass.length > 5 ) {
                console.log(' ---------------------- Mail & Pass: ', mail, pass, type);
                var select = "SELECT userId, firstName, lastName, imgSrc, mail, about, hash FROM users WHERE password = '" + pass + "' AND mail = '" + mail + "'",
                    check  = "SELECT * FROM users WHERE mail = '" + mail + "'",
                    addNew = "INSERT INTO users ( mail, password ) VALUES('" + mail + "', '" + pass + "' )";

                switch ( parseInt( type ) ) {
                    case 1:
                        connectionQuery_( res, select, signIn );
                        break;
                    case 2:
                        queryUpdate_( check, checkUser );
                        if( count == 0 ) {
                            if ( isNew == 1 ) {
                                queryUpdate_(addNew);
                                connectionQuery_(res, select, signIn);
                            } else {
                                connectionQuery_(res, select, signIn);
                            }
                            count++;
                        }
                        break;
                    default:
                        res.send( resObj );
                }
            } else {
                res.send( resObj );
            }
        } else {
            res.send( resObj );
        }

        // Get Answer:
        function checkUser( rows ) {
            if( rows ) {
                isNew = 0;
            }
        }

//----------------------------------------------------------------------------------------------------------------------
        // This will start only after a sign in:
        function signIn( res, rows ) {
            if( rows.length > 0 ) {

                var row  = rows[0],
                    hash = hashGenerator_( row.mail),
                    queryString = "UPDATE users SET hash = '" + hash + "' WHERE password = '" + pass + "' AND mail = '" + mail + "'";
                row.hash = hash;

                // Set Hash To DB:
                queryUpdate_( queryString );

                // Get Template:
                fs.readFile( 'server/views/html/in.html', function( err, content ) {
                    if( err ) {
                        console.log( 'File Operation', err );
                        res.send( resObj );
                    } else {
                        res.send({
                            isIn: 1,
                            page: content.toString(),
                            user: row,
                            hash: hash
                        });
                    }
                } );
            } else {
                res.send( resObj );
            }
        }
    }

//----------------------------------------------------------------------------------------------------------------------
    // Get Authorization Hash:
    function getHash( req, res ) {
        var hash = req.body.hash,
            resObj = {
                isIn: 0,
                page: null,
                user: null,
                hash: null
            },
            queryString = "SELECT userId, firstName, lastName, imgSrc, mail, about FROM users WHERE hash = '" + hash + "'";

        // Check Hash:
        connectionQuery_( res, queryString, hashHandler );

        function hashHandler( res, rows ) {
            if( rows.length > 0 ) {
                var row = rows[0];

                // Get Template:
                fs.readFile( 'server/views/html/in.html', function( err, content ) {
                    if( err ) {
                        console.log( 'File Operation', err );
                        res.send( resObj );
                    } else {
                        res.send({
                            isIn: 1,
                            page: content.toString(),
                            user: row,
                            hash: hash
                        });
                    }
                } );
            } else {
                res.send( resObj );
            }
        }
    }

//----------------------------------------------------------------------------------------------------------------------
    // Get Data in Book:
    function getMsg( req, res ) {

        getConvertData_();

        var userId = req.body.userId,
            resObj = {
                inMsgs:  null,
                outMsgs: null
            },
            queryString = "SELECT fromId, toId, time, msg FROM guestmsg WHERE toId = " + userId;
        connectionQuery_( res, queryString, getMsgIn );

        function getMsgIn( res, rows ) {

            rows.forEach( function( item ) {
                var fromId = item.fromId - 1;
                item.user   = names[fromId];
                item.imgSrc = images[fromId];
            } );
            resObj.inMsgs = rows;

            var queryString = "SELECT fromId, toId, time, msg FROM guestmsg WHERE fromId = " + userId;
            connectionQuery_( res, queryString, getMsgOut );

            function getMsgOut( res, rows ) {

                rows.forEach( function( item ) {
                    var toId = item.toId - 1;
                    item.user   = names[toId];
                    item.imgSrc = images[toId];
                } );

                resObj.outMsgs = rows;

                console.log( resObj );
                res.send( resObj );
            }

        }
    }

//----------------------------------------------------------------------------------------------------------------------
    // Add new Article:
    function addArticle( req, res ) {

        var text = req.body.article,
            time = req.body.time,
            user = req.body.user,
            img  = req.body.imgSrc,
            addStr  = "INSERT INTO guestbook (user, time, imgSrc, text ) VALUES('" + user + "', '" + time + "', '" + img + "', '" + text + "' )";

        if( text && time && user && img ) {
            queryUpdate_( addStr );
            getSignInArticleList( res );
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Private:   ------------------------------------------------------------------------------------------------------

    // To query response:   --------------------------------------------------------------------------------------------
    function connectionQuery_( res, queryString, handler ) {
        pool.getConnection( function( err, connection ) {
            if( err ) {
                connection.release();
                console.log({"code" : 100, "status" : "Error in connection database"});
            }

            connection.query( queryString, function( err, rows ) {
                connection.release();
                if( !err ) handler( res, rows );

                connection.on('error', function( err ) {
                    res.json({"code" : 100, "status" : "Error in connection database"});
                });
            });
        });
    }

    // Function to Make a Name:    -------------------------------------------------------------------------------------
    function makeName_( el ) {
        var name = '';
            if( el.firstName && el.lastName ) {
                name = el.firstName + ' ' + el.lastName;
            } else if( el.firstName && !el.lastName ) {
                name = el.firstName;
            } else {
                name = el.lastName;
            }
        return name;
    }
//----------------------------------------------------------------------------------------------------------------------
    // Function Get Convert:
    function getConvertData_() {
        var queryString = "SELECT firstName, lastName, imgSrc FROM users";
        queryUpdate_( queryString, setData );

        function setData( rows ) {

            if( rows ) {
                for( var i = 0; i < rows.length; i++ ) {
                    names[i]  = makeName_( rows[i] );
                    images[i] = rows[i].imgSrc;
                }
            }
        }
    }


//----------------------------------------------------------------------------------------------------------------------
    // Function to Make a smt. like a hash:
    function hashGenerator_( mail ) {
        var rand = Math.random() * ( 9999998 - 1000001 ) + 1000001 + '',
            date = (new Date()).getTime();
        return mail + '&' + rand + '&' + date;
    }
//----------------------------------------------------------------------------------------------------------------------
    // Function to Query a simple connection ( UPDATE ):
    function queryUpdate_( queryString, process ) {
        process = process || null;

        pool.getConnection( function( err, connection) {
            handler( err );
            connection.query( queryString, handler );
        });

        function handler( err, rows ) {
            if( err ) {
                connection.release();
                console.log( " Error in connection database" , err );
            }

            if( typeof process == "function" ) {
                process( rows );
            }
        }
    }

    return sql;
}

//----------------------------------------------------------------------------------------------------------------------
module.exports = MySQL;

//----------------------------------------------------------------------------------------------------------------------
//connection.end();