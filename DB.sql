CREATE DATABASE  IF NOT EXISTS `recordatorio_medicamentos` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `recordatorio_medicamentos`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: recordatorio_medicamentos
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `cita`
--

DROP TABLE IF EXISTS `cita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cita` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha_hora` datetime NOT NULL,
  `estado` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cita_usuario` (`usuario_id`),
  CONSTRAINT `fk_cita_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cita`
--

LOCK TABLES `cita` WRITE;
/*!40000 ALTER TABLE `cita` DISABLE KEYS */;
INSERT INTO `cita` VALUES (1,1,'Cita de control médico','2026-09-15 09:00:00','pendiente'),(2,2,'Cita con especialista','2026-09-18 14:30:00','pendiente'),(3,2,'Cita con admin','2026-09-18 00:00:00','pendiente'),(4,1,'Cita dentista','2026-09-18 00:00:00','pendiente'),(5,1,'Cita dentistax2','2026-09-18 00:00:00','pendiente');
/*!40000 ALTER TABLE `cita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicamento`
--

DROP TABLE IF EXISTS `medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `presentacion` varchar(100) DEFAULT NULL,
  `concentracion` varchar(50) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_medicamento` (`nombre`,`presentacion`,`concentracion`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicamento`
--

LOCK TABLES `medicamento` WRITE;
/*!40000 ALTER TABLE `medicamento` DISABLE KEYS */;
INSERT INTO `medicamento` VALUES (1,'Acetaminofén','Tableta','500 mg','Analgésico y antipirético para aliviar dolor y reducir la fiebre'),(2,'Ibuprofeno','Tableta','400 mg','Antiinflamatorio no esteroideo para aliviar dolor e inflamación'),(3,'dolex','Tableta','400 mg','para la gripe');
/*!40000 ALTER TABLE `medicamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `toma_medicamento`
--

DROP TABLE IF EXISTS `toma_medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `toma_medicamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tratamiento_medicamento_id` int NOT NULL,
  `estado` varchar(30) NOT NULL,
  `fecha_hora_programada` datetime NOT NULL,
  `fecha_hora_registro` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_toma_tratamiento_medicamento` (`tratamiento_medicamento_id`),
  CONSTRAINT `fk_toma_tratamiento_medicamento` FOREIGN KEY (`tratamiento_medicamento_id`) REFERENCES `tratamiento_medicamento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `toma_medicamento`
--

LOCK TABLES `toma_medicamento` WRITE;
/*!40000 ALTER TABLE `toma_medicamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `toma_medicamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tratamiento`
--

DROP TABLE IF EXISTS `tratamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tratamiento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tratamiento_usuario` (`usuario_id`),
  CONSTRAINT `fk_tratamiento_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tratamiento`
--

LOCK TABLES `tratamiento` WRITE;
/*!40000 ALTER TABLE `tratamiento` DISABLE KEYS */;
INSERT INTO `tratamiento` VALUES (1,1,'Tratamiento para hipertensión','Control de la presión arterial'),(2,1,'Tratamiento para el dolor','Tratamiento para aliviar dolor muscular'),(3,2,'Tratamiento para infección','Tratamiento antibiótico por 7 días'),(4,2,'Tratamiento xxxxxxxxx','Control xxxxxxxxxxxxxxxxxx'),(5,2,'Tratamiento tttttttttttttttt','Tratamiento antibiótico por ttttttttttt'),(6,1,'Tratamiento tttttttttttttttt','Tratamiento antibiótico por ttttttttttt'),(7,2,'Tratamientoprueba','Tratamiento aprueba'),(8,3,'Tratamiento para infección','Tratamiento antibiótico por 7 días');
/*!40000 ALTER TABLE `tratamiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tratamiento_medicamento`
--

DROP TABLE IF EXISTS `tratamiento_medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tratamiento_medicamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tratamiento_id` int NOT NULL,
  `medicamento_id` int NOT NULL,
  `via_administracion_id` int NOT NULL,
  `instruccion` varchar(255) DEFAULT NULL,
  `dosis` decimal(10,2) DEFAULT NULL,
  `unidad_dosis` varchar(30) DEFAULT NULL,
  `frecuencia_horas` decimal(7,4) DEFAULT NULL,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tm_tratamiento` (`tratamiento_id`),
  KEY `fk_tm_medicamento` (`medicamento_id`),
  KEY `fk_tm_via_administracion` (`via_administracion_id`),
  CONSTRAINT `fk_tm_medicamento` FOREIGN KEY (`medicamento_id`) REFERENCES `medicamento` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_tm_tratamiento` FOREIGN KEY (`tratamiento_id`) REFERENCES `tratamiento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tm_via_administracion` FOREIGN KEY (`via_administracion_id`) REFERENCES `via_administracion` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tratamiento_medicamento`
--

LOCK TABLES `tratamiento_medicamento` WRITE;
/*!40000 ALTER TABLE `tratamiento_medicamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `tratamiento_medicamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `genero` varchar(30) DEFAULT NULL,
  `correo` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `contraseña_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Juan Perez','Masculino','juan@gmail.com','3001234567','1999-05-15','hash123'),(2,'Maria Gomez','Femenino','maria@gmail.com','3109876543','2001-08-22','hash456'),(3,'Marta Gonza','Femenino','marta@gmail.com','3109875555','2001-08-12','hash45633'),(5,'Mario Bross','Masculino','mario@gmail.com','3239875555','2001-08-04','hash45644'),(6,'kevyn Gonza','Mixto','kevyn@gmail.com','31098754555','2001-08-12','hash45633'),(7,'xxxxx','Masculino','juxxxxxx@gmail.com','30012xx4567','1999-05-15','hash123'),(8,'zzzzzzz','Masculino','juzzzzzz@gmail.com','30012xx4567','1999-05-15','hash123');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `via_administracion`
--

DROP TABLE IF EXISTS `via_administracion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `via_administracion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `via_administracion`
--

LOCK TABLES `via_administracion` WRITE;
/*!40000 ALTER TABLE `via_administracion` DISABLE KEYS */;
INSERT INTO `via_administracion` VALUES (1,'Vía oral','Administración del medicamento por la boca'),(2,'Vía intravenosa','Administración del medicamento directamente en una vena'),(3,'Vía topica','Administración del medicamento alicando en la zona afectada'),(4,'Vía intramuscular','Administración del medicamento en el musculo'),(5,'Vía anal','Administración del medicamento anal'),(6,'Vía renal','Administración del medicamento en el ano'),(7,'Vía x ','Administración del medicamento por x'),(8,'xxxxxx','Administración del medicamento por la xxxxx');
/*!40000 ALTER TABLE `via_administracion` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-16 12:21:01
