"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import { usePageHeader } from "@/hooks/usePageHeader";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || "");

const Payment = () => {
  usePageHeader("Complete Payment");
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm></PaymentForm>
    </Elements>
  );
};

export default Payment;
