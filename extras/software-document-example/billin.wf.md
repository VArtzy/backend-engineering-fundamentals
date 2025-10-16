## Billin Workflow

### 1. Create Products / Plans

Define what users can purchase — pricing tiers, subscription plans, or one-time payments.

* Log in to the Billin Dashboard.
* Navigate to Products / Plans.
* Add your product details:

  * Name: e.g., “Pro Plan”, “Starter Tier”
  * Price: set monthly or one-time amount
  * Description: optional; appears on the checkout page
  * Billing Cycle: monthly, yearly, or custom

Each plan gets a unique Product ID and Plan ID that will be used in API or link integrations.

### 2. Connect With Your SaaS

Link Billin to your SaaS backend so that payment confirmations and subscriptions sync automatically.

* Go to Integration Settings in the Billin dashboard.
* Obtain your API Key / Secret.
* In your SaaS backend:

  * Add Billin API credentials to your `.env` or config.
  * Implement Billin’s Webhook Endpoint to listen for:

    * `payment.success`
    * `subscription.created`
    * `subscription.cancelled`
* Test webhook delivery using sandbox mode (if available).

Your SaaS is now connected to receive automatic payment and subscription updates.

### 3. Start Billing

Activate your payment flow for users.

1. Payment Links

   * Generate a link for each plan from the Billin dashboard.
   * Share directly with customers or embed in your app UI.

2. API Integration

   * Use Billin’s API endpoint (e.g., `/checkout/session/create`) to dynamically generate checkout sessions.
   * Redirect users to the returned `checkout_url`.

Your SaaS is now live and ready to accept payments.

### Next Steps

* Test the entire flow with a dummy transaction.
* Verify webhook updates and SaaS-side subscription activation.
* Enable live mode to accept real payments.
