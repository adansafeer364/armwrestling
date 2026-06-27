# Armwrestling Tournament Platform - User Guide

This guide explains how to operate the complete Armwrestling Tournament Platform. It covers all the different user roles and their specific functionalities within the system.

## Table of Contents
1. [General Overview](#general-overview)
2. [Athlete Guide](#athlete-guide)
3. [Referee Guide](#referee-guide)
4. [Admin & Super Admin Guide](#admin--super-admin-guide)
   - [Dashboard](#dashboard)
   - [Tournament Management](#tournament-management)
   - [Category & Athlete Management](#category--athlete-management)
   - [Match & Bracket Management](#match--bracket-management)
5. [Knockout Engine](#knockout-engine)

---

## 1. General Overview
The platform handles end-to-end management of armwrestling tournaments, including athlete registration, automated knockout bracketing, live match scheduling, and a dedicated interface for referees to input results in real time.

---

## 2. Athlete Guide

### Registration Process
1. **Navigate to Registration:** Go to the `/register` page.
2. **Fill Details:** Enter personal information: Full Name, Father's Name, Phone, Email, Age, City, Club Name, and Weight.
3. **Select Category:** Choose the competing hand(s) - Right, Left, or Both. (If 'Both' is selected, the system will automatically enter the athlete into both categories).
4. **Upload Documents:** Upload the required documents (Profile Picture, CNIC Front, CNIC Back, Payment Screenshot). *A valid payment screenshot is mandatory to submit the form.*
5. **Receive ID:** Upon successful submission, a unique Registration ID (e.g., `ARM-2026-0001`) will be generated.
6. **Wait for Verification:** An admin will verify the payment screenshot and approve the registration.

### Athlete Login
- Athletes can log in using their credentials to view their registration status, upcoming matches, and tournament history.

---

## 3. Referee Guide

Referees have a specialized, focused interface to manage live matches.

### Operating the Referee Panel
1. **Login:** Access the referee portal (e.g., `/referee`) using designated credentials.
2. **View Current Match:** The panel displays the currently assigned match, showing:
   - Player 1 vs Player 2
   - Weight & Hand Category
   - Table Number
3. **Submit Result:** After the match concludes, the referee selects the winner and submits the result.
4. **Auto-Progression:** Submitting a result automatically updates the tournament bracket and queues the next match for the assigned table.

---

## 4. Admin & Super Admin Guide

Admins have full control over the platform via the Admin Dashboard (`/admin`).

### Dashboard
- **Stats:** View real-time statistics including total registered athletes, pending payments, ongoing tournaments, and live matches.
- **Reports:** Generate and view reports on tournament outcomes, participant demographics, and financials.

### Tournament Management
- **Create Tournament:** Define Name, Date, Location, Banner, Description, and Prize Pool.
- **Statuses:** Update tournament status as it progresses:
  - `Draft`
  - `Registration Open`
  - `Registration Closed`
  - `Live`
  - `Completed`

### Category & Athlete Management
- **Payment Verification:** Review pending athlete registrations, check the payment screenshots, and mark them as verified/approved.
- **Categories:** The system automatically categorizes athletes based on weight (60kg, 70kg, 80kg, 90kg, 100kg, 100kg+) and hand (Right, Left).
- **Auto-Assignment:** Verified athletes are automatically placed into the correct brackets.

### Match & Bracket Management
- **Scheduling & Tables:** Assign generated matches to specific tables.
- **Match Status:** Monitor matches as they move from `Upcoming` to `Live`, and finally to `Finished`.
- **Match History:** Review all completed matches and their results.

---

## 5. Knockout Engine

The tournament utilizes an automated Knockout system. Admins do not need to manually create the next matches; the engine handles it.

### Rules & Progression
- **Winner Bracket:** All athletes begin here.
- **First Loss:** A player losing in the Winner Bracket drops to the Loser Bracket.
- **Second Loss:** A player losing in the Loser Bracket is eliminated.
- **Grand Final:** The Champion of the Winner Bracket faces the Champion of the Loser Bracket.
- **Bracket Reset:** If the Loser Bracket Champion wins the first match of the Grand Final, a second "Bracket Reset" match is generated to determine the true winner.

*The system supports dynamic bracket generation for 8, 16, 32, 64, or 128 athletes.*

---
*Note: This guide will be updated automatically as new features are added to the platform.*
