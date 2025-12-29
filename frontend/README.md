# Banking App Frontend

React frontend application for the Banking App with Redux and Axios.

## Tech Stack

- **React** 18.2.0
- **Redux Toolkit** 2.0.1
- **React Router** 6.20.0
- **Axios** 1.6.2
- **Vite** 5.0.8 (Build tool)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminDashboard.css
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Auth.css
│   │   ├── account/
│   │   │   ├── Account.jsx
│   │   │   └── Account.css
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Dashboard.css
│   │   ├── layout/
│   │   │   ├── Layout.jsx
│   │   │   └── Layout.css
│   │   ├── transfer/
│   │   │   ├── Transfer.jsx
│   │   │   └── Transfer.css
│   │   └── transactions/
│   │       ├── Transactions.jsx
│   │       └── Transactions.css
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── accountSlice.js
│   │   │   └── transactionSlice.js
│   │   └── store.js
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── index.html
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure API Base URL

The API base URL is configured in `src/services/api.js`. By default, it's set to:
```javascript
const API_BASE_URL = 'http://localhost:8080'
```

Update this if your backend runs on a different port.

### 3. Run Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Features

### Authentication
- User registration
- User login with JWT token
- Protected routes
- Auto-logout on token expiration

### User Features
- View account balance
- Create bank account
- Transfer money between accounts
- View transaction history

### Admin Features
- View all users
- View all transactions
- View fraud transactions
- Make fraud decisions (SAFE/CONFIRMED_FRAUD)

## Redux Store Structure

- **auth**: User authentication state
- **account**: User account information
- **transactions**: Transaction history

## API Integration

All API calls are made through Axios with:
- Automatic JWT token injection in request headers
- Automatic token refresh handling
- Error handling and redirect on 401

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Then update `src/services/api.js` to use:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
```

## Development

- Hot module replacement (HMR) enabled
- Proxy configured for API calls (see `vite.config.js`)
- ESLint and Prettier recommended for code quality

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)


