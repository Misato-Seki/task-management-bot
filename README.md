# **Task Management Bot**

## **1. Project Overview**

**Name:** Task Management Bot

**Goal:**

The goal of this project is to **help users improve their self-management skills** by supporting **habit-building, goal achievement, and daily task tracking** using Google Calendar, Discord, and a Web UI. The bot will **automatically send reminders, record activity, and help users reflect** on their progress.

**Target Users:** Individuals (for study, work, or daily habits)

**Platforms:** Web UI + Discord Bot

## **2. Features by Development Phase**

### **Phase 1: Google Calendar Event Notification**

- Google OAuth2 login and account connection
- Get today’s events from the user’s Google Calendar
- Send “Today’s Events” message to Discord at 7:00 AM every day
- Allow users to disconnect their calendar if needed

### **Phase 2: Basic Habit Tracking**

- Register habits (via Discord command or Web UI)
- Send daily ToDo habit list to Discord at 7:00 AM
- Mark habits as done (via reaction or command)
- Send weekly report showing habit success rate

### **Phase 3: Goal Setting & Task Support**

- Register goals with deadlines (via Discord command)
- Automatically break goals into weekly tasks, with priorities
- Send “Today’s Tasks” to Discord every morning
- Record task completion (via reaction or command)
- Send weekly progress report and motivational messages

## **3. User Flow Details**

### **Google Calendar Event Notification**

1. User connects calendar via Web UI
2. Bot sends OAuth login link
3. User logs into Google and allows access
4. Bot gets schedule from Google Calendar (store token?)
5. Every day at 7:00 AM, bot sends today’s events to Discord
6. User can disconnect calendar from Web UI anytime

### **Habit Tracking (Basic)**

1. User registers habits (from Web UI)
2. Every day at 7:00 AM, bot sends the list of habits to Discord
3. User marks done via reaction, command, or Web UI
4. On weekends, bot sends a weekly report with habit success rate

### **Goal Management & Task Support**

1. User sets a goal with deadline (from Web UI)
2. Bot creates weekly task plan and shows it to user
3. User approves or edits the plan
4. Tasks are saved and shown daily
5. User marks done via reaction, command, or Web UI
6. Bot tracks progress and sends weekly review and messages of support

## **4. Command List (Main Examples)**

| **Command** | **Description** |
| --- | --- |
| `/done [habit-name]` | Mark a habit as done |
| `/done [task-name]` | Mark a task as done |

---

## **5. Technology Stack (Planned)**

| **Category** | **Tech Example** |
| --- | --- |
| Discord Bot | Python (`discord.py`) or Node.js (`discord.js`) |
| Web UI | Flask or React |
| Database | SQLite / PostgreSQL / Firebase |
| Scheduler | cron / APScheduler |
| Google Integration | Google Calendar API (OAuth2) |
| Deployment | Render, Railway, Vercel, etc. |