USE guestbook;  # use this DB

# Inser Data:
INSERT INTO guestmsg ( fromId, toId, time, msg )
VALUES('1', '2', '05.03.2015 12:54:23', 'Hi! How I am?' );
INSERT INTO guestmsg ( fromId, toId, time, msg )
VALUES('2', '1', '05.03.2015 12:55:45', 'House MD. Hello, doctor)' );
INSERT INTO guestmsg ( fromId, toId, time, msg )
VALUES('3', '1', '05.03.2015 14:00:30', 'Good morning, my friend!' );
INSERT INTO guestmsg ( fromId, toId, time, msg )
VALUES('2', '3', '05.03.2015 16:20:52', 'Minister?!' );

# Result:
SELECT * FROM guestmsg;