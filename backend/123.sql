-- MySQL dump 10.13  Distrib 8.0.34, for macos13 (arm64)
--
-- Host: 127.0.0.1    Database: meeting_room_booking_system
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '订单id',
  `title` varchar(255) NOT NULL DEFAULT '会议室预定' COMMENT '订单标题',
  `startTime` varchar(255) NOT NULL COMMENT '预定开始时间',
  `endTime` varchar(255) NOT NULL COMMENT '预定结束时间',
  `status` int NOT NULL DEFAULT '0' COMMENT '预定状态',
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `userId` int DEFAULT NULL,
  `meetingRoomId` int DEFAULT NULL COMMENT '会议室ID',
  PRIMARY KEY (`id`),
  KEY `FK_336b3f4a235460dc93645fbf222` (`userId`),
  KEY `FK_03b2beec0de5cc949438c5424eb` (`meetingRoomId`),
  CONSTRAINT `FK_03b2beec0de5cc949438c5424eb` FOREIGN KEY (`meetingRoomId`) REFERENCES `meeting-room` (`id`),
  CONSTRAINT `FK_336b3f4a235460dc93645fbf222` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (28,'会议室预定','2024-02-29 15:06:16','2024-02-29 16:06:16',3,'2024-02-29 07:06:16.217554','2024-02-29 07:43:51.000000',4,4),(29,'会议室预定','2024-02-29 15:06:16','2024-02-29 16:06:16',3,'2024-02-29 07:06:16.247819','2024-02-29 07:47:56.000000',3,6),(30,'会议室预定','2024-02-29 15:06:16','2024-02-29 16:06:16',1,'2024-02-29 07:06:16.274910','2024-02-29 07:48:16.000000',3,4),(31,'会议室预定','2024-02-29 15:06:16','2024-02-29 16:06:16',0,'2024-02-29 07:06:16.321708','2024-02-29 07:06:16.321708',4,6);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_attendees`
--

DROP TABLE IF EXISTS `booking_attendees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_attendees` (
  `booking_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`booking_id`,`user_id`),
  KEY `IDX_9c8042a806022ef9e11cb3c8b0` (`booking_id`),
  KEY `IDX_27a456e539de09d075217c9948` (`user_id`),
  CONSTRAINT `FK_27a456e539de09d075217c99485` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_9c8042a806022ef9e11cb3c8b05` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_attendees`
--

