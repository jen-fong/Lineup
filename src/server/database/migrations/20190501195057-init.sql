# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.25)
# Database: parkData
# Generation Time: 2019-04-11 14:27:00 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table operatingHour
# ------------------------------------------------------------

DROP TABLE IF EXISTS `operatingHour`;

CREATE TABLE `operatingHour` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `parkOpen` datetime DEFAULT NULL,
  `parkClose` datetime DEFAULT NULL,
  `specialHours` varchar(255) DEFAULT NULL,
  `specialHoursOpen` datetime DEFAULT NULL,
  `specialHoursClose` datetime DEFAULT NULL,
  `theDate` varchar(10) DEFAULT NULL,
  `parkId` bigint(20) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `operatinghours_ibfk_1` (`parkId`),
  CONSTRAINT `operatinghour_ibfk_1` FOREIGN KEY (`parkId`) REFERENCES `park` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table park
# ------------------------------------------------------------

DROP TABLE IF EXISTS `park`;

CREATE TABLE `park` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `shortName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table ride
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ride`;

CREATE TABLE `ride` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `libId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parkId` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `type` varchar(20) DEFAULT 'ride',
  PRIMARY KEY (`id`),
  KEY `ride_ibfk_1` (`parkId`),
  CONSTRAINT `ride_ibfk_1` FOREIGN KEY (`parkId`) REFERENCES `park` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table waitTime
# ------------------------------------------------------------

DROP TABLE IF EXISTS `waitTime`;

CREATE TABLE `waitTime` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `rideId` bigint(20) NOT NULL,
  `wait` int(5) NOT NULL,
  `createdAt` datetime NOT NULL,
  `lastUpdated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) DEFAULT NULL,
  `temperature` int(3) DEFAULT NULL,
  `conditions` varchar(255) DEFAULT NULL,
  `humidity` int(3) DEFAULT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `waitTimes_ibfk_2` (`rideId`),
  CONSTRAINT `waitTimes_ibfk_2` FOREIGN KEY (`rideId`) REFERENCES `ride` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
