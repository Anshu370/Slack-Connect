# Slack Connect - Message Scheduler

🚀 **Live Demo**: [slackconnect-one.vercel.app](slackconnect-one.vercel.app)

This project is a Slack application that integrates with external services using OAuth, manages tokens securely, and supports scheduled tasks for automated workflows.  
The solution is split into two main parts:  
- **Frontend** (React.js) – User-facing interface for authentication and interaction  
- **Backend** (Node.js + Express) – Handles Slack OAuth, token storage, API calls, and scheduled jobs  

---

## 🚀 Features
- **Slack OAuth integration for secure authentication**
- **Secure token management with refresh handling**
- **Scheduled tasks for periodic actions in Slack**
- **Modular architecture for easy extension and robust error handling**
- **Morden UI**

---

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB database (local or Atlas)
- Slack App with appropriate permissions

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Custom Hooks** - For location and authentication management

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript development
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - Object Data Modeling (ODM) library

### External Services
- **Slack Web API** - For Slack integration and messaging
- **MongoDB Atlas** - Cloud database hosting
- **Vercel** - Frontend deployment and hosting
- **Render** - Backend API hosting

---

## 🏗️ Architecture

### Controller-Based Architecture
The backend follows a clean controller-based architecture for better maintainability:

```
Slack-Connect/
├── backend/
│   └── src/
│       ├── controllers/
│       │   ├── channel.controller.ts
│       │   ├── message.controller.ts
│       │   ├── schedulemessage.controller.ts
│       │   └── slack.controller.ts
│       ├── middlewares/
│       │   ├── checkandrefreshToken.ts
│       ├── models/
│       │   ├── schedulemessage.model.ts
│       │   └── workspace.model.ts
│       ├── routes/
│       │   ├── channels.ts
│       │   ├── slack.ts
│       │   └── chat.ts
│       └── services/
│           └── encryptDecrypt.ts
│    
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ScheduledMessages.tsx
│   │   ├── pages/
│   │   │   ├── AuthFailure.tsx
│   │   │   ├── AuthSuccess.tsx
│   │   │   ├── Chat.tsx
│   │   │   └── Hero.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   └── package.json
```

### Data Models

**Workspace Model:**
- Stores Slack workspace credentials and tokens
- Handles OAuth data securely with encryption
- Tracks active status and last refresh times

**Schedulemessage Model:**
- Links messages to users via userId/teamId for persistence
- Supports message status tracking (pending, sent, failed)
- Stores channel information and scheduled time

---

## 🔄 Application Flow

1. **Authentication**: User clicks "Add to Slack" button
2. **OAuth Flow**: Redirects to Slack for authorization
3. **Token Storage**: Securely stores encrypted access tokens
4. **Dashboard Access**: User accesses message scheduling interface
5. **Channel Loading**: Fetches available Slack channels
6. **Message Scheduling**: User composes and schedules messages
7. **Background Processing**: Scheduler sends messages at specified times
8. **Persistent Sessions**: Messages persist across logout/login cycles

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone <repository-url>
cd slack-connect
```

### 2. Slack App Configuration
1. Create a new Slack app at [https://api.slack.com/apps](https://api.slack.com/apps)
2. Configure OAuth & Permissions with these scopes:
   - **Bot Scopes**
   - `channels:history`- View messages and other content in public channels that Slack Connect has been added to

   - `channels:join` - Join public channels in a workspace

   - `channels:read` - View basic information about public channels in a workspace

   - `chat:write` - Send messages as @Slack Connect

   - `groups:read` - View basic information about private channels that Slack Connect has been added to
   - 
   - `im:history` - View messages and other content in direct messages that Slack Connect has been added to

   - `im:read` - View basic information about direct messages that Slack Connect has been added to

   - `mpim:read` - View basic information about group direct messages that Slack Connect has been added to

   - `users:read`- View people in a workspace
   
   - **Users Scopes**

   - `channels:history` - View messages and other content in a user’s public channels

   - `channels:read` - View basic information about public channels in a workspace

   - `channels:write` - Manage a user’s public channels and create new ones on a user’s behalf

   - `chat:write` - Send messages on a user’s behalf

   - `groups:read` - View basic information about a user’s private channels

   - `im:history` - View messages and other content in a user’s direct messages

   - `im:read` - View basic information about a user’s direct messages

   - `mpim:read` - View basic information about a user’s group direct messages

   - `users:read` - View people in a workspace

3. Set redirect URL: `YOUR_BACKEND_URL/slack/oauth_redirect`

4. Also, make sure to enable "Opt In" for token rotation in your Slack app Oauth & permissions settings.

### 3. Environment Variables

**Backend (.env):**
```env

