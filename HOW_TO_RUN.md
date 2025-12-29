# How to Run the Banking App Project

## Prerequisites

- **Java 21+** installed
- **Node.js** and **npm** installed (for frontend)
- **MySQL 8.0+** installed and running

---

## 🚀 Quick Start

### Step 1: Ensure MySQL is Running

```powershell
# Check if MySQL is running
Test-NetConnection -ComputerName localhost -Port 3306
```

### Step 2: Configure MySQL Password (if needed)

Edit `demo/src/main/resources/application-prod.properties`:

```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Or set environment variable:
```powershell
$env:SPRING_DATASOURCE_PASSWORD="your_password"
```

### Step 3: Run Backend

```powershell
cd demo
.\mvnw.cmd spring-boot:run
```

*Note: The application uses MySQL database by default (prod profile).*

### Step 4: Run Frontend

```powershell
cd frontend
npm run dev
```

---

## 📋 Complete Step-by-Step Guide

### Backend Setup

1. **Navigate to backend:**
   ```powershell
   cd demo
   ```

2. **Build the project (optional):**
   ```powershell
   .\mvnw.cmd clean install
   ```

3. **Run the application:**
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   
   The application will use MySQL database automatically.

5. **Verify backend is running:**
   - Open: http://localhost:8080
   - You should see a response (or error page, which means server is running)

### Frontend Setup

1. **Navigate to frontend:**
   ```powershell
   cd frontend
   ```

2. **Install dependencies (first time only):**
   ```powershell
   npm install
   ```

3. **Start development server:**
   ```powershell
   npm run dev
   ```

4. **Verify frontend is running:**
   - Open: http://localhost:3000
   - You should see the login page

---

## 🎯 Quick Commands Reference

### Backend Commands

| Task | Command |
|------|---------|
| **Run application** | `.\mvnw.cmd spring-boot:run` |
| **Build project** | `.\mvnw.cmd clean install` |
| **Run tests** | `.\mvnw.cmd test` |

### Frontend Commands

| Task | Command |
|------|---------|
| **Install dependencies** | `npm install` |
| **Start dev server** | `npm run dev` |
| **Build for production** | `npm run build` |
| **Preview production build** | `npm run preview` |

---

## 🔧 Troubleshooting

### Backend Issues

**Problem:** "Access denied for user 'root'@'localhost'"
- **Solution:** Update MySQL password in `application-prod.properties` or set environment variable `SPRING_DATASOURCE_PASSWORD`

**Problem:** "Port 8080 already in use"
- **Solution:** Change port in `application.properties`: `server.port=8081`

**Problem:** Maven not found
- **Solution:** Use `.\mvnw.cmd` (Maven wrapper) instead of `mvn`

### Frontend Issues

**Problem:** "npm not found"
- **Solution:** Install Node.js from https://nodejs.org/

**Problem:** "Port 3000 already in use"
- **Solution:** Vite will automatically use the next available port (3001, 3002, etc.)

**Problem:** "Cannot connect to backend"
- **Solution:** Ensure backend is running on http://localhost:8080

---

## 📱 Using the Application

1. **Register a new user:**
   - Go to http://localhost:3000/register
   - Fill in name, email, password, and role (USER or ADMIN)

2. **Login:**
   - Go to http://localhost:3000/login
   - Enter email and password

3. **Create Account:**
   - After login, go to "Account" page
   - Click "Create Account"

4. **Transfer Money:**
   - Go to "Transfer" page
   - Enter recipient account number and amount

5. **View Transactions:**
   - Go to "Transactions" page to see history

---

## 🛑 Stopping the Application

- **Backend:** Press `Ctrl+C` in the backend terminal
- **Frontend:** Press `Ctrl+C` in the frontend terminal

---

## 📝 Notes

- **MySQL Database:** All data is persisted in MySQL and will remain between application restarts
- **Database:** The application uses the `bankapp` database (created automatically if it doesn't exist)

---

## ✅ Success Indicators

**Backend is running when you see:**
```
Started BankAppApplication in X.XXX seconds
Tomcat started on port 8080
```

**Frontend is running when you see:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## 🎉 You're All Set!

Once both backend and frontend are running, open http://localhost:3000 in your browser and start using the banking application!

