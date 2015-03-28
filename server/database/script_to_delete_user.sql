USE guestbook;  # use this DB
DELETE FROM guestbook.users WHERE userId > 6;
ALTER TABLE users AUTO_INCREMENT = 1;
SELECT * FROM users;