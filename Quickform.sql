-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 05, 2018 at 04:23 PM
-- Server version: 10.1.26-MariaDB
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `appjudigot_quickform`
--
CREATE DATABASE IF NOT EXISTS `appjudigot_quickform` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `appjudigot_quickform`;

-- --------------------------------------------------------

--
-- Table structure for table `app_event`
--

CREATE TABLE `app_event` (
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_type` enum('attendance','registration') NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `event_password` varchar(255) DEFAULT NULL,
  `event_form` int(11) DEFAULT NULL,
  `event_list` int(11) DEFAULT NULL,
  `event_email` longtext,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `event_status` enum('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `app_form`
--

CREATE TABLE `app_form` (
  `form_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `form_name` varchar(100) NOT NULL,
  `form_content` longtext NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `app_list`
--

CREATE TABLE `app_list` (
  `list_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `list_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `app_user`
--

CREATE TABLE `app_user` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT 'Default.png',
  `password` varchar(255) NOT NULL,
  `birthdate` date DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `user_type` enum('admin','standard') DEFAULT 'standard'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `app_event`
--
ALTER TABLE `app_event`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_form` (`event_form`),
  ADD KEY `event_ibfk_3` (`event_list`);

--
-- Indexes for table `app_form`
--
ALTER TABLE `app_form`
  ADD PRIMARY KEY (`form_id`),
  ADD KEY `poster` (`user_id`);

--
-- Indexes for table `app_list`
--
ALTER TABLE `app_list`
  ADD PRIMARY KEY (`list_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `app_user`
--
ALTER TABLE `app_user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `app_event`
--
ALTER TABLE `app_event`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `app_form`
--
ALTER TABLE `app_form`
  MODIFY `form_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `app_list`
--
ALTER TABLE `app_list`
  MODIFY `list_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `app_user`
--
ALTER TABLE `app_user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `app_event`
--
ALTER TABLE `app_event`
  ADD CONSTRAINT `app_event_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`user_id`),
  ADD CONSTRAINT `app_event_ibfk_2` FOREIGN KEY (`event_form`) REFERENCES `app_form` (`form_id`),
  ADD CONSTRAINT `app_event_ibfk_3` FOREIGN KEY (`event_list`) REFERENCES `app_list` (`list_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `app_form`
--
ALTER TABLE `app_form`
  ADD CONSTRAINT `app_form_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`user_id`);

--
-- Constraints for table `app_list`
--
ALTER TABLE `app_list`
  ADD CONSTRAINT `app_list_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`user_id`),
  ADD CONSTRAINT `app_list_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `app_event` (`event_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
