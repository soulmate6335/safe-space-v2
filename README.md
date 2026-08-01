# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# 💜 Safe Space

A modern, anonymous mental wellness platform that provides a safe environment for individuals to share their thoughts, feelings, and experiences while receiving compassionate responses from a founder or administrator.

Built with **React**, **Vite**, **Tailwind CSS v4**, and **Supabase**, Safe Space focuses on privacy, simplicity, and meaningful conversations.

---

## 🌐 Live Demo

**User Application**

https://dashing-salmiakki-9f2eb5.netlify.app/

**Admin Dashboard**

https://dashing-salmiakki-9f2eb5.netlify.app/admin

---

# ✨ Features

## Anonymous Conversations

- Users can create conversations without creating an account.
- Every conversation receives a unique conversation code.
- Conversation codes can be copied and used later to continue the conversation.

---

## Secure Messaging

- Real-time messaging powered by Supabase.
- Founder/Admin can reply instantly.
- Read receipts.
- Typing indicator.
- Automatic conversation updates.

---

## Conversation Management

The administrator can:

- View all conversations
- Search conversations
- View unread messages
- Reply to conversations
- Close conversations
- Reopen conversations
- Monitor conversation status

---

## Modern User Experience

- Responsive design
- Mobile-first interface
- Dark mode support
- Smooth animations
- Auto-growing message input
- Professional chat bubbles
- Conversation code popup
- Copy conversation code functionality

---

# 🛠 Tech Stack

## Frontend

- React 19
- React Router DOM
- Vite
- Tailwind CSS v4
- Lucide React
- React Hot Toast

## Backend

- Supabase

### Services Used

- PostgreSQL Database
- Realtime
- Row Level Security
- Authentication (Admin)

---

# 📁 Project Structure

```
src/
│
├── components/
│   ├── admin/
│   ├── chat/
│   ├── ui/
│   └── Layout.jsx
│
├── contexts/
│
├── hooks/
│
├── pages/
│
├── services/
│
├── utils/
│
└── main.jsx
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/safe-space-v2.git
```

Go into the project

```bash
cd safe-space-v2
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file.

```env
VITE_SUPABASE_URL=your_supabase_url

VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

# 🗄 Database

The application uses Supabase PostgreSQL.

Main tables include:

- conversations
- conversation_messages
- typing_status
- presence

---

# User Flow

1. User writes a message.
2. A conversation is created.
3. A unique conversation code is generated.
4. User saves the conversation code.
5. User can return anytime using the code.
6. Founder replies.
7. User receives the reply inside the conversation.

---

# Admin Flow

1. Login
2. View Inbox
3. Open Conversation
4. Read Messages
5. Reply
6. Close or Reopen Conversation

---

# UI Highlights

- Responsive Layout
- Mobile Friendly
- Dark Mode
- Animated Chat Interface
- Beautiful Conversation Popup
- Modern Cards
- Gradient Design
- Accessible Interface

---

# Future Improvements

- Push Notifications
- Email Notifications (Optional)
- Founder Notes
- Conversation Labels
- Search Filters
- Analytics Dashboard
- Export Conversations
- File Attachments
- Voice Messages
- AI-Assisted Replies
- Multiple Admin Accounts

---

# Performance

- Optimistic UI Updates
- Lazy Rendering
- Realtime Synchronization
- Efficient Supabase Queries
- Responsive Components

---

# Security

- Anonymous users
- Conversation codes instead of user accounts
- Supabase Row Level Security
- Secure environment variables
- Protected admin routes

---

# Deployment

Frontend deployed with:

- Netlify

Backend powered by:

- Supabase

---

# License

This project is licensed under the MIT License.

---

# Author

**Kehinde Issa**

Software Developer

GitHub:
https://github.com/soulmate6335

---

# Acknowledgements

Built with:

- React
- Vite
- Tailwind CSS
- Supabase
- Lucide React
- React Hot Toast

---

> "A safe place where every voice matters."