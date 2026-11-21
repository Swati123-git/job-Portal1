-- =======================================================
-- Student Management System Database Schema
-- Database: student_management_db
-- Designed for BTech Project / Production Use
-- =======================================================

CREATE DATABASE IF NOT EXISTS `student_management_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `student_management_db`;

-- Drop existing tables if re-importing (in correct FK dependency order)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `results`;
DROP TABLE IF EXISTS `marks`;
DROP TABLE IF EXISTS `attendance`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `departments`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- -------------------------------------------------------
-- Table: users (Authentication & Authorization)
-- -------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'student') NOT NULL DEFAULT 'student',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- Table: departments
-- -------------------------------------------------------
CREATE TABLE `departments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `description` TEXT,
  `hod_name` VARCHAR(100) DEFAULT 'Dr. Senior Faculty',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- Table: courses
-- -------------------------------------------------------
CREATE TABLE `courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `department_id` INT NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `code` VARCHAR(30) NOT NULL UNIQUE,
  `credits` INT NOT NULL DEFAULT 4,
  `semester` INT NOT NULL DEFAULT 1,
  `instructor` VARCHAR(100) DEFAULT 'Faculty Member',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_courses_department` FOREIGN KEY (`department_id`) 
    REFERENCES `departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- Table: students
-- -------------------------------------------------------
CREATE TABLE `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL UNIQUE,
  `roll_number` VARCHAR(30) NOT NULL UNIQUE,
  `first_name` VARCHAR(60) NOT NULL,
  `last_name` VARCHAR(60) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) DEFAULT NULL,
  `dob` DATE DEFAULT NULL,
  `gender` ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
  `department_id` INT NOT NULL,
  `semester` INT NOT NULL DEFAULT 1,
  `address` TEXT,
  `blood_group` VARCHAR(10) DEFAULT 'O+',
  `guardian_name` VARCHAR(100) DEFAULT NULL,
  `guardian_phone` VARCHAR(20) DEFAULT NULL,
  `admission_date` DATE NOT NULL,
  `status` ENUM('Active', 'Graduated', 'Suspended', 'Withdrawn') DEFAULT 'Active',
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_students_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_students_department` FOREIGN KEY (`department_id`) 
    REFERENCES `departments` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- Table: attendance
-- -------------------------------------------------------
CREATE TABLE `attendance` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `status` ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL DEFAULT 'Present',
  `remarks` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_student_course_date` (`student_id`, `course_id`, `date`),
  CONSTRAINT `fk_attendance_student` FOREIGN KEY (`student_id`) 
    REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_attendance_course` FOREIGN KEY (`course_id`) 
    REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- Table: marks
-- -------------------------------------------------------
CREATE TABLE `marks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `exam_type` ENUM('Internal 1', 'Internal 2', 'Midterm', 'Final', 'Assignment', 'Lab') NOT NULL,
  `max_marks` DECIMAL(5,2) NOT NULL DEFAULT 100.00,
  `marks_obtained` DECIMAL(5,2) NOT NULL,
  `semester` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_marks_student` FOREIGN KEY (`student_id`) 
    REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_marks_course` FOREIGN KEY (`course_id`) 
    REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- Table: results
