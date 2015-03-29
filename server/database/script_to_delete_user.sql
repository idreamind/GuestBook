USE guestbook;  # use this DB
DELETE FROM guestmsg WHERE msgId > 6;
ALTER TABLE guestmsg AUTO_INCREMENT = 1;
SELECT * FROM guestmsg;

-- DELETE FROM guestbook WHERE idArticle > 5;
-- ALTER TABLE guestbook AUTO_INCREMENT = 1;
-- SELECT * FROM guestbook;