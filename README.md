# 🏡 Leadsage Africa

**Leadsage Africa** is a modern property management and rental platform built for the African real estate market — connecting **tenants**, **landlords**, and **admins** through a unified ecosystem.  
It simplifies renting, shortlets, lease management, property onboarding, and secure payments while creating transparency and trust across all stakeholders.

---

## 🚀 Overview

Leadsage Africa allows:

- **Renters** to browse listings, book tours or shortlets, submit applications, sign digital leases, and make secure payments.
- **Landlords** to manage listings, track bookings, review tenant applications, and handle leases.
- **Admins** to approve listings, monitor platform activity, and manage compliance and payments.

Designed for scalability, the system is split across **three applications**:

- 🌍 **Renter App** → `leadsage.com`
- 🏠 **Landlord Portal** → `landlord.leadsage.com`
- ⚙️ **Admin Dashboard** → `admin.leadsage.com`

Each operates independently but shares a unified backend, authentication, and design system.

---

## ✨ Key Features

### 🧭 Tenant / Renter

- Browse verified listings by category or location
- Book **property tours** or **shortlet stays**
- Submit applications for long-term rentals
- Sign digital **lease agreements** securely
- Manage payments and receipts in one place

### 🏘️ Landlord

- Create and manage listings with detailed info & images
- Review and approve tenant applications
- Monitor lease statuses, renewals, and terminations
- Receive notifications for booking or payment updates
- Analytics dashboard for performance tracking

### 🛠️ Admin

- Approve or reject new listings and landlord profiles
- Oversee leases, payments, and platform-wide data
- Manage categories, policies, and user reports
- Handle communication and support

---

## ⚙️ Tech Stack

| Category            | Tools / Services                       |
| ------------------- | -------------------------------------- |
| **Frontend**        | Next.js 15, React, TypeScript          |
| **UI & Styling**    | Tailwind CSS, ShadCN UI, Framer Motion |
| **Auth & Security** | Clerk, Arcjet                          |
| **Database**        | Neon (PostgreSQL)                      |
| **Email Delivery**  | Mailjet                                |
| **File Storage**    | Tigres S3                              |
| **Hosting**         | Vercel, AWS (for scaling)              |
| **Payments**        | Coming soon – Paystack / Flutterwave   |
| **Version Control** | GitHub                                 |

---

## 🧩 Architecture

<!--
Leadsage uses a **Turborepo monorepo** setup for scalability:

```
leadsage/
├── apps/
│   ├── web/         # renter app (leadsage.com)
│   ├── landlord/    # landlord dashboard (landlord.leadsage.com)
│   └── admin/       # admin console (admin.leadsage.com)
├── packages/
│   ├── ui/          # shared components
│   ├── lib/         # utilities, auth, helpers
│   ├── config/      # tailwind, eslint, env, etc.
│   └── api/         # server actions, db access
└── turbo.json
```

### Shared Modules
- **@leadsage/ui** → buttons, modals, inputs, tables
- **@leadsage/lib** → hooks, auth, utilities
- **@leadsage/api** → reusable server functions (e.g. `createListing`, `approveLease`)

This setup allows isolated deployment per app while maintaining shared logic.

--- -->

## 💬 Email Workflows

The system supports **automated email templates** for:

- User onboarding & verification
- Lease lifecycle (activation, renewal, termination, expiry)
- Booking confirmations (shortlets, tours)
- Admin actions (approvals, rejections, info requests)
- Support inquiries via Contact Us page

All emails are handled through **Mailjet transactional API**, with environment-based templates.

---

<!-- ## 💰 Pricing Projection (Infrastructure)

| Service | Provider | Est. Monthly Cost (10,000 users) |
|----------|-----------|------------------------------|
| Hosting & Compute | AWS EC2 / Vercel | ~$120–200 |
| Database | Neon PostgreSQL | ~$80 |
| Storage | Tigres S3 | ~$30 |
| Email Delivery | Mailjet | ~$40 |
| Auth | Clerk | ~$50 |
| Security | Arcjet | ~$20 |
| Misc / Backups | AWS / Cloudflare | ~$30 |
| **Total Estimate** |  | **≈ $350–450 / month** |

--- -->

## 🧑‍💻 Development

### Prerequisites

- Node.js v18+
- pnpm or npm
- PostgreSQL connection (via Neon)
- Environment variables configured

### Run Locally

```bash
git clone https://github.com/tomiwa-adelae/leadsage-africa.git
cd leadsage-africa
pnpm install
pnpm dev
```

<!-- Apps will run at:
- Renter → http://localhost:3000
- Landlord → http://localhost:3001
- Admin → http://localhost:3002

--- -->

## 🔒 Environment Variables

| Variable                            | Description           |
| ----------------------------------- | --------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key      |
| `DATABASE_URL`                      | Neon database URL     |
| `MAILJET_API_KEY`                   | Mailjet API key       |
| `S3_BUCKET_NAME`                    | Tigres storage bucket |
| `SUPPORT_EMAIL_ADDRESS`             | Support contact email |
| `ARCJET_API_KEY`                    | Arcjet security key   |

<!-- ---

## 🧠 Future Roadmap

- [ ] Payment gateway integration (Paystack / Flutterwave)
- [ ] In-app chat between tenants & landlords
- [ ] AI-driven property recommendations
- [ ] Analytics dashboard for landlords
- [ ] iOS & Android companion apps   -->

---

## 🧾 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Tomiwa Adelae**  
Full-stack Developer | Builder | Innovator  
🔗 [Portfolio](https://tomiwaadelae.vercel.app) • [GitHub](https://github.com/tomiwa-adelae)

> “Leadsage Africa bridges the gap between people and property — one digital lease at a time.”
