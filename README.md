# Kivi website

A static website with Anime.js motion, a three-act scroll story, interactive productivity scenes, and native-script language previews.

## Local preview
Requires Node.js 20 or newer. No dependencies need installing.

```sh
npm run dev
```

Open http://127.0.0.1:4187.

## Push to GitHub
Extract this ZIP. Upload the CONTENTS of this folder to the root of a new GitHub repository.
Keep dist, package.json, verify.cjs and vercel.json together at the repository root.
Do not upload only the ZIP file.

Using Git in this extracted folder:

```sh
git init
git add .
git commit -m "Add Kivi website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the placeholder remote with your actual repository URL.

## Deploy on Vercel
1. Open https://vercel.com/new and import your GitHub repository.
2. Root Directory: leave at the repository root.
3. Framework Preset: Other.
4. Build Command: npm run build.
5. Output Directory: dist.
6. Deploy.

The included vercel.json configures the build and output directory automatically.
The build only verifies files; the site is already built. No environment variables or API keys are required.
Subsequent pushes to the connected production branch trigger deployments.

Official instructions: https://vercel.com/docs/git/vercel-for-github
Configuration: https://vercel.com/docs/project-configuration/vercel-json

## Editing
Edit dist/index.html and the CSS/JS files referenced there. Images and the bundled Anime.js module are in dist/assets.
The website uses Google Fonts with local fallback fonts.
The previews use sample text. They do not record audio or connect to the Kivi desktop app.
This package has not itself been deployed to Vercel.

## Assets
Branding and artwork were supplied for this project.
Anime.js 4.1.3 is distributed under the MIT license; see THIRD_PARTY_NOTICES.md.
