/**
 * Created by dreamind on 22.02.2015.
 */

(function() {
    'use strict';

    angular
        .module( 'GuestBook' )
        .controller( 'SignIn', SignIn );

    SignIn.$inject = ['$scope', '$http', '$compile', '$sce', '$upload' ];

    function SignIn( $scope, $http, $compile, $sce, $upload ) {

        var sign    = this,
            isOk    = [0, 0],
            stop    = [0, 0],
            validList = {
                Q:      "Not available quotes",
                short:  "So short",
                empty:  "Field must not be empty",
                type:   "Wrong writing",
                str:    "It is must be string"
            };

        // Init Variables:
        sign.isSignIn   = 1;
        sign.isLinkImg  = 1;
        sign.forgot     = false;
        sign.mail       = null;
        sign.pass       = null;
        sign.errMail    = "";
        sign.errPass    = "";

        // When IN:
        sign.iBook      = null;
        sign.iUsers     = null;
        sign.iMsg       = null;
        sign.iPhoto     = null;
        sign.iFirstName = null;
        sign.iLastName  = null;
        sign.iMail      = null;
        sign.iAbout     = null;
        sign.iId        = null;
        sign.iUserName  = null;
        sign.iPass      = null;
        sign.newImgLink = null;
        sign.newImage   = null;

        // In Collections:
        sign.inMsgs   = null;
        sign.outMsgs  = null;

        // Controllers:
        sign.startHandling = startHandling;
        sign.signOut       = signOut;
        sign.writeMsg      = writeMsg;
        sign.postArticle   = postArticle;
        sign.sendMessage   = sendMessage;
        sign.updateProfile = updateProfile;
        sign.onFileSelect  = onFileSelect;

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
//----------------------------------------------------------------------------------------------------------------------
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
//----------------------------------------------------------------------------------------------------------------------
        // Click on button:
        function startHandling() {
            if( isOk[0] && isOk[1] ) {
                var objToSend = {
                    type: sign.isSignIn,
                    mail: sign.mail,
                    pass: sign.pass
                };

                $http.post( '/in', objToSend )
                    .success( function(data, status, headers, config) {
                        console.log( ' Authorization Success: ', data );

                        switch ( data.isIn ) {
                            case 1:
                                if( data.hash.length > 10 ) {
                                    compileData_( data );
                                }
                                break;
                        }
                        console.log( ' Hash: ', localStorage.getItem("GuestBookInSession") );

                    })
                    .error( function(data, status, headers, config) {
                        console.log( ' Authorization Error: ', data );
                    });
            }
        }

//----------------------------------------------------------------------------------------------------------------------
        // Write Msg:
        function writeMsg( id ) {
            console.log( 'User Id', id );
            var $userCard = $('.user-card');
            if( $userCard.eq( id ).hasClass('user-card-active') ) {
                $userCard.eq( id ).removeClass('user-card-active user-card-active');
            } else {
                $userCard.eq( id ).addClass('user-card-active');
            }
        }

//----------------------------------------------------------------------------------------------------------------------
        // Sign Out:
        function signOut() {
            console.log( ' --- Sign Out --- ' );
            localStorage.setItem("GuestBookInSession", null);
            location.reload();
        }

//----------------------------------------------------------------------------------------------------------------------
        // Post Article:
        function postArticle() {

            if( sign.articleToPost.length > 10 && sign.articleToPost != 'So short...' ) {
                var objToSend = {
                    article: sign.articleToPost,
                    time: timeGenerator(),
                    user: sign.iUserName,
                    imgSrc: sign.iPhoto
                };

                $http.post('/add', objToSend )
                    .success( function ( data ) {
                        sign.book = data;
                    })
                    .error(function ( data ) {
                        console.log(' ERROR Get Data from DB: ', data);
                    });

            } else {
                sign.articleToPost = 'So short...';
            }
        }

//----------------------------------------------------------------------------------------------------------------------
        // Update Profile:
        function updateProfile() {
            var objToSend = {
                type:       sign.isLinkImg,
                user:       sign.iId,
                imgLink:    sign.newImgLink,
                ftName:     sign.iFirstName || '',
                sdName:     sign.iLastName  || '',
                email:      sign.iMail,
                pass:       sign.iPass,
                about:      sign.iAbout
            };

            objToSend.ftName = objToSend.ftName.trim();
            objToSend.sdName = objToSend.sdName.trim();

            if( objToSend.ftName.length > 1 || objToSend.sdName.length > 1 ) {
                $http.post('/update', objToSend )
                    .success( function ( data ) {
                        if( data == '1' ) {
                            location.reload();
                        }
                    })
                    .error(function ( data ) {
                        console.log(' ERROR Update Data on Server: ', data);
                    });
            }

            console.log( objToSend );

        }

//----------------------------------------------------------------------------------------------------------------------
        // Send Message:
        function sendMessage( idToSend ) {
            var objToSend = {
                    idTo:   idToSend,
                    idFrom: sign.iId,
                    time:   timeGenerator(),
                    text:   $('.message-area').eq( idToSend - 1 ).val()
                    },
                arrQ = objToSend.text.match(/[\"\']/ig) || [];

            console.log( objToSend, objToSend.text.length, arrQ );

            if( objToSend.text.length > 0 && objToSend.text.length < 1000 && !arrQ.length ) {
                $http.post('/send', objToSend)
                    .success(function (data) {
                        console.log( " Data !!!: ", data );
                        if (data == '1') {
                            getPageData_(true);
                        }
                    })
                    .error(function (data) {
                        console.log(' ERROR Sending message: ', data);
                    });
            }
        }

//----------------------------------------------------------------------------------------------------------------------
        function onFileSelect($files) {
            if ($files.length > 0) {
                $upload.upload({
                    url: '/image',
                    file: $files,
                    data: {
                        user: sign.iId
                    },
                    progress: function ( err ) {
                        console.log(' ERROR Update Data on Server: ', err);
                    }
                }).then(function (data, status, headers, config) {
                    // file is uploaded successfully
                    if( data.data == '1' ) {
                        location.reload();
                    }
                    console.log( data );
                });
            }
        }

//----------------------------------------------------------------------------------------------------------------------
        // Get Data from Server:
        function getDataFromServer() {

            var objToSend = {
                hash: localStorage.getItem("GuestBookInSession")
            };

            $http.post('/check', objToSend )
                .success( function( data, status, headers, config ) {
                    if( data.isIn == 1 ) {
                        compileData_( data );
                    } else {
                        getPageData_();
                    }
                } )
                .error( function( data, status, headers, config ) {
                    console.log( ' ERROR Get Data from DB: ', data );
                } );
        }

//----------------------------------------------------------------------------------------------------------------------

        function getPageData_( isIn ) {
            isIn = isIn || false;

            $http.get('/inUsers')
                .success( function( data, status, headers, config ) {
                    sign.users = data;
                } )
                .error( function( data, status, headers, config ) {
                    console.log( ' ERROR Get Data from DB: ', data );
                } );

            $http.get('/inBook')
                .success( function( data, status, headers, config ) {
                    sign.book = data;
                } )
                .error( function( data, status, headers, config ) {
                    console.log( ' ERROR Get Data from DB: ', data );
                } );

            if( isIn ) {

                var objToSend = {
                    userId: sign.iId
                };

                $http.post('/messages', objToSend )
                    .success( function( data ) {

                        sign.inMsgs   = data.inMsgs;
                        sign.outMsgs  = data.outMsgs;
                    } )
                    .error( function( data ) {
                        console.log( ' ERROR Get Data from DB: ', data );
                    } );
            }

            //$scope.$apply();
        }

//----------------------------------------------------------------------------------------------------------------------

        function compileData_( data ) {
            localStorage.setItem("GuestBookInSession", data.hash);

            // Set a New Html:
            var linkFn  = $compile( data.page),
                content = linkFn( $scope );
            angular.element('#wrapper').html( content );

            sign.iPhoto     = data.user.imgSrc;
            sign.iFirstName = data.user.firstName;
            sign.iLastName  = data.user.lastName;
            sign.iMail      = data.user.mail;
            sign.iAbout     = data.user.about;
            sign.iId        = data.user.userId;

            if( sign.iFirstName ) {
                sign.iUserName = (sign.iFirstName + ' ' + sign.iLastName).trim();
            } else {
                sign.iUserName = sign.iLastName;
            }

            // Get Page Data:
            getPageData_( true );

            // Click imitation by jQuery:
            setTimeout( function() {
                $("#fn").trigger("click");
            }, 0 );

            setTimeout( function() {
                $("#ln").trigger("click");
            }, 500 );

            setTimeout( function() {
                $("#em").trigger("click");
            }, 1000 );

            setTimeout( function() {
                $("#am").trigger("click");
            }, 1500 );
        }

 //---------------------------------------------------------------------------------------------------------------------
        // Time Getter:
        function timeGenerator() {
            var dt    = new Date(),
                day   = dt.getDate() + '',
                month = ( dt.getMonth() + 1 ) + '',
                year  = dt.getFullYear(),
                hour  = dt.getHours() + '',
                min   = dt.getMinutes() + '',
                sec   = dt.getSeconds() + '';

            day   = ( day.length > 1 ) ? day : '0' + day;
            month = ( month.length > 1 ) ? month : '0' + month;

            hour = ( hour.length > 1 ) ? hour : '0' + hour;
            min  = ( min.length > 1 ) ? min : '0' + min;
            sec  = ( sec.length > 1 ) ? sec : '0' + sec;

            return day + '.' + month + '.' + year + ' ' + hour + ':' + min + ':' + sec;
        }

        return sign;
    }


})();