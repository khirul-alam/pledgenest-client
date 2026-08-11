# PledgeNest — Client

Next.js (App Router) দিয়ে বানানো **PledgeNest**-এর ফ্রন্টএন্ড। Phase 3: ফাউন্ডেশন (Auth system + basic layout + home page)।

## ফোল্ডার স্ট্রাকচার

```
pledgenest-client/
├── src/
│   ├── app/
│   │   ├── layout.js              # রুট লেআউট (AuthProvider + Navbar + Footer)
│   │   ├── page.js                 # হোম পেজ
│   │   ├── globals.css
│   │   ├── login/                  # (Phase 4 এ পূর্ণ হবে)
│   │   └── register/               # (Phase 4 এ পূর্ণ হবে)
│   │
│   ├── components/
│   │   └── shared/
│   │       ├── Navbar.js
│   │       ├── Footer.js
│   │       └── PrivateRoute.js     # প্রাইভেট রুট গার্ড — reload bug ফিক্স সহ
│   │
│   ├── providers/
│   │   ├── AuthContext.js
│   │   └── AuthProvider.js         # Firebase auth + JWT ম্যানেজমেন্ট
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useAxiosSecure.js       # secure API কলের জন্য axios instance
│   │
│   ├── firebase/
│   │   └── firebase.config.js
│   │
│   └── services/                   # (Phase 4+ এ imgbbService, campaignService ইত্যাদি যোগ হবে)
│
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.mjs
├── .env.local.example
└── .gitignore
```

## এখন পর্যন্ত যা কাজ করে (Phase 3)

- Firebase Authentication সেটআপ (Email/Password + Google প্রস্তুত)
- AuthProvider — reload করলে যাতে ভুলভাবে logout/redirect না হয়, তার ফিক্স করা আছে
- useAxiosSecure — token সহ protected API কল, 401/403 এ auto logout
- Navbar (logged-in vs logged-out state ভিন্ন), Footer
- Home page — Hero, Top Funded (placeholder), Testimonial (placeholder), ৩টা এক্সট্রা সেকশন

## এখনো বাকি

- Login / Register পেজ (ImgBB আপলোড সহ)
- Dashboard লেআউট + Supporter/Creator/Admin রুট
- Notification popup, Report feature
- Stripe পেমেন্ট
- Swiper দিয়ে আসল hero slider + animation

## সেটআপ করবেন কীভাবে

```bash
npm install
cp .env.local.example .env.local   # তারপর আসল Firebase/ImgBB key বসান
npm run dev
```