LOCK TABLES `booking_attendees` WRITE;
/*!40000 ALTER TABLE `booking_attendees` DISABLE KEYS */;
INSERT INTO `booking_attendees` VALUES (28,3),(28,4);
/*!40000 ALTER TABLE `booking_attendees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meeting-room`
--

DROP TABLE IF EXISTS `meeting-room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meeting-room` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '会议室ID',
  `address` varchar(255) NOT NULL COMMENT '会议室地址',
  `capacity` int NOT NULL COMMENT '会议室容量',
  `description` varchar(255) DEFAULT NULL COMMENT '会议室描述',
  `status` int NOT NULL COMMENT '会议室状态',
  `name` varchar(255) NOT NULL COMMENT '会议室名称',
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meeting-room`
--

LOCK TABLES `meeting-room` WRITE;
/*!40000 ALTER TABLE `meeting-room` DISABLE KEYS */;
INSERT INTO `meeting-room` VALUES (4,'302',10,'第二个会议室',1,'会议室2','2024-02-22 08:24:29.118084','2024-02-22 08:24:29.118084'),(6,'301',15,'首个会议室',1,'会议室1','2024-02-26 09:40:45.245075','2024-02-26 09:40:45.245075');
/*!40000 ALTER TABLE `meeting-room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL COMMENT '权限代码',
  `description` varchar(100) NOT NULL COMMENT '权限描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission`
--

LOCK TABLES `permission` WRITE;
/*!40000 ALTER TABLE `permission` DISABLE KEYS */;
INSERT INTO `permission` VALUES (1,'ccc','访问 ccc 接口'),(2,'ddd','访问 ddd 接口'),(3,'ccc','访问 ccc 接口'),(4,'ddd','访问 ddd 接口'),(5,'ccc','访问 ccc 接口'),(6,'ddd','访问 ddd 接口'),(7,'ccc','访问 ccc 接口'),(8,'ddd','访问 ddd 接口'),(9,'ccc','访问 ccc 接口'),(10,'ddd','访问 ddd 接口'),(11,'ccc','访问 ccc 接口'),(12,'ddd','访问 ddd 接口');
/*!40000 ALTER TABLE `permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '角色名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'管理员'),(2,'普通用户'),(3,'管理员'),(4,'普通用户'),(5,'管理员'),(6,'普通用户'),(7,'管理员'),(8,'普通用户'),(9,'管理员'),(10,'普通用户'),(11,'管理员'),(12,'普通用户');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permission`
--

DROP TABLE IF EXISTS `role_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permission` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `IDX_3d0a7155eafd75ddba5a701336` (`role_id`),
  KEY `IDX_e3a3ba47b7ca00fd23be4ebd6c` (`permission_id`),
  CONSTRAINT `FK_3d0a7155eafd75ddba5a7013368` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_e3a3ba47b7ca00fd23be4ebd6cf` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permission`
--

LOCK TABLES `role_permission` WRITE;
/*!40000 ALTER TABLE `role_permission` DISABLE KEYS */;
INSERT INTO `role_permission` VALUES (1,1),(1,2),(2,1),(3,3),(3,4),(4,3),(5,5),(5,6),(6,5),(7,7),(7,8),(8,7),(9,9),(9,10),(10,9),(11,11),(11,12),(12,11);
/*!40000 ALTER TABLE `role_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(50) NOT NULL COMMENT '密码',
  `email` varchar(50) NOT NULL COMMENT '邮箱',
  `phone` varchar(50) DEFAULT NULL COMMENT '电话',
  `nickName` varchar(50) NOT NULL COMMENT '昵称',
  `avatar` varchar(50) DEFAULT NULL COMMENT '头像',
  `isFrozen` tinyint NOT NULL DEFAULT '0' COMMENT '是否冻结',
  `isAdmin` tinyint NOT NULL DEFAULT '0' COMMENT '是否是管理员',
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2,'digua2','96e79218965eb72c92a549dd5a330112','jeffreybin@tencent.com',NULL,'地瓜','I\'m avatar',0,1,'2024-02-26 07:18:16.382449','2024-02-22 03:49:01.470538'),(3,'zhangsan','96e79218965eb72c92a549dd5a330112','707772620@qq.com','13233323333','张三',NULL,0,0,'2024-02-26 07:22:00.444231','2024-02-22 03:49:01.470538'),(4,'lisi','e3ceb5881a0a1fdaad01296d7554868d','yy@yy.com',NULL,'李四',NULL,0,0,'2024-01-15 09:20:13.858386','2024-02-22 03:49:01.470538'),(14,'wangwu','1a100d2c0dab19c4430e7d73762b3423','zz@yy.com',NULL,'王五',NULL,0,0,'2024-02-26 07:18:31.262821','2024-02-22 03:49:01.470538'),(17,'zhaoliu','1a100d2c0dab19c4430e7d73762b3423','zz@yy.com',NULL,'赵六',NULL,0,0,'2024-02-26 07:18:31.264314','2024-02-22 06:19:00.124839');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `IDX_d0e5815877f7395a198a4cb0a4` (`user_id`),
  KEY `IDX_32a6fc2fcb019d8e3a8ace0f55` (`role_id`),
  CONSTRAINT `FK_32a6fc2fcb019d8e3a8ace0f55f` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_d0e5815877f7395a198a4cb0a46` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (3,1),(4,2),(14,9),(14,10);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-01 17:27:15
