/*
 * Nose.JS Express WEB-server: Router
 */
'use strict';

function Controllers() {
    var ctrl   = this,
        MySQL  = require('./mysql'),
        db     = new MySQL();

    ctrl.server         = server;
    ctrl.inUsers        = inUsers;
    ctrl.inBook         = inBook;
    ctrl.inMails        = inMails;
    ctrl.signOrCheck    = signOrCheck;
    ctrl.checkHash      = checkHash;
    ctrl.getMsg         = getMsg;
    ctrl.addArticle     = addArticle;
    ctrl.sendMessage    = sendMessage;
    ctrl.updateProfile  = updateProfile;
    ctrl.uploadImage    = uploadImage;

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
        db.getAuthorization( req, res );
    }

    function checkHash( req, res ) {
        db.getHash( req, res );
    }

    function getMsg( req, res ) {
        db.getMsg( req, res );
    }

    function addArticle( req, res ) {
        db.addArticle( req, res );
    }

    function sendMessage( req, res ) {
        db.sendMessage( req, res );
    }

    function updateProfile( req, res ) {
        db.updateProfile( req, res );
    }

    function uploadImage( req, res ) {
        db.uploadImage( req, res );
    }

}

module.exports = Controllers;