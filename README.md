# PledgeNest

A full-stack crowdfunding platform where creators launch campaigns and supporters back them with platform credits — built with Next.js, Express, MongoDB, Firebase Authentication, and Stripe.

**Admin Email:** admin.test@example.com
**Admin Password:** Test123

**Live Site URL:** _(replace with your Vercel deployment link)_
**Client Repository:** _(replace with your GitHub client repo link)_
**Server Repository:** _(replace with your GitHub server repo link)_

> ⚠️ Before submitting, replace the admin credentials above with a real account on your deployed database, and update the placeholder links.

## Features

- Three distinct roles — **Supporter**, **Creator**, and **Admin** — each with their own dashboard and permissions, enforced by JWT-protected, role-based middleware on the server.
- Firebase Authentication with both email/password registration and Google Sign-In, backed by a JWT session that survives page reloads without redirecting logged-in users back to the login page.
- Credit-based economy: Supporters start with 50 free credits, Creators with 20, and every contribution, approval, rejection, and withdrawal updates balances atomically on the server.
- Campaign lifecycle with admin moderation — every campaign starts as `pending` and only becomes publicly visible after an admin approves it.
- Creators review incoming contributions one by one, with a detail modal and one-click approve/reject; rejections automatically refund the supporter's credits.
- Real Stripe checkout for purchasing credit packages, with a graceful test-mode fallback so the flow works end-to-end even before a Stripe key is configured.
- Withdrawal system with server-enforced business rules (20 credits = \$1, \$10 minimum) and an admin-side "Payment Success" approval step.
- In-app notification system — a floating, click-outside-to-close bell icon shows real-time updates for contribution approvals, campaign decisions, and withdrawal approvals.
- Community reporting: supporters can flag suspicious campaigns, and admins can dismiss the report, suspend the campaign, or delete it outright.
- Paginated "My Contributions" history, category and keyword filtering on Explore Campaigns, and a fully responsive layout from mobile to desktop, including the dashboard.

## Tech Stack

**Client:** Next.js (App Router), Tailwind CSS, Firebase Auth, Axios, Swiper, Stripe.js
**Server:** Express.js, MongoDB (native driver), JWT, Firebase Admin SDK, Stripe

## Local Setup

**Server**
```bash
cd pledgenest-server
npm install
cp .env.example .env   # fill in MongoDB, JWT, Firebase, and Stripe secret key
npm run dev
```

**Client**
```bash
cd pledgenest-client
npm install
cp .env.local.example .env.local   # fill in Firebase, ImgBB, and Stripe publishable key
npm run dev
```
