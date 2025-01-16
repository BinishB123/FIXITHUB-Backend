import { SelectedService } from "entities/user/IuserResponse";
import HttpStatus from "../../entities/rules/statusCode";
import IStripe from "../../entities/services/Istripe";
import CustomError from "./errorInstance";
import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECERET_KEY + "");

class StripePayment implements IStripe {
  async userCheckoutSession(
    initailAmountToPay: number
  ): Promise<{ success?: boolean; sessionId?: string; url?: string }> {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        currency: "INR",
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "inr",
              product_data: {
                name: "Service Booking Fee",
                description:
                  "To book a service, a payment of 25% of the estimated service cost is required in advance, along with a flat fee of Rs. 50. The advance amount will be deducted from the total amount due upon completion of the service.",
              },
              unit_amount: initailAmountToPay * 100,
            },
          },
        ],
        success_url: `https://api.binish.site/api/user/servicebooking/succesBooking?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://binish.site/`,
      });

      if (!session) {
        throw new CustomError("Something Went Wrong", HttpStatus.FORBIDDEN);
      }

      return { success: true, sessionId: session.id, url: session.url + "" };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async retrieveSession(
    sessionId: string
  ): Promise<{ success?: boolean; paymentInentID?: string }> {
    try {
      const response = await stripe.checkout.sessions.retrieve(sessionId);

      return { success: true, paymentInentID: response.payment_intent + "" };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async refund(
    payemnt_IntendId: string,
    amount: number
  ): Promise<{ success?: boolean }> {
    try {
      const response = await stripe.refunds.create({
        payment_intent: payemnt_IntendId,
        amount: Math.round(amount * 100),
      });

      return { success: true };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async fullpayment(
    selectedServices: SelectedService[],
    docId: string
  ): Promise<{ success?: boolean; url?: string }> {
    try {
      const lineItems = selectedServices.map((service) => ({
        quantity: 1,
        price_data: {
          currency: "inr",
          product_data: {
            name: `${service.serviceName} : ₹${service.price}`,
            description: "  ",
          },
          unit_amount: 0,
        },
      }));
      const calculatePercentage = (totalAmount: number, percentage = 25) => {
        return (totalAmount * percentage) / 100;
      };

      const totalAmount = selectedServices.reduce(
        (total, service) => total + service.price,
        0
      );
      const finalAmount =
        Math.max(totalAmount - calculatePercentage(totalAmount)) * 100;

      const reason = `Your total service amount is ₹ ${totalAmount}. After deducting the advance payment of ₹${calculatePercentage(totalAmount)}, the remaining balance of ₹${finalAmount} is now due. Please proceed with the payment to complete the process.`;
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "inr",
          product_data: {
            name: "Total",
            description: reason,
          },
          unit_amount: finalAmount,
        },
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        currency: "INR",
        mode: "payment",
        line_items: lineItems,
        success_url: `http://localhost:3000/api/user/servicebooking/fullpaymentsuccess/${docId}`,
        cancel_url: `http://localhost:5173`,
      });

      if (!session) {
        throw new CustomError("Something Went Wrong", HttpStatus.FORBIDDEN);
      }

      return { success: true, url: session.url + "" };
    } catch (error: any) {
      console.log(error);

      throw new CustomError(error.message, error.statusCode);
    }
  }
}

export default StripePayment;
