# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-XX

### Added
- Initial template setup with Feature-Sliced Design architecture
- React 18 + TypeScript + Vite configuration
- Redux Toolkit with Redux Persist for state management
- React Router DOM v7 for routing
- Ant Design (antd) UI library integration
- SCSS Modules for styling
- ESLint configuration for code quality
- Path aliases for clean imports
- Authentication flow (mock implementation)
- Protected and public routes
- Error Boundary for error handling
- Responsive design with SCSS mixins
- Global CSS variables for theming

### Pages
- HomePage - Welcome page with project overview
- LoginPage - Authentication page
- ErrorPage - Error fallback page
- NotFoundPage - 404 page

### Widgets
- Header - Navigation header with logout

### Features
- Auth/LoginForm - Login form component

### Entities
- User - User entity with Redux slice and API

### Shared
- Button - Wrapped Ant Design button
- Loader - Loading spinner component
- classNames - Utility for conditional classes
- useAppDispatch - Typed Redux dispatch hook
- API configuration

### Documentation
- README.md - Complete project documentation
- ARCHITECTURE.md - Architecture explanation
- CONTRIBUTING.md - Contribution guidelines
- QUICKSTART.md - Quick start guide
- SCRIPTS.md - Available scripts reference
- CHANGELOG.md - This file

### Configuration
- TypeScript configuration (strict mode)
- Vite configuration with plugins
- ESLint configuration
- Prettier configuration
- EditorConfig for consistent coding style
- VSCode extensions recommendations

## [Unreleased]

### Planned
- [ ] Testing setup (Vitest, React Testing Library)
- [ ] E2E testing setup (Playwright)
- [ ] CI/CD pipeline examples
- [ ] i18n internationalization
- [ ] Dark mode theme
- [ ] PWA configuration
- [ ] Docker configuration
- [ ] API mock server setup
- [ ] Storybook integration
- [ ] Bundle analyzer integration

---

For more details, check the [README](README.md) and [ARCHITECTURE](ARCHITECTURE.md) files.
