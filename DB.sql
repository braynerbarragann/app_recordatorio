CREATE DATABASE  IF NOT EXISTS `recordatorio_salud` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `recordatorio_salud`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: recordatorio_salud
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
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `paciente_id` int unsigned NOT NULL,
  `tipo_cita_id` int unsigned NOT NULL,
  `descripcion` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_hora` datetime NOT NULL,
  `estado` enum('PROGRAMADA','CONFIRMADA','REALIZADA','CANCELADA','NO_ASISTIO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PROGRAMADA',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cita_paciente_fecha` (`paciente_id`,`fecha_hora`),
  KEY `fk_cita_tipo` (`tipo_cita_id`),
  CONSTRAINT `fk_cita_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `paciente` (`id`),
  CONSTRAINT `fk_cita_tipo` FOREIGN KEY (`tipo_cita_id`) REFERENCES `tipo_cita` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cita`
--

LOCK TABLES `cita` WRITE;
/*!40000 ALTER TABLE `cita` DISABLE KEYS */;
INSERT INTO `cita` VALUES (6,13,1,'Consulta médica general','2026-10-05 09:00:00','PROGRAMADA'),(7,15,2,'Control médico de seguimiento','2026-10-07 10:30:00','CONFIRMADA'),(8,20,4,'Consulta con especialista','2026-10-10 14:00:00','PROGRAMADA'),(9,15,2,'Pruebapaciente 15','2026-12-05 00:00:00','PROGRAMADA'),(12,15,1,NULL,'2027-12-09 00:00:00','PROGRAMADA');
/*!40000 ALTER TABLE `cita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dia_semana`
--

DROP TABLE IF EXISTS `dia_semana`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dia_semana` (
  `id` tinyint unsigned NOT NULL,
  `nombre` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  CONSTRAINT `chk_dia_semana` CHECK ((`id` between 1 and 7))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dia_semana`
--

LOCK TABLES `dia_semana` WRITE;
/*!40000 ALTER TABLE `dia_semana` DISABLE KEYS */;
/*!40000 ALTER TABLE `dia_semana` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnostico`
--

DROP TABLE IF EXISTS `diagnostico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnostico` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `paciente_id` int unsigned NOT NULL,
  `cita_id` int unsigned DEFAULT NULL,
  `enfermedad_id` int unsigned NOT NULL,
  `fecha_diagnostico` date DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `estado` enum('ACTIVO','RESUELTO','INACTIVO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`),
  KEY `fk_diagnostico_paciente` (`paciente_id`),
  KEY `fk_diagnostico_cita` (`cita_id`),
  KEY `fk_diagnostico_enfermedad` (`enfermedad_id`),
  CONSTRAINT `fk_diagnostico_cita` FOREIGN KEY (`cita_id`) REFERENCES `cita` (`id`),
  CONSTRAINT `fk_diagnostico_enfermedad` FOREIGN KEY (`enfermedad_id`) REFERENCES `enfermedad` (`id`),
  CONSTRAINT `fk_diagnostico_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `paciente` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnostico`
--

LOCK TABLES `diagnostico` WRITE;
/*!40000 ALTER TABLE `diagnostico` DISABLE KEYS */;
INSERT INTO `diagnostico` VALUES (13,13,6,1,'2026-09-10','Diagnóstico registrado durante consulta general.','ACTIVO'),(14,15,7,2,'2026-09-12','Se recomienda seguimiento médico.','ACTIVO'),(15,20,8,3,'2026-09-15','Diagnóstico asociado a consulta médica.','ACTIVO'),(16,15,9,2,'2026-09-18','Paciente en seguimiento por especialista.','ACTIVO'),(17,16,NULL,5,'2026-09-20','Diagnóstico registrado sin cita asociada.','ACTIVO'),(18,18,NULL,6,'2026-09-22','Registro de diagnóstico independiente de una cita.','ACTIVO'),(19,18,NULL,3,NULL,NULL,'ACTIVO');
/*!40000 ALTER TABLE `diagnostico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enfermedad`
--

DROP TABLE IF EXISTS `enfermedad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enfermedad` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `tipo_enfermedad_id` int unsigned NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `codigo_cie10` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_enfermedad_cie10` (`codigo_cie10`),
  KEY `fk_enfermedad_tipo` (`tipo_enfermedad_id`),
  CONSTRAINT `fk_enfermedad_tipo` FOREIGN KEY (`tipo_enfermedad_id`) REFERENCES `tipo_enfermedad` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enfermedad`
--

LOCK TABLES `enfermedad` WRITE;
/*!40000 ALTER TABLE `enfermedad` DISABLE KEYS */;
INSERT INTO `enfermedad` VALUES (1,1,'Influenza','Infección viral que afecta principalmente el sistema respiratorio.','J11.1'),(2,2,'Hipertensión esencial','Elevación persistente de la presión arterial sin una causa secundaria identificable.','I10'),(3,3,'Asma','Enfermedad respiratoria caracterizada por inflamación y estrechamiento variable de las vías respiratorias.','J45.9'),(5,3,'editAsmapureba','editPrueabEnfermedad respiratoria caracterizada por inflamación y estrechamiento variable de las vías respiratorias.','J45.99'),(6,3,'2PruebAsmapureba',NULL,NULL);
/*!40000 ALTER TABLE `enfermedad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genero`
--

DROP TABLE IF EXISTS `genero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genero` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviatura` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `abreviatura` (`abreviatura`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genero`
--

LOCK TABLES `genero` WRITE;
/*!40000 ALTER TABLE `genero` DISABLE KEYS */;
INSERT INTO `genero` VALUES (1,'Masculino','M'),(2,'Femenino','F'),(3,'No Binario','NB'),(4,'Prefiero no decirlo','PND');
/*!40000 ALTER TABLE `genero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horario_medicamento`
--

DROP TABLE IF EXISTS `horario_medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horario_medicamento` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `tratamiento_medicamento_id` int unsigned NOT NULL,
  `dia_semana_id` tinyint unsigned NOT NULL,
  `hora` time NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_horario_medicamento` (`tratamiento_medicamento_id`,`dia_semana_id`,`hora`),
  KEY `fk_horario_dia` (`dia_semana_id`),
  CONSTRAINT `fk_horario_dia` FOREIGN KEY (`dia_semana_id`) REFERENCES `dia_semana` (`id`),
  CONSTRAINT `fk_horario_tm` FOREIGN KEY (`tratamiento_medicamento_id`) REFERENCES `tratamiento_medicamento` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horario_medicamento`
--

LOCK TABLES `horario_medicamento` WRITE;
/*!40000 ALTER TABLE `horario_medicamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `horario_medicamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicamento`
--

DROP TABLE IF EXISTS `medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicamento` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `presentacion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `concentracion_valor` decimal(10,2) DEFAULT NULL,
  `concentracion_unidad` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_medicamento_detalle` (`nombre`,`presentacion`,`concentracion_valor`,`concentracion_unidad`),
  CONSTRAINT `chk_medicamento_concentracion` CHECK (((`concentracion_valor` is null) or (`concentracion_valor` > 0)))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicamento`
--

LOCK TABLES `medicamento` WRITE;
/*!40000 ALTER TABLE `medicamento` DISABLE KEYS */;
INSERT INTO `medicamento` VALUES (1,'Paracetamol','Tableta',500.00,'mg','Analgésico y antipirético.'),(2,'Ibuprofeno','Tableta',400.00,'mg','Antiinflamatorio no esteroideo.'),(3,'Amoxicilina','Cápsula',500.00,'mg','Antibiótico de uso oral.'),(4,'Prueba2.0','Prueba',9500.00,'mg','Prueba de uso oral.');
/*!40000 ALTER TABLE `medicamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paciente`
--

DROP TABLE IF EXISTS `paciente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paciente` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `tipo_documento_id` int unsigned NOT NULL,
  `genero_id` int unsigned NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_documento` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('ACTIVO','INACTIVO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_paciente_documento` (`tipo_documento_id`,`numero_documento`),
  KEY `fk_paciente_genero` (`genero_id`),
  CONSTRAINT `fk_paciente_genero` FOREIGN KEY (`genero_id`) REFERENCES `genero` (`id`),
  CONSTRAINT `fk_paciente_tipo_documento` FOREIGN KEY (`tipo_documento_id`) REFERENCES `tipo_documento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paciente`
--

LOCK TABLES `paciente` WRITE;
/*!40000 ALTER TABLE `paciente` DISABLE KEYS */;
INSERT INTO `paciente` VALUES (13,1,1,'Carlos Rodríguez','1001234567','1985-04-12','Calle 12 # 8-25 barrio centro','2026-09-23 15:30:31','ACTIVO'),(14,1,2,'María petarda Gómez','1002345678','1990-08-25','Carrera 5 # 23-14','2026-09-23 15:30:31','ACTIVO'),(15,1,1,'Juan David Martínez','1003456789','1978-02-17','Calle 45 # 10-32','2026-09-23 15:30:31','ACTIVO'),(16,1,2,'Laura Isabel Pérez','1004567890','2001-11-03','Carrera 8 # 15-40','2026-09-23 15:30:31','ACTIVO'),(17,2,1,'Samuel Esteban Torres','1204567890','2010-06-21','Calle 20 # 6-18','2026-09-23 15:30:31','ACTIVO'),(18,3,4,'Alex Morgan','CE9876543','1995-09-14','Carrera 10 # 30-12','2026-09-23 15:30:31','ACTIVO'),(20,1,1,'Pruebaeditado1234','1311111',NULL,'calle 343','2026-09-27 14:18:18','ACTIVO');
/*!40000 ALTER TABLE `paciente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_cita`
--

DROP TABLE IF EXISTS `tipo_cita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_cita` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_cita`
--

LOCK TABLES `tipo_cita` WRITE;
/*!40000 ALTER TABLE `tipo_cita` DISABLE KEYS */;
INSERT INTO `tipo_cita` VALUES (1,'Consulta general','Consulta médica general para valoración y seguimiento del paciente.'),(2,'Consulta de especialista','Consulta con un médico especialista según la necesidad del paciente.'),(3,'Control médico','Cita para realizar seguimiento a una condición o tratamiento previamente establecido.'),(4,'Examen médico','Cita destinada a la realización o revisión de exámenes médicos.');
/*!40000 ALTER TABLE `tipo_cita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_documento`
--

DROP TABLE IF EXISTS `tipo_documento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_documento` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviatura` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `abreviatura` (`abreviatura`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_documento`
--

LOCK TABLES `tipo_documento` WRITE;
/*!40000 ALTER TABLE `tipo_documento` DISABLE KEYS */;
INSERT INTO `tipo_documento` VALUES (1,'Cédula de Ciudadanía','CC'),(2,'Tarjeta de Identidad','TI'),(3,'Cédula de Extranjería','CE'),(4,'Pasaporte','PAS');
/*!40000 ALTER TABLE `tipo_documento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_enfermedad`
--

DROP TABLE IF EXISTS `tipo_enfermedad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_enfermedad` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_enfermedad`
--

LOCK TABLES `tipo_enfermedad` WRITE;
/*!40000 ALTER TABLE `tipo_enfermedad` DISABLE KEYS */;
INSERT INTO `tipo_enfermedad` VALUES (1,'Enfermedades infecciosas','Enfermedades causadas por microorganismos como bacterias, virus, hongos o parásitos.'),(2,'Enfermedades cardiovasculares','Enfermedades que afectan el corazón y los vasos sanguíneos.'),(3,'Enfermedades respiratorias','Enfermedades que afectan las vías respiratorias y los pulmones.');
/*!40000 ALTER TABLE `tipo_enfermedad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_frecuencia`
--

DROP TABLE IF EXISTS `tipo_frecuencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_frecuencia` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_frecuencia`
--

LOCK TABLES `tipo_frecuencia` WRITE;
/*!40000 ALTER TABLE `tipo_frecuencia` DISABLE KEYS */;
INSERT INTO `tipo_frecuencia` VALUES (1,'INTERVALO','Administración del medicamento cada cierto número de horas.'),(2,'HORARIO','Administración del medicamento en días y horas específicas.'),(3,'SEGUN_NECESIDAD','Administración del medicamento cuando sea necesario según indicación médica.'),(4,'Prueba','prueba descripcion'),(5,'Prueba sin decrip',NULL);
/*!40000 ALTER TABLE `tipo_frecuencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_relacion`
--

DROP TABLE IF EXISTS `tipo_relacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_relacion` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_relacion`
--

LOCK TABLES `tipo_relacion` WRITE;
/*!40000 ALTER TABLE `tipo_relacion` DISABLE KEYS */;
INSERT INTO `tipo_relacion` VALUES (3,'CUIDADOR'),(2,'FAMILIAR'),(4,'RESPONSABLE');
/*!40000 ALTER TABLE `tipo_relacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `toma_medicamento`
--

DROP TABLE IF EXISTS `toma_medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `toma_medicamento` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tratamiento_medicamento_id` int unsigned NOT NULL,
  `estado` enum('PENDIENTE','TOMADA','OMITIDA','VENCIDA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDIENTE',
  `fecha_hora_programada` datetime NOT NULL,
  `fecha_hora_registro` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_toma_programada` (`tratamiento_medicamento_id`,`fecha_hora_programada`),
  CONSTRAINT `fk_toma_tm` FOREIGN KEY (`tratamiento_medicamento_id`) REFERENCES `tratamiento_medicamento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `toma_medicamento`
--

LOCK TABLES `toma_medicamento` WRITE;
/*!40000 ALTER TABLE `toma_medicamento` DISABLE KEYS */;
INSERT INTO `toma_medicamento` VALUES (1,4,'TOMADA','2026-09-29 19:00:00','2026-09-29 19:05:00'),(2,5,'PENDIENTE','2026-09-29 20:00:00',NULL),(3,6,'PENDIENTE','2026-09-29 21:00:00',NULL);
/*!40000 ALTER TABLE `toma_medicamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tratamiento`
--

DROP TABLE IF EXISTS `tratamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tratamiento` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `paciente_id` int unsigned NOT NULL,
  `diagnostico_id` int unsigned DEFAULT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `fk_tratamiento_diagnostico` (`diagnostico_id`),
  KEY `fk_tratamiento_paciente` (`paciente_id`),
  CONSTRAINT `fk_tratamiento_diagnostico` FOREIGN KEY (`diagnostico_id`) REFERENCES `diagnostico` (`id`),
  CONSTRAINT `fk_tratamiento_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `paciente` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tratamiento`
--

LOCK TABLES `tratamiento` WRITE;
/*!40000 ALTER TABLE `tratamiento` DISABLE KEYS */;
INSERT INTO `tratamiento` VALUES (1,13,13,'Tratamiento inicial','Tratamiento asociado al diagnóstico registrado del paciente.'),(2,15,14,'Tratamiento de seguimiento','Plan de tratamiento para seguimiento médico.'),(3,20,15,'Tratamiento de control','Tratamiento asociado a diagnóstico previo.'),(4,15,16,'Tratamiento complementario','Tratamiento complementario para el paciente.'),(5,17,NULL,'Tratamiento preventivo','Tratamiento registrado sin diagnóstico asociado.'),(6,18,18,'EDITTratamiento PRUEBA','EDITTratamiento DECRIPCION PRUEBA.'),(7,13,NULL,'Tratamiento PRUEBA','Tratamiento DECRIPCION PRUEBA.');
/*!40000 ALTER TABLE `tratamiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tratamiento_medicamento`
--

DROP TABLE IF EXISTS `tratamiento_medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tratamiento_medicamento` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `tratamiento_id` int unsigned NOT NULL,
  `medicamento_id` int unsigned NOT NULL,
  `via_administracion_id` int unsigned NOT NULL,
  `tipo_frecuencia_id` int unsigned NOT NULL,
  `instruccion` text COLLATE utf8mb4_unicode_ci,
  `dosis` decimal(10,2) NOT NULL,
  `unidad_dosis` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `intervalo_horas` int unsigned DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tm_tratamiento` (`tratamiento_id`),
  KEY `fk_tm_medicamento` (`medicamento_id`),
  KEY `fk_tm_via` (`via_administracion_id`),
  KEY `fk_tm_tipo_frecuencia` (`tipo_frecuencia_id`),
  CONSTRAINT `fk_tm_medicamento` FOREIGN KEY (`medicamento_id`) REFERENCES `medicamento` (`id`),
  CONSTRAINT `fk_tm_tipo_frecuencia` FOREIGN KEY (`tipo_frecuencia_id`) REFERENCES `tipo_frecuencia` (`id`),
  CONSTRAINT `fk_tm_tratamiento` FOREIGN KEY (`tratamiento_id`) REFERENCES `tratamiento` (`id`),
  CONSTRAINT `fk_tm_via` FOREIGN KEY (`via_administracion_id`) REFERENCES `via_administracion` (`id`),
  CONSTRAINT `chk_tm_dosis` CHECK ((`dosis` > 0)),
  CONSTRAINT `chk_tm_fechas` CHECK (((`fecha_fin` is null) or (`fecha_fin` >= `fecha_inicio`))),
  CONSTRAINT `chk_tm_intervalo` CHECK (((`intervalo_horas` is null) or (`intervalo_horas` > 0)))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tratamiento_medicamento`
--

LOCK TABLES `tratamiento_medicamento` WRITE;
/*!40000 ALTER TABLE `tratamiento_medicamento` DISABLE KEYS */;
INSERT INTO `tratamiento_medicamento` VALUES (4,1,1,1,1,'Prueba API 1 actualizada',1.50,'tableta',8,'2026-09-29',NULL),(5,2,2,2,2,'Prueba API 2',2.00,'ml',12,'2026-09-29',NULL),(6,3,3,1,3,'Prueba API 3',1.00,'capsula',24,'2026-09-29',NULL);
/*!40000 ALTER TABLE `tratamiento_medicamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contrasena_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('ACTIVO','INACTIVO','BLOQUEADO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVO',
  `ultimo_acceso` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Carlos Rodríguez','carlos.rodriguez@gmail.com','3001234567','$2b$10$EjemploHashCarlos123456789','2026-09-24 10:34:05','ACTIVO','2026-09-23 08:30:00'),(2,'María Gómez','maria.gomez@gmail.com','3102345678','$2b$10$EjemploHashMaria123456789','2026-09-24 10:34:05','ACTIVO','2026-09-22 19:45:00'),(5,'pruebauser','prueba@gmail.com',NULL,'123213sddasdas','2026-09-27 20:36:09','ACTIVO',NULL),(6,'Prueba autenticador','prueba.rodriguez@gmail.com','3001234567','$2b$10$p4IJrDwOCPD/GxAOJBfqYeieV6RskZrveANgm/91fWU81eAaeJNla','2026-10-05 21:34:43','ACTIVO',NULL),(7,'Prueba2 autenticador','prueba2.rodriguez@gmail.com','3001234567','$2b$10$U7BgezpBlUwjLCRWJsrkpepKaVpiesfPaHU/IIdsOkYV9zSn7wA2u','2026-10-05 21:48:48','ACTIVO',NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_paciente`
--

DROP TABLE IF EXISTS `usuario_paciente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_paciente` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` int unsigned NOT NULL,
  `paciente_id` int unsigned NOT NULL,
  `tipo_relacion_id` int unsigned NOT NULL,
  `fecha_vinculacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('ACTIVO','INACTIVO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuario_paciente` (`usuario_id`,`paciente_id`),
  KEY `fk_usuario_paciente_paciente` (`paciente_id`),
  KEY `fk_usuario_paciente_tipo_relacion` (`tipo_relacion_id`),
  CONSTRAINT `fk_usuario_paciente_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `paciente` (`id`),
  CONSTRAINT `fk_usuario_paciente_tipo_relacion` FOREIGN KEY (`tipo_relacion_id`) REFERENCES `tipo_relacion` (`id`),
  CONSTRAINT `fk_usuario_paciente_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_paciente`
--

LOCK TABLES `usuario_paciente` WRITE;
/*!40000 ALTER TABLE `usuario_paciente` DISABLE KEYS */;
INSERT INTO `usuario_paciente` VALUES (1,1,13,2,'2026-09-28 19:19:10','ACTIVO'),(2,2,15,3,'2026-09-28 19:19:10','ACTIVO'),(4,1,16,3,'2026-09-28 19:19:10','ACTIVO'),(5,2,17,2,'2026-09-28 19:19:10','ACTIVO'),(6,5,18,2,'2026-09-28 19:19:10','ACTIVO'),(7,5,14,3,'2026-09-28 22:30:46','ACTIVO');
/*!40000 ALTER TABLE `usuario_paciente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `via_administracion`
--

DROP TABLE IF EXISTS `via_administracion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `via_administracion` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `via_administracion`
--

LOCK TABLES `via_administracion` WRITE;
/*!40000 ALTER TABLE `via_administracion` DISABLE KEYS */;
INSERT INTO `via_administracion` VALUES (1,'Topico','Aplicar en la zona afectada'),(2,'Oral','consumir via oral');
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

-- Dump completed on 2026-10-05 22:53:58
