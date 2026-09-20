# Install the reconciled redesign (Windows + VS Code)

This is the NEW redesigned website. It combines the previous redesign with the latest OLD website you uploaded. Your currently deployed site has not been changed.

## 1. Download and extract

Extract this ZIP somewhere OUTSIDE your existing Git repository, e.g. `Downloads/website-redesign-final`. Keep it separate for now. Open your EXISTING website repository in VS Code, then choose Terminal → New Terminal. Commands below use PowerShell.

## 2. Save your current work and make a test branch

Run `git status`. If it lists changes, review them in VS Code's Source Control panel. Do not stage secrets or generated files. Then save the reviewed changes:

```powershell
git add .
git diff --cached --stat
git commit -m "Save website before redesign"
```

Skip that commit if the working tree is already clean. Do NOT push your production branch just to make a backup: on an automatically deployed site that could publish unrelated changes.

```powershell
git switch -c website-redesign
```

If that branch already exists, use `git switch website-redesign`. A branch is a separate line of work; it leaves your production branch unchanged. You do not need `git init` or a new GitHub repository.

## 3. Preview the installation

Stop any running development server with Ctrl+C. Keep your existing `.env.local`, `.gitignore`, `.git`, and Vercel configuration. Do not send private environment values to anyone.

Run the installer from the EXTRACTED download, pointing it at your EXISTING repository. Replace BOTH example paths with your actual paths; keep the quotation marks:

```powershell
& "C:\Users\YourName\Downloads\website-redesign-final\scripts\install-redesign.ps1" -RepositoryPath "C:\Users\YourName\Documents\my-portfolio"
```

This only prints a plan. If PowerShell blocks the script, stop and share the error text (without secrets); do not disable your security policy blindly.

Read the printed target and branch. If correct, run the same command with `-Apply`:

```powershell
& "C:\Users\YourName\Downloads\website-redesign-final\scripts\install-redesign.ps1" -RepositoryPath "C:\Users\YourName\Documents\my-portfolio" -Apply
```

The installer backs up replaced source files in a sibling folder named `my-portfolio-before-redesign-...`, then installs the redesign. It preserves environment files, Git history, your existing ignore rules and unrelated root files. It replaces complete source folders to prevent duplicate old/new Next.js routes. Public assets are backed up and merged. It does NOT install dependencies, commit, push, deploy or write to Sanity.

## 4. Install dependencies and configure the public URL

Back in the terminal for your EXISTING repository:

```powershell
node --version
npm ci
```

Use Node 22.12+ (22.x) or Node 24. The supplied package-lock is already synchronized, so use `npm ci`, not `npm install`. No separate Studio installation is needed.

Keep your original `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and API-version settings. In `.env.local`, add the actual public origin of your website:

```env
SITE_URL=https://your-actual-domain.example
CONTENT_PREVIEW=0
```

Replace the example with YOUR current website URL. `SITE_URL` controls canonical links, the sitemap and RSS; without a public HTTPS URL the site deliberately stays noindex. `NEXT_PUBLIC_SITE_URL` is accepted as a fallback, but prefer `SITE_URL`. Do not use preview sample content in production.

## 5. Check the site locally

```powershell
npm run check
npm run dev
```

`check` runs lint, content tests, and a production build. If it fails, stop and send the error text. Do not use `npm audit fix --force` or randomly upgrade dependencies.

Open http://localhost:3000. Visit Writing, Projects, Progress and About. Open an EXISTING project's URL and confirm its text, code, images and links. Open http://localhost:3000/studio and sign in normally. Confirm your existing documents are there. If Sanity rejects localhost, check the allowed origin in your Sanity project's API/CORS settings; use the specific localhost origin, not a wildcard.

Existing project documents remain projects. Nothing automatically classifies your Crime and Punishment article or monthly logs. New Writing and Progress collections may be empty until you add entries. Do not delete or rename old documents to make them fit.

Check mobile at 390px using DevTools, then browser zoom at 125%, 150%, and 200%. Tab through the menu and image-enlarge buttons; Enter opens an image and Escape closes it. Wide tables/code should scroll inside the article, not widen the whole page.

## 6. Push a preview branch

Stop the dev server with Ctrl+C. Review Source Control or run:

```powershell
git status --short
git diff --stat
git add .
git diff --cached --stat
```

If you see `.env.local`, private tokens, `node_modules`, or `.next`, STOP before committing and fix ignore/tracking rules. Also ignore generated `public/math/`, `test-results/`, and `playwright-report/` in your existing `.gitignore` (the math files are regenerated by the build).

```powershell
git commit -m "Redesign personal website"
git push -u origin website-redesign
```

In Vercel, confirm that your existing production branch is NOT `website-redesign`. If Git preview deployments are enabled, the push creates a preview URL. Set the existing Sanity environment variables for the Preview environment too, plus `SITE_URL` to your real public website URL and `CONTENT_PREVIEW=0`. Redeploy if you changed environment variables after the build. No separate `sanity deploy` is required: Studio is served at `/studio`.

## 7. Publish only after reviewing the preview

On GitHub open a pull request from `website-redesign` into your EXISTING production branch (often `main`, but check yours). Review the changes and successful Vercel preview. Merge when satisfied. Vercel will deploy the production branch if your existing integration is configured that way.

## If something goes wrong

Before a production merge: leave production alone and fix the test branch. The installer printed an outside-the-repository backup of every replaced source file. Do not run `git reset --hard` or delete the repository. If installation stops halfway, do not commit; use the backup or ask for help with the error.

After deployment: use your hosting provider's rollback to the previous successful deployment, then revert the redesign pull request in GitHub so the repository matches the rollback. A merge commit needs different revert handling, so do not copy a generic `git revert COMMIT_ID` blindly.

## Where to edit things later

| Change | File or place |
| --- | --- |
| Name, bio, GitHub, email, Currently | `content/site.json` |
| Homepage layout | `app/(site)/page.js` |
| Colors, spacing, typography | `app/(site)/globals.css` |
| Navigation | `components/Navbar.jsx` |
| Articles, projects, monthly logs | `/studio` |
| New CMS fields | `sanity/schema/` |
| Image rendering | `components/ResponsiveImage.jsx` |
| Rich content rendering | `components/ArticleRenderer.jsx` |

The `(site)` folder is a Next.js route group, NOT part of the public URL. The homepage is still `/`, not `/(site)`.
