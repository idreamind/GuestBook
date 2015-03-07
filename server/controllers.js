/*
 * Nose.JS Express WEB-server: Router
 */
'use strict';

function Controllers() {
    var ctrl   = this,
        Helper = require('./helpers'),
        helper = new Helper();

    ctrl.server = server;

    function server( req, res ) {
        res.render( 'index', {} );
    }

}

module.exports = Controllers;