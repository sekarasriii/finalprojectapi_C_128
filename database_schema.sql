-- Buat Database
CREATE DATABASE IF NOT EXISTS api_system;
USE api_system;

-- Table Users
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'client') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table API Keys dengan data access scope
CREATE TABLE IF NOT EXISTS api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    api_key VARCHAR(64) NOT NULL UNIQUE,
    data_access_type VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Table Services (layanan arsitektur)
CREATE TABLE IF NOT EXISTS services (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Orders (pemesanan layanan)
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE
);

-- Insert sample data untuk Services
INSERT INTO services (service_name, description, price) VALUES
('Desain Rumah Minimalis', 'Desain rumah minimalis modern 1-2 lantai', 5000000.00),
('Desain Rumah Klasik', 'Desain rumah klasik elegan dengan detail ornamen', 7500000.00),
('Desain Interior', 'Desain interior ruangan rumah atau kantor', 3000000.00),
('Renovasi Bangunan', 'Konsultasi dan desain renovasi bangunan', 4000000.00),
('Desain Komersial', 'Desain bangunan komersial (toko, restoran, dll)', 10000000.00);

-- Insert sample admin user
INSERT INTO users (name, email, password, role) VALUES
('Admin System', 'admin@arsitektur.com', 'admin123', 'admin');

-- Index untuk performa
CREATE INDEX idx_api_key ON api_keys(api_key);
CREATE INDEX idx_user_id_keys ON api_keys(user_id);
CREATE INDEX idx_is_active ON api_keys(is_active);
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_service ON orders(service_id);
CREATE INDEX idx_order_status ON orders(status);
