# Banking Application - Spring Boot Backend

A complete Spring Boot banking application with JWT authentication, role-based access control, money transfer simulation, transaction history, and fraud detection.

## Tech Stack

- **Spring Boot** 4.0.1
- **Spring Security** with JWT authentication
- **MySQL** database
- **JPA/Hibernate** ORM
- **Maven** build tool
- **Lombok** for reducing boilerplate code

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (USER and ADMIN)
- Secure password encryption using BCrypt

### User Features
- Create bank account
- View account balance
- Transfer money between accounts
- View transaction history

### Admin Features
- View all users
- View all transactions
- View fraud transactions
- Make fraud decisions (SAFE or CONFIRMED_FRAUD)

### Fraud Detection
- Automatic fraud detection on every transfer
- Rules:
  1. Transaction amount > 50,000 → marked as FRAUD
  2. More than 3 transactions within 1 minute from same account → marked as FRAUD

## Prerequisites

- Java 25 or higher
- Maven 3.6+
- MySQL 8.0+
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

## Setup Instructions

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE bankapp;
```

Or the application will create it automatically if `createDatabaseIfNotExist=true` is set in the connection URL.

### 2. Configure Database

Update `src/main/resources/application.properties` with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bankapp?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 3. Build and Run

```bash
# Navigate to project directory
cd demo

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Documentation

### Base URL
```
http://localhost:8080
```

### Authentication

All requests to `/user/**` and `/admin/**` endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Public APIs (No Authentication Required)

### 1. Register User

**POST** `/auth/register`

Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

### 2. Login

**POST** `/auth/login`

Login and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com",
  "role": "USER",
  "userId": 1
}
```

---

## User APIs (Requires USER Role)

### 3. Create Bank Account

**POST** `/user/account`

Create a bank account for the logged-in user. Each user can create only one account.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "id": 1,
    "accountNumber": "1234567890",
    "balance": 0.0,
    "userName": "John Doe"
  }
}
```

### 4. View Account Balance

**GET** `/user/account`

Get the account details of the logged-in user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Account retrieved successfully",
  "data": {
    "id": 1,
    "accountNumber": "1234567890",
    "balance": 1000.0,
    "userName": "John Doe"
  }
}
```

### 5. Transfer Money

**POST** `/user/transfer`

Transfer money from logged-in user's account to another account.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "toAccount": "9876543210",
  "amount": 500.0
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transfer completed successfully",
  "data": {
    "id": 1,
    "fromAccount": "1234567890",
    "toAccount": "9876543210",
    "amount": 500.0,
    "timestamp": "2024-01-15T10:30:00",
    "status": "SUCCESS",
    "isFraud": null,
    "fraudReason": null
  }
}
```

**Note:** Fraud information is hidden from regular users.

### 6. View Transaction History

**GET** `/user/transactions`

Get all transactions (sent and received) for the logged-in user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": [
    {
      "id": 1,
      "fromAccount": "1234567890",
      "toAccount": "9876543210",
      "amount": 500.0,
      "timestamp": "2024-01-15T10:30:00",
      "status": "SUCCESS",
      "isFraud": null,
      "fraudReason": null
    }
  ]
}
```

---

## Admin APIs (Requires ADMIN Role)

### 7. View All Users

**GET** `/admin/users`

Get list of all registered users.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    {
      "id": 2,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
  ]
}
```

### 8. View All Transactions

**GET** `/admin/transactions`

Get all transactions in the system with fraud information.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "All transactions retrieved successfully",
  "data": [
    {
      "id": 1,
      "fromAccount": "1234567890",
      "toAccount": "9876543210",
      "amount": 50000.0,
      "timestamp": "2024-01-15T10:30:00",
      "status": "SUCCESS",
      "isFraud": true,
      "fraudReason": "Transaction amount (50000.0) exceeds threshold of 50000.0."
    }
  ]
}
```

### 9. View Fraud Transactions

**GET** `/admin/fraud-transactions`

Get only transactions marked as fraud.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Fraud transactions retrieved successfully",
  "data": [
    {
      "id": 1,
      "fromAccount": "1234567890",
      "toAccount": "9876543210",
      "amount": 50000.0,
      "timestamp": "2024-01-15T10:30:00",
      "status": "SUCCESS",
      "isFraud": true,
      "fraudReason": "Transaction amount (50000.0) exceeds threshold of 50000.0."
    }
  ]
}
```

