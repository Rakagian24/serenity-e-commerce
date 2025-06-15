# 🛍️ Serenity

<div align="center">

**Modern E-commerce Platform for Fashion UMKM**

Built with Next.js 14 (App Router) • Tailwind CSS • MySQL • Socket.IO

[🚀 Live Demo](https://serenity-teal-eta.vercel.app/) • [📖 Documentation](#documentation) • [🐛 Report Bug](https://github.com/username/serenity/issues)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.0-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## ✨ Features

### 🛒 **Customer Experience**
- **Smart Product Catalog** - Browse, search, and filter products by category
- **Shopping Cart** - Add to cart with quantity management
- **Secure Checkout** - Integrated payment processing with Midtrans
- **Order Tracking** - Real-time order status updates
- **Live Chat Support** - Direct communication with admin via Socket.IO
- **User Profile** - Manage personal information and order history

### 👨‍💼 **Admin Panel**
- **Product Management** - Complete CRUD operations with image upload
- **Order Management** - Track orders, update status, manage deliveries
- **User Management** - View and manage customer accounts
- **Transaction History** - Complete sales and payment tracking
- **Real-time Chat** - Live customer support system
- **Analytics Dashboard** - Sales statistics and performance metrics
- **Delivery Management** - Shipping and tracking management

### 🔒 **Security & Authentication**
- **NextAuth Integration** - Secure authentication system
- **Google OAuth** - Social login support
- **Email Verification** - Account activation via email
- **Role-based Access** - Admin/Customer permission system
- **Protected Routes** - Middleware-based route protection

## 🚀 Quick Start

### Option 1: Docker (Recommended)

**Prerequisites**
- Docker & Docker Compose
- [Midtrans Account](https://midtrans.com) (Sandbox/Production)
- Gmail App Password for email notifications

**Installation with Docker**

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/serenity.git
   cd serenity
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local` for Docker:
   ```env
   # Database (Docker MySQL)
   DATABASE_URL="mysql://root:serenity_root@db:3306/serenity"
   
   # NextAuth
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Email Configuration
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASS=your_app_password
   
   # Midtrans Payment
   MIDTRANS_SERVER_KEY=your_server_key
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key
   MIDTRANS_ENVIRONMENT=sandbox # or production
   ```

3. **Run with Docker Compose**
   ```bash
   # Build and start all services
   docker-compose up --build
   
   # Or run in background
   docker-compose up -d --build
   ```

4. **Import sample data**
   ```bash
   # Wait for MySQL to be ready, then import data
   docker-compose exec db mysql -u root -pserenity_root serenity < database/backup.sql
   
   # Alternative: Copy file into container first
   docker cp database/backup.sql mysql_serenity:/backup.sql
   docker-compose exec db mysql -u root -pserenity_root serenity < /backup.sql
   ```

5. **Access the application**
   - **Application**: [http://localhost:3000](http://localhost:3000)
   - **MySQL**: `localhost:3306` (from host machine)

**Docker Management Commands**
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete your database data)
docker-compose down -v

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f web
docker-compose logs -f db

# Rebuild after code changes
docker-compose up --build

# Access web container shell
docker-compose exec web sh

# Access MySQL container
docker-compose exec db mysql -u root -pserenity_root serenity
```

### Option 2: Manual Installation

**Prerequisites**
- Node.js 18+
- MySQL Database
- [Midtrans Account](https://midtrans.com) (Sandbox/Production)
- Gmail App Password for email notifications

**Installation Steps**

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/serenity.git
   cd serenity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/serenity"
   
   # NextAuth
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Email Configuration
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASS=your_app_password
   
   # Midtrans Payment
   MIDTRANS_SERVER_KEY=your_server_key
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key
   MIDTRANS_ENVIRONMENT=sandbox # or production
   ```

4. **Setup database**
   ```bash
   # Create your MySQL database
   mysql -u root -p -e "CREATE DATABASE serenity;"
   
   # Import the database schema and sample data
   mysql -u root -p serenity < database/backup.sql
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # For Socket.IO server (if separate)
   npm run socket
   ```

Visit [http://localhost:3000](http://localhost:3000) 🎉

### Prerequisites
- Node.js 18+
- MySQL Database
- [Midtrans Account](https://midtrans.com) (Sandbox/Production)
- Gmail App Password for email notifications

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/serenity.git
   cd serenity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/serenity"
   
   # NextAuth
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Email Configuration
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASS=your_app_password
   
   # Midtrans Payment
   MIDTRANS_SERVER_KEY=your_server_key
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key
   MIDTRANS_ENVIRONMENT=sandbox # or production
   ```

4. **Setup database**
   ```bash
   # Create your MySQL database
   mysql -u root -p -e "CREATE DATABASE serenity;"
   
   # Import the database schema and sample data
   mysql -u root -p serenity < database/backup.sql
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # For Socket.IO server (if separate)
   npm run socket
   ```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 🗂️ Sample Data

The project includes a `backup.sql` file with sample data that you can import into your database:

- **Sample Products**: Contains dummy product data with AI-generated descriptions
- **Admin User**: Pre-configured admin account for testing
- **Note**: Product images are currently URLs (not uploaded files) and descriptions are AI-generated placeholders

**Admin Login Credentials:**
- Email: `admin@serenity.com`
- Password: `rakagian24`

**Customer Access:**
- Register a new account through the registration page
- Or use the demo at the live deployment link

## 🌐 Live Demo

The application is deployed and accessible at: **[https://serenity-teal-eta.vercel.app/](https://serenity-teal-eta.vercel.app/)**

Try it out with the admin credentials above or register as a new customer!

## 📁 Project Structure

```
serenity/src/
├── app/
│   ├── admin/                    # Admin panel pages
│   │   ├── deliveries/          # Delivery management
│   │   ├── history/             # Order history
│   │   ├── messages/            # Customer messages
│   │   ├── orders/              # Order management
│   │   ├── products/            # Product management
│   │   ├── profile/             # Admin profile
│   │   ├── transactions/        # Transaction history
│   │   └── users/               # User management
│   │
│   ├── api/                     # API routes
│   │   ├── admin/               # Admin-specific APIs
│   │   ├── auth/                # Authentication APIs
│   │   ├── cart/                # Shopping cart APIs
│   │   ├── checkout/            # Checkout process
│   │   ├── messages/            # Chat system APIs
│   │   ├── midtrans/            # Payment callbacks
│   │   ├── orders/              # Order management APIs
│   │   ├── products/            # Product APIs
│   │   └── profile/             # User profile APIs
│   │
│   ├── components/              # Reusable React components
│   │   ├── AdminChatArea.jsx    # Admin chat interface
│   │   ├── AdminSidebar.jsx     # Admin navigation
│   │   ├── ChatBox.jsx          # Chat component
│   │   ├── CustomerLiveChat.jsx # Customer chat widget
│   │   ├── LiveChatProvider.jsx # Chat context provider
│   │   ├── Navbar.jsx           # Main navigation
│   │   └── OrderActions.jsx     # Order action buttons
│   │
│   ├── cart/                    # Shopping cart page
│   ├── checkout/                # Checkout page
│   ├── login/                   # Login page
│   ├── orders/[id]/             # Order detail page
│   ├── product/[id]/            # Product detail page
│   ├── product-list/            # Product listing page
│   ├── profile/                 # User profile page
│   └── register/                # Registration page
│
├── lib/                         # Utility libraries
│   ├── auth.js                  # NextAuth configuration
│   ├── db.js                    # Database connection
│
├── pages/api/                   # Legacy API routes
│   └── socket.js                # Socket.IO API endpoint
│
└── server/                      # Server configurations
    └── socket.js                # Socket.IO server setup
```

## 🗄️ Database Schema

<details>
<summary>Click to expand database schema</summary>

```sql
-- Users table
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  image TEXT,
  role ENUM('admin','customer') DEFAULT 'customer',
  email_verified BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  shipping_name VARCHAR(100),
  shipping_phone VARCHAR(20),
  shipping_address TEXT
);

-- Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  category ENUM('Baju','Jaket','Celana','Aksesoris') NOT NULL,
  gender ENUM('Pria','Wanita','Unisex') NOT NULL DEFAULT 'Unisex',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  total_price INT,
  status ENUM('pending','paid','shipped','received','cancelled','returned') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resi VARCHAR(50),
  courier VARCHAR(50),
  delivery_status ENUM('pending','processing','shipped','delivered','returned') DEFAULT 'pending',
  complaint TEXT,
  shipping_name VARCHAR(100),
  shipping_phone VARCHAR(20),
  shipping_address TEXT,
  midtrans_order_id VARCHAR(100),
  midtrans_token VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  price INT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Cart items table (renamed from cart_items to carts)
CREATE TABLE carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  product_id INT,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Messages table (for live chat)
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id BIGINT,
  receiver_id BIGINT,
  message TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- NextAuth accounts table
CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  provider VARCHAR(255),
  provider_account_id VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  expires_at INT,
  token_type VARCHAR(255),
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- NextAuth verification tokens table
CREATE TABLE verification_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  identifier VARCHAR(255),
  token VARCHAR(255),
  expires DATETIME
);
```

</details>

## 🔧 Configuration

### Payment Integration (Midtrans)
1. Create account at [Midtrans](https://midtrans.com)
2. Get your Server Key and Client Key from dashboard
3. Configure webhook URL: `your-domain.com/api/midtrans/callback`
4. Set environment to `sandbox` for testing or `production` for live

### Email Configuration
1. Enable 2-factor authentication on Gmail
2. Generate App Password in Google Account settings
3. Use App Password in `EMAIL_PASS` environment variable

### Socket.IO Setup
The project includes real-time chat functionality using Socket.IO:
- Server configuration in `server/socket.js`
- API endpoint in `pages/api/socket.js`
- React components for chat interface

## 🚢 Deployment

### Vercel (Recommended for Frontend)

1. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Configure environment variables in Vercel dashboard**

3. **Setup external database** (PlanetScale, Railway, or similar)

> **Note:** For Socket.IO functionality, you'll need to deploy the WebSocket server separately (Railway, Render, etc.) as Vercel doesn't support persistent WebSocket connections.

### Traditional Hosting

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🛡️ Security Features

- **NextAuth Authentication** - Secure session management
- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Prevention** - Parameterized queries
- **CSRF Protection** - Built-in NextAuth CSRF protection
- **Role-based Access Control** - Admin/Customer permissions
- **Protected API Routes** - Middleware-based protection
- **Email Verification** - Account activation required

## 🎯 Key Features Explained

### Live Chat System
- Real-time messaging between customers and admin
- Socket.IO for instant communication
- Message history and unread indicators
- Admin can handle multiple customer conversations

### Order Management
- Complete order lifecycle tracking
- Payment integration with Midtrans
- Order status updates (pending → paid → shipped → received)
- Customer can track order status and cancel if needed
- Delivery tracking with courier and tracking number support

### Product Management
- Full CRUD operations for products
- Image upload and management
- Category-based organization (Baju, Jaket, Celana, Aksesoris)
- Gender-based filtering (Pria, Wanita, Unisex)
- Featured/bestseller product highlighting
- Active/inactive product status

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

<details>
<summary>Common Issues</summary>

**Database Connection Issues**
```bash
# Check your DATABASE_URL in .env.local
# Ensure MySQL service is running
sudo service mysql start
```

**Socket.IO Not Working**
```bash
# Make sure Socket.IO server is running
npm run socket

# Check if port 3001 is available
netstat -an | grep 3001
```

**Midtrans Payment Issues**
- Verify Server Key and Client Key
- Check environment setting (sandbox/production)
- Ensure callback URL is accessible
- Check Midtrans dashboard for transaction logs

**Email Verification Not Working**
- Verify Gmail App Password is correct
- Check email configuration in environment variables
- Ensure less secure app access is enabled (if not using App Password)

</details>

## 📋 API Documentation

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/register` - User registration
- `GET /api/verify/[token]` - Email verification

### Products
- `GET /api/products` - Get products with filters
- `GET /api/products/[id]` - Get single product
- `GET /api/products/bestseller` - Get bestselling products
- `POST /api/admin/products` - Create product (Admin)
- `PUT /api/admin/products/[id]` - Update product (Admin)
- `DELETE /api/admin/products/[id]` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details
- `POST /api/orders/[id]/cancel` - Cancel order
- `POST /api/orders/[id]/confirm` - Confirm order receipt
- `GET /api/admin/orders` - Get all orders (Admin)
- `PUT /api/admin/orders/[id]` - Update order status (Admin)

### Cart
- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item quantity
- `DELETE /api/cart` - Remove item from cart

### Messages
- `GET /api/messages` - Get chat messages
- `POST /api/messages` - Send message
- `GET /api/messages/history` - Get message history
- `GET /api/messages/unread` - Get unread message count

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication library
- [Socket.IO](https://socket.io/) - Real-time communication
- [Midtrans](https://midtrans.com/) - Payment gateway
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

<div align="center">

**Made with ❤️ for Indonesian UMKM**

[⭐ Star this repo](https://github.com/username/serenity) • [🐦 Follow updates](https://twitter.com/yourhandle) • [💬 Join discussion](https://github.com/username/serenity/discussions)

</div>