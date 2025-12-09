import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess, onError }) => {
  const value = Number(amount || 0).toFixed(2);

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "ASs16bfOZ9YPGNnvlgQUqXKt9tszwYxtgVkgeET8yOxrJw96yDNyEyZns41v2s-QhRsK5pniGfR8FlzY",
        currency: "USD",
        intent: "CAPTURE",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) =>
          actions.order.create({
            purchase_units: [{ amount: { value } }],
          })
        }
        onApprove={(data, actions) =>
          actions.order.capture().then((details) => {
            if (onSuccess) onSuccess(details);
          })
        }
        onError={(err) => {
          console.error("PayPal error:", err);
          if (onError) onError(err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
