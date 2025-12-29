-- Banking Application Database Schema
-- This file is for reference only. Hibernate will auto-create tables when ddl-auto=update

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);

-- Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    balance DOUBLE NOT NULL DEFAULT 0.0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    from_account VARCHAR(20) NOT NULL,
    to_account VARCHAR(20) NOT NULL,
    amount DOUBLE NOT NULL,
    timestamp DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    is_fraud BOOLEAN NOT NULL DEFAULT FALSE,
    fraud_reason VARCHAR(500)
);

-- Indexes for better query performance
CREATE INDEX idx_account_user_id ON accounts(user_id);
CREATE INDEX idx_account_number ON accounts(account_number);
CREATE INDEX idx_transaction_from_account ON transactions(from_account);
CREATE INDEX idx_transaction_to_account ON transactions(to_account);
CREATE INDEX idx_transaction_timestamp ON transactions(timestamp);
CREATE INDEX idx_transaction_fraud ON transactions(is_fraud);


