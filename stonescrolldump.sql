-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: stonescroll
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `scroll_tracking`
--

DROP TABLE IF EXISTS `scroll_tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scroll_tracking` (
  `userid` int NOT NULL,
  `uname` varchar(250) DEFAULT NULL,
  `nocopy` int NOT NULL,
  `papertype` varchar(150) DEFAULT NULL,
  `side` int DEFAULT NULL,
  `delivarydate` timestamp NULL DEFAULT NULL,
  `createddate` timestamp NULL DEFAULT NULL,
  `modifieddate` timestamp NULL DEFAULT NULL,
  `doc_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scroll_tracking`
--

LOCK TABLES `scroll_tracking` WRITE;
/*!40000 ALTER TABLE `scroll_tracking` DISABLE KEYS */;
INSERT INTO `scroll_tracking` VALUES (9,'testuser7',2,'A4',2,'2024-02-13 00:00:00',NULL,NULL,'65dcb9b7c59dc8b5e8bb6d0c');
/*!40000 ALTER TABLE `scroll_tracking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ss_userdetails`
--

DROP TABLE IF EXISTS `ss_userdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ss_userdetails` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `fname` varchar(150) DEFAULT NULL,
  `lname` varchar(150) DEFAULT NULL,
  `phonenumber` varchar(180) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `taddress` varchar(250) DEFAULT NULL,
  `paddress` varchar(250) DEFAULT NULL,
  `plan` varchar(50) NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `user_status` enum('ACTIVE','INACTIVE') NOT NULL,
  `modifieddate` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createddate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `password` varchar(255) NOT NULL,
  `uname` varchar(255) NOT NULL,
  UNIQUE KEY `userid` (`userid`),
  KEY `idx_userid` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ss_userdetails`
--

LOCK TABLES `ss_userdetails` WRITE;
/*!40000 ALTER TABLE `ss_userdetails` DISABLE KEYS */;
INSERT INTO `ss_userdetails` VALUES (1,'test demo','demo','','test1@gmail.com','paid address','address in bill','D',0.00,'ACTIVE','2024-02-22 11:35:15','2024-02-21 15:02:33','',''),(2,'test2 demo','demo2','91-7788227712','test1@gmail.com','paid address','address in bill','D',0.00,'ACTIVE','2024-02-22 12:35:45','2024-02-21 15:06:43','',''),(3,'test2 demo','demo2','','test1@gmail.com','paid address','address in bill','D',0.00,'ACTIVE','2024-02-22 11:35:24','2024-02-21 16:07:09','undefined',''),(4,'test2 demo','demo2','','test1@gmail.com','paid address','address in bill','D',0.00,'ACTIVE','2024-02-22 11:35:27','2024-02-22 08:32:05','undefined','testuser'),(5,'test2 demo','demo2','91-7788227711','test1@gmail.com','paid address','address in bill','D',0.00,'ACTIVE','2024-02-22 12:35:11','2024-02-22 12:35:11','undefined','testuser'),(6,'test3 demo','demo3','91-7788227713','test3@gmail.com','paid address','address in bill','D',0.00,'ACTIVE','2024-02-22 12:49:45','2024-02-22 12:49:45','undefined','testuser2'),(7,'test4 demo','demo4','91-7788227714','test4@gmail.com','paid address','address in bill','D',0.00,'ACTIVE','2024-02-22 12:51:25','2024-02-22 12:51:25','undefined','testuser4'),(8,'test5 demo','demo5','91-7788227715','test5@gmail.com','paid address','address in bill','D',0.00,'ACTIVE','2024-02-22 12:53:49','2024-02-22 12:53:49','undefined','testuser5'),(9,'test7 demo','demo7','91-7788227717','test7@gmail.com','paid address','address in bill','D',0.00,'ACTIVE','2024-02-22 13:06:51','2024-02-22 13:06:51','$2b$12$bnrI50NYEgWVic4WQojiRuwF9fuk2hUlkSqlipIsY.sRs0PJnZefi','testuser7'),(10,'test9 demo','demo9','91-7788227719','test9@gmail.com','paid address','address in bill','D',0.00,'ACTIVE','2024-02-23 10:26:43','2024-02-23 10:26:43','$2b$12$scVDYgUCPBd7IVLCB5IDq.VyDAot79q4SLI21mpfQbqFPfuPOaek2','testuser9');
/*!40000 ALTER TABLE `ss_userdetails` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-28 20:12:56
