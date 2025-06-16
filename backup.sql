-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: serenity
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `provider_account_id` varchar(255) DEFAULT NULL,
  `access_token` text,
  `refresh_token` text,
  `expires_at` int DEFAULT NULL,
  `token_type` varchar(255) DEFAULT NULL,
  `scope` text,
  `id_token` text,
  `session_state` text,
  PRIMARY KEY (`id`),
  KEY `accounts_ibfk_1` (`user_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,NULL,62,1,'2025-06-13 10:20:22'),(2,NULL,64,1,'2025-06-13 10:20:45'),(3,NULL,63,1,'2025-06-13 12:14:46'),(4,NULL,63,1,'2025-06-13 12:15:55'),(5,NULL,63,1,'2025-06-13 12:16:27'),(6,NULL,69,1,'2025-06-13 12:48:34'),(7,NULL,57,1,'2025-06-13 12:56:09'),(8,NULL,57,1,'2025-06-13 13:12:31');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` bigint DEFAULT NULL,
  `receiver_id` bigint DEFAULT NULL,
  `message` text NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,3,1,'hallo','2025-06-14 17:31:01'),(2,1,3,'hi','2025-06-14 17:40:40'),(3,1,3,'Terima kasih telah menghubungi kami. Ada yang bisa saya bantu?','2025-06-14 17:55:06');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,60,1,189000),(2,1,62,1,169000),(3,2,63,1,299000),(4,3,68,1,199000),(5,4,69,1,109000),(6,4,64,1,139000),(7,5,63,1,299000),(8,6,66,1,179000),(9,7,58,1,125000),(10,8,59,1,89000),(11,9,58,1,125000),(12,10,60,1,189000),(13,11,60,1,189000),(14,12,58,1,125000),(15,13,60,1,189000),(16,14,58,1,125000),(17,15,59,1,89000),(18,16,59,1,89000),(19,17,59,1,89000),(20,18,60,1,189000),(21,19,59,1,89000),(22,20,57,2,249000),(23,21,63,1,299000),(24,22,63,1,299000),(25,23,57,1,249000),(26,24,63,1,299000),(27,25,60,1,189000),(28,26,89,1,249000),(29,27,60,1,189000);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `total_price` int DEFAULT NULL,
  `status` enum('pending','paid','shipped','received','cancelled','returned') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `resi` varchar(50) DEFAULT NULL,
  `courier` varchar(50) DEFAULT NULL,
  `delivery_status` enum('pending','processing','shipped','delivered','returned') DEFAULT 'pending',
  `complaint` text,
  `shipping_name` varchar(100) DEFAULT NULL,
  `shipping_phone` varchar(20) DEFAULT NULL,
  `shipping_address` text,
  `midtrans_order_id` varchar(100) DEFAULT NULL,
  `midtrans_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_url` text NOT NULL,
  `description` text NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `category` enum('Baju','Jaket','Celana','Aksesoris') NOT NULL,
  `gender` enum('Pria','Wanita','Unisex') NOT NULL DEFAULT 'Unisex',
  `is_featured` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (57,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400','Kemeja Formal Pria Lengan Panjang Warna Navy - Bahan katun premium dengan desain elegan untuk acara formal dan kantor',249000.00,'Baju','Pria',1,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(58,'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400','Polo Shirt Pria Cotton Combed - Nyaman dipakai sehari-hari dengan warna yang tidak mudah pudar',125000.00,'Baju','Pria',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(59,'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400','T-Shirt Pria Casual Motif Grafis - Bahan katun 100% dengan printing berkualitas tinggi',89000.00,'Baju','Pria',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(60,'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400','Hoodie Pria Premium - Bahan fleece tebal dan hangat, cocok untuk cuaca dingin',189000.00,'Baju','Pria',1,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(61,'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400','Kaos Polo Pria Stripe - Polo shirt dengan motif garis-garis klasik',139000.00,'Baju','Pria',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(62,'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400','Blouse Wanita Sifon Motif Bunga - Desain feminin dengan detail ruffle yang cantik',169000.00,'Baju','Wanita',1,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(63,'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400','Dress Midi Wanita Elegant - Bahan jersey stretch dengan potongan A-line yang flowy',299000.00,'Baju','Wanita',1,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(64,'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400','Cardigan Wanita Rajut - Cardigan tipis yang cocok untuk layering dalam berbagai outfit',139000.00,'Baju','Wanita',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(65,'https://images.unsplash.com/photo-1566479179817-c0c8f42b0e8c?w=400','Top Tank Wanita Basic - Atasan simpel yang bisa dipadukan dengan berbagai outer',65000.00,'Baju','Wanita',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(66,'https://images.unsplash.com/photo-1583009070950-da4cf0f31c3f?w=400','Kemeja Wanita Oversized - Kemeja longgar dengan gaya boyfriend shirt yang trendy',179000.00,'Baju','Wanita',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(67,'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400','Kemeja Flannel Unisex Kotak-kotak - Bahan flanel premium dengan motif kotak klasik',159000.00,'Baju','Unisex',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(68,'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=400','Sweater Crewneck Unisex - Sweater hangat dengan desain minimalis untuk pria dan wanita',199000.00,'Baju','Unisex',1,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(69,'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400','Kaos Vintage Band Tee - T-shirt dengan desain band legendaris, bahan cotton combed',109000.00,'Baju','Unisex',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(70,'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400','Shirt Denim Unisex - Kemeja jeans classic yang cocok untuk gaya kasual santai',179000.00,'Baju','Unisex',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(71,'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400','Jaket Bomber Pria Premium - Jaket bomber dengan bahan parasut berkualitas dan resleting YKK',319000.00,'Jaket','Pria',1,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(72,'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400','Jaket Kulit Sintetis Pria - Jaket kulit sintetis dengan desain biker jacket yang keren',399000.00,'Jaket','Pria',1,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(73,'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400','Jaket Hoodie Zipper Pria - Hoodie dengan resleting depan dan kantong samping yang praktis',229000.00,'Jaket','Pria',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(74,'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400','Jaket Denim Wanita Classic - Jaket jeans timeless dengan wash effect yang natural',259000.00,'Jaket','Wanita',1,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(75,'https://images.unsplash.com/photo-1609205458177-4ea0c4eda8ad?w=400','Blazer Wanita Formal - Blazer dengan potongan slim fit untuk tampilan profesional',349000.00,'Jaket','Wanita',1,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(76,'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400','Cardigan Panjang Wanita - Cardigan rajut panjang yang cocok untuk layering',189000.00,'Jaket','Wanita',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(77,'https://images.unsplash.com/photo-1525845859779-54d477ff291f?w=400','Jaket Windbreaker Unisex - Jaket anti angin ringan untuk aktivitas outdoor',189000.00,'Jaket','Unisex',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(78,'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400','Varsity Jacket Unisex - Jaket varsity dengan kombinasi warna klasik',279000.00,'Jaket','Unisex',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(79,'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400','Celana Jeans Pria Skinny Fit - Jeans dengan potongan skinny fit dan stretch yang nyaman',199000.00,'Celana','Pria',1,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(80,'https://images.unsplash.com/photo-1506629905230-b5b4d24e0903?w=400','Celana Chino Pria - Celana chino dengan bahan cotton twill yang premium',169000.00,'Celana','Pria',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(81,'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400','Celana Cargo Pria - Celana cargo dengan multiple pocket yang fungsional',189000.00,'Celana','Pria',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(82,'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400','Celana Formal Pria - Celana bahan untuk acara formal dengan potongan regular fit',219000.00,'Celana','Pria',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(83,'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400','Celana Kulot Wanita - Celana kulot dengan bahan flowy yang nyaman untuk aktivitas sehari-hari',139000.00,'Celana','Wanita',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(84,'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400','Celana Palazzo Wanita - Celana palazzo dengan motif print yang elegan',159000.00,'Celana','Wanita',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(85,'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400','Celana Jeans Wanita High Waist - Jeans high waist dengan potongan mom jeans',199000.00,'Celana','Wanita',1,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(86,'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400','Legging Wanita Premium - Legging dengan bahan stretch yang nyaman dan tidak transparan',89000.00,'Celana','Wanita',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(87,'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400','Celana Jogger Unisex - Celana jogger dengan bahan cotton fleece dan tali serut',119000.00,'Celana','Unisex',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(88,'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400','Celana Training Unisex - Celana olahraga dengan bahan dry fit yang menyerap keringat',149000.00,'Celana','Unisex',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(89,'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400','Jam Tangan Digital Pria - Jam tangan sport digital dengan fitur stopwatch',249000.00,'Aksesoris','Pria',1,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(90,'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400','Belt Kulit Formal Pria - Ikat pinggang kulit dengan buckle logam berkualitas',129000.00,'Aksesoris','Pria',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(91,'https://images.unsplash.com/photo-1580752300992-559f8e0734e0?w=400','Dompet Kulit Premium Pria - Dompet kulit asli dengan compartment yang rapi',169000.00,'Aksesoris','Pria',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(92,'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400','Tas Handbag Wanita - Tas tangan dengan desain elegant dan bahan kulit sintetis',199000.00,'Aksesoris','Wanita',1,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(93,'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400','Kacamata Sunglasses Wanita - Kacamata hitam dengan frame cat eye yang trendy',179000.00,'Aksesoris','Wanita',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(94,'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=400','Syal Rajut Wanita - Syal rajut hangat dengan desain cable knit pattern',89000.00,'Aksesoris','Wanita',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(95,'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400','Topi Baseball Cap Unisex - Topi baseball dengan bordir logo dan adjustable strap',79000.00,'Aksesoris','Unisex',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(96,'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=400','Backpack Laptop Unisex - Tas ransel dengan compartment khusus laptop 15 inch',289000.00,'Aksesoris','Unisex',1,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(97,'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400','Tas Selempang Canvas Unisex - Tas selempang dengan bahan canvas yang kuat dan tahan lama',149000.00,'Aksesoris','Unisex',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15'),(98,'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400','Kacamata Aviator Unisex - Kacamata aviator klasik dengan UV protection',159000.00,'Aksesoris','Unisex',0,1,'2025-05-31 17:17:15','2025-05-31 17:17:15');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `image` text,
  `role` enum('admin','customer') DEFAULT 'customer',
  `email_verified` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `shipping_name` varchar(100) DEFAULT NULL,
  `shipping_phone` varchar(20) DEFAULT NULL,
  `shipping_address` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'Ruri Nurmarisa','rakagian234@gmail.com','$2b$10$X5X78wXinj./gyVhK6qmYe4c2n9ULb.Vu.YTBelqKPbC9TYAafOEC',NULL,'customer',0,'2025-06-13 10:18:09','Ruri Nurmarisa','08321638716','Majalaya'),(4,'Rayna Kayla Rayya','rakagian12345@gmail.com','$2b$10$9Ky/olgpd3JNuzH2QztNb.n6WxNZH/VMqp23gyrNzTF8kQEF192J.',NULL,'customer',0,'2025-06-13 12:53:49','Rayna Kayla Rayya','089508410132','Grand PKJ'),(5,'Raka Gian Aditya Asbath','admin@serenity.com','$2b$10$.2fLdzbYIe77qpNQfMOzZ.76oYF9blCKT5FU3jSflk9I3Xa9m3PeO',NULL,'admin',0,'2025-06-14 04:53:37',NULL,NULL,NULL),(6,'Raka Gian','rakagian1234@gmail.com',NULL,'https://lh3.googleusercontent.com/a/ACg8ocJFzy1gb3MhJgLhb5N55HL3RmLSS8sM1FGrUiLnxS7yK9pX=s96-c','customer',0,'2025-06-14 07:48:01',NULL,NULL,NULL),(7,'Rasya Muhammad Atthaya','rakagian107@gmail.com','$2b$10$g/DskoPKbGXBFmGbytMEIeKEwDJrv5fm2baLxW6hGkoeBNUh1SYIC',NULL,'customer',0,'2025-06-14 11:56:52','Rasya Muhammad Atthaya','089508410132','Rancamanyar');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification_tokens`
--

DROP TABLE IF EXISTS `verification_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `identifier` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification_tokens`
--

LOCK TABLES `verification_tokens` WRITE;
/*!40000 ALTER TABLE `verification_tokens` DISABLE KEYS */;
INSERT INTO `verification_tokens` VALUES (1,'rakagian234@gmail.com','51053070325c10b6e479deb2f5ff3ffad640021bfc46d174298469842e2ffbca','2025-06-14 10:18:19'),(2,'rakagian12345@gmail.com','fb011d8f0b80cceb585d46ca519093ca3bf0112f081a8c4a3d91c5d70dc810e6','2025-06-14 12:53:57'),(3,'admin@serenity.com','dca51c824df54be079eb4b094485d6be5bb928d0ed377a640be7b08e1c05528e','2025-06-15 04:53:41'),(4,'rakagian107@gmail.com','991f602bd8b6d77cd835edd1b179efd5d6f99e9dd30b63b8a67a3dce51d08872','2025-06-15 11:56:57');
/*!40000 ALTER TABLE `verification_tokens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-16  1:46:07
