# **Workflow Document — Payment System (Vidiopintar.com)**

## **1. Actors**

| Actor                 | Description                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------- |
| **User / Subscriber** | Website visitor purchasing a premium plan.                                                |
| **Admin**             | Operator who verifies payment manually.                                                   |
| **System**            | Vidiopintar backend handling plans, user data, payment records, and WhatsApp integration. |
| **Bank (BCA)**        | External payment channel where user transfers money manually.                             |
| **WhatsApp**          | Communication channel for payment confirmation.                                           |

## **2. Goal**

Allow users to upgrade to a **premium plan** via **manual bank transfer**, followed by confirmation through WhatsApp.
Once verified by admin, the user gains access to premium features.

## **3. Workflow Steps**

### **3.1. Select Plan**

1. User visits premium plans page.
2. User selects a plan (e.g. *Monthly Premium*, *AI Pro*, etc.).
3. System retrieves and displays plan details:

   * Plan name
   * Price
   * Benefits / features

### **3.2. Show Payment Instructions**

1. System displays **bank transfer details**:

   * Account name (e.g. PT Vidiopintar)
   * Bank: BCA
   * Account number
2. A **“Confirm via WhatsApp”** button is shown beneath the payment instructions.
3. The system generates a WhatsApp message template automatically containing:

   ```
   Halo, saya sudah melakukan transfer untuk {planName} sebesar {planPrice}. Mohon konfirmasi pembayaran saya.
   ```
4. If a transaction reference exists, `{reference}` is appended to the message.

### **3.3. User Transfer & Confirmation**

1. User transfers the required amount to the displayed BCA account.
2. After payment, user clicks the **“Confirm via WhatsApp”** button.
3. System opens WhatsApp (via `wa.me/{number}`) with the generated message pre-filled.
4. User sends the message to the official Vidiopintar WhatsApp number.
5. System updates the transaction status to **`waiting_confirmation`**.

### **3.4. Admin Verification**

1. Admin receives the user’s message and verifies payment manually by checking:

   * Sender’s name
   * Transfer amount
   * Bank receipt (if provided)
   * Matching transaction reference
2. If payment is valid:

   * Admin marks transaction as **`paid`** or **`confirmed`** in the admin panel.
   * System upgrades user’s account to **premium**.
3. If payment is invalid or unverified:

   * Admin may reject or request clarification.

### **3.5. Grant Premium Access**

1. Upon successful verification, system updates the user record:

   * Set `plan_status = active`
   * Set `premium_until = <expiry_date>`
2. User gains access to premium-only features:

   * Unlimited usage
   * AI features
   * Dedicated support
   * Other premium modules

### **3.6. Refund Process**

1. User (first-time subscriber only) can request refund within **7 days**.
2. Admin reviews eligibility:

   * Refund denied if user violates Terms, has used a portion of the billing period, or spent credits.
3. If approved, admin processes manual refund (bank transfer return).

## **4. Payment Configuration**

* Admin can **seed/update** payment configurations:

  * Bank account details
  * WhatsApp number
  * Message template
* Configurations are stored in backend settings (e.g. database or environment).
* Changes apply system-wide immediately.

## **5. Data Handling & Privacy**

* Payment data and user details are stored securely according to privacy policy.
* Payment data is only used to validate access to premium features.
* Sensitive info (e.g. transfer proof) is accessible only to admins.

## **6. System States**

| State                  | Trigger                        | Description                         |
| ---------------------- | ------------------------------ | ----------------------------------- |
| `initiated`            | User selects plan              | Transaction created but unpaid      |
| `waiting_confirmation` | User clicks WhatsApp confirm   | Awaiting admin validation           |
| `paid` / `confirmed`   | Admin verifies transfer        | Payment approved; premium activated |
| `rejected`             | Admin rejects invalid transfer | Payment not validated               |
| `refunded`             | Admin approves refund          | Refund processed                    |

## **7. Summary**

* Current payment flow is **manual**, using **BCA bank transfers** and **WhatsApp confirmations**.
* The system **does not** use any automatic payment gateway.
* Transaction status depends on **manual confirmation** from both user and admin.
* Premium activation occurs only after **admin validation**.
* Refunds are limited and handled manually.
