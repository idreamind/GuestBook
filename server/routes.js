/*
 * Nose.JS Express WEB-server: Routes List
 */
'use strict';

var routesList = {
    "/"             : "server",
    "/server"       : "server",
    "/server.html"  : "server",   //< Test String
    "/inUsers"      : "inUsers",
    "/inBook"       : "inBook",
    "/in"           : "signOrCheck",
    "/check"        : "checkHash",
    "/messages"     : "getMsg",
    "/add"          : "addArticle",
    "/send"         : "sendMessage"
};

module.exports = routesList;
