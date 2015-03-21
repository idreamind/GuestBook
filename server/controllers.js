/*
 * Nose.JS Express WEB-server: Router
 */
'use strict';

function Controllers() {
    var ctrl   = this,
        Helper = require('./helpers'),
        helper = new Helper(),
        MySQL  = require('./mysql'),
        db     = new MySQL();

    ctrl.server      = server;
    ctrl.inUsers     = inUsers;
    ctrl.inBook      = inBook;
    ctrl.inMails     = inMails;
    ctrl.signOrCheck = signOrCheck;
    ctrl.checkHash   = checkHash;
    ctrl.getMsg      = getMsg;


    function server( req, res ) {
        res.render( 'index', {} );
    }

    function inUsers( req, res ) {
        db.getSignInUserList( res );
    }

    function inBook( req, res ) {
        db.getSignInArticleList( res );
    }

    function inMails( req, res ) {
        db.getSignInValidateInf( res );
    }

    function signOrCheck( req, res ) {

        switch ( req.body.type ) {
            case 1:
                db.getAuthorization( req, res );
                break;
            case 2:
                break;
            default:
                res.send( {
                    isIn: -1,
                    page: null,
                    user: ' You should to check your information ',
                    hash: null
                } );
        }
    }

    function checkHash( req, res ) {
        db.getHash( req, res );
    }

    function getMsg( req, res ) {
        db.getMsg( req, res );
    }

}

module.exports = Controllers;