# 🚀 Setup Checklist

Use this checklist when starting a new project with this template.

## ✅ Initial Setup

### 1. Project Initialization
- [ ] Clone or copy this template to your project folder
- [ ] Rename project folder to your project name
- [ ] Initialize git: `git init` (if not already done)
- [ ] Create GitHub repository and push initial commit

### 2. Dependencies
```bash
- [ ] Run: npm install
- [ ] Verify installation: npm run dev
- [ ] Check for updates: npm outdated
```

### 3. Configuration Files

#### package.json
- [ ] Update `name` field
- [ ] Update `description` field
- [ ] Update `version` (0.1.0 for new project)
- [ ] Update `author`
- [ ] Update `repository` URL
- [ ] Update `bugs` URL
- [ ] Update `homepage` URL

#### .env
- [ ] Copy `.env.example` to `.env`
- [ ] Set `VITE_API_BASE_URL` to your API URL
- [ ] Set `VITE_APP_TITLE` to your app name
- [ ] Add any additional env variables

#### index.html
- [ ] Update `<title>` tag
- [ ] Update favicon if needed
- [ ] Add meta tags (description, keywords, og tags)

#### README.md
- [ ] Replace template README with your project README
- [ ] Update project name and description
- [ ] Update setup instructions if needed
- [ ] Add project-specific documentation

## 🔧 Code Customization

### 1. Remove Mock Authentication
```bash
- [ ] Update src/entities/User/api/userApi.ts
- [ ] Replace mock login with real API call
- [ ] Update LoginPage to handle real auth flow
- [ ] Add token refresh logic if needed
```

### 2. API Configuration
```bash
- [ ] Review src/shared/config/api.config.ts
- [ ] Add your API endpoints
- [ ] Configure axios interceptors if needed
- [ ] Add error handling
```

### 3. Redux Store
```bash
- [ ] Review persist whitelist in store.ts
- [ ] Add new slices as needed
- [ ] Configure middleware if needed
```

### 4. Routing
```bash
- [ ] Update routes in AppRouter.tsx
- [ ] Remove unused template routes
- [ ] Add your application routes
- [ ] Update route protection logic
```

## 🎨 Styling & Branding

### 1. Theme Configuration
```bash
- [ ] Update Ant Design theme in App.tsx
- [ ] Configure primary color
- [ ] Configure other theme tokens
```

### 2. CSS Variables
```bash
- [ ] Review src/app/styles/variables/global.scss
- [ ] Update color palette
- [ ] Update spacing if needed
- [ ] Update font family
```

### 3. Logo & Assets
```bash
- [ ] Replace favicon in public/
- [ ] Add logo files
- [ ] Add other static assets
- [ ] Update Header with your logo
```

## 📝 Documentation

### 1. Project Documentation
```bash
- [ ] Update/replace README.md
- [ ] Update CONTRIBUTING.md if needed
- [ ] Add API documentation
- [ ] Add component documentation
- [ ] Create deployment guide
```

### 2. Code Documentation
```bash
- [ ] Add JSDoc comments to complex functions
- [ ] Document custom hooks
- [ ] Document utilities
- [ ] Add inline comments for complex logic
```

## 🧪 Testing (Optional but Recommended)

### 1. Setup Testing
```bash
- [ ] Install Vitest: npm install -D vitest @vitest/ui
- [ ] Install RTL: npm install -D @testing-library/react
- [ ] Create test setup file
- [ ] Add test scripts to package.json
```

### 2. Write Tests
```bash
- [ ] Add unit tests for utilities
- [ ] Add component tests
- [ ] Add integration tests
- [ ] Add E2E tests (Playwright)
```

## 🔒 Security

### 1. Environment Variables
```bash
- [ ] Never commit .env file
- [ ] Add .env to .gitignore (already done)
- [ ] Use environment variables for sensitive data
- [ ] Validate env variables on app start
```

### 2. Dependencies
```bash
- [ ] Run: npm audit
- [ ] Fix vulnerabilities: npm audit fix
- [ ] Review and update dependencies regularly
```

### 3. Code Security
```bash
- [ ] Enable Content Security Policy
- [ ] Sanitize user inputs
- [ ] Use HTTPS in production
- [ ] Implement CSRF protection
```

## 🚀 Deployment Setup

### 1. Build Configuration
```bash
- [ ] Test production build: npm run build
- [ ] Test preview: npm run preview
- [ ] Optimize bundle size
- [ ] Configure code splitting
```

### 2. CI/CD
```bash
- [ ] Copy .github/workflows/ci.yml.example to ci.yml
- [ ] Configure GitHub Actions
- [ ] Add deploy workflow
- [ ] Set up staging environment
```

### 3. Hosting
```bash
- [ ] Choose hosting platform (Netlify/Vercel/etc)
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Test deployment
- [ ] Configure custom domain
```

## 📊 Monitoring & Analytics

### 1. Error Tracking
```bash
- [ ] Add Sentry or similar
- [ ] Configure error reporting
- [ ] Set up alerts
```

### 2. Analytics
```bash
- [ ] Add Google Analytics or similar
- [ ] Configure tracking events
- [ ] Set up conversion tracking
```

### 3. Performance
```bash
- [ ] Set up Lighthouse CI
- [ ] Monitor Core Web Vitals
- [ ] Set up performance budgets
```

## 🎯 Development Workflow

### 1. Git Setup
```bash
- [ ] Create develop branch
- [ ] Set up branch protection
- [ ] Configure PR templates
- [ ] Set up code review process
```

### 2. Code Quality
```bash
- [ ] Set up pre-commit hooks (husky)
- [ ] Configure lint-staged
- [ ] Set up commit message linting
- [ ] Configure VSCode settings
```

### 3. Team Collaboration
```bash
- [ ] Add team members to repository
- [ ] Share .env.example and setup docs
- [ ] Create development guidelines
- [ ] Schedule code review meetings
```

## ✨ Optional Enhancements

### Future Improvements
```bash
- [ ] Add internationalization (i18n)
- [ ] Set up Storybook
- [ ] Add PWA configuration
- [ ] Implement dark mode
- [ ] Add Docker configuration
- [ ] Set up GraphQL (if needed)
- [ ] Add bundle analyzer
- [ ] Implement lazy loading for heavy components
```

## 🎉 Final Steps

### 1. Pre-Launch
```bash
- [ ] Full testing on all browsers
- [ ] Mobile responsiveness check
- [ ] Accessibility audit
- [ ] SEO optimization
- [ ] Performance optimization
```

### 2. Launch
```bash
- [ ] Deploy to production
- [ ] Verify production deployment
- [ ] Monitor for errors
- [ ] Create launch announcement
```

### 3. Post-Launch
```bash
- [ ] Monitor analytics
- [ ] Collect user feedback
- [ ] Plan next iteration
- [ ] Update documentation
```

---

## 📋 Quick Reference

### Essential Commands
```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

### Important Files to Update
1. `package.json` - Project metadata
2. `.env` - Environment variables
3. `index.html` - App title and meta tags
4. `README.md` - Project documentation
5. `src/shared/config/api.config.ts` - API configuration

---

**Print this checklist and check off items as you complete them!** ✅
