# Local Market Tracker - Full Stack Web Application


A comprehensive full-stack web application for tracking local market prices and managing product information. Built with React, Node.js, Express, and MongoDB.

## 🌟 Features

### 🔐 Authentication & Authorization
- **Firebase Authentication** with email/password and Google sign-in
- **Role-based access control** (User, Vendor, Admin)
- **Protected routes** and middleware
- **Profile management** with editable information
=======
## 📚 Project Description
 A full-stack web app to track, compare, and analyze daily prices of local market products. Features role-based dashboards, product reviews, watchlist, offers, Stripe payment, and a modern, responsive UI.

## 🌐 Live Website
[Live Demo](https://flourishing-moonbeam-4a7ee1.netlify.app/)


### 🏠 Home Page
- **Hero section** with rotating banner/slider
- **Featured products** with top-rated items
- **Recent products** section
- **Categories** with product distribution
- **Reviews/Testimonials** from customers
- **Statistics** dashboard
- **Newsletter subscription**
- **Advertisement carousel**

<<<<<<< HEAD
### 📊 Dashboard
- **Overview page** with charts and statistics
- **Profile management** with edit functionality
- **Price trends** with interactive charts
- **Watchlist management**
- **Order history**
- **Real-time data visualization**
=======

## 🔐 Authentication Details
- **Admin Email:** `admin@gmail.com`
- **Admin Password:** `Admin123`
>>>>>>> e756dd56ce2911dcbf04df989d534c300e0adec8

### 🛍️ Product Management
- **All products page** with search and filtering
- **Product details** with comprehensive information
- **Price history tracking**
- **Sorting options** (ascending/descending price)
- **Responsive product cards**

### 🎨 UI/UX Features
- **Dark/Light mode** toggle
- **Fully responsive** design (Mobile, Tablet, Desktop)
- **Modern animations** with Framer Motion
- **Professional error pages**
- **Consistent design system**
- **Accessibility features**

### 🔧 Admin Features
- **User management**
- **Product approval system**
- **Vendor management**
- **Analytics dashboard**
- **Content management**

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animation library
- **React Router** - Navigation
- **React Icons** - Icon library
- **Recharts** - Chart library
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Firebase Admin** - Authentication
- **JWT** - Token-based authentication
- **Multer** - File upload handling

### Deployment
- **Vercel** - Frontend hosting
- **Railway/Render** - Backend hosting
- **MongoDB Atlas** - Cloud database

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database
- Firebase project

### Frontend Setup
```bash
# Clone the repository
git clone <repository-url>
cd my-vue-app

# Install dependencies
npm install

# Create environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

#### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

<<<<<<< HEAD
#### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

## 🎯 Project Structure

```
my-vue-app/
├── src/
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   ├── context/            # React context providers
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom hooks
│   └── assets/             # Static assets
├── public/                 # Public assets
└── package.json

backend/
├── routes/                 # API routes
├── models/                 # Database models
├── middleware/             # Custom middleware
├── utils/                  # Utility functions
└── server.js              # Main server file
```

## 🔑 Default Credentials

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: Admin

### Vendor Account
- **Email**: vendor@example.com
- **Password**: vendor123
- **Role**: Vendor

### User Account
- **Email**: user@example.com
- **Password**: user123
- **Role**: User

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Yellow (#F59E0B)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)

### Typography
- **Primary Font**: Inter
- **Display Font**: Poppins
- **Fallback**: System fonts

### Components
- **Border Radius**: Consistent rounded corners
- **Shadows**: Layered shadow system
- **Spacing**: 8px grid system
- **Animations**: Smooth transitions

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Configure network access
3. Get connection string
4. Update backend environment variables

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: [Your Name]
- **Design**: [Designer Name]
- **Backend**: [Backend Developer Name]

## 📞 Support

For support and questions:
- **Email**: support@localmarkettracker.com
- **Documentation**: [Link to docs]
- **Issues**: [GitHub Issues]

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Complete authentication system
- Product management
- Dashboard with charts
- Dark/Light mode
- Responsive design
- Error handling

---

**Built with ❤️ for the local market community**
=======
## 💡 Setup Instructions
```bash
# 1. Clone the repository
$ git clone https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-Mahiudden
$ cd last assinment/my-vue-app

# 2. Install dependencies
$ npm install

# 3. Configure environment variables
#    (see the .env example above)

# 4. Run the frontend
$ npm run dev
```

## 📸 Screenshots
<img width="1901" height="912" alt="image" src="https://github.com/user-attachments/assets/8a445f7b-28e6-4ff9-b4f1-49c13fa71cbb" /><img width="1902" height="911" alt="image" src="https://github.com/user-attachments/assets/8a13fd12-f00a-40c2-8784-68357ad8fcd6" />



## 🙏 Credits / Contributors
- [Your Name](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-Mahiudden/)

