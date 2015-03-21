USE guestbook;  # use this DB

# Inser Data:
INSERT INTO users ( firstName, lastName, imgSrc, mail, password )
VALUES('Gregory', 'House', 'img/imgUsers/1.jpg', 'gregory@yahoo.com', 'g123456' );
INSERT INTO users ( firstName, lastName, imgSrc, mail, password )
VALUES('Sherlock', 'Holmes', 'img/imgUsers/2.jpg', 'holmes@gmail.com', 'h123456' );
INSERT INTO users ( firstName, lastName, imgSrc, mail, password )
VALUES('Walter', 'Bishop', 'img/imgUsers/3.jpg', 'walter@yahoo.com', 'w123456' );

# Result:
SELECT * FROM users;