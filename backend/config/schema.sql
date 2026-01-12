-- 1. Buat Database
CREATE DATABASE IF NOT EXISTS fespace_db;
USE fespace_db;

-- 2. Tabel Users (TETAP, tapi strict role)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'client') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel API Keys (HANYA UNTUK CLIENT)
CREATE TABLE IF NOT EXISTS api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    api_key VARCHAR(64) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_api_key (api_key),
    INDEX idx_user_id (user_id)
);

-- 4. Tabel Services (BARU - Dikelola oleh Admin)
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    category VARCHAR(100),
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Tabel Orders (BARU - Pesanan dari Client)
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    service_id INT NOT NULL,
    status ENUM('pending', 'approved', 'in_progress', 'completed', 'rejected') DEFAULT 'pending',
    notes TEXT,
    total_price DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    INDEX idx_client_id (client_id),
    INDEX idx_service_id (service_id),
    INDEX idx_status (status)
);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert Admin User (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin FeSpace', 'admin@fespace.com', '$2a$10$YourHashedPasswordHere', 'admin');

-- Insert Sample Client (password: client123)
INSERT INTO users (name, email, password, role) VALUES 
('Sekar Asri Maghfirah', 'sekar@fespace.com', '$2a$10$YourHashedPasswordHere', 'client');

-- Insert Sample Services
INSERT INTO services (name, description, price, category, is_active) VALUES 
('Desain Rumah Minimalis', 'Desain arsitektur rumah minimalis modern 1-2 lantai', 15000000.00, 'Residential', TRUE),
('Desain Kantor', 'Desain interior dan eksterior kantor modern', 25000000.00, 'Commercial', TRUE),
('Renovasi Rumah', 'Jasa renovasi dan redesign rumah existing', 10000000.00, 'Residential', TRUE),
('Desain Taman', 'Landscape design untuk taman rumah atau komersial', 8000000.00, 'Landscape', TRUE),
('Konsultasi Arsitektur', 'Konsultasi dan perencanaan proyek arsitektur', 5000000.00, 'Consultation', TRUE);

-- ============================================
-- VERIFIKASI
-- ============================================

-- Cek semua tabel
SHOW TABLES;

-- Cek struktur tabel
DESCRIBE users;
DESCRIBE api_keys;
DESCRIBE services;
DESCRIBE orders;

-- Cek data
SELECT * FROM users;
SELECT * FROM services;

