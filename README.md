# Widget Talk

### Overview

This is a **React (Vite)** based **AI-powered Chat Widget** that can be embedded into any website using a CDN script. Its primary role is to act as a **product-specific chatbot**, allowing users to ask questions and get relevant information about the product where it's integrated.

---

### 📦 Integration (CDN-based Injection)

The widget can be injected into any website using a simple `<script>` tag:

```html
<!-- Vercel Hosted -->
<script src="https://your-chat-widget.vercel.app/chat-widget.js"></script>

<!-- jsDelivr CDN -->
<script src="https://cdn.jsdelivr.net/gh/johndoe/chat-widget/dist/chat-widget.js"></script>

```

---

### 🤖 Core Technologies

- **Frontend:** React (Vite)
- **Backend:** FastAPI
- **AI Stack:**
    - Ollama (LLM)
    - LangChain (Prompt orchestration)
    - Pinecone (Vector DB for semantic search)

---

### 🔐 Authentication & API Key

- Only **authenticated users** can use the widget.
- After signing up, logging in, and subscribing to a plan, users receive a **unique API Key**.
- This API Key must be attached with the widget initialization to allow access.

---

### 🧠 Admin Training Portal

Accessible via `/admin` routes:

- Admins (product owners) can:
    - Upload documents
    - Input FAQs
    - Feed product-specific data
- This data is used to train the AI using Langchain & Pinecone.
- Once trained, a custom widget can be deployed using the assigned API Key.

---

### 👥 Roles & Panels

### 1. **Admin Panel** (`/admin`)

- Manage product data
- Train AI assistant
- Monitor widget usage
- View subscribers and analytics

### 2. **User Panel** (`/dashboard`)

- View active API Key(s)
- Widget management
- Track daily query limits
- Subscription upgrades

---

### 💳 Subscription Plans (3 Tiers)

Each plan comes with feature-based limitations:

| Plan | Daily Query Limit | Max Widgets | Support | Price |
| --- | --- | --- | --- | --- |
| **Starter** | 50 queries | 1 | Email | $9/mo |
| **Pro** | 500 queries | 3 | Priority | $29/mo |
| **Enterprise** | Unlimited | 10+ | Dedicated | $99/mo |

> Additional usage may require overage fees or upgrades.
> 

---

### 🔒 Rate Limiting & Usage Restrictions

- Daily query limit based on plan.
- Widget injection is validated via the API Key.
- Backend will verify the authenticity and usage caps for every request.
- Alerts and UI warnings when limits are approaching.

---

### 🌐 Future Features

- Multi-language support
- Auto-document crawling for training
- Analytics dashboard
- Slack/email alerts on limits
- Voice support in the widget
