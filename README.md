# Edicions Clariana — Full-Stack Editorial Platform

A modern editorial platform for managing and publishing projects across **Paper**, **Digital**, and **Editorial** categories. Built with **React + Vite + TypeScript** on the frontend and **Express + MongoDB (Mongoose) + JWT** on the backend.  
It includes a rich text editor (TipTap), image uploads, powerful filtering, responsive design, **dark mode**, and an **Admin panel** for user management (roles + block/activate).

---

## ✨ Features

- **Public site**
  - Hero video + elegant editorial layout
  - Category cards (Paper / Digital / Editorial) linking to Projects with pre-applied filters
  - Project grid with image, title, subtitle, category, author, created date
  - Project modal with formatted rich content (TipTap HTML sanitized and with proper line breaks)
  - **Advanced filtering**: search (title/subtitle), category, author, **date range (“From/To”)**
  - **Dark mode** toggle (persisted in `localStorage`), Tailwind `dark:` styles

- **Editor**
  - TipTap blocks with toolbar (bold, italic, underline, lists, headings, alignment, links)
  - Custom **ImageBlock** node with upload integration (Multer endpoint)
  - Multiple blocks joined by `<hr/>` (for easy split/merge on edit)
  - Cleans `<p><br></p>` to real visual line breaks for the modal

- **Authentication**
  - Register / Login (JWT)
  - Accessible forms (proper `<label>` markup)
  - Persistent session (`localStorage`)

- **Admin panel**
  - List / filter users (search by name or email)
  - Change roles: **admin**, **editor**, **subscriber**
  - **Block / Activate** users (without deleting)
  - **Delete** users (with confirmation popup)
  - Self-protection: you cannot block or delete your own user

- **Code quality**
  - Strong typing for API responses (no `any`)
  - `fetchWithValidation<T>()` helper for robust HTTP error handling
  - Custom hooks: `useProjects`, `useUsers`, `useFetch`, `useFileUpload`
  - Backend exported as `app` for tests; separate `index.ts` to start the server
  - Frontend Vitest setup; Backend Jest + Supertest ready

---

## 🧱 Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS (`darkMode: 'class'`)
- TipTap editor
- framer-motion, lucide-react
- React Router
- Vitest (+ React Testing Library)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Multer (image uploads)
- CORS
- Jest + Supertest

---

## 📁 Project Structure

```
/front/mi-app
  ├─ src
  │  ├─ components
  │  │  ├─ Header.tsx
  │  │  ├─ Footer.tsx
  │  │  └─ Spinner.tsx
  │  ├─ pages
  │  │  ├─ Home.tsx
  │  │  ├─ Projects.tsx
  │  │  ├─ EditorPost.tsx
  │  │  ├─ Admin.tsx
  │  │  └─ UserPanel.tsx
  │  ├─ context/useAuth.tsx
  │  ├─ hooks
  │  │  ├─ useProjects.ts
  │  │  ├─ useUsers.ts
  │  │  ├─ useFetch.ts
  │  │  └─ useFileUpload.ts
  │  ├─ extensions/ImageBlock.ts
  │  ├─ utils/fetchWithValidation.ts
  │  ├─ types/api.ts
  │  └─ main.tsx
  ├─ tailwind.config.ts
  ├─ vite.config.ts
  └─ index.html

/back
  ├─ src
  │  ├─ index.ts
  │  ├─ server.ts
  │  ├─ routes
  │  │  ├─ auth.ts
  │  │  ├─ user.ts
  │  │  ├─ admin.ts
  │  │  └─ projects.ts
  │  ├─ models
  │  │  └─ User.ts
  │  ├─ middleware
  │  │  └─ requireAdmin.ts
  │  └─ tests
  │     ├─ server.test.ts
  │     └─ admin.test.ts
  ├─ uploads/
  └─ .env
```

---

## ⚙️ Configuration

### Backend — `.env`

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/clariana
JWT_SECRET=replace_me_with_a_long_random_secret
CORS_ORIGIN=http://localhost:5173
```

### Frontend — Tailwind config

```ts
// tailwind.config.ts
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

