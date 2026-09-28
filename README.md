# Madam No Case Ventures: Website & API

> **Your One Stop Shop for Traditional, Bridal and Event Essentials**
> *Quality Products & Excellent Service*

The business website for Madam No Case Ventures (Ondo Town, Ondo State), with a REST API and an admin dashboard for managing services, products, the gallery and customer enquiries.

| Layer    | Tech                                                           |
| -------- | -------------------------------------------------------------- |
| Frontend | React 19, JavaScript, Vite, Tailwind CSS v4, React Router      |
| Backend  | Node.js, Express 5, JavaScript (ES modules), REST API          |
| Database | MongoDB with Mongoose                                          |
| Auth     | JWT (Bearer tokens) + bcrypt password hashing                  |

No TypeScript is used anywhere.

---

## Project structure

```
Madam-No-Case/
├── client/                    React + Vite frontend
│   ├── public/                favicon
│   └── src/
│       ├── assets/images/     business photos used on the marketing pages
│       ├── components/        Header, Footer, ProductCard, ContactForm, GalleryGrid…
│       ├── lib/               API client, auth context, business details, hooks
│       ├── pages/             Home, About, Services, Products, Gallery, Contact
│       │   └── admin/         Admin login + dashboard
│       ├── App.jsx
│       └── main.jsx
└── server/                    Express REST API
    ├── config/                env loading, DB connection, constants, paths
    ├── controllers/           request handlers
    ├── middleware/            auth, validation, uploads, rate limits, errors
    ├── models/                Mongoose schemas (Admin, Inquiry, Service, Product, GalleryImage)
    ├── routes/                /api/* routers
    ├── validators/            express-validator rules
    ├── utils/                 ApiError, response helper, mailer, file helpers
    ├── scripts/               seed, create-admin, local MongoDB, API smoke test
    ├── seed/images/           the business's own photos, used by the seed script
    ├── uploads/               images uploaded through the admin dashboard
    ├── app.js                 Express app (middleware + routes)
    └── server.js              entry point (connects DB, starts server)
```

---

## 1. Installation

Requires **Node.js 20 or newer** (tested on Node 24) and npm.

```bash
cd server && npm install
cd ../client && npm install
```

## 2. MongoDB setup

Pick **one** of these options.

