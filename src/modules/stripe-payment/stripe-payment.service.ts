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
    // Define an empty array to store the payments
    let payments = [];
    let paymentList;
    // Define the initial parameters for the list method
    let params: { [key: string]: any } = { limit: 100 };

    // Use a do-while loop to paginate through the payments
    do {
      // Retrieve a list of payments
      paymentList = await this.stripeClient.paymentIntents.list(params);

      // Filter the payments based on the spaceId metadata
      const filteredPayments = paymentList.data.filter(
        (payment) => payment.metadata.spaceId === spaceId,
      ).map(payment => ({
        suiteNumber: payment.metadata.suiteNumber,
        suiteId: payment.metadata.suiteId,
        spaceId: payment.metadata.spaceId,
        amount: payment.amount / 100, 
        dateOfPayment: new Date(payment.created * 1000),
        status: payment.status, // payment status
      }));

      // Add the filtered payments to the payments array
      payments = [...payments, ...filteredPayments];

      // Get the last payment's ID
      const lastPaymentId = paymentList.data[paymentList.data.length - 1].id;

      // Set the starting_after parameter for the next iteration
      params.starting_after = lastPaymentId;
    } while (payments.length < paymentList.total_count);

    // Return the payments array
    return payments;
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
  
  async getSubscriptionBySuiteId(suiteId) {
    const subscriptions = await this.getAllSubscriptions();
  
    const subscription = subscriptions.find(sub => sub.metadata.suiteId === suiteId);
  
    return subscription;
  }
  
  async getCurrentSubscriptionBySuiteId(customerId, suiteId) {
    const subscriptions = await this.stripeClient.subscriptions.list({
      customer: customerId,
      status: 'active',
    });
  
    const currentSubscription = subscriptions.data.find(sub => sub.metadata.suiteId === suiteId);
  
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
