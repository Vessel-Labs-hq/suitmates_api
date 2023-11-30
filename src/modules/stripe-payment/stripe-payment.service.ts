import { Injectable, Inject } from '@nestjs/common';
import { STRIPE_WEBHOOK_SECRET, STRIPE_CURRENCY } from 'src/base/config';
import StripeError from 'src/enums/stripeError.enum';
import { STRIPE_TOKEN } from '@sjnprjl/nestjs-stripe'; // provider token
import Stripe from 'stripe';

@Injectable()
export class StripePaymentService {
  constructor(@Inject(STRIPE_TOKEN) private stripeClient: Stripe) {}

  // Create a product and a price for each suite
  async createSuiteProductAndPrice(
    suiteName: string,
    suiteCost: number,
    suiteId: string,
    suiteNumber: string,
    spaceId: string,
  ) {
    // Create a product with the suite name
    const product = await this.stripeClient.products.create({
      name: suiteName,
      metadata: {
        suiteId: suiteId,
        spaceId: spaceId,
        suiteNumber: suiteNumber
      },
    });

    // Create a price with the suite cost and billing interval (yearly)
    const price = await this.stripeClient.prices.create({
      unit_amount: suiteCost,
      currency: STRIPE_CURRENCY,
      recurring: {
        interval: 'month',
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
  async createSubscription(customerId: string, priceId: string,suiteId: string) {
    // Create a subscription with the customer and price
    const subscription = await this.stripeClient.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      metadata:{
        suiteId: suiteId
      },
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
  async updatePaymentMethod(
    customerId: string,
    paymentMethodId: string,
    oldPaymentId: string,
  ) {
    // Detach the current default payment method from the customer
    // const currentPaymentMethod = await this.stripeClient.paymentMethods.retrieve(customerId);
    await this.stripeClient.paymentMethods.detach(oldPaymentId);

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

  // Retrieve all payments based on spaceId metadata
  async getAllPaymentsBySpaceId(spaceId: string) {
   // Retrieve all products with the specific spaceId in their metadata
  const products = await this.stripeClient.products.list();
  const filteredProducts = products.data.filter(product => product.metadata.spaceId === spaceId);

  let allInvoices = [];

  for (const product of filteredProducts) {
    // Retrieve all prices associated with the product
    const prices = await this.stripeClient.prices.list({ product: product.id });

    for (const price of prices.data) {
      // Retrieve all subscriptions associated with the price
      const subscriptions = await this.stripeClient.subscriptions.list({ price: price.id });

      for (const subscription of subscriptions.data) {
        // Retrieve all invoices associated with the subscription
        const invoices = await this.stripeClient.invoices.list({ subscription: subscription.id });

        // Add the invoices to the allInvoices array
        for (const invoice of invoices.data) {
          allInvoices.push({
            suiteNumber: product.metadata.suiteNumber,
            suiteId: product.metadata.suiteId,
            spaceId: product.metadata.spaceId,
            amount: invoice.amount_paid / 100, // Convert from cents to dollars
            dateOfPayment: new Date(invoice.created  * 1000), // Convert from Unix timestamp to JavaScript Date
            status: invoice.status,
            nextPaymentAttempt: invoice.next_payment_attempt,
            paid: invoice.paid,
          });
        }
      }
    }
  }

  return allInvoices;

  }

  async getAllSubscriptions() {
    let allSubscriptions = [];
    let lastId;
  
    while (true) {
      const subscriptions = await this.stripeClient.subscriptions.list({
        limit: 100,
        starting_after: lastId,
      });
  
      allSubscriptions = [...allSubscriptions, ...subscriptions.data];
  
      if (subscriptions.has_more) {
        lastId = subscriptions.data[subscriptions.data.length - 1].id;
      } else {
        break;
      }
    }
  
    return allSubscriptions;
  }
  
  // async getSubscriptionBySuiteId(suiteId) {
  //   const subscriptions = await this.getAllSubscriptions();
  
  //   const subscription = subscriptions.find(sub => sub.metadata.suiteId === suiteId);
  
  //   return subscription;
  // }

  async getProductBySuiteId(suiteId) {
    const products = await this.stripeClient.products.list();
    const product = products.data.find(prod => prod.metadata.suiteId == suiteId);
    return product;
  }

  async getPriceIdByProductId(productId) {
    const prices = await this.stripeClient.prices.list();
  
    const price = prices.data.find(price => price.product == productId);
  
    return price ? price.id : null;
  }
  
  async getCurrentSubscriptionBySuiteId(customerId, suiteId) {
    const subscriptions = await this.stripeClient.subscriptions.list({
      customer: customerId,
      status: 'active',
    });
    const currentSubscription = subscriptions.data.find(sub => sub.metadata.suiteId == suiteId);
  
    return currentSubscription;
  }
  

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
