import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  BASE_URL,
  GET_CLIENT_SECRET_URL,
  CREATE_ORDER_URL,
} from "../../utils/constants";
import Header from "../layout/Header";
import toast from "react-hot-toast";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

function CoursePurchase() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const discount = Number(searchParams.get("discount"));
  const originalPrice = Number(searchParams.get("originalPrice"));

  const [course, setCourse] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [cardError, setCardError] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (!token) {
      toast.error("Please login to purchase this course");
      navigate("/login");
      return;
    }

    const fetchCourseAndClientSecret = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}${GET_CLIENT_SECRET_URL}`,
          { courseId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setCourse(response.data.course);
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        if (err?.response?.status === 400) {
          toast.error("You already purchased this course.");
          navigate("/my-courses");
        } else {
          toast.error("Failed to load course data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndClientSecret();
  }, [courseId]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setPaymentLoading(true);

    const { error: methodError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card,
      });

    if (methodError) {
      setCardError(methodError.message);
      setPaymentLoading(false);
      return;
    }

    const { error: confirmError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.user?.firstName,
            email: user?.user?.email,
          },
        },
      });

    if (confirmError) {
      setCardError(confirmError.message);
      setPaymentLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      const paymentInfo = {
        email: user?.user?.email,
        userId: user.user._id,
        courseId: courseId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        status: paymentIntent.status,
      };

      await axios
        .post(`${BASE_URL}${CREATE_ORDER_URL}`, paymentInfo, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error while creating order");
        });
      toast.success("Payment Successful!");
      navigate("/my-courses");
    }

    setPaymentLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-900 min-h-screen text-white">
      <Header />
      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2 h-64 bg-gray-700 rounded-lg" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                <div className="h-10 bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ) : !course ? (
          <div className="text-center text-red-400">Course not found.</div>
        ) : (
          <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <img
                src={course.image?.url}
                alt={course.title}
                className="w-full md:w-1/2 rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-orange-500 mb-4">
                  {course.title}
                </h2>
                <p className="text-gray-300 mb-4">{course.description}</p>
                <div className="mb-6">
                  <span className="text-2xl font-bold text-white">
                    ${course.price}
                  </span>
                  {originalPrice > 0 && discount > 0 && (
                    <>
                      <span className="text-gray-400 line-through ml-2">
                        ${originalPrice}
                      </span>
                      <span className="ml-4 text-green-400">
                        {discount}% off
                      </span>
                    </>
                  )}
                </div>
                <form onSubmit={handlePayment}>
                  <div className="mb-4 p-3 bg-white rounded">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#000",
                            "::placeholder": {
                              color: "#aab7c4",
                            },
                          },
                          invalid: {
                            color: "#9e2146",
                          },
                        },
                      }}
                    />
                  </div>
                  {cardError && (
                    <p className="text-red-400 text-sm mb-2">{cardError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={!stripe || paymentLoading}
                    className="w-full bg-orange-500 hover:bg-blue-700 text-white py-3 rounded transition duration-300 cursor-pointer"
                  >
                    {paymentLoading ? "Processing..." : "Pay Now"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoursePurchase;
