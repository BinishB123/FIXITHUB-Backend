import HttpStatus from "../../entities/rules/statusCode";
import IStripe from "../../entities/services/Istripe";
import CustomError from "./errorInstance";
import dotenv from "dotenv"
import Stripe from "stripe";
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECERET_KEY + "")


class StripePayment implements IStripe {
   async   userCheckoutSession(): Promise<{ success?: boolean; sessionId?: string; url?: string; }> {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                currency: "INR",
                mode: "payment",
                line_items: [{
                  quantity: 1,
                  price_data: {
                    currency: "inr",
                    product_data: { name: "Booking Fee", description: "A booking fee of Rs. 1000 is non-refundable if the booking is canceled. Upon completion of the service, this fee will be deducted from the total amount due.Prices are estimates and may change based on additional work identified during service." },
                    unit_amount: 1000 * 100
                  }
                }],
                success_url: `http://localhost:3000/api/user/servicebooking/succesBooking?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `http://localhost:5173`,
              }); 
              
              if (!session) {
                throw new CustomError("Something Went Wrong", HttpStatus.FORBIDDEN);
              }
        
              return { success: true, sessionId: session.id, url: session.url+"" };
        } catch (error:any) {
           throw new CustomError(error.message,error.statusCode) 
        }
    }

    async retrieveSession(sessionId: string): Promise<{ success?: boolean; paymentInentID?: string; }> {
        try {
            const response = await stripe.checkout.sessions.retrieve(sessionId)
           
            return {success:true,paymentInentID:response.payment_intent+""}
        } catch (error:any) {
          throw new CustomError(error.message,error.statusCode)
        }
    }
}

export default StripePayment