import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Adding publishable key - safe to be exposed
const stripePromise = loadStripe(
  "pk_test_51RezeSFTEumaF2fNZXiaiKTCgNGaGUXRPWIIJsRxj3UkLmjAswA0sONkA0lHvre9GQIW2RBY7eNXGIOWKZu7qqnA00Qzk2Eicm"
);
createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);
