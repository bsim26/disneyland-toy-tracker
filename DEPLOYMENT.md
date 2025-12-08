# Deploying to Cloudflare Pages with Turso Database

## Prerequisites

- Node.js installed
- Git repository pushed to GitHub
- Turso CLI installed globally

## Step 1: Set Up Turso Database

### 1.1 Install Turso CLI (if not already installed)
```bash
npm install -g @turso/cli
```

### 1.2 Sign Up and Authenticate
```bash
turso auth signup
```

This will open your browser for authentication.

### 1.3 Create Your Database
```bash
turso db create disneyland-toys
```

### 1.4 Get Database Credentials
```bash
turso db show disneyland-toys --url
turso db tokens create disneyland-toys
```

Save both the URL and token - you'll need them!

### 1.5 Update Local .env File
Create or update `.env` (never commit this file!):
```env
DATABASE_URL=libsql://disneyland-toys-YOUR-NAME.turso.io
DATABASE_AUTH_TOKEN=eyJhbGc...(your token here)
```

### 1.6 Push Schema to Turso
```bash
npm run db:push
```

### 1.7 Create Admin User in Turso
Update `create-user.js` to use your Turso database, then run:
```bash
node create-user.js
```

## Step 2: Deploy to Cloudflare Pages

### 2.1 Push Your Code to GitHub
```bash
git add .
git commit -m "Prepare for Cloudflare deployment"
git push origin main
```

### 2.2 Connect to Cloudflare Pages

1. Go to https://dash.cloudflare.com/
2. Navigate to **Workers & Pages**
3. Click **Create application** → **Pages** → **Connect to Git**
4. Select your GitHub repository: `disneyland-toy-tracker`
5. Configure build settings:
   - **Framework preset:** SvelteKit
   - **Build command:** `npm run build`
   - **Build output directory:** `.svelte-kit/cloudflare`

### 2.3 Add Environment Variables

In Cloudflare Pages settings, add these environment variables:

- `DATABASE_URL` = `libsql://disneyland-toys-YOUR-NAME.turso.io`
- `DATABASE_AUTH_TOKEN` = `eyJhbGc...` (your Turso token)

**Important:** Add these for **Production** environment.

### 2.4 Deploy

Click **Save and Deploy**. Cloudflare will build and deploy your app!

## Step 3: Verify Deployment

1. Once deployed, visit your Cloudflare Pages URL
2. Log in with `admin` / `password`
3. Verify you can see your toys collection

## Important Notes

### Markdown Files (Read-Only)
The `data/toys/*.md` files are bundled in your build and are **read-only** in production. You won't be able to create/edit/delete toys through the app unless you:

1. **Move data to database** - Store toy info in Turso instead of markdown files
2. **Use a CMS** - Set up Sanity/Contentful for editable content
3. **Rebuild on changes** - Edit markdown files locally and redeploy

### Future Deployments

For every update:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Cloudflare will automatically rebuild and deploy!

## Troubleshooting

### Build Fails
- Check Cloudflare build logs
- Verify environment variables are set
- Ensure all dependencies are in `package.json`

### Database Connection Errors
- Verify `DATABASE_URL` and `DATABASE_AUTH_TOKEN` are correct
- Check Turso database status: `turso db show disneyland-toys`

### Can't Log In
- Verify admin user was created in Turso database
- Check that `create-user.js` ran successfully

## Alternative: Use Turso CLI Directly

Query your production database:
```bash
turso db shell disneyland-toys
```

Check users:
```sql
SELECT * FROM user;
```
