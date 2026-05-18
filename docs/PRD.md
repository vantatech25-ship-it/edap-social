# Product Requirements Document (PRD): EDAP Social

## 1. Product Overview
EDAP Social is a community platform designed for edap.co.za. It provides a production-grade social networking experience similar to major platforms (profiles, feed, friends/follows, posting, commenting, groups, messaging) but tailored specifically for the South African market with strict POPIA compliance, an original UI/UX, and specific brand guidelines.

## 2. Brand & Persona
- **Persona:** World-class "Sports Industrial Capital" factory. Authoritative, community-focused, professional, high-energy, data-driven, transformative.
- **Core Goal:** Transform South African talent via AI coaching, health monitoring, and digital literacy.

## 3. Core Features
- **Accounts & Profiles:** Signup/login, avatars, cover images, bios, interests, verification flags.
- **Social Graph:** Dual model (friends for private connections, follow for public/creators). Ability to block/mute users.
- **News Feed:** Ranked feed (recency + relationship + engagement velocity) and chronological options, infinite scroll (cursor-based), media previews.
- **Posts & Engagement:** Text, images, short videos, link previews. Likes, comments, nested replies, saves. Strict privacy controls (public, friends, private, custom lists).
- **Messaging:** 1:1 and group chats, typing indicators, read receipts, media sharing.
- **Groups & Pages:** Role-based groups. Pages for EDAP programmes/partners.
- **Search & Explore:** Users, posts, groups, pages, hashtags.
- **Notifications:** Real-time (WebSockets) and digests.
- **Moderation & Safety:** Comprehensive reporting workflows (content/users), user blocking, admin console, bans/suspensions, anti-spam.

## 4. Monetisation & Business Hooks
- **Primary:** Promote Elite Performance Tiers (AI video analysis, health tracking).
- **Secondary:** Drive E-Learning + Computer Literacy subscriptions.
- **Affiliate:** Wearable tech recommendations seamlessly integrated into content.
- **Corporate CSR:** Highlight BBBEE Level 1 to attract corporate sponsorships.

## 5. Non-Functional Requirements
- **Security:** POPIA compliance, data export/deletion, rate limiting, CSRF protection, input sanitisation.
- **Scalability:** Designed for high concurrent user load, utilizing caching (Redis) and hybrid fan-out/fan-in workers for feed generation.
- **Analytics:** Dashboards for DAU/MAU, retention, funnels, engagement rates.
