# Next.js 16 + Supabase + Google OAuth Boilerplate

A production-ready, open-source project scaffold (boilerplate) for building full-stack web applications with Next.js 16 (App Router), Supabase Auth (`@supabase/ssr`), and Google OAuth authentication. Designed as a "plug-and-play" template.

## Tech Stack Overview

- **Core Framework:** [Next.js 16](https://nextjs.org/) (App Router, React Server Components, Server Actions, Route Handlers)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict type-safety)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Premium minimalist styling, class-based theme switcher, and scroll limits)
- **Database & Auth:** [Supabase](https://supabase.com/) via the modern `@supabase/ssr` package for cookie-based server side session persistence
- **Authentication Provider:** Google OAuth (via PKCE flow) & standard email/password authentication
- **Access Control:** Role-Based Access Control (RBAC) with pre-configured Admin Panel routing checks

---

## File Structure

```text
mahusay/
├── .env.example              # Template for environment variables
├── .env.local                # Local environment variables (gitignored)
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and run scripts
├── src/
│   ├── proxy.ts              # Next.js 16 Request Interceptor (replaces middleware.ts)
│   ├── app/
│   │   ├── layout.tsx        # Global theme and provider definitions
│   │   ├── page.tsx          # Interactive setup developer guide (landing page)
│   │   ├── globals.css       # Tailwind CSS v4 directives
│   │   ├── dashboard/
│   │   │   ├── page.tsx      # Secure dashboard with role checking and role-switch test widget
│   │   │   └── admin/
│   │   │       └── page.tsx  # Protected admin dashboard containing logs and audit stats
│   │   └── auth/
│   │       ├── callback/
│   │       │   └── route.ts  # PKCE auth code exchange Route Handler
│   │       ├── signup/
│   │       │   └── page.tsx  # Account Registration Page
│   │       ├── login/
│   │       │   └── page.tsx  # Auth Portal Login screen
│   │       └── actions.ts    # Secure Server Actions for OAuth, Login, Signup & Sign Out
│   ├── components/
│   │   ├── theme-provider.tsx# Theme context wrapper using next-themes
│   │   ├── theme-toggle.tsx  # Minimalist light/dark/system theme selector
│   │   ├── submit-btn.tsx    # React 19 useFormStatus Submit button
│   │   ├── login-btn.tsx     # Google Sign-in button with loading state
│   │   └── logout-btn.tsx    # Sign-out action button
│   └── utils/
│       └── supabase/
│           ├── client.ts     # Supabase Browser Client constructor
│           └── server.ts     # Supabase Server Client constructor (asynchronous cookies)
```

---

## Getting Started

Follow these step-by-step instructions to get the boilerplate running locally with Supabase and Google OAuth:

### Step 1: Clone the Repository and Install Dependencies

```bash
git clone <your-scaffold-repo-url> mahusay
cd mahusay
npm install
```

### Step 2: Set up Supabase Project

1. Go to the [Supabase Dashboard](https://supabase.com/dashboard) and log in.
2. Click **New Project**, select an organization, and fill out:
   - **Project Name:** (e.g., `mahusay-scaffold`)
   - **Database Password:** (Generate a secure password and save it)
   - **Region:** (Select the closest region to your users)
3. Click **Create new project** and wait for it to provision (takes about 1-2 minutes).
4. Go to **Project Settings > API** on the left menu.
5. Copy your **Project URL** and **API Key (anon/public)**.

### Step 3: Configure Google OAuth on Google Cloud Console

1. Navigate to the [Google Cloud Console](https://console.cloud.google.com).
2. Create a **New Project** or select an existing one.
3. Search for **OAuth consent screen** in the search bar:
   - Select **External** and click **Create**.
   - Fill in the required fields. Click **Save and Continue**.
   - Under **Scopes**, click **Add or Remove Scopes**, select `.../auth/userinfo.email` and `.../auth/userinfo.profile`, then click **Save and Continue**.
4. Search for **Credentials** in the left menu:
   - Click **Create Credentials > OAuth client ID**.
   - Set **Application type** to **Web application**.
   - Under **Authorized redirect URIs**, add the callback URL provided by your Supabase project:
     ```text
     https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
     ```
     *(Replace `<your-supabase-project-ref>` with the reference ID of your project).*
   - Click **Create**.
5. Copy the generated **Client ID** and **Client Secret**.

### Step 4: Configure Google Provider in Supabase

1. Back in the **Supabase Dashboard**, navigate to **Authentication > Providers > Google**.
2. Toggle **Enable Google Enabled** to `ON`.
3. Paste the **Client ID** and **Client Secret** you copied from the Google Cloud Console.
4. Click **Save**.

### Step 5: Configure Environment Variables

In the root of your project directory, copy `.env.example` to create `.env.local`:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 6: Start Local Development Server

Run the development server locally:

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser. You will see the interactive Developer Guide. Click the **Login** button in the header to test your setup!

---

## Security & RBAC Architecture

1. **Edge-Level Interception (`src/proxy.ts`):** 
   Next.js 16 introduces `proxy.ts` to replace the deprecated `middleware.ts`. This request interceptor runs at the network edge:
   - refreshes cookies transparently via `@supabase/ssr`'s `getAll` and `setAll` API.
   - Enforces authentication: blocks unauthenticated requests to `/dashboard`.
   - **Enforces Role-Based Access Control (RBAC):** blocks access to `/dashboard/admin` and sub-paths if the user's role metadata claims are not `'admin'`.

2. **Server-Side Cryptographic Validation:**
   For secure data fetching, Page Server Components perform secondary validation checks:
   ```typescript
   const { data: { user }, error } = await supabase.auth.getUser()
   ```
   Unlike `getSession()`, `getUser()` makes an internal network request to the Supabase authentication provider to cryptographically verify that the user session and metadata claims have not been altered or forged.

3. **RBAC Metadata Toggling:**
   During signup, new registrations default to the `'user'` role inside `user_metadata`. The template includes a role-switching Server Action `toggleUserRole()` allowing developers to swap roles dynamically inside their user workspace dashboard to verify routing limits in action.
