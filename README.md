This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Recent Updates

### Added NextAuth Authentication System
- Integrated **NextAuth.js** with a custom Credentials provider backed by **MongoDB**.
- Updated the \User\ model to support role-based access control with roles: **Athlete, Referee, Admin, Super Admin**.
- Created a robust login interface at \/login\.
- Implemented **Next.js Middleware** (\src/middleware.ts\) to secure protected routes and restrict access based on user roles.
- Included \cryptjs\ for secure password hashing and verification.

### What is needed from you (Mr.) in the future:
1. **Environment Variables:** Please ensure you have added a strong \NEXTAUTH_SECRET\ inside your \.env.local\ file for signing the JWT tokens securely in production.
2. **Session Provider Wrapper:** NextAuth requires a \<SessionProvider>\ in the root layout (\src/app/providers.tsx\ or \src/app/layout.tsx\) if you plan to use client-side hooks like \useSession()\ globally. Please confirm if you want me to add this wrapper.
3. **Logout UI:** Currently, there's no visible "Logout" button in the \Navbar\. Let me know where you'd like me to place it (e.g., inside a user profile dropdown).

### Added Professional Admin Dashboard
- Created a fully responsive **Admin Layout** with a sidebar navigation using TailwindCSS and Lucide icons (\src/app/admin/layout.tsx\).
- Implemented **Dashboard Stats** (\/admin\) fetching real-time data for athletes, tournaments, pending payments, and referees from MongoDB.
- Created **Athlete Management** module (\/admin/athletes\) showing registered athletes and their details.
- Created **Payment Verification** module (\/admin/payments\) listing payment transactions and their statuses.
- Created **Tournament Management** module (\/admin/tournaments\) for tracking active and upcoming arm wrestling events.
- Created **Referee Management** module (\/admin/referees\) listing staff and their roles.
- Added a placeholder for the **Reports** module (\/admin/reports\).

### What is needed from you (Mr.) in the future:
1. **Interactive Functionality:** The buttons in the dashboard (like "Add Athlete", "Verify Payment", "Edit") currently don't have click handlers or modals attached. I will need you to specify how you want these interactions to behave (e.g., open a modal, redirect to a new form page, or trigger an API call directly).
2. **Chart Integration:** For the Reports module, please let me know if you prefer a specific charting library (like Recharts or Chart.js) so I can implement the analytics graphs.
3. **Data Pagination:** Right now, the data tables fetch the latest records. Let me know when you are ready to implement full server-side pagination for better performance as your dataset grows.

### Built Tournament Management Module
- Refactored the \/admin/tournaments\ page to allow full CRUD operations.
- Implemented **Next.js Server Actions** (\ctions.ts\) for secure database mutations.
- Created a dynamic \TournamentForm\ component supporting file uploads directly to Cloudinary.
- Added **Create Tournament** functionality with required fields: Name, Date, Location, Description, Prize Pool, Status, and Banner Upload.
- Added **Edit Tournament** functionality at \/admin/tournaments/[id]/edit\.
- Added **Delete Tournament** functionality using React's \useTransition\ for a smooth UI experience.
- Mapped UI statuses correctly to the MongoDB schema enums (Draft, Registration Open, Registration Closed, Active/Live, Completed, Cancelled).

### Built Category Management System
- Updated the \Category\ Mongoose model (\src/infrastructure/db/models/Category.ts\) to include a \participants\ array containing references to the \Registration\ documents.
- Created the Category Management UI at \/admin/tournaments/[id]/categories\ with access linked from the Tournament List page.
- Added **Category Generation** functionality using Server Actions to automatically build Left/Right Hand categories across standard weight classes (60kg, 70kg, 80kg, 90kg, 100kg, 100kg+).
- Developed the **Auto-Assign Algorithm** that loops through registered athletes and evaluates their weight and hand preferences. Athletes who registered under "Both" are efficiently inserted into both the appropriate Left and Right categories.

### Built Professional Knockout Engine
- Added core domain logic at \the referee panel\.
- Fully supports automatic power-of-2 scaling for any number of competitors up to 128 (dynamically pads with BYEs if uneven).
- Includes **Bracket Generator**, generating the complete graph for Winner Bracket, Loser Bracket, and Grand Finals.
- Handles **Cross-Bracket Pairings**, dropping Winner Bracket losers into mathematically correct Loser Bracket slots to prevent immediate rematches.
- Features **Auto Progression**, moving winners forward and automatically routing losers down or eliminating them.
- Resolves the **Bracket Reset**, automatically cancelling the GF2 match if the Winner Bracket champion wins, or activating it if the Loser Bracket champion causes the reset.

### What is needed from you (Mr.) in the future:
1. **Bracket Visualization UI:** The backend graph engine is ready, but we need to build the React components to render the visual "tree" of the matches on the screen using tools like SVG or styled div columns.
2. **Database Integration for the Engine:** Currently, the \Knockout flow\ operates purely in TypeScript memory. We need to decide when you want to execute \.generate()\ (e.g., when an admin clicks "Start Tournament") and how we save that generated array into your MongoDB \Match\ collection.

### Built Match Management System
- Created the **Match Management Dashboard** at \/admin/tournaments/[id]/matches\ offering a split view of Live, Upcoming, and Finished matches (Match History).
- Developed a dynamic **MatchCard** component that allows admins to inline-edit Match Scheduling, Table Assignment, Score, Match Status (PENDING, IN_PROGRESS, COMPLETED), and Winner selection.
- Created **Next.js Server Actions** to securely process these match updates into the MongoDB \Match\ collection.
- Added a \Generate Demo Matches\ helper button to securely test the UI layout while the Knockout Engine is pending MongoDB wiring.
- Added a quick-access "Matches" button on the Tournament Management cards.

### Built Referee Panel
- Created the **Referee Dashboard** at /referee restricted to users with Referee, Admin, or Super Admin roles.
- Developed the interactive **RefereePanel** UI allowing referees to see their currently assigned active matches (READY or IN_PROGRESS) in a sidebar.
- Included a detailed scoring view displaying Player 1 vs Player 2, their names, category, and table number.
- Built a Server Action (submitMatchResult) that validates the match state, updates the score/winner in MongoDB, and inherently calls the **Bracket Progression Logic** to advance the winner and loser to their designated future brackets (including Grand Final bracket reset logic).
