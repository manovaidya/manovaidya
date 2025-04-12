import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { getData } from "../../services/FetchNodeServices";

// Register the chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Define state variables for data
  const [users, setUsers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [coupones, setCoupones] = useState([]);
  const [orders, setOrders] = useState([]);
  const [daySales, setDaySales] = useState([]); // Holds sales data for charts

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users data
        const usersResponse = await getData("api/users/get-all-user");
        if (usersResponse.success) {
          setUsers(usersResponse.users);
        } else {
          console.error("Failed to fetch users:", usersResponse.message);
        }

        // Fetch banners data
        const bannersResponse = await getData('api/banners');
        if (bannersResponse?.success) {
          setBanners(bannersResponse.banners);
        } else {
          console.error("Failed to fetch banners:", bannersResponse.message);
        }

        // Fetch categories data
        const categoriesResponse = await getData('api/categories/get-All-category');
        if (categoriesResponse?.success) {
          setCategories(categoriesResponse.categories);
        }

        // Fetch sub-categories data
        const subCategoriesResponse = await getData('api/subcategories/get-all-sub-diseases');
        if (subCategoriesResponse?.success) {
          setSubCategories(subCategoriesResponse.subcategories);
        }

        // Fetch products data
        const productsResponse = await getData("api/products/all-product");
        if (productsResponse?.success) {
          setProducts(productsResponse.products || []);
        }

        // Fetch reviews data
        const reviewsResponse = await getData('api/products/get-all-reviews');
        if (reviewsResponse?.success) {
          setReviews(reviewsResponse.reviews || []);
        }

        // Fetch coupones data
        const couponesResponse = await getData('api/coupon/get-All-coupons');
        if (couponesResponse?.success) {
          setCoupones(couponesResponse.coupons);
        }

        // Fetch orders data
        const ordersResponse = await getData('api/orders/get-all-orders');
        if (ordersResponse?.success) {
          setOrders(ordersResponse.orders);
        }

        // Fetch day-sales data for the graph
        const daySalesResponse = await getData('api/sales/day-sales'); // Assuming this endpoint exists
        if (daySalesResponse?.success) {
          setDaySales(daySalesResponse.sales); // Assuming the response contains 'sales'
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the function to fetch data
    fetchData();
  }, []); // Empty dependency array ensures the fetch runs only once when the component mounts

  const daySalesData = {
    labels: daySales.map(sale => sale.date), // Assuming 'date' is available in sales data
    datasets: [
      {
        label: "Sales",
        data: daySales.map(sale => sale.totalSales), // Assuming 'totalSales' contains sales amount
        fill: false,
        borderColor: "rgba(255,99,132,1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Manovaidya Admin Panel</h1>
        <p>Manage your Manovaidya store data from here!</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <Link to="/all-orders">
            <i className="fa-solid fa-truck"></i>
            <h3>Manage Orders</h3>
            <p>Track and manage your customer orders</p>
            <p>{orders.length} Orders</p>
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-banners">
            <i className="fa-regular fa-images"></i>
            <h3>Manage Banners</h3>
            <p>Update your website's banners</p>
            <p>{banners.length} Banners</p>
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-category">
            <i className="fa-solid fa-virus"></i>
            <h3>Manage Diseases</h3>
            <p>Manage Diseases of your products</p>
            <p>{categories.length} Diseases</p>
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/sub-diseases">
            <i className="fa-solid fa-heartbeat"></i>
            <h3>Manage Sub Diseases</h3>
            <p>Organize products in sub-Diseases</p>
            <p>{subCategories.length} Sub Diseases</p>
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-reviews">
            <i className="fa-solid fa-star"></i>
            <h3>Manage Review</h3>
            <p>Update Review for your products</p>
            <p>{reviews.length} Review</p>
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-products">
            <i className="fa-solid fa-boxes-stacked"></i>
            <h3>Manage Products</h3>
            <p>Add, update, or remove products</p>
            <p>{products.length} Products</p>
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-users">
            <i className="fa-solid fa-users"></i>
            <h3>All Users</h3>
            <p>View and manage users</p>
            <p>{users.length} Users</p>
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-coupen">
            <i className="fa-solid fa-tags"></i>
            <h3>All Coupons</h3>
            <p>View and manage coupons</p>
            <p>{coupones.length} Coupons</p>
          </Link>
        </div>
      </div>

      {/* Graphs (Optional) */}
      {/* <div className="dashboard-card">
        <h3>Day by Day Sales</h3>
        <p>Overview of your sales</p>
        <Line data={daySalesData} />
      </div> */}
    </div>
  );
};

export default Dashboard;