### Frontend — Vite config (Ngrok friendly)

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: [
      "*.ngrok-free.dev",
      "your-subdomain.ngrok-free.dev"
    ],
    cors: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
```

---

## 🚀 Running locally

### Backend

```bash
cd back
npm install
npm run dev
# or
npm start
```

- Server runs at `http://localhost:3000`
- Uploads: `http://localhost:3000/uploads/...`
- Upload endpoint: `POST /uploads` (multipart `file` field)

### Frontend

```bash
cd front/mi-app
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## 🔐 Auth & Roles

- **Register** → `POST /auth/register`
  - Returns `{ token, user }`
  - Roles:
    - `admin` (special email)
    - `editor` (default non-admin)
    - `subscriber` (default for normal register)
- **Login** → `POST /auth/login`
- **Profile update** → `PUT /user/me` (JWT required)

### Roles

| Role | Permissions |
|------|--------------|
| `admin` | Full access, manage users |
| `editor` | Create/edit projects |
| `subscriber` | Read-only |

### Block/Activate users

- `PATCH /admin/users/:id/toggle` with `{ active: boolean }`

---

## 🧱 Projects API

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/projects` | List all projects |
| GET | `/projects/:id` | Get project details |
| POST | `/projects` | Create project (editor/admin) |
| PUT | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project (admin only) |

### Project Type

```ts
{
  _id: string;
  title: string;
  subtitle: string;
  category: "Paper" | "Digital" | "Editorial";
  content: string; // TipTap HTML joined by <hr/>
  imageUrl: string;
  author: string;
  createdAt: string;
  status: "published" | "draft";
}
```

---

## 💅 Frontend UX

- Category filter via `?category=<Digital|Paper|Editorial>`
- “From” / “To” date range filter
- Clean line breaks in TipTap HTML rendering
- Responsive header with dark/light mode
- Accessible UI with Tailwind styling

---

## 🧰 Utilities & Hooks

- `fetchWithValidation<T>()` — unified fetch with JSON parsing and error handling
- `useProjects()` — load + filter projects
- `useUsers()` — manage user lists
- `useFetch()` — generic fetch hook
- `useFileUpload()` — upload file → return URL
- `Spinner` — loading animation

---

## ✅ Testing

### Backend (Jest + Supertest)

```json
"scripts": {
  "test": "cross-env NODE_ENV=test jest --runInBand",
  "test:watch": "cross-env NODE_ENV=test jest --watch",
  "test:coverage": "cross-env NODE_ENV=test jest --coverage"
}
```

> Ensure MongoDB is running locally.  
> `server.ts` exports `app` for tests.  
> `index.ts` starts the listener.

### Frontend (Vitest)

```bash
npm run test
```

---

## 🌐 Using Ngrok (public tunneling)

1. Install & login:
   ```bash
   npm i -g ngrok
   ngrok config add-authtoken <YOUR_TOKEN>
   ```
2. Run frontend:
   ```bash
   npm run dev
   ```
3. Open tunnel:
   ```bash
   ngrok http 5173
   ```
4. Visit: `https://your-subdomain.ngrok-free.dev`

> If blocked, add your subdomain to `vite.config.ts → server.allowedHosts`.

---

## 🧩 Troubleshooting

| Issue | Solution |
|-------|-----------|
| **Blocked request (Ngrok)** | Add `host: true` and `allowedHosts` to `vite.config.ts` |
| **Uploads not working** | Ensure `/uploads` exists and POSTs `file` field |
| **CORS error** | Check backend `CORS` origins |
| **JWT invalid** | Ensure `JWT_SECRET` matches and token not expired |
| **Tests timeout** | Ensure MongoDB is running or use `mongodb-memory-server` |

---

## 🔒 Security Notes

- Never commit `.env`
- Restrict upload size and MIME types
- Sanitize HTML content on backend if needed
- Use HTTPS in production

---

