/**
 * Created by dreamind on 22.02.2015.
 */

(function() {
    'use strict';

    angular
        .module( 'GuestBook' )
        .controller( 'SignIn', SignIn );

    SignIn.$inject = ['$scope'];

    function SignIn( $scope ) {

        var sign    = this,
            tempDB  = new CollectionsDB,
            validList = {
                oneQ: "Not available \' ",
                twoQ: "Not available \" ",
                short: "So short",
                long:  "So long",
                empty: "Field must not be empty"
            };

        // Temp DB:
        sign.book     = tempDB.guestBook;
        sign.users    = tempDB.usersList;
        sign.profiles = tempDB.userProfileList;

        // Init Variables:
        sign.isSignIn = 1;
        sign.forgot   = false;
        sign.mail     = null;
        sign.pass     = null;

        // Watchers:
        $scope.$watch( 'sign.mail', validOnFly );
        $scope.$watch( 'sign.pass', validOnFly );

        // First-level validation:
        function validOnFly() {
            console.log( "mail: " + sign.mail );
            console.log( "pass: " + sign.pass );
        }

        return sign;
    }


})();