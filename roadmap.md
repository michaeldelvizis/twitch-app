# Twitch Stream Companion Dashboard – Roadmap

This project is a full-stack dashboard for streamers. It will integrate with the Twitch API to track chat activity, stream metrics, and (optionally) stats from reliable games like Fortnite. Initially built for a Twitch streamer (my brother), it is designed to be modular and extensible.

---

## Milestone 1: Twitch OAuth & Stream Connection

- [x] Implement Twitch OAuth login
- [x] Authenticate user and store access tokens securely
- [x] Fetch basic stream metadata (title, uptime, category)
- [x] Show live stream status on dashboard
- [ ] Scheduled start time of your next stream
- [ ] followers count / gift count
- [ ] automatic refreshing


---

## Milestone 2: Chat Listener & Logging

- [ ] Connect to Twitch chat via IRC or PubSub
- [ ] Log messages with username and timestamp
- [ ] Store chat data in database (e.g., PostgreSQL or Firebase)
- [ ] Display live chat feed in dashboard
- [ ] Basic metrics: total messages, unique chatters


---

## Milestone 4: Basic Chatbot Commands

- [ ] Implement simple chatbot commands (`!hello`, `!stats`)
- [ ] Enable command logging and frequency tracking
- [ ] Admin panel to create/edit custom commands
- [ ] Optional: Use a hosted bot account or OAuth-scoped bot

---

## Milestone 5: Chat Analytics & Viewer Insights

- [ ] Track unique chatters per stream
- [ ] Message heatmap (activity over time)
- [ ] Top chatters list
- [ ] Viewer streaks: "User has chatted in 5 streams in a row"
- [ ] Optional: basic NLP sentiment scoring
- [ ] Optional: tag high-engagement moments (chat bursts) and reccomend clip timestamps

---

## Milestone 6: Fortnite (or Other Game) Stat Integration

- [ ] Use Epic Games API or reliable wrapper to fetch stats
- [ ] Show kills, wins, session performance
- [ ] Connect game stats to stream sessions
- [ ] Optional: Simulate API results if live match data is not accessible

---

## Milestone 7: Polish & Deployment

- [ ] Responsive frontend UI (Next.js or React)
- [ ] Use Tailwind for styling
- [ ] Host backend (e.g., Render, Railway)
- [ ] Host frontend (e.g., Vercel, Netlify)
- [ ] Add loading/error states + basic auth protections
- [ ] Write clear README and setup instructions

---


## Tech Stack Plan

- **Frontend**: Next.js + Tailwind
- **Backend**: Node.js (Express or Fastify)
- **Database**: PostgreSQL (with Prisma) or Firebase
- **Auth**: Twitch OAuth 2.0
- **Chatbot**: Twitch IRC or tmi.js
- **Deployment**: Vercel (frontend) + Render/Railway (backend)

---

## Development Goals

- Build modular, reusable components
- Write clean, documented code
- Follow IC2+ level best practices (separation of concerns, code testing, logging)
- Use git branches with clear PRs

---

