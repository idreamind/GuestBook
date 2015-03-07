/**
 * Created by dreamind on 22.02.2015.
 */

(function() {
    'use strict';

    angular
        .module( 'GuestBook' )
        .controller( 'SignIn', SignIn );

    SignIn.$inject = ['$scope', '$http'];

    function SignIn( $scope, $http ) {

        var sign    = this,
            tempDB  = new CollectionsDB,
            isOk    = [0, 0],
            stop    = [0, 0],
            validList = {
                Q:      "Not available quotes",
                short:  "So short",
                empty:  "Field must not be empty",
                type:   "Wrong writing",
                str:    "It is must be string"
            };

        // Temp DB:
        sign.book = [ {
            id: "1",
            author: "Gregory House",
            time: "06.02.2015 9:54",
            text: "Something went wrong...",
            img: "img/imgUsers/1.jpg",
            count: "1"
        } ];
        sign.users = [ {
            id: "1",
            author: "Gregory House",
            img: "img/imgUsers/1.jpg"
        } ];

        // Init Variables:
        sign.isSignIn = 1;
        sign.forgot   = false;
        sign.mail     = null;
        sign.pass     = null;
        sign.errMail  = "";
        sign.errPass  = "";

        // Sub Controllers:
        getDataFromServer();

        // Watchers:
        $scope.$watch( 'sign.mail', validOnFlyMail );
        $scope.$watch( 'sign.pass', validOnFlyPass );

        // First-level validation mail:
        function validOnFlyMail() {
            if( !stop[0] ) {
                stop[0] = 1;
                return null;
            }

            var str = sign.mail;
            if( typeof str === "string" ) {
                var arrQ = str.match(/[\",\']/ig) || [];
                console.log( "arrQ: " + arrQ );
                if( !arrQ.length ) {
                    if (str.length > 6) {
                        var arrM = str.match(/[@,.]/ig) || [];
                        if ( arrM.length ) {
                            isOk[0] = 1;
                            sign.errMail = "";
                        } else {
                            isOk[0] = 0;
                            sign.errMail = "Mail: " + validList.type;
                        }
                    } else {
                        isOk[0] = 0;
                        sign.errMail = "Mail: " + validList.short;
                    }
                } else {
                    isOk[0] = 0;
                    sign.errMail= "Mail: " + validList.Q;
                }
            } else {
                isOk[0] = 0;
                sign.errMail = "Mail: " + validList.str;
            }
        }

        // First-level validation pass:
        function validOnFlyPass() {
            if( !stop[1] ) {
                stop[1] = 1;
                return null;
            }

            var str = sign.pass;
            if( typeof str === "string" ) {
                var arrQ = str.match(/[\",\']/ig) || [];
                if( !arrQ.length ) {
                    if (str.length > 6) {
                        isOk[1] = 1;
                        sign.errPass = "";
                    } else {
                        isOk[1] = 0;
                        sign.errPass = "Password: " + validList.short;
                    }
                } else {
                    isOk[1] = 0;
                    sign.errPass = "Password: " + validList.Q;
                }
            } else {
                isOk[1] = 0;
                sign.errPass = "Password: " + validList.str;
            }
        }


        // Get Data from Server:
        function getDataFromServer() {
            $http.get('/in')
                .success( function( data, status, headers, config ) {
                // this callback will be called asynchronously
                // when the response is available
                } )
                .error( function( data, status, headers, config ) {

                } );
            console.log(' Get Data ');
        }

        return sign;
    }


})();