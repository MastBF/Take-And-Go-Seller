import React from "react";
import OrderCard from "./OrderCard";

const OrderGroup = ({ title, orders, onStatusChange }) => {
  return (
    <div className="order-group">
      <h2 className="group-title">{title}</h2>
      <div className="group-content">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusChange={onStatusChange} />
          ))
        ) : (
          <p>No orders in this category.</p>
        )}
      </div>
    </div>
  );
};

export default OrderGroup;
