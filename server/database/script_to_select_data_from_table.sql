USE guestbook;

# Get all data from table
SELECT * FROM users; 

# Get any column
-- SELECT user, time, imgSrc FROM guestbook;

# Get with WHERE
-- SELECT imgSrc AS 'Path to Img: ' FROM guestbook WHERE idArticle = '1';

# Get rows count
-- SELECT count(*) AS ' Rows Count: ' FROM guestbook; 

# Get article:
-- SELECT idArticle, user, time, imgSrc, text FROM guestbook;

# Get All emails:
-- SELECT mail, password FROM users;

# Select Data by Email:
-- SELECT password FROM users WHERE mail = 'holmes@gmail.com';

# Get Profile:
-- SELECT userId, firstName, lastName, imgSrc, mail, about FROM users WHERE password = '' AND mail = '';

# Select mail AND pass:
-- SELECT userId, firstName, lastName, imgSrc, mail, about, hash FROM users WHERE password = 'h123456' AND mail = 'holmes@gmail.com';

# Input MSG:
-- SELECT fromId, toId, time, msg FROM guestmsg WHERE toId = 2;
-- SELECT fromId, toId, time, msg FROM guestmsg WHERE fromId = 2;

-- SELECT firstName, lastName, imgSrc FROM users;