# MongoDB
YOUR_MONGODB_URI=mongodb://localhost:70000/slack-connect

# Slack App Credentials
YOUR_SLACK_CLIENT_ID=your_slack_client_id
YOUR_SLACK_CLIENT_SECRET=your_slack_client_secret
YOUR_SLACK_REDIRECT_URI=YOUR_BACKEND_URL/slack/oauth_redirect

# Application URLs
YOUR_BACKEND_URL=http://localhost:3000
YOUR_FRONTEND_URL=http://localhost:5172

# Security
YOUR_ENCRYPTION_KEY=your-32-character-encryption-key

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Frontend (.env):**
```env
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Installation & Development

**Backend Setup:**
```bash
cd backend
npm install
npm run dev
```

**Frontend Setup:**
```bash
cd client
npm install
npm run dev
```

### 5. Production Deployment

**Backend (Render):**
- Set all environment variables
- Deploy backend with Build Command: `npm run build && npm start`
- Start Command: `npm start`

**Frontend (Vercel):**
- leave all the fields empty.

## 🎯 Learning & Challenges

### 🔐 HTTPS Requirements & Tunneling
**Challenge**: Slack OAuth requires HTTPS endpoints for security, but local development runs on HTTP.

**Solution**: 
- **1**
- Used tunneling services (ngrok, Cloudflare Tunnel) to expose local development server with HTTPS
- Configured Slack app redirect URLs to use HTTPS tunnel endpoints
- Implemented proper SSL certificate handling in production
- **2**
- Host your Backend and Frontend.
- Then every time you have to commit for tests.
- Also, from there you can easily gets the `https` link.

**Learning**: 
- Understanding webhook security requirements and the importance of HTTPS in OAuth flows.


### 🗄️ OAuth Callback and Redirect Handling
**Challenge**: Handling OAuth Callback, Redirects, and Token Expiry

**Solution**:
- Ensured that the redirect_uri in both Slack App settings and backend code were identical to prevent failed redirects.
- Modified the backend to store both access tokens and refresh tokens securely in the database. for both bot and user token.

**Learning**: OAuth token lifecycle management and building resilient API authentication systems.


### ⏰ Scheduled Tasks Synchronization
**Challenge**: Scheduling stop automatically.

**Solution**:
- Cron jobs sometimes ran before OAuth was completed, leading to missing tokens.
- Added a token verification step before executing scheduled jobs.

**Learning**: Building distributed systems and handling time-based operations reliably.

### 🔒 Security & Encryption
**Challenge**: Securing sensitive Slack tokens and user data.

**Solution**:
- Implemented AES encryption for token storage
- Used environment variables for encryption keys
- Built secure API endpoints with proper validation
- Implemented CORS properly with environment-based origins

**Learning**: Application security best practices and encryption implementation.

### 🎨 UI/UX Consistency
**Challenge**: Creating a modern, consistent interface across different components and states.

**Solution**:
- Developed unified design system with Tailwind CSS
- Implemented responsive design patterns
- Created consistent error handling with auto-dismiss functionality
- Built accessible form controls and navigation

**Learning**: Modern frontend development patterns and accessibility considerations.

### 🏗️ Code Organization & Scalability
**Challenge**: Managing growing codebase with clean architecture.

**Solution**:
- Implemented controller-based backend architecture
- Separated concerns with dedicated service layers
- Created reusable components and hooks
- Established consistent code patterns and TypeScript usage

**Learning**: Software architecture principles and maintainable code organization.


## 🤝 Support

For questions or support, please contact: [anshu.gupta.anshu2004@gmail.com](mailto:anshu.gupta.anshu2004@gmail.com)

---

**Note**: This application requires proper Slack app configuration and HTTPS endpoints for production use. Follow the setup instructions carefully for successful deployment.