### 10. Make Fraud Decision

**POST** `/admin/transaction/{id}/decision`

Admin can mark a transaction as SAFE or CONFIRMED_FRAUD.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "decision": "CONFIRMED_FRAUD",
  "reason": "Confirmed fraudulent activity after investigation"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Fraud decision updated successfully",
  "data": {
    "id": 1,
    "fromAccount": "1234567890",
    "toAccount": "9876543210",
    "amount": 50000.0,
    "timestamp": "2024-01-15T10:30:00",
    "status": "SUCCESS",
    "isFraud": true,
    "fraudReason": "Confirmed fraudulent activity after investigation"
  }
}
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);
```

### Accounts Table
```sql
CREATE TABLE accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    balance DOUBLE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    from_account VARCHAR(20) NOT NULL,
    to_account VARCHAR(20) NOT NULL,
    amount DOUBLE NOT NULL,
    timestamp DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    is_fraud BOOLEAN NOT NULL DEFAULT FALSE,
    fraud_reason VARCHAR(500)
);
```

**Note:** The schema is automatically created by Hibernate when `spring.jpa.hibernate.ddl-auto=update` is set.

---

## Security Configuration

- **Public Endpoints:** `/auth/**`
- **USER Role Required:** `/user/**`
- **ADMIN Role Required:** `/admin/**`
- **JWT Token Expiration:** 24 hours (configurable in `application.properties`)

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message description",
  "data": null
}
```

Common HTTP Status Codes:
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Invalid or missing JWT token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Testing the Application

### 1. Register a User
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "USER"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the token from the response.

### 3. Create Account
```bash
curl -X POST http://localhost:8080/user/account \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json"
```

### 4. Transfer Money
```bash
curl -X POST http://localhost:8080/user/transfer \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "toAccount": "9876543210",
    "amount": 100.0
  }'
```

---

## Project Structure

```
demo/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/bankapp/
│   │   │       ├── BankAppApplication.java
│   │   │       ├── config/
│   │   │       │   ├── JwtUtil.java
│   │   │       │   ├── JwtAuthenticationFilter.java
│   │   │       │   └── SecurityConfig.java
│   │   │       ├── controller/
│   │   │       │   ├── AuthController.java
│   │   │       │   ├── UserController.java
│   │   │       │   └── AdminController.java
│   │   │       ├── dto/
│   │   │       │   ├── LoginRequest.java
│   │   │       │   ├── LoginResponse.java
│   │   │       │   ├── RegisterRequest.java
│   │   │       │   ├── TransferRequest.java
│   │   │       │   ├── AccountResponse.java
│   │   │       │   ├── TransactionResponse.java
│   │   │       │   ├── UserResponse.java
│   │   │       │   ├── FraudDecisionRequest.java
│   │   │       │   └── ApiResponse.java
│   │   │       ├── model/
│   │   │       │   ├── User.java
│   │   │       │   ├── Account.java
│   │   │       │   ├── Transaction.java
│   │   │       │   ├── Role.java
│   │   │       │   └── TransactionStatus.java
│   │   │       ├── repository/
│   │   │       │   ├── UserRepository.java
│   │   │       │   ├── AccountRepository.java
│   │   │       │   └── TransactionRepository.java
│   │   │       └── service/
│   │   │           ├── UserService.java
│   │   │           ├── TransactionService.java
│   │   │           └── FraudDetectionService.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

---

## Notes

1. **Fraud Detection:** Fraud detection runs automatically on every transfer. Users cannot see fraud information, only admins can.

2. **Account Creation:** Each user can create only one bank account.

3. **Transaction Atomicity:** Money transfers are transactional - if any step fails, the entire operation is rolled back.

4. **JWT Secret:** In production, use a strong, randomly generated secret key stored securely (environment variables or secrets manager).

5. **Password Security:** Passwords are encrypted using BCrypt before storage.

---

## License

This is a demo project for educational purposes.


