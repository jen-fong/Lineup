-- -------------------------------------------------------------
-- TablePlus 2.3(222)
--
-- https://tableplus.com/
--
-- Database: parkData
-- Generation Time: 2019-05-01 16:11:40.0930
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

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
) ENGINE=InnoDB AUTO_INCREMENT=519 DEFAULT CHARSET=utf8;

CREATE TABLE `park` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `shortName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=292 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=1170633 DEFAULT CHARSET=utf8;




/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;