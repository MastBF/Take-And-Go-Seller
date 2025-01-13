import React, { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import "./App.css";
import LoginPage from "../pages/Auth/LoginPage";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/api";


const ordersData = [
  {
    id: 1,
    count: 3,
    username: "Username",
    phone: "123-456-7890",
    time: "15:32",
    code: "A123",
    items: [
      { name: "Nescafe", quantity: 1, size: "Small" },
      { name: "Cappuccino", quantity: 1, size: "Big" },
      { name: "Nutella", quantity: 1, size: "Small" },
    ],
    status: "new",
    state: "New Order"
  },
  {
    id: 2,
    count: 2,
    username: "Username",
    phone: "234-567-8901",
    time: "16:00",
    code: "B456",
    items: [
      { name: "Espresso", quantity: 2, size: "Small" },
      { name: "Latte", quantity: 1, size: "Big" },
    ],
    status: "on-cook",
    state: "On Cook"
  },
  {
    id: 3,
    count: 2,
    username: "Username",
    phone: "345-678-9012",
    time: "16:30",
    code: "C789",
    items: [
      { name: "Mocha", quantity: 1, size: "Small" },
      { name: "Cappuccino", quantity: 1, size: "Small" },
    ],
    status: "prepared",
    state: "Prepared"
  },
  {
    id: 4,
    count: 2,
    username: "Username",
    phone: "456-789-0123",
    time: "17:00",
    code: "D012",
    items: [
      { name: "Americano", quantity: 1, size: "Big" },
      { name: "Latte", quantity: 1, size: "Small" },
    ],
    status: "completed",
    state: "finished"
  },
  {
    id: 5,
    count: 2,
    username: "Username",
    phone: "456-789-0123",
    time: "17:00",
    code: "D012",
    items: [
      { name: "Americano", quantity: 1, size: "Big" },
      { name: "Latte", quantity: 1, size: "Small" },
    ],
    status: "completed",
    state: "finished"
  },
  // Дополнительные заказы
];

const App = () => {
  const [orders, setOrders] = useState(ordersData);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem('uuidAccessToken')
  const navigate = useNavigate()
  const handleStatusChange = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders = orders.filter(
    (order) => filter === "all" || order.status === filter
  );


  const orderRequest = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/Order/branch-current-orders`, {
        headers: {
          'TokenString': token
        }
      })
      setOrders(response.data.orders)
    } catch (err) {
      console.log('Err:', err)
    }
  }


  useEffect(() => {
    if (!localStorage.getItem('uuidAccessToken')) navigate('/')
  }, [])

  useEffect(() => {
    orderRequest()
  }, [])

  const onLogout = () => {
    localStorage.removeItem('uuidAccessToken');
    navigate('/')
  }

  return (
    <div className="app">

      <div className="header">
        <div className="title-left">
          <h1>Take&Go</h1>
          <p>Order List</p>
        </div>
        <div className="title-right">
          <h2>Ice Lava</h2>
          <p className="log-out-button" onClick={onLogout}>Log out</p>
        </div>
      </div>
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter(1)}>New Orders</button>
        <button onClick={() => setFilter(2)}>On Cook</button>
        <button onClick={() => setFilter(3)}>Prepared</button>
        <button onClick={() => setFilter(4)}>Completed</button>
      </div>
      <div className="order-container">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onStatusChange={handleStatusChange}
            token={token}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
