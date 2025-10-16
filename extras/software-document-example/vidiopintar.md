# Vidiopintar Workflow

## Aktor

User
Admin: operator verifikasi payment manual
System
Bank
Whatsapp: channel komunikasi untuk konfirmasi payment

## Abstrak

Bisa upgrade user ke premium plan pakai manual bank transfer, terus konfirmasi di wa. Setelah diverifikasi admin, user dapat access ke fitur premium.

## Workflow

### 1. Pilih Plan

1. User ke halaman premium plans
2. User pilih plan (bisa bulanan/tahunan/dll)
3. System menampilkan detail plannya:

    * Nama plan
    * Harga
    * Benefit / fitur

### 2. Intruksi Pembayaran

1. System menampilkan detail bank transfer:

    * Nama
    * Bank: BCA
    * Nomor rekening

2. Muncul button konfirmasi via whatsapp dibawah intruksi pembayaran
3. Menggunakan whatsapp chat API, akan mengenerate chat whatsapp template otomatis seperti:

   ```
   Halo, saya sudah melakukan transfer untuk {planName} sebesar {planPrice}. Mohon konfirmasi pembayaran saya.
   ```
4. Jika ada referal, {reference} ditambahin ke pesan whatsapp.

### 3. User Transfer

1. User transfer ke rekening BCA sesuai detail ditampilkan
2. Setelah pembayaran, user klik confirm via WhatsApp
3. Buka whatsapp (via `wa.me/{number}`) dengan message yang sudah disiapkan dengan templating.
4. User kirim message ke nomor WA Vidiopintar
5. Update status transaksi ke `waiting_confirmation` di sistem

### 4. Verifikasi Admin

1. Admin menerima pesan user dan memverifikasi Pembayaran
2. Jika payment valid:

    * Admin mengubah transaksi sebagai `paid` atau `confirmed` di admin panel
    * System mengubah akun user ke premium

### 5. Premium Access

1. Setelah sukses verifikasi, system update user:

    * Set `plan_status = active`
    * Set `premium_until = <expiry_date>`
2. User dapat fitur khusus premium

### 6. Refund

1. User dapat request refund selama 7 hari
2. Admin cek memenuhi syarat
3. Jika approve, admin memproses refund manual (transfer balik)

## Konfigurasi Pembayaran

* Admin bisa update konfigurasi payment:

    * Nomor rekening
    * No WA
    * Template message
* Disimpan di setting backend (bisa database/app/env)

## Status Pembayaran

initiated: transaksi dibuat tapi belum bayar
waiting_confirmation: menunggu validasi admin
paid / confirmed: pembayaran diterima; aktivasi premium
rejected: pembayaran tidak valid
refunded: admin approve refund

## Summary

* Proses pembayaran sekarang masih manual, menggunakan transfer bank BCA dan konfirmasi wa
* System tidak menggunakan payment gateway
* Status transaksi tergantung konfirmasi manual dari user dan admin
* Refund terbatas karerna dihandle manual
