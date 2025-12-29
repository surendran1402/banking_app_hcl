# MySQL Connection Troubleshooting

## Test MySQL Connection Manually

Try connecting to MySQL directly to verify the password:

```powershell
# If MySQL is in PATH
mysql -u root -p
# Enter password when prompted: bitsathy@123A
```

## Alternative Solutions

### Option 1: Use Environment Variable (Recommended)

Instead of hardcoding the password, use an environment variable:

1. Set environment variable:
```powershell
$env:SPRING_DATASOURCE_PASSWORD="bitsathy@123A"
```

2. Update `application-prod.properties`:
```properties
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
```

### Option 2: Check MySQL User Permissions

Connect to MySQL and verify:
```sql
SELECT user, host FROM mysql.user WHERE user='root';
SHOW GRANTS FOR 'root'@'localhost';
```

### Option 3: Reset MySQL Root Password

If needed, reset the password:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'bitsathy@123A';
FLUSH PRIVILEGES;
```

