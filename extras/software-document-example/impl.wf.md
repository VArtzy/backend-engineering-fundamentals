## ⚙️ **Option 1: Low-Code Integration (Payment Links + Webhooks)**

### **Overview**

This option focuses on rapid integration — no deep API coding required. You use **Billin’s dashboard and payment links**, then connect minimal backend logic to handle post-payment actions.

### **1. Create Products and Plans**

* Log in to **Billin Dashboard → Products / Plans**.
* Add your plans:

  * Example:

    * **Starter Plan** – ID: `plan_starter`
    * **Pro Plan** – ID: `plan_pro`
* Set pricing, billing cycle, and currency.

### **2. Generate Payment Links**

* Navigate to **Billing → Payment Links**.
* Create checkout links for each plan.
* Copy and store them in your SaaS config or database:

  * `starter_checkout_url = https://billin.id/checkout/starter`
  * `pro_checkout_url = https://billin.id/checkout/pro`

### **3. Integrate Into SaaS Frontend**

In your pricing page:

* Replace “Subscribe” or “Buy” buttons with the Billin payment link:

  ```html
  <a href="{{ plan.checkout_url }}" target="_blank" class="btn btn-primary">Subscribe Now</a>
  ```
* When the user pays, Billin redirects them to a “Payment Success” page or your callback URL.

### **4. Configure Webhook**

To sync payment results:

* Go to **Billin → Integrations → Webhooks**
* Add endpoint in your SaaS backend:

  ```
  POST https://yourdomain.com/api/webhook/billin
  ```
* Events to handle:

  * `payment.success` → mark subscription active
  * `subscription.cancelled` → disable premium features
* Example Node.js/Python pseudo-handler:

  ```python
  @app.post("/api/webhook/billin")
  def billin_webhook(event):
      if event["type"] == "payment.success":
          activate_user(event["data"]["user_id"])
  ```

### **5. Test Integration**

* Use Billin sandbox/test mode.
* Simulate successful and failed payments.
* Confirm your app updates user status correctly.

### **6. Go Live**

* Switch API keys to **Production Mode**.
* Start billing real customers.

✅ **Best For:** MVPs, small teams, low-code startups.
🚀 **Pros:** Fast setup, minimal code.
⚠️ **Cons:** Less customization, limited automation.

## 🧩 **Option 2: Full API Integration (Custom Checkout + Subscription Logic)**

### **Overview**

For teams needing **customized UX**, full control of checkout logic, and tight SaaS integration (e.g., metered billing or in-app payments).

### **1. Setup API Credentials**

* Go to **Billin Dashboard → Developer Settings → API Keys**.
* Store them securely:

  ```
  BILLIN_API_KEY=sk_live_xxx
  BILLIN_WEBHOOK_SECRET=whsec_xxx
  ```

### **2. Create Products via API**

Instead of using the dashboard:

```bash
POST /api/v1/products
{
  "name": "Pro Plan",
  "price": 99000,
  "interval": "month"
}
```

Store the returned `product_id` and `plan_id` in your database.

### **3. Create Dynamic Checkout Sessions**

In your backend:

```bash
POST /api/v1/checkout/session/create
{
  "customer_email": "user@example.com",
  "plan_id": "plan_pro",
  "redirect_url": "https://yourapp.com/payment/success"
}
```

**Response:**

```json
{
  "checkout_url": "https://billin.id/checkout/session/abc123"
}
```

Redirect the user to that URL from your frontend.

### **4. Handle Webhooks**

Billin will send webhook events to your endpoint:

```
POST /api/webhook/billin
```

Example handler:

```js
app.post("/api/webhook/billin", verifySignature, async (req, res) => {
  const { type, data } = req.body;
  switch (type) {
    case "payment.success":
      await activateUser(data.customer_email);
      break;
    case "subscription.cancelled":
      await deactivateUser(data.customer_email);
      break;
  }
  res.sendStatus(200);
});
```

### **5. Maintain Subscription State**

In your database, track:

* `subscription_status`
* `plan_id`
* `renewal_date`
* `cancel_at`

Use a CRON job or webhook-based sync to renew subscriptions or cancel them automatically.

### **6. Test & Deploy**

* Use Billin’s sandbox to test flows.
* Validate event signatures for webhook security.
* Move to production when verified.

✅ **Best For:** Mature SaaS, teams with backend developers.
🚀 **Pros:** Fully automated, custom UX, scalable.
⚠️ **Cons:** Requires coding effort and maintenance.

### **Comparison Summary**

| Feature     | Option 1: Payment Links | Option 2: Full API |
| ----------- | ----------------------- | ------------------ |
| Setup Time  | ~5 mins                 | ~1–2 hrs           |
| Automation  | Partial (via webhook)   | Full               |
| Custom UX   | ❌                       | ✅                  |
| Dev Effort  | Minimal                 | Moderate–High      |
| Scalability | Basic                   | Advanced           |
| Ideal For   | Startups, MVP           | Production SaaS    |
