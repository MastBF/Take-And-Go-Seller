import React, { useEffect, useState } from "react";
import "../assets/styles/OrderCard.css";
import svg from '../assets/images/Clock.svg';
import LockSvg from '../assets/images/Lock.svg';
import axios from "axios";
import { BASE_URL } from "../utils/api";

const OrderCard = ({ order, onStatusChange, token }) => {
  const { username, phone, createdAt, orderNumber, items, status, id, count } = order;
  const [transformedStatus, setTransformedStatus] = useState("");
  const [time, setTime] = useState("");

  const getTimeFromTimestamp = (isoString) => {
    const date = new Date(isoString);
    let hours = date.getUTCHours(); // Используем getUTCHours для UTC времени
    let minutes = date.getUTCMinutes()
    if (minutes / 10 < 1) {
      minutes = '0' + minutes
    }
    if (hours / 10 < 1) {
      hours = '0' + hours
    }
    setTime(`${hours}:${minutes}`);
  };

  useEffect(() => {
    getTimeFromTimestamp(createdAt);
  }, [createdAt]);

  useEffect(() => {
    switch (status) {
      case 1:
        setTransformedStatus("new");
        break;
      case 2:
        setTransformedStatus("on-cook");
        break;
      case 3:
        setTransformedStatus("prepared");
        break;
      default:
        setTransformedStatus("completed");
        break;
    }
  }, [status]);

  const updateStatus = async (url, newStatus) => {
    try {
      const response = await axios.patch(url, {}, {
        headers: {
          'TokenString': token
        }
      });
      if (response.status === 200) {
        onStatusChange(id, newStatus);
        setTransformedStatus(newStatus); // Локальное обновление статуса
      }
    } catch (err) {
      console.error("Error updating the order:", err?.response?.data || err.message);
    }
  };

  const handleAccept = () => {
    updateStatus(`${BASE_URL}/api/v1/Order/accept-order-seller/${id}`, "on-cook");
  };

  const handleDone = () => {
    updateStatus(`${BASE_URL}/api/v1/Order/execute-order-seller/${id}`, "prepared");
  };

  const handleTaken = () => {
    updateStatus(`${BASE_URL}/api/v1/Order/set-order-taken-seller/${id}`, "completed");
  };

  return (
    <div className={`order-card ${transformedStatus}`}>
      <div className="order-header">
        <div className="order-username-number">
          <div className="order-username">{username}</div>
          <div className={`order-state ${transformedStatus}`}>{transformedStatus}</div>
        </div>
        <div className="order-phone">{phone || "0000000000"}</div>
      </div>
      <div className="order-code-time-wrapper">
        <div className="order-time-wrapper">
          <img src={svg} alt="Clock Icon" width={20} height={20} className='svg-time' />
          <div className="order-time">{time}</div>
        </div>
        <div className="order-time-wrapper  order-code-wrapper">
          <img src={LockSvg} alt="" width={20} height={20} />
          <div className="order-code">{`${orderNumber}`}</div>
        </div>
      </div>
      <ul className="order-items">
        <li className="order-item-total">
          <strong>Items:</strong> {count || 1}
        </li>
        {items.map((item, index) => (
          <li key={index} className="order-item">
            <span className="item-details">
              {item.productQuantity} {item.productName}
            </span>
            <span className="item-size">{item.productTypeName}</span>
            <div className={`line`}></div>
          </li>
        ))}
      </ul>
      <div className="order-actions">
        {transformedStatus === "new" && (
          <button className="accept-btn" onClick={handleAccept}>
            Accept
          </button>
        )}
        {transformedStatus === "on-cook" && (
          <button className="done-btn" onClick={handleDone}>
            Done
          </button>
        )}
        {transformedStatus === "prepared" && (
          <button className="taken-btn" onClick={handleTaken}>
            Taken
          </button>
        )}
        {transformedStatus === "completed" && (
          <button className="completed-btn" disabled>
            Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