**A. MongoDB Atlas (recommended for production, free tier available)**
1. Create a cluster at https://www.mongodb.com/atlas.
2. Under *Database Access*, create a database user. Under *Network Access*, allow your IP (or your host's IP).
3. Click *Connect → Drivers* and copy the connection string into `MONGODB_URI`, adding the database name:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/madam-no-case?retryWrites=true&w=majority`

**B. MongoDB installed locally**
Install MongoDB Community Server and use `MONGODB_URI=mongodb://127.0.0.1:27017/madam-no-case`.

**C. No install: run a local MongoDB from this project (development only)**
```bash
cd server
npm run db:local
```
This downloads the official MongoDB server binary on first run (~780 MB on Windows, cached afterwards). It then runs a real MongoDB on `127.0.0.1:27017`, keeping data in `server/.mongo-data/`. Leave that terminal open while you work.

On a slow or unreliable connection, download the MongoDB zip yourself from https://www.mongodb.com/try/download/community, extract it, and set `MONGOD_BINARY=C:/path/to/bin/mongod.exe` in `server/.env`. `npm run db:local` will then use it with no download.

## 3. Environment variables

```bash
cd server
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
```

Then edit `server/.env`:

| Variable          | Required | Description |
| ----------------- | :------: | ----------- |
| `MONGODB_URI`     | ✅ | MongoDB connection string (see above). |
| `JWT_SECRET`      | ✅ | Long random secret used to sign admin tokens (32+ characters). Generate one: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `PORT`            |    | API port, default `5000`. |
| `NODE_ENV`        |    | `development` or `production`. |
| `CLIENT_ORIGIN`   |    | Comma-separated origins allowed by CORS. Default `http://localhost:5173`. Set to your live domain in production. (In development any `localhost` port is also accepted, so it still works if Vite picks 5174.) |
| `MONGOD_BINARY`   |    | Only for `npm run db:local`: path to an existing `mongod` executable, which skips the download. |
| `JWT_EXPIRES_IN`  |    | Admin session length, default `7d`. |
| `TRUST_PROXY`     |    | `true` when behind a proxy/load balancer (Render, Railway, Nginx), so rate limiting sees real IPs. |
| `MAX_UPLOAD_MB`   |    | Max image upload size, default `5`. |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | | Optional defaults for `npm run create-admin`. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `NOTIFY_EMAIL` | | Optional. When all are set, each new enquiry is also emailed to `NOTIFY_EMAIL`. Enquiries are always saved to the database either way. For Gmail use `smtp.gmail.com`, port `465`, `SMTP_SECURE=true` and an [App Password](https://myaccount.google.com/apppasswords). |

The server refuses to start if `MONGODB_URI` or `JWT_SECRET` is missing. Never commit `.env`; it is already in `.gitignore`.

The frontend needs no `.env` for local development. For production see `client/.env.example` (`VITE_API_URL`).

## 4. Load the starting content

```bash
cd server
npm run seed
```

This adds the 11 services from the flyer, plus products and gallery photos made from the business's own pictures in `server/seed/images`. It is safe to re-run: existing records (including your edits) are never overwritten.

## 5. Admin setup

There is **no public sign-up**. Create the owner's account from the command line:

```bash
cd server
npm run create-admin -- --email owner@example.com --password "choose-a-long-password" --name "Madam No Case"
```

* Password must be at least 10 characters. It is hashed with bcrypt (12 rounds) and never stored in plain text.
* Forgot the password? Reset it with: `npm run create-admin -- --email owner@example.com --password "new-password" --reset`
* Sign in at **http://localhost:5173/admin** (there is also a small "Admin" link in the footer).
* In the dashboard you can manage **Enquiries** (mark as new/read/replied/archived, reply by phone/WhatsApp/email, delete), **Services**, **Products** (with photo upload, price, availability, featured flag), **Gallery**, and change your password under **Account**. Changing the password signs out other devices.

## 6. Start the backend

```bash
cd server
npm run dev        # auto-restarts on file changes
# or
npm start
```
API: http://localhost:5000, health check: http://localhost:5000/api/health

## 7. Start the frontend

```bash
cd client
npm run dev
```
Website: **http://localhost:5173**

In development Vite proxies `/api` and `/uploads` to `http://localhost:5000`, so both must be running.

### Running commands from the project root

`db:local`, `seed`, `create-admin`, `test:api` and the dev servers are defined in `server/package.json` and `client/package.json`. The root `package.json` forwards them, so these also work from the top-level folder:

```bash
npm run dev            # everything in one terminal: local MongoDB (if needed) + API + website. Ctrl+C stops all
npm run install:all    # install server + client dependencies
npm run db:local       # local MongoDB
npm run seed
npm run create-admin -- --email you@example.com --password "a-long-password"
npm run server         # API on :5000
npm run client         # website on :5173
```

### Quick start (all together, 3 terminals)

```bash
# terminal 1 (skip if you use Atlas or an installed MongoDB)
cd server && npm run db:local
# terminal 2
cd server && npm run seed && npm run create-admin -- --email you@example.com --password "a-long-password" && npm run dev
# terminal 3
cd client && npm run dev
```

## 8. Testing the API

With the server running and an admin created:

```bash
cd server
npm run test:api -- --email you@example.com --password "a-long-password"
```

This runs an end-to-end check against every endpoint: validation errors, auth failures, create/update/delete, image uploads and cleanup, filters and search, and injection attempts. It removes everything it creates.

## 9. Production build

```bash
cd client && npm run build            # outputs client/dist
cd ../server && NODE_ENV=production npm start
```

With `NODE_ENV=production`, the Express server also serves `client/dist`, so one Node process hosts the whole site. Alternatively, host `client/dist` on any static host (Netlify, Vercel…) and set `VITE_API_URL` to the API's URL before building, and add that site's origin to `CLIENT_ORIGIN`.

Uploaded images are stored on disk in `server/uploads/`. Use a host with a persistent disk, and back that folder up.

---

## API reference

Base URL: `http://localhost:5000/api`

### Response format

```jsonc
// success
{ "success": true, "message": "optional", "data": { ... } | [ ... ], "meta": { ... } }
// error
{ "success": false, "message": "Validation failed", "errors": [{ "field": "phone", "message": "Please enter a valid phone number" }] }
```

Status codes: `200` OK, `201` created, `400` bad request, `401` not signed in / bad token, `403` CORS origin not allowed, `404` not found, `409` duplicate, `413` too large, `422` validation failed, `429` rate limited, `500` server error.

### Authentication

Admin endpoints (🔒) need the header `Authorization: Bearer <token>`.

| Method | Endpoint             | Description |
| ------ | -------------------- | ----------- |
| POST   | `/auth/login`        | `{ email, password }` → `{ token, admin }`. Rate limited to 10 failed attempts / 15 min. |
| GET    | `/auth/me` 🔒         | Current admin. |
| PUT    | `/auth/password` 🔒   | `{ currentPassword, newPassword }` → new token (other sessions are invalidated). |

### Contact / enquiries

| Method | Endpoint          | Description |
| ------ | ----------------- | ----------- |
| POST   | `/contact`        | Submit an enquiry. Body: `name`*, `phone`*, `message`*, `email`, `serviceNeeded`, `eventDate` (ISO date). Rate limited to 10 / hour per IP. |
| GET    | `/contact` 🔒      | List enquiries, newest first. Query: `status` (new/read/replied/archived), `page`, `limit`. `meta.unread` = count of new. |
| GET    | `/contact/:id` 🔒  | One enquiry. |
| PATCH  | `/contact/:id` 🔒  | Update `status` and/or `adminNote`. |
| DELETE | `/contact/:id` 🔒  | Delete. |

Each enquiry stores `name, phone, email, serviceNeeded, eventDate, message, status, createdAt` (the submission date).

### Services

| Method | Endpoint              | Description |
| ------ | --------------------- | ----------- |
| GET    | `/services`           | Active services, in display order. Admins can add `?all=true` to include hidden ones. |
| GET    | `/services/:idOrSlug` | One service. |
| POST   | `/services` 🔒         | Create. Fields: `title`*, `summary`, `description`, `items` (array or comma-separated), `order`, `isActive`, `image` (file) or `imageUrl`. |
| PUT    | `/services/:id` 🔒     | Update any of the above. |
| DELETE | `/services/:id` 🔒     | Delete (and its uploaded image). |

### Products

| Method | Endpoint            | Description |
| ------ | ------------------- | ----------- |
| GET    | `/products`         | Query: `category`, `availability`, `featured=true`, `search`, `page`, `limit` (max 100). |
| GET    | `/products/:id`     | One product. |
| POST   | `/products` 🔒       | Create. Fields: `name`*, `category`*, `description`, `price` (optional; empty = "price on request"), `availability` (`available`, `out_of_stock`, `made_to_order`, `for_rent`), `featured`, `image` (file) or `imageUrl`. |
| PUT    | `/products/:id` 🔒   | Update any of the above. Send `price: ""` to clear the price. |
| DELETE | `/products/:id` 🔒   | Delete (and its uploaded image). |

Categories: Asooke, Jewelry, Wrist Watches, Beads, Bridal Materials, Bridal Accessories, Attire Rental, Proposal & Acceptance Letters, Grooms Accessories, Cakes, Decorations, Other.

### Gallery

| Method | Endpoint           | Description |
| ------ | ------------------ | ----------- |
| GET    | `/gallery`         | All images. Query: `category`. |
| POST   | `/gallery` 🔒       | Add. Fields: `title`*, `image`* (file) or `imageUrl`*, `caption`, `category`, `order`. |
| PUT    | `/gallery/:id` 🔒   | Update. |
| DELETE | `/gallery/:id` 🔒   | Delete (and its uploaded image). |

### Image uploads

Send `multipart/form-data` with the file in the `image` field. JPEG, PNG, WebP and AVIF up to `MAX_UPLOAD_MB` are accepted. Files are saved with random names in `server/uploads/` and served at `/uploads/<file>`.

### Other

`GET /health` returns the server status and database connection state.

---

## Security notes

* Passwords hashed with bcrypt; password hashes are never returned by the API.
* JWTs signed with `JWT_SECRET`; tokens issued before a password change are rejected.
* All input validated with express-validator; unknown fields are ignored (no mass-assignment).
* Mongoose `sanitizeFilter` blocks query-operator injection.
* Helmet security headers, strict CORS allow-list, JSON body size limits.
* Rate limits on the whole API, the contact form and login.
* A hidden honeypot field on the contact form filters simple spam bots.
* Uploads restricted by MIME type and size, with random file names.

## Business details used on the site

All contact details live in one file, `client/src/lib/business.js`:

* Phone / WhatsApp: **+238032252023** (the number printed on the flyer is outdated and is not used anywhere)
* Email: **akinijsetoyin720@gmail.com**
* Address: **No 43 Off Akure Road, Lover Boy, Ondo Town, Ondo State**
