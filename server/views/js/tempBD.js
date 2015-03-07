/**
 * Created by dreamind on 22.02.2015.
 */
//(function() {
//    'use strict';

    function CollectionsDB() {

        var db = this;

        var guestBook = [
            {
                id: "1",
                author: "Gregory House",
                time: "06.02.2015 9:54",
                text: "You have a wonderful website! But I do not know what it is...",
                img: "img/imgUsers/1.jpg",
                count: "1"
            },
            {
                id: "2",
                author: "Sherlock Holmes",
                time: "07.02.2015 10:32",
                text: "Following the deductive method, I guess ... No. I can not imagine!",
                img: "img/imgUsers/2.jpg",
                count: "1"
            },
            {
                id: "3",
                author: "Walter Bishop",
                time: "08.02.2015 11.47",
                text: "Most likely it's from a parallel universe",
                img: "img/imgUsers/3.jpg",
                count: "1"
            }
        ];

        var usersList = [
            {
                id: "1",
                author: "Gregory House",
                img: "img/imgUsers/1.jpg"
            },
            {
                id: "2",
                author: "Sherlock Holmes",
                img: "img/imgUsers/2.jpg"
            },
            {
                id: "3",
                author: "Walter Bishop",
                img: "img/imgUsers/3.jpg"
            }
        ];

        var msgInList = [
            {
                id: "1",
                author: "Gregory House",
                time: "06.02.2015 9:54",
                text: "Hi, I have heard that you also love to mix pills :-)",
                img: "img/imgUsers/1.jpg"
            }

        ];

        var msgOutList = [
            {
                id: "2",
                author: "Sherlock Holmes",
                time: "07.02.2015 10:32",
                text: "I hear you're also a genius!",
                img: "img/imgUsers/2.jpg"
            }
        ];

        var userProfileList = [
            {
                id: "1",
                img: "img/imgUsers/1.jpg",
                firstN: "Gregory",
                secondN: "House",
                email: "gregory@yahoo.com",
                password: "12345",
                about: "Dr. Medetsine, I live in Jersey."
            },
            {
                id: "2",
                img: "img/imgUsers/2.jpg",
                firstN: "Sherlock",
                secondN: "Holmes",
                email: "holmes@gmail.com",
                password: "12345",
                about: "Consulting detective."
            },
            {
                id: "3",
                img: "img/imgUsers/3.jpg",
                firstN: "Walter",
                secondN: "Bishop",
                email: "walter@yahoo.com",
                password: "12345",
                about: "I am a good person!"
            }
        ];

        db.guestBook        = guestBook;
        db.usersList        = usersList;
        db.msgInList        = msgInList;
        db.msgOutList       = msgOutList;
        db.userProfileList  = userProfileList;

        return db;
    }

//})();