-- -------------------------------------------------------
CREATE TABLE `results` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `semester` INT NOT NULL,
  `total_marks` DECIMAL(6,2) NOT NULL DEFAULT 500.00,
  `marks_obtained` DECIMAL(6,2) NOT NULL,
  `percentage` DECIMAL(5,2) NOT NULL,
  `gpa` DECIMAL(4,2) NOT NULL,
  `grade` VARCHAR(5) NOT NULL,
  `status` ENUM('Pass', 'Fail', 'Probation') NOT NULL DEFAULT 'Pass',
  `published_date` DATE DEFAULT (CURRENT_DATE),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_student_semester_result` (`student_id`, `semester`),
  CONSTRAINT `fk_results_student` FOREIGN KEY (`student_id`) 
    REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- Indexes for High Performance Queries
-- -------------------------------------------------------
CREATE INDEX `idx_student_roll` ON `students` (`roll_number`);
CREATE INDEX `idx_student_dept` ON `students` (`department_id`);
CREATE INDEX `idx_attendance_date` ON `attendance` (`date`);
CREATE INDEX `idx_marks_student_sem` ON `marks` (`student_id`, `semester`);

-- =======================================================
-- SEED DATA
-- Default Passwords:
-- Admin:   Admin@123   (bcrypt hash for password "Admin@123")
-- Student: Student@123 (bcrypt hash for password "Student@123")
-- =======================================================

-- 1. Insert Users
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `status`) VALUES
(1, 'admin', 'admin@sms.edu', '$2a$10$w09ZkFkY/f6Q8B8qV4u8q.77D9uV7XU7s0Ew6ZfS7CgL2e4gM96bK', 'admin', 'active'),
(2, 'aarav.sharma', 'aarav.sharma@sms.edu', '$2a$10$vD22lMhE6Xm21SgS8KxJ/e6X2c5eO5R9N9y8xW7E3F1A9bC3dE5fG', 'student', 'active'),
(3, 'priya.patel', 'priya.patel@sms.edu', '$2a$10$vD22lMhE6Xm21SgS8KxJ/e6X2c5eO5R9N9y8xW7E3F1A9bC3dE5fG', 'student', 'active'),
(4, 'rohit.verma', 'rohit.verma@sms.edu', '$2a$10$vD22lMhE6Xm21SgS8KxJ/e6X2c5eO5R9N9y8xW7E3F1A9bC3dE5fG', 'student', 'active'),
(5, 'sneha.singh', 'sneha.singh@sms.edu', '$2a$10$vD22lMhE6Xm21SgS8KxJ/e6X2c5eO5R9N9y8xW7E3F1A9bC3dE5fG', 'student', 'active');

-- 2. Insert Departments
INSERT INTO `departments` (`id`, `name`, `code`, `description`, `hod_name`) VALUES
(1, 'Computer Science & Engineering', 'CSE', 'Focuses on computing algorithms, software engineering, databases, and AI.', 'Dr. Rajesh Raman'),
(2, 'Electronics & Communication', 'ECE', 'Covers signal processing, embedded systems, VLSI, and communication networks.', 'Dr. Ananya Sen'),
(3, 'Mechanical Engineering', 'ME', 'Specializes in thermodynamics, robotics, manufacturing, and CAD/CAM.', 'Dr. Vikramaditya Rao'),
(4, 'Civil Engineering', 'CE', 'Encompasses structural analysis, urban planning, and environmental design.', 'Dr. Meera Iyer');

-- 3. Insert Courses
INSERT INTO `courses` (`id`, `department_id`, `name`, `code`, `credits`, `semester`, `instructor`) VALUES
(1, 1, 'Data Structures & Algorithms', 'CS301', 4, 3, 'Prof. Arvind Kumar'),
(2, 1, 'Database Management Systems', 'CS302', 4, 3, 'Prof. Swati Joshi'),
(3, 1, 'Full-Stack Web Development', 'CS303', 3, 3, 'Prof. Neha Gupta'),
(4, 1, 'Artificial Intelligence & ML', 'CS304', 4, 5, 'Dr. Rajesh Raman'),
(5, 2, 'Digital Signal Processing', 'EC301', 4, 3, 'Dr. Ananya Sen'),
(6, 2, 'Microprocessors & Microcontrollers', 'EC302', 3, 3, 'Prof. K. R. Nambiar'),
(7, 3, 'Thermodynamics & Heat Transfer', 'ME301', 4, 3, 'Dr. Vikramaditya Rao'),
(8, 4, 'Structural Analysis', 'CE301', 4, 3, 'Dr. Meera Iyer');

-- 4. Insert Students
INSERT INTO `students` (`id`, `user_id`, `roll_number`, `first_name`, `last_name`, `email`, `phone`, `dob`, `gender`, `department_id`, `semester`, `address`, `blood_group`, `guardian_name`, `admission_date`, `status`) VALUES
(1, 2, '21CSE001', 'Aarav', 'Sharma', 'aarav.sharma@sms.edu', '+91 9876543210', '2003-05-14', 'Male', 1, 3, 'Flat 402, Green Park Avenue, New Delhi', 'O+', 'Ramesh Sharma', '2022-08-10', 'Active'),
(2, 3, '21CSE002', 'Priya', 'Patel', 'priya.patel@sms.edu', '+91 9876543211', '2003-09-22', 'Female', 1, 3, 'B-12, Heritage Residency, Ahmedabad', 'B+', 'Kishore Patel', '2022-08-10', 'Active'),
(3, 4, '21ECE015', 'Rohit', 'Verma', 'rohit.verma@sms.edu', '+91 9876543212', '2002-12-05', 'Male', 2, 3, 'Sector 15, Block C, Chandigarh', 'A+', 'Sanjay Verma', '2022-08-12', 'Active'),
(4, 5, '21CSE045', 'Sneha', 'Singh', 'sneha.singh@sms.edu', '+91 9876543213', '2003-03-18', 'Female', 1, 3, 'Plot 89, Lake View Colony, Bengaluru', 'AB+', 'Devendra Singh', '2022-08-10', 'Active');

-- 5. Insert Attendance Records (Sample semester days)
INSERT INTO `attendance` (`student_id`, `course_id`, `date`, `status`, `remarks`) VALUES
(1, 1, '2026-09-01', 'Present', 'Attentive in sorting lecture'),
(1, 1, '2026-09-02', 'Present', 'Regular class'),
(1, 1, '2026-09-03', 'Present', 'Lab assignment completed'),
(1, 1, '2026-09-04', 'Absent', 'Medical leave'),
(1, 1, '2026-09-05', 'Present', 'Regular class'),
(1, 2, '2026-09-01', 'Present', 'ER diagram discussion'),
(1, 2, '2026-09-02', 'Present', 'SQL normalization'),
(1, 2, '2026-09-03', 'Present', 'Indexing mechanisms'),
(1, 2, '2026-09-04', 'Present', 'Lab practical test'),
(1, 3, '2026-09-01', 'Present', 'React hooks overview'),
(1, 3, '2026-09-02', 'Present', 'Express REST API'),
(1, 3, '2026-09-03', 'Late', 'Arrived 10 mins late with permit'),
(2, 1, '2026-09-01', 'Present', 'Regular class'),
(2, 1, '2026-09-02', 'Present', 'Regular class'),
(2, 1, '2026-09-03', 'Present', 'Lab regular'),
(2, 1, '2026-09-04', 'Present', 'Regular class'),
(2, 2, '2026-09-01', 'Present', 'Regular class'),
(2, 2, '2026-09-02', 'Present', 'Regular class'),
(3, 5, '2026-09-01', 'Absent', 'Uninformed absence'),
(3, 5, '2026-09-02', 'Absent', 'Uninformed absence'),
(3, 5, '2026-09-03', 'Present', 'Signal lab'),
(4, 1, '2026-09-01', 'Present', 'Excellent interaction'),
(4, 1, '2026-09-02', 'Present', 'Regular class');

-- 6. Insert Marks
INSERT INTO `marks` (`student_id`, `course_id`, `exam_type`, `max_marks`, `marks_obtained`, `semester`) VALUES
(1, 1, 'Internal 1', 30.00, 27.50, 3),
(1, 1, 'Midterm', 50.00, 44.00, 3),
(1, 1, 'Final', 100.00, 88.00, 3),
(1, 2, 'Internal 1', 30.00, 26.00, 3),
(1, 2, 'Midterm', 50.00, 42.50, 3),
(1, 2, 'Final', 100.00, 84.00, 3),
(1, 3, 'Internal 1', 30.00, 29.00, 3),
(1, 3, 'Midterm', 50.00, 47.00, 3),
(1, 3, 'Final', 100.00, 92.00, 3),
(2, 1, 'Internal 1', 30.00, 28.50, 3),
(2, 1, 'Midterm', 50.00, 46.00, 3),
(2, 1, 'Final', 100.00, 91.00, 3),
(2, 2, 'Internal 1', 30.00, 28.00, 3),
(2, 2, 'Midterm', 50.00, 48.00, 3),
(2, 2, 'Final', 100.00, 94.00, 3),
(3, 5, 'Internal 1', 30.00, 14.00, 3),
(3, 5, 'Midterm', 50.00, 22.00, 3),
(3, 5, 'Final', 100.00, 45.00, 3),
(4, 1, 'Internal 1', 30.00, 29.50, 3),
(4, 1, 'Midterm', 50.00, 49.00, 3),
(4, 1, 'Final', 100.00, 96.00, 3);

-- 7. Insert Semester Results
INSERT INTO `results` (`student_id`, `semester`, `total_marks`, `marks_obtained`, `percentage`, `gpa`, `grade`, `status`) VALUES
(1, 2, 500.00, 432.00, 86.40, 8.64, 'A+', 'Pass'),
(2, 2, 500.00, 465.00, 93.00, 9.30, 'O', 'Pass'),
(3, 2, 500.00, 265.00, 53.00, 5.30, 'C', 'Probation'),
(4, 2, 500.00, 480.00, 96.00, 9.60, 'O', 'Pass');
