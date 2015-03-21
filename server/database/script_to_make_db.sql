-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema GuestBook
-- -----------------------------------------------------
-- Base for the GuestBook app

-- -----------------------------------------------------
-- Schema GuestBook
--
-- Base for the GuestBook app
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `GuestBook` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `GuestBook` ;

-- -----------------------------------------------------
-- Table `GuestBook`.`GuestBook`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GuestBook`.`GuestBook` (
  `idArticle` INT NOT NULL AUTO_INCREMENT COMMENT 'Id of the Table Article\n',
  `user` VARCHAR(40) NOT NULL COMMENT 'User, who has past article',
  `time` VARCHAR(20) NOT NULL COMMENT 'Time, when aricle was pasted\n',
  `imgSrc` VARCHAR(200) NOT NULL COMMENT 'User Img Src\n',
  `text` VARCHAR(1000) NOT NULL COMMENT 'Article\n',
  PRIMARY KEY (`idArticle`),
  UNIQUE INDEX `idGuestBook_UNIQUE` (`idArticle` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GuestBook`.`GuestMsg`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GuestBook`.`GuestMsg` (
  `msgId` INT NOT NULL AUTO_INCREMENT,
  `fromId` INT NOT NULL,
  `toId` INT NOT NULL,
  `time` VARCHAR(20) NOT NULL,
  `msg` VARCHAR(1000) NOT NULL,
  PRIMARY KEY (`msgId`),
  UNIQUE INDEX `msgId_UNIQUE` (`msgId` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GuestBook`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GuestBook`.`Users` (
  `userId` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(20) NOT NULL,
  `lastName` VARCHAR(20) NULL,
  `imgSrc` VARCHAR(200) NOT NULL,
  `mail` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `about` VARCHAR(1000) NULL,
  PRIMARY KEY (`userId`),
  UNIQUE INDEX `userId_UNIQUE` (`userId` ASC))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
