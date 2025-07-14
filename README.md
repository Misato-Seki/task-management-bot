# **🤖TaskBot**

## **✅ Project Overview**

**Name:** TaskBot

**Goal:**

The goal of this project is to **help users improve their self-management skills** using Google Calendar, Discord, and a Web UI. The TaskBot will **automatically send bot message to Discord** evey morning, including today's events, habits, and tasks.

**Target Users:** Individuals (for study, work, or daily habits)

**Platforms:** Web UI + Discord Bot

## **✨ Features**

### **1: Google Calendar Event Notification**

- Google OAuth2 login and account connection
- Get today’s events from the user’s Google Calendar
- Send “Today’s Events” message to Discord at 6:00 AM every day

### **2: Basic Habit Tracking**

- Register habits
- Send daily ToDo habit list to Discord at 6:00 AM
- Mark habits as done

### **3: Goal Setting & Task Support**

- Register tasks with deadlines
- Send “Today’s Tasks (tasks with deadline within 7 days from today)” to Discord at 6:00 AM
- Record task completion

## **🔧 Technology Stack**

| **Category** | **Tech Example** |
| --- | --- |
| Discord Bot | Node.js (`discord.js`) |
| Front-end | React + TypeScript + Next.js + TailwindCSS |
| Back-end | Node.js + Javascript + Express.js |
| Database | PostgreSQL + Prisma |
| Scheduler | cron |
| Google Integration | Google Calendar API (OAuth2) |
| Deployment | Docker + Google Cloud Compute Engine |

## **🔗 Links**

- [Demo(Website)](https://taskbot.misatosan.com/)
- [Demo(Youtube)](https://www.youtube.com/watch?v=b9PKrZLI4pE)