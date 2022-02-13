
CREATE TABLE IF NOT EXISTS `mail_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mail` varchar(120) NOT NULL,
  `password` varchar(120) NOT NULL,
  `createdBy` varchar(120) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `mail_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` varchar(60) NOT NULL,
  `sender` varchar(120) NOT NULL,
  `receiver` varchar(120) NOT NULL,
  `subject` varchar(120) NOT NULL,
  `content` text DEFAULT NULL,
  `isRead` tinyint(4) DEFAULT 0,
  `sendBy` varchar(120) NOT NULL,
  PRIMARY KEY (`id`)
)
