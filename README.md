# Notice Board

A full CRUD Notice Board built with Next.js (Pages Router), Prisma, and MySQL, for the Reno Platforms web development assignment.

## Tech stack

- **Framework:** Next.js 14, Pages Router
- **Database access:** Prisma
- **Database:** MySQL (TiDB Cloud free tier)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel (free/Hobby tier)

## Features

- List all notices as responsive cards (phone and desktop)
- Create and edit notices through a single shared form
- Delete a notice, with a confirmation step before it's removed
- Urgent notices are always sorted above Normal ones (via Prisma `orderBy`, in the database, not in the browser), with a red "Urgent" badge
- Server-side validation on every write (title/body required, category and priority must be valid values, publish date must be a valid date)
- Optional image URL per notice

## Running locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root (see `.env.example`) with a `DATABASE_URL` pointing at a MySQL-compatible database, e.g. a free TiDB Cloud cluster:
   ```
   DATABASE_URL="mysql://<user>:<password>@<host>:4000/<database>?sslaccept=strict"
   ```
3. Push the Prisma schema to your database:
   ```bash
   npx prisma db push
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000).

## Deploying

1. Push this repo to a public GitHub repository.
2. Import it into Vercel.
3. Add the `DATABASE_URL` environment variable in the Vercel project settings (same value as your `.env`).
4. Deploy. Vercel runs `prisma generate` automatically via the `postinstall` script, and the build script also runs `prisma generate` before `next build`.
5. Make sure the database schema has been pushed (`npx prisma db push` from your local machine, pointed at the same `DATABASE_URL`) before the app is used, so the `Notice` table exists.

## One thing I'd improve with more time

Real file uploads for the notice image (e.g. via an object storage bucket like S3/Cloudinary with a signed upload URL), instead of asking for a plain image URL. That would also let me add server-side validation on file type/size, which the current URL-only approach can't do.

## Where and how AI was used

I used Claude (Anthropic) to scaffold this project: generating the initial Next.js Pages Router file structure, the Prisma schema, the API routes (`pages/api/notices/index.js` and `pages/api/notices/[id].js`), the shared server-side validation helper, the React components (`NoticeCard`, `NoticeForm`), and the Tailwind-based styling. I reviewed the generated code, adjusted the Prisma enum ordering approach used for the Urgent-first sort, and tested the CRUD flow locally before deploying. I wrote this README myself, based on what was actually built.
