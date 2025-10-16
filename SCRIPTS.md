# Development Scripts

## 📜 Available Commands

### Development

```bash
# Start development server (default port: 5173)
npm run dev

# Start development server with custom host
npm run dev -- --host

# Start development server with custom port
npm run dev -- --port 3000
```

### Building

```bash
# Build for production
npm run build

# Build and analyze bundle size
npm run build -- --mode production
```

### Preview

```bash
# Preview production build locally
npm run preview

# Preview on custom port
npm run preview -- --port 4173
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint errors automatically
npm run lint -- --fix
```

### Type Checking

```bash
# Run TypeScript compiler check
npx tsc --noEmit

# Watch mode for type checking
npx tsc --noEmit --watch
```

## 🔧 Useful Development Commands

### Package Management

```bash
# Install all dependencies
npm install

# Add a new dependency
npm install <package-name>

# Add a dev dependency
npm install -D <package-name>

# Remove a dependency
npm uninstall <package-name>

# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Audit for security issues
npm audit
```

### Git Commands

```bash
# Initialize git
git init

# Add all files
git add .

# Commit changes
git commit -m "feat: your message"

# Create a new branch
git checkout -b feature/your-feature

# Push to remote
git push origin your-branch
```

### Clean & Reset

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Clear dist folder
rm -rf dist
```

## 🚀 Deployment Commands

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

## 🛠 Maintenance Commands

### Dependencies Upgrade

```bash
# Check for major updates
npx npm-check-updates

# Update all to latest (interactive)
npx npm-check-updates -i

# Update all to latest (auto)
npx npm-check-updates -u
npm install
```

### Bundle Analysis

```bash
# Install rollup plugin visualizer
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts and run build
npm run build

# Open stats.html to analyze bundle
```

### Performance Check

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:5173
```

## 📦 Custom Scripts to Add

You can add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,scss}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css,scss}\"",
    "clean": "rm -rf dist node_modules/.vite",
    "clean:all": "rm -rf dist node_modules package-lock.json",
    "reinstall": "npm run clean:all && npm install"
  }
}
```

## 🧪 Testing (Future)

When you add testing libraries:

```bash
# Vitest
npm run test
npm run test:watch
npm run test:coverage

# E2E with Playwright
npm run test:e2e
npm run test:e2e:ui
```

## 📊 Monitoring & Analytics

```bash
# Bundle size analysis
npm run build
npx vite-bundle-visualizer

# Source map explorer
npm install -g source-map-explorer
npm run build
source-map-explorer dist/assets/*.js
```

---

For more information, check the official documentation:
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
