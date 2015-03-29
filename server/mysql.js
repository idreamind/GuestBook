/*
 * Nose.JS Express WEB-server: MySQL
 */
'use strict';

var mysql   = require('mysql'),
    fs      = require('fs'),
    Helper  = require('./helpers'),
    help    = new Helper(),
    pool    = mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : '1234',
        database : 'guestbook'
    }),
    images = [],
    names  = [],
    isProduction = true;

function MySQL() {
    var sql = this;

    sql.getSignInArticleList = getSignInArticleList;
    sql.getSignInUserList    = getSignInUserList;
    sql.getAuthorization     = getAuthorization;
    sql.getHash              = getHash;
    sql.getMsg               = getMsg;
    sql.addArticle           = addArticle;
    sql.sendMessage          = sendMessage;
    sql.updateProfile        = updateProfile;
    sql.uploadImage          = uploadImage;
    sql.forgotPassword       = forgotPassword;

//----------------------------------------------------------------------------------------------------------------------
    // Simple User-list: img + name, - return this:
    function getSignInUserList( res ) {
        connectionQuery_( res, 'SELECT userId, firstName, lastName, imgSrc, about FROM users', simpleUsers );

        function simpleUsers( res, rows ) {
            res.json( rows.map(function (el) {
                return {
                    author: makeName_(el),
                    about: el.about,
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

        var mail   = filterData_( req.body.mail ),
            pass   = filterData_( req.body.pass ),
            type   = isNumber_( req.body.type ),
            count  = 0,
            isNew  = 1,
            resObj = {
                isIn: -1,
                page: null,
                user: ' You should to check your information ',
                hash: null,
                store: null
            },
            store = storageGenerator_();

        mail = repQuotes_( mail );
        pass = repQuotes_( pass );

        if( typeof mail == "string" && typeof pass == "string" ) {
            if( mail.length > 5 && pass.length > 5 ) {

                var select = "SELECT userId, firstName, lastName, imgSrc, mail, about, hash, dataStorage FROM users WHERE password = '" + pass + "' AND mail = '" + mail + "'",
                    check  = "SELECT * FROM users WHERE mail = '" + mail + "'",
                    addNew = "INSERT INTO users ( mail, password, dataStorage ) VALUES('" + mail + "', '" + pass + "', '" + store + "' )";

                switch ( parseInt( type ) ) {
                    case 1:
                        connectionQuery_( res, select, signIn );
                        break;
                    case 2:
                        queryUpdate_( check, checkUser );
                        if( count == 0 ) {
                            if ( isNew == 1 ) {
                                queryUpdate_(addNew);
                                console.log(' ---------------------- Add Nev Mail & Pass: ', mail, pass, help.getCurrentTime() );
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
                    hash = hashGenerator_( row.mail ),
                    queryString = "UPDATE users SET hash = '" + hash + "' WHERE password = '" + pass + "' AND mail = '" + mail + "'";
                row.hash = hash;

                // Set Hash To DB:
                queryUpdate_( queryString );

                // Get Template:
                fs.readFile( 'server/views/html/in.html', function( err, content ) {
                    if( err ) {
                        console.log( 'File Operation', err );
                        resObj.user = ' Can not load Application ';
                        res.send( resObj );
                    } else {
                        res.send({
                            isIn: 1,
                            page: content.toString(),
                            user: row,
                            hash: hash,
                            store: row.dataStorage
                        });
                    }
                } );
            } else {
                resObj.user = ' You should to check your information 2';
                res.send( resObj );
            }
        }
    }

//----------------------------------------------------------------------------------------------------------------------
    // Get Authorization Hash:
    function getHash( req, res ) {
        var hash = filterData_( req.body.hash ),
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

        var userId = isNumber_( req.body.userId ),
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
                res.send( resObj );
            }

        }
    }

//----------------------------------------------------------------------------------------------------------------------
    // Add new Article:
    function addArticle( req, res ) {

        var text = repQuotes_( req.body.article ),
            time = filterData_( req.body.time ),
            user = isNumber_( req.body.user ),
            img  = repQuotes_( req.body.imgSrc ),
            addStr  = "INSERT INTO guestbook (user, time, imgSrc, text ) VALUES('" + user + "', '" + time + "', '" + img + "', '" + text + "' )";

        if( text && time && user && img ) {
            queryUpdate_( addStr );
            getSignInArticleList( res );
        } else {
            res.send( "ERROR to add an article" );
        }
    }

//----------------------------------------------------------------------------------------------------------------------
    // Send a new message:
    function sendMessage( req, res ) {
        var fromId  = isNumber_( req.body.idFrom ),
            toId    = isNumber_( req.body.idTo ),
            time    = filterData_( req.body.time ),
            msg     = repQuotes_( req.body.text ),
            addStr  = "INSERT INTO guestmsg ( fromId, toId, time, msg ) VALUES('" + fromId + "', '" + toId + "', '" + time + "', '" + msg + "' )";

        if( fromId && toId && time && msg ) {
            queryUpdate_( addStr );
            res.send( '1' );
        } else {
            res.send( "ERROR to send a message" );
        }
    }

//----------------------------------------------------------------------------------------------------------------------
    // Update Profile:
    function updateProfile( req, res ) {
        var type    = isNumber_( req.body.type )      || '',
            user    = isNumber_( req.body.user )      || '',
            imgLink = repQuotes_( req.body.imgLink )  || '',
            ftName  = filterData_( req.body.ftName )  || '',
            sdName  = filterData_( req.body.sdName )  || '',
            email   = filterData_( req.body.email )   || '',
            pass    = filterData_( req.body.pass )    || '',
            about   = repQuotes_( req.body.about )    || '',
            updateStr = '';

        if( imgLink.length > 10 ) {
            updateStr = "UPDATE users SET imgSrc = '" + imgLink + "' WHERE userId = '" + user + "'";
            queryUpdate_( updateStr );
        }

        if( ftName.length > 0 ) {
            updateStr = "UPDATE users SET firstName = '" + ftName + "' WHERE userId = '" + user + "'";
            queryUpdate_( updateStr );
        }

        if( sdName.length > 0 ) {
            updateStr = "UPDATE users SET lastName = '" + sdName + "' WHERE userId = '" + user + "'";
            queryUpdate_( updateStr );
        }

        if( email.length > 6 ) {
            updateStr = "UPDATE users SET mail = '" + email + "' WHERE userId = '" + user + "'";
            queryUpdate_( updateStr );
        }

        if( pass.length > 6 ) {
            updateStr = "UPDATE users SET password = '" + pass + "' WHERE userId = '" + user + "'";
            queryUpdate_( updateStr );
        }

        if( about.length > 0 ) {
            updateStr = "UPDATE users SET about = '" + about + "' WHERE userId = '" + user + "'";
            queryUpdate_( updateStr );
        }

        res.send( '1' );
    }

//----------------------------------------------------------------------------------------------------------------------
    // Upload Image:
    function uploadImage( req, res ) {

        var file      = "img/imgUsers/" + repQuotes_( req.files.file.name ),
            user      = JSON.parse(req.body.data).user,
            updateStr = "UPDATE users SET imgSrc = '" + file + "' WHERE userId = '" + user + "'";

        queryUpdate_( updateStr );

        res.send( '1' );
    }

//----------------------------------------------------------------------------------------------------------------------
    // Set New Password:
    function forgotPassword( req, res ) {
        var mail        = filterData_( req.body.mail ),
            pass        = filterData_( req.body.pass ),
            queryString = "SELECT userId FROM users WHERE mail = '" + mail + "'",
            updateStr   = "UPDATE users SET password = '" + pass + "' WHERE mail = '" + mail + "'";

        // Check Mail:
        connectionQuery_( res, queryString, mailHandler );

        function mailHandler( res, rows ) {
            if( rows.length > 0 ) {
                queryUpdate_( updateStr );
                res.send( 'New Password Has Send ' );
            } else {
                res.send( 'No such user: ' + mail );
            }
        }
    }

//----------------------------------------------------------------------------------------------------------------------
    // Private:   ------------------------------------------------------------------------------------------------------

    // To query response:   --------------------------------------------------------------------------------------------
    function connectionQuery_( res, queryString, handler ) {
        pool.getConnection( function( err, connection ) {
            if( err ) {
                if( !isProduction ) {
                    connection.release();
                }
                console.log({"code" : 100, "status" : "Error in connection database"});
            }

            connection.query( queryString, function( err, rows ) {
                if( !isProduction ) {
                    connection.release();
                }
                if( !err ) handler( res, rows );
                connection.on('error', function( err ) {
                    res.json({"code" : 100, "status" : "Error in connection database"});
                });
            });
        });
    }

// Function to Make a Name:    -----------------------------------------------------------------------------------------
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
    // Function Replace Quotes:
    function repQuotes_( str ) {
        if( typeof str != "string" ) {
            return null;
        }
        return str.replace(/'/g,'\\\'').replace(/"/g,'\\\"').trim();
    }

    // Filter data:
    function filterData_( str ) {
        if( typeof str != "string" ) {
            return null;
        }
        return str.replace(/'/g, '\\\'').replace(/"/g,'\\\"').replace(/;/g, '').replace(/select/gi,'').replace(/union/gi,'').trim();
    }

    function deleteQuotes_( str ) {
        if( typeof str != "string" ) {
            return null;
        }
        return str.replace(/'/g,'').replace(/"/g,'').trim();
    }

    // Is Number:
    function isNumber_( str ) {
        var number = parseInt( str );
        if( number ) {
            if( number > 0 ) {
                return ( number + '' );
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

//----------------------------------------------------------------------------------------------------------------------
    // Function to Make a smt. like a hash:
    function hashGenerator_( mail ) {
        var rand = passwordGenerator_() + '',
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
                if( !isProduction ) {
                    connection.release();
                }
                console.log( " Error in connection database" , err );
            }

            if( typeof process == "function" ) {
                process( rows );
            }
        }
    }

//----------------------------------------------------------------------------------------------------------------------
    // Password Generator:
    function passwordGenerator_() {
        return Math.random() * ( 9999998 - 1000001 ) + 1000001;
    }

    // Storage Generator:
    function storageGenerator_() {

        var str = '';
        while( str.length < 20 ) {
            var r = Math.floor(Math.random() * ( 20 - 1 ) + 1),
                n = Math.floor(Math.random() * ( 10 - 1 ) + 1),
                l = null;
            switch ( r ) {
                case 1: l = 'a';
                    break;
                case 2: l = 'b';
                    break;
                case 3: l = 'c';
                    break;
                case 4: l = 'd';
                    break;
                case 5: l = 'e';
                    break;
                case 6: l = 'f';
                    break;
                case 7: l = 'j';
                    break;
                case 8: l = 'i';
                    break;
                case 9: l = 'k';
                    break;
                case 10: l = 'l';
                    break;
                case 11: l = 'm';
                    break;
                case 12: l = 'n';
                    break;
                case 13: l = 'o';
                    break;
                case 14: l = 'p';
                    break;
                case 15: l = 'q';
                    break;
                case 16: l = 'r';
                    break;
                case 17: l = 's';
                    break;
                case 18: l = 't';
                    break;
                case 19: l = 'u';
                    break;
                default: l = 'z';
            }
            str += l + n;
        }
        return deleteQuotes_( str );
    }

    return sql;
}

//----------------------------------------------------------------------------------------------------------------------
module.exports = MySQL;

//----------------------------------------------------------------------------------------------------------------------
//connection.end();