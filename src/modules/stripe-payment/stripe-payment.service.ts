import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { STRIPE_WEBHOOK_SECRET, STRIPE_CURRENCY } from "src/base/config";
import StripeError from "src/enums/stripeError.enum";
import { STRIPE_TOKEN } from '@sjnprjl/nestjs-stripe'; // provider token
import Stripe from "stripe";


@Injectable()
export class StripePaymentService {
  constructor(
    @Inject(STRIPE_TOKEN) private stripeClient: Stripe
  ) {}

  

 // Create a product and a price for each suite
 async createSuiteProductAndPrice(suiteName: string, suiteCost: number, suiteId: string) {
  // Create a product with the suite name
  const product = await this.stripeClient.products.create({
    name: suiteName,
    id: suiteId
  });

  // Create a price with the suite cost and billing interval (yearly)
  const price = await this.stripeClient.prices.create({
    unit_amount: suiteCost,
    currency: STRIPE_CURRENCY,
    recurring: {
      interval: 'year',
    },
    product: product.id,
  });

  // Return the product and price objects
  return { product, price };
}

// Create a customer and attach a payment method
async createCustomerAndPaymentMethod(
  customerEmail: string,
  paymentMethodId: string,
) {
  // Create a customer with the email address
  const customer = await this.stripeClient.customers.create({
    email: customerEmail,
  });

  // Attach the payment method to the customer
  const paymentMethod = await this.stripeClient.paymentMethods.attach(
    paymentMethodId,
    {
      customer: customer.id,
    },
  );

  // Set the payment method as the default for the customer
  await this.stripeClient.customers.update(customer.id, {
    invoice_settings: {
      default_payment_method: paymentMethod.id,
    },
  });

  // Return the customer and payment method objects
  return { customer, paymentMethod };
}

// Create a subscription for a customer and a price
async createSubscription(customerId: string, priceId: string) {
  // Create a subscription with the customer and price
  const subscription = await this.stripeClient.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: priceId,
      },
    ],
    expand: ['latest_invoice.payment_intent'],
  });

  // Return the subscription object
  return subscription;
}

 // Cancel a subscription by ID
 async cancelSubscription(subscriptionId: string) {
  // Delete the subscription and return the result
  const result = await this.stripeClient.subscriptions.del(subscriptionId);
  return result;
}

 // Update a payment method by customer ID and payment method ID
 async updatePaymentMethod(customerId: string, paymentMethodId: string) {
  // Detach the current default payment method from the customer
  const currentPaymentMethod = await this.stripeClient.paymentMethods.retrieve(
    customerId,
  );
  await this.stripeClient.paymentMethods.detach(currentPaymentMethod.id);

  // Attach the new payment method to the customer
  const newPaymentMethod = await this.stripeClient.paymentMethods.attach(
    paymentMethodId,
    {
      customer: customerId,
    },
  );

  // Set the new payment method as the default for the customer
  await this.stripeClient.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: newPaymentMethod.id,
    },
  });

  // Return the new payment method object
  return newPaymentMethod;
}

 // Delete a product and cancel all subscriptions by suite ID
 async deleteProductAndCancelSubscriptions(suiteId: string) {
  // Retrieve the product object by the suite ID
  const product = await this.stripeClient.products.retrieve(suiteId);

  // List all subscriptions that have the product as an item
  const subscriptions = await this.stripeClient.subscriptions.list({
    price: product.id,
  });

  // Loop through the subscriptions and cancel each one
  for (const subscription of subscriptions.data) {
    await this.stripeClient.subscriptions.del(subscription.id);
  }

  // Delete the product and return the result
  const result = await this.stripeClient.products.del(product.id);
  return result;
}






















  // public async createSubscription(priceId: string, customerId: string) {
  //   try {
  //     return await this.stripe.subscriptions.create({
  //       customer: customerId,
  //       items: [
  //         {
  //           price: priceId,
  //         },
  //       ],
  //     });
  //   } catch (error) {
  //     if (error?.code === StripeError.ResourceMissing) {
  //       throw new BadRequestException("Credit card not set up");
  //     }
  //     throw new InternalServerErrorException();
  //   }
  // }

  // public async listSubscriptions(priceId: string, customerId: string) {
  //   return this.stripe.subscriptions.list({
  //     customer: customerId,
  //     price: priceId,
  //   });
  // }

  // public async createMonthlySubscription(user, planId: string) {
  //   const data = await this.userService.findOneByEmail(user.email);
  //   const customerId: string = data.stripeCustomerId;
  //   const priceId = planId;
  //   const subscriptions = await this.listSubscriptions(priceId, customerId);
  //   if (subscriptions.data.length) {
  //     throw new BadRequestException("Customer already subscribed");
  //   }
  //   return this.createSubscription(priceId, customerId);
  // }

  // public async getMonthlySubscription(user, planId: string) {
  //   const data = await this.userService.findOneByEmail(user.email);
  //   const customerId: string = data.stripeCustomerId;
  //   const priceId = planId;
  //   const subscriptions = await this.listSubscriptions(priceId, customerId);

  //   if (!subscriptions.data.length) {
  //     throw new NotFoundException("Customer not subscribed");
  //   }
  //   return subscriptions.data[0];
  // }

  // public async createCustomer(name: string, email: string) {
  //   const stripeCustomer = await this.stripe.customers.create({
  //     name,
  //     email,
  //   });
  //   await this.userService.updateByEmail(email, {
  //     stripeCustomerId: stripeCustomer.id,
  //   });
  //   return stripeCustomer;
  // }

  // async getAllPlans() {
  //   try {
  //     // Fetch all products from Stripe
  //     const products = await this.stripe.products.list({ active: true });

  //     // Iterate through each product to fetch its pricing (prices)
  //     const productsWithPricing = await Promise.all(
  //       products.data.map(async (product) => {
  //         const prices = await this.stripe.prices.list({ product: product.id });
  //         return {
  //           product: product,
  //           prices: prices.data,
  //         };
  //       })
  //     );

  //     return productsWithPricing;
  //   } catch (error) {
  //     throw new InternalServerErrorException("Error while fetching products.");
  //   }
  // }

  // public async attachCreditCard(user, paymentMethod: CardSaveDto) {
  //   const data = await this.userService.findOneByEmail(user.email);
  //   if (!data.stripeCustomerId) {
  //     await this.createCustomer(paymentMethod.cardLastNumber, data.email);
  //   }

  //   const userData = await this.userService.findOneByEmail(user.email);
  //   const personDate = await this.personService.getPersonData(userData.id);

  //   await this.settingsService.updateSettings(
  //     userData.id,
  //     personDate["_id"].toString(),
  //     {
  //       cardName: paymentMethod.cardName,
  //       cardLastNumber: paymentMethod.cardLastNumber,
  //     }
  //   );
  //   // await this.userService.updateByCustomerId(userData.stripeCustomerId, {
  //   //   cardName: paymentMethod.cardName,
  //   //   cardLastNumber: paymentMethod.cardLastNumber
  //   // })
  //   const customerId: string = userData.stripeCustomerId;
  //   return await this.stripe.setupIntents.create({
  //     customer: customerId,
  //     payment_method: paymentMethod.paymentMethodId,
  //   });
  // }

  // public async updateCreditCard(user, cardDetails: CardUpdateDto) {
  //   try {
  //     const userData = await this.userService.findOneByEmail(user.email);

  //     // // Create a new Payment Method for the updated card details
  //     const paymentMethod = await this.stripe.paymentMethods.create({
  //       type: "card",
  //       card: {
  //         token: cardDetails.paymentMethodId, // Token received from client
  //       },
  //     });

  //     // Attach the Payment Method to the customer
  //     await this.stripe.paymentMethods.attach(paymentMethod.id, {
  //       customer: userData.stripeCustomerId,
  //     });

  //     // Update the customer's default payment method to the new Payment Method
  //     await this.stripe.customers.update(userData.stripeCustomerId, {
  //       invoice_settings: {
  //         default_payment_method: paymentMethod.id,
  //       },
  //     });

  //     const personDate = await this.personService.getPersonData(userData.id);
  //     await this.settingsService.updateSettings(
  //       userData.id,
  //       personDate["_id"].toString(),
  //       {
  //         cardName: cardDetails.cardName,
  //         cardLastNumber: cardDetails.cardLastNumber,
  //       }
  //     );

  //     return "Card details updated successfully.";
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException(
  //       "Error while updating card details."
  //     );
  //   }
  // }

  // async cancelSubscription(id: string) {
  //   return await this.stripe.subscriptions.cancel(id);
  // }

  // async webHookListen(req: Buffer, signature: string) {
  //   try {
  //     const event = this.stripe.webhooks.constructEvent(
  //       req,
  //       signature,
  //       STRIPE_WEBHOOK_SECRET
  //     );
  //     // Handle the event based on the event type
  //     switch (event.type) {
  //       case "customer.subscription.created":
  //         // Subscription was created
  //         const subscription = event.data.object;
  //         const customerId = subscription["customer"];
  //         await this.userService.updateByCustomerId(customerId, {
  //           isSubscribed: true,
  //         });

  //         break;
  //       case "customer.subscription.updated":
  //         // Subscription was updated
  //         const currentSubscription = event.data.object;

  //         if (currentSubscription["status"] === "active") {
  //           // Subscription was renewed
  //           const customerId = currentSubscription["customer"];
  //           await this.userService.updateByCustomerId(customerId, {
  //             isSubscribed: true,
  //           });
  //         }

  //         if (
  //           currentSubscription["status"] === "canceled" ||
  //           currentSubscription["status"] === "past_due"
  //         ) {
  //           const customerId = currentSubscription["customer"];
  //           const Id = customerId["customer"];
  //           await this.userService.updateByCustomerId(Id, {
  //             isSubscribed: false,
  //           });
  //         }
  //         break;
  //       case "customer.subscription.deleted":
  //         // Subscription was canceled
  //         // Handle the logic for the subscription cancellation

  //         const subscriptionDel = event.data.object;
  //         const Id = subscriptionDel["customer"];
  //         await this.userService.updateByCustomerId(Id, {
  //           isSubscribed: false,
  //         });

  //         break;
  //       default:
  //         // Unexpected event type
  //         break;
  //     }

  //     // res.sendStatus(200);
  //     return;
  //   } catch (err) {
  //     throw new BadRequestException(err);
  //   }
  // }
}
