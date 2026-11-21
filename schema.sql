-- ===================================================
-- Database: job_portal
-- Description: Complete Relational Schema for Job Portal
-- ===================================================

-- Create database if it does not already exist
CREATE DATABASE IF NOT EXISTS `job_portal` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `job_portal`;

-- Disable foreign key checks for clean recreation if needed
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they exist to allow clean script execution
DROP TABLE IF EXISTS `saved_jobs`;
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `companies`;
DROP TABLE IF EXISTS `users`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;


-- ---------------------------------------------------
-- Table 1: users
-- Stores all system users (Job Seekers, Employers, Admins)
-- ---------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('job_seeker', 'employer', 'admin') NOT NULL DEFAULT 'job_seeker',
  `phone` VARCHAR(20) DEFAULT NULL,
  `profile_image` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------
-- Table 2: companies
-- Stores company profiles created by employers
-- ---------------------------------------------------
CREATE TABLE `companies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `employer_id` INT NOT NULL,
  `company_name` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `location` VARCHAR(150) DEFAULT NULL,
  `logo` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`employer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------
-- Table 3: jobs
-- Stores job postings created by employers
-- ---------------------------------------------------
CREATE TABLE `jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `employer_id` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `company_name` VARCHAR(150) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `salary` VARCHAR(100) DEFAULT NULL,
  `job_type` VARCHAR(50) DEFAULT 'Full-Time',
  `skills` TEXT DEFAULT NULL,
  `experience` VARCHAR(100) DEFAULT NULL,
  `deadline` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`employer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------
-- Table 4: applications
-- Stores job applications submitted by job seekers
-- ---------------------------------------------------
CREATE TABLE `applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` INT NOT NULL,
  `applicant_id` INT NOT NULL,
  `resume` VARCHAR(255) NOT NULL,
  `cover_letter` TEXT DEFAULT NULL,
  `status` ENUM('Applied', 'Under Review', 'Interview Scheduled', 'Shortlisted', 'Rejected', 'Accepted') DEFAULT 'Applied',
  `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`applicant_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `unique_job_applicant` UNIQUE (`job_id`, `applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------
-- Table 5: saved_jobs
-- Stores bookmarked/saved jobs by job seekers
-- ---------------------------------------------------
CREATE TABLE `saved_jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `job_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `unique_user_saved_job` UNIQUE (`user_id`, `job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ===================================================
-- SAMPLE SEED DATA (FOR TESTING)
-- ===================================================

-- Insert sample users (Passwords are hashed placeholders)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`) VALUES
(1, 'Alex Morgan', 'alex.morgan@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'job_seeker', '+1 555-0192'),
(2, 'TechCorp Recruiter', 'hr@techcorp.example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'employer', '+1 555-0193'),
(3, 'Admin User', 'admin@jobportal.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'admin', '+1 555-0194');

-- Insert sample company profile
INSERT INTO `companies` (`id`, `employer_id`, `company_name`, `description`, `website`, `location`) VALUES
(1, 2, 'TechCorp Global', 'Leading cloud and AI software enterprise company.', 'https://techcorp-example.com', 'San Francisco, CA');

-- Insert sample job postings
INSERT INTO `jobs` (`id`, `employer_id`, `title`, `description`, `company_name`, `location`, `salary`, `job_type`, `skills`, `experience`, `deadline`) VALUES
(1, 2, 'Senior Full Stack React & Node Engineer', 'Looking for an experienced React.js and Node.js developer to lead cloud platform development.', 'TechCorp Global', 'San Francisco, CA', '$140k - $175k / year', 'Full-Time', 'React, Node.js, Express, MySQL', '5+ years', '2026-11-30'),
(2, 2, 'UI/UX Product Designer', 'Design modern user interfaces and design systems for enterprise web applications.', 'TechCorp Global', 'Remote', '$100k - $130k / year', 'Full-Time', 'Figma, UI/UX, Design Systems', '3+ years', '2026-12-15');

-- Insert sample application
INSERT INTO `applications` (`id`, `job_id`, `applicant_id`, `resume`, `cover_letter`, `status`) VALUES
(1, 1, 1, 'Alex_Morgan_Resume.pdf', 'Excited to apply for the Senior Full Stack role!', 'Under Review');

-- Insert sample saved job
INSERT INTO `saved_jobs` (`id`, `user_id`, `job_id`) VALUES
(1, 1, 2);
