-- Create shadow database for Prisma
CREATE DATABASE IF NOT EXISTS giftlist_shadow;
GRANT ALL PRIVILEGES ON giftlist_shadow.* TO 'giftlist_user'@'%';
FLUSH PRIVILEGES;