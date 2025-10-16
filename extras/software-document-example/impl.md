# Implementasi Billin ke Vidiopintar

## Low-Code Integration (Payment Link + Webhook)

Pendekatan ini fokus ke rapid integration. Tidak perlu API coding secara dalam. Pakai Billin dashboard dan bikin payment links, terus koneksiin dengan backend logic untuk handle setelah payment.

### 1. Buat Product dan Plans

* Log in ke dashboard billin -> products / plans
* Tambahin plan (contoh: paket bulanan/tahunan)
* Set harga

### 2. Generate Payment Link

* Cari payment links
* Buat checkout links buat setiap plan
* Copy dan simpan ke konfigurasi/database/app

### 3. Integrasi Frontend

Di halaman pricing:

* Ganti href button dengan payment link billin (embed)
* Jika user membayar, billin redirect ke halaman pembayaran sukses dari callback URL

### 4. Konfigurasi Webhook

Biar bisa sinkron hasil pembayaran:

* Ke billin -> webhook
* Tambah endpoint ke backend:
```
POST https://vidiopintar.com/api/webhook/billin
```
* Handle event:

    * `payment.success` -> subscription aktif
    * `subscription.cancelled`

### 5. Test Integrasi

* Pakai Billin sandbox/test mode
* Simulasi pembayaran sukses dan gagal
* Konfirmasi aplikasi update status user

### 6. Live

* Pindah API key ke mode production
* Mulai billing

Cocok untuk: MVP, tim kecil, low-code
Kelebihan: Setup cepat, kode minimal
Kekurangan: Susah kustomisasi, automasi terbatas, tidak pegang kontrol flow

## API Integration (jika ada)

Jika membutuhan UX yang customized, full control logika checkout, pembayaran dalam aplikasi.

### 1. Setup Kredensial API

* Ke Billin dashboard -> API keys
* Simpan dengan aman API key dan webhook secret (env)

### 2. Buat Produk via API

Tanpa menggunakan dashboard (misal):

```bash
POST /api/v1/products
{
    "nama": "Bulanan",
    "harga": 50000,
    "interval": "bulan"
}```

Simpan produk/plan id di database

### 3. Buat Checkout

Backend:

```bash
POST /api/v1/checkout/session/create
{
    "customer_email": "farrel@asd.com",
    "plan_id": "bulanan",
    "redirect_url": "https://vidiopintar.com/payment/success"
}
```

Reponse:

```json
{ "checkout_url": "https://billin.id/checkout/session/abc123" }
```

Redirect user ke checkout url dari frontend

### 4. Handle Webhook

Billin mengirim webhook events ke endpoint:

```bash
POST <url>/api/webhook/billin
```

Contoh handler: 
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

### 5. Subscription State

Di database update:

subscription_status
plan_id
renewal_date
cancel_at

Pakai CRON atau sinkronisasi webhook untuk memperbarui subscription atau cancel otomatis

### 6. Test & Deploy

* Pakai sandbox Billin ngetes flow
* Validasi event (cek keamanan webhook)
* Pindah ke production

Cocok untuk: Mature SaaS, tim dengan backend developer
kelebihan: Fully automated, custom UX, scalable
Kekurangan: Butuh effort dan maintenance kode
