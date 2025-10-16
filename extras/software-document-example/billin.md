# Billin Workflow

## 1. Buat Products / Plans

Definisikan apa yang dapat dibeli user. jenis produk,pricing, subscription plan, atau one-time payments.

* Masuk ke Billin dashboard
* Navigasi ke bagian Products / Plans
* Menambahkan detail produk:

    * Nama
    * Harga
    * Deskripsi
    * Lama pembayaran: bulanan, tahunan, dll

Setiap plan ada punya id yang bisa dipakai untuk API atau integrasi link billin.

## 2. Integrasi SaaS

Integrasi Billin ke SaaS backend jadi konfirmasi dan pembayaran langanan dapat terhubung otomatis.

* Ke integration setting di dashboard billin
* Cari API Key / Secret Key
* Dalam Backend SaaS:

    * Tambahin API credentials ke `.env` atau config
    * Implementasi webhook endpoint Billin listen ke:

        * payment.success
* subscription.created
        * subscription.cancelled

* Test webhook delivery pakai mode sandbox (kalau ada)

## 3. Billing

Aktivasi payment flow untuk user.

1. Payment Links

    * Buat link untuk setiap plan dari dashboard billin
    * Embed di frontend UI aplikasinya

2. API Integration (jika ada)

    * Pakai API endpoint punya billin (misal: '/checkout/session/create') biar generate checkout session otomatis.
    * Redirect user ke callback url yang dikirim

## Next Steps

* Test flow dengan transaksi dummy
* Verifikasi update webhook dan subscription activation di backend
* Enable live mode kalau udah aman bisa menerima pembayaran
