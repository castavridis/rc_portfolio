# RC Portfolio

## Tools
* Next.js
* Hygraph
* React
* TypeScript
  * TypeScript is included in current production-ready React releases
* pnpm

* Push to GitHub
* Connect repository to Vercel projects
* Import git repo to Vercel

### Steps
* git init rc_portfolio
* cd rc_portfolio
* pnpm init
* pnpm i next@latest react@latest react-dom@latest
* ... followed the rest of this getting started document: https://nextjs.org/docs/app/getting-started/installation
* pnpm run dev // will install TypeScript packages for you for the first time
* Configure repo to use eslint.config.js
  * npx @next/codemod@canary next-lint-to-eslint-cli
  * pnpm install @eslint/eslintrc
  * Add `"type": "module"` to package.json
  * Migrate eslintrc.json > eslint.config.js, followed [documentation for 'next/core-web-vitals'](https://nextjs.org/docs/app/api-reference/config/eslint#with-core-web-vitals)
  * Add "ignoreDuringBuilds: true" to next.config.js
  * Add "ignores": \['.next/'\] to eslint.config.js (.eslintignore is deprecated)
  * Add rule for "next-env.d.ts" to [supress /// error](https://stackoverflow.com/questions/74826402/do-not-use-a-triple-slash-reference-for)