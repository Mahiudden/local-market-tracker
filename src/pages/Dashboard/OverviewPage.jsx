import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaShoppingCart, 
  FaStore, 
  FaChartLine, 
  FaStar, 
  FaEye, 
  FaDollarSign,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getAllUsers, getAllProducts, getAllOrders } from '../../utils/api';

const OverviewPage = () => {
  const { user, role } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalVendors: 0,
    totalOrders: 0,
    totalRevenue: 0,
    avgRating: 0,
    monthlyGrowth: 0,
    weeklyGrowth: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is admin before making admin-only API calls
        
        if (role === 'admin') {
          const [usersRes, productsRes, ordersRes] = await Promise.all([
            getAllUsers(),
            getAllProducts(),
            getAllOrders()
          ]);

          const users = usersRes.data;
          const products = productsRes.data;
          const orders = ordersRes.data;

          const totalUsers = users.length;
          const totalProducts = products.length;
          const totalVendors = users.filter(u => u.role === 'vendor').length;
          const totalOrders = orders.length;
          const totalRevenue = orders.reduce((acc, order) => acc + order.price, 0);

          setStats({
            totalUsers,
            totalProducts,
            totalVendors,
            totalOrders,
            totalRevenue,
            avgRating: 4.5, // Dummy data
            monthlyGrowth: 12.5, // Dummy data
            weeklyGrowth: 8.2 // Dummy data
          });
        } else {
          // For non-admin users, show dummy data or limited data
          setStats({
            totalUsers: 1250,
            totalProducts: 850,
            totalVendors: 45,
            totalOrders: 320,
            totalRevenue: 45000,
            avgRating: 4.5,
            monthlyGrowth: 12.5,
            weeklyGrowth: 8.2
          });
        }

        const monthlyData = [
          { month: 'January', users: 8000, products: 4000, revenue: 900000 },
          { month: 'February', users: 8500, products: 4200, revenue: 950000 },
          { month: 'March', users: 9000, products: 4500, revenue: 1000000 },
          { month: 'April', users: 9500, products: 4800, revenue: 1100000 },
          { month: 'May', users: 10000, products: 5000, revenue: 1150000 },
          { month: 'June', users: 10500, products: 5200, revenue: 1250000 },
        ];
        setMonthlyData(monthlyData);

        const categoryData = [
          { name: 'Rice', value: 25, color: '#3B82F6' },
          { name: 'Vegetable', value: 30, color: '#10B981' },
          { name: 'Fish', value: 20, color: '#F59E0B' },
          { name: 'Meat', value: 15, color: '#EF4444' },
          { name: 'Fruit', value: 10, color: '#8B5CF6' },
        ];
        setCategoryData(categoryData);

        const recentActivity = [
          { type: 'New User', message: 'Ahmed Ali has joined', time: '2 hours ago', icon: FaUsers },
          { type: 'New Product', message: 'Fresh tomato has been added', time: '3 hours ago', icon: FaShoppingCart },
          { type: 'New Order', message: 'Order #12345 has been successful', time: '4 hours ago', icon: FaStore },
          { type: 'Review', message: '5-star review has been received', time: '5 hours ago', icon: FaStar },
        ];
        setRecentActivity(recentActivity);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: FaUsers,
      color: 'blue',
      growth: '+12.5%',
      trend: 'up'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: FaShoppingCart,
      color: 'green',
      growth: '+8.2%',
      trend: 'up'
    },
    {
      title: 'Total Vendors',
      value: stats.totalVendors.toLocaleString(),
      icon: FaStore,
      color: 'purple',
      growth: '+5.1%',
      trend: 'up'
    },
    {
      title: 'Total Revenue',
      value: `৳${(stats.totalRevenue / 100000).toFixed(1)}L`,
      icon: FaDollarSign,
      color: 'yellow',
      growth: '+15.3%',
      trend: 'up'
    }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Recent status and statistics of your business</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                <stat.icon className={`text-2xl text-${stat.color}-600`} />
              </div>
              <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {stat.growth}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <FaChartLine />
            Monthly Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} name="User" />
              <Line type="monotone" dataKey="products" stroke="#10B981" strokeWidth={3} name="Product" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <FaStore />
            Product Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
          <FaDollarSign />
          Monthly Revenue
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `৳${(value / 1000).toFixed(0)}K`} />
            <Bar dataKey="revenue" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
          <FaEye />
          Recent Activities
        </h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="p-3 bg-blue-100 rounded-xl mr-4">
                <activity.icon className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{activity.type}</h4>
                <p className="text-gray-600 text-sm">{activity.message}</p>
              </div>
              <div className="text-gray-500 text-sm">{activity.time}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default OverviewPage;
