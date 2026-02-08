# Fix bug

## Workflow Steps

### [x] Step: Investigation and Planning

Analyze the bug report and design a solution.

1. Review the bug description, error messages, and logs
2. Clarify reproduction steps with the user if unclear
3. Check existing tests for clues about expected behavior
4. Locate relevant code sections and identify root cause
5. Propose a fix based on the investigation
6. Consider edge cases and potential side effects

Save findings to `c:\Users\jmeni\CollectClock\.zencoder\chats\c4ee90c9-a4e6-4b36-8097-cbeba10dc2a7/investigation.md` with:

- Bug summary
- Root cause analysis
- Affected components
- Proposed solution

### [x] Step: UI/UX Improvements & Deployment

1. Implement suggested UI enhancements (loading states, animations, improved mobile responsiveness)
2. Push changes to GitHub

### [x] Step: Implement Redesigned Global Settings

1. Add "Settings" button to the header
2. Create Global Settings Modal with a table for all casinos
3. Add inputs for Interval, Bonus Amount, and a Visibility toggle for each casino
4. Update `render()` to auto-sort cards and handle hidden states
5. Implement persistence for new settings properties
6. Push changes to GitHub

### [x] Step: Implement Selected Enhancements (Progress Bars, Multi-Tab, Notes, Notifications)

1. Add "Notes" field to Global Settings for site-specific instructions
2. Implement "Open All Ready" button in the header
3. Add visual progress bars to each card showing time remaining
4. Implement Browser Notifications API for "READY" status
5. Integrate Discord Channel deep-links
6. Push all enhancements to GitHub

### [x] Step: Discord Integration & Polishing

1. Fix missing `fmt` function (BUG)
2. Research and implement Discord "Live Drops" embed (WidgetBot suggested)
3. Add Export/Import settings functionality
4. Add "Last Collected" timestamp to cards
5. Final review of suggestions 3-7 (Bonus Amount, Hide, Auto-sort, Progress Bar, Notes)
6. Push changes to GitHub

### [x] Step: Phase 1 Enhancements (Mobile & Feedback)

1. Implement PWA (Manifest & Service Worker) for home screen installation
2. Add "Notification Sound" toggle in Settings
3. Implement audio alert when a timer reaches zero
4. Final UI polish for mobile responsiveness
5. Push changes to GitHub

### [ ] Step: Backend & Discord Bot Integration

1. Setup Node.js/Express backend for data persistence
2. Implement "Login with Discord" (OAuth2) for cross-device syncing
3. Create "Submit Casino" modal and endpoint (notifies Discord user 1153034319271559328)
4. Implement "First-time Visit" configuration popup for new casinos
5. Develop Discord Bot for `/ready` command and DM notifications
6. Implement "Live Drop" real-time push from Discord to Web UI
7. Deploy Backend (Railway/Render) and Frontend (Vercel/Netlify)









🚀 Deployment Steps
To deploy this project for free or at a low cost:

1. Database: MongoDB Atlas (Free Tier)
Create a free cluster at mongodb.com.
Whitelist 0.0.0.0/0 (or your deployment IP) in Network Access.
Get your connection string (MONGODB_URI).
2. Authentication: Discord Developer Portal
Go to Discord Developer Portal.
Create an application and a Bot.
OAuth2: Add a redirect URI: https://your-app-url.com/auth/discord/callback.
Get your DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, and DISCORD_BOT_TOKEN.
Intents: Enable Message Content Intent and Server Members Intent under the Bot tab.
3. Hosting: Railway or Render (Cheap/Free)
Railway.app is highly recommended for Node.js + Bot projects.
Connect your GitHub repository.
Add these Environment Variables:
MONGODB_URI: Your Atlas string.
DISCORD_CLIENT_ID: From Discord portal.
DISCORD_CLIENT_SECRET: From Discord portal.
DISCORD_BOT_TOKEN: From Discord portal.
SESSION_SECRET: Any random string (e.g., collect-clock-secret-123).
DISCORD_SUBMISSION_WEBHOOK: Your webhook URL for site submissions.
PORT: 5000 (or leave default).
4. Register Slash Commands
Once deployed, run the registration script once to make /ready appear in Discord:

node server/registerCommands.js
5. Progressive Web App (PWA)
The app is already configured with manifest.json and sw.js. Users can "Add to Home Screen" on mobile for a native app experience.

📊 How to view your Admin Report
Once logged in via Discord, navigate to: https://your-app-url.com/api/admin/report This will return a JSON object with your site stats and nerf history.

