USE guestbook;  # use this DB

# Inser Data:
INSERT INTO guestbook (user, time, imgSrc, text )
VALUES('Gregory House', '03.03.2015 12:10', 'img/imgUsers/1.jpg', 'You have a wonderful website! But I do not know what it is...' );
INSERT INTO guestbook (user, time, imgSrc, text )
VALUES('Sherlock Holmes', '04.03.2015 10:32', 'img/imgUsers/2.jpg', 'Following the deductive method, I guess ... No. I can not imagine!' );
INSERT INTO guestbook (user, time, imgSrc, text )
VALUES('Walter Bishop', '05.03.2015 11:47', 'img/imgUsers/3.jpg', 'Most likely it is from a parallel universe' );

# Result:
SELECT * FROM guestbook;
