# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kalkulacka.1 is a multi-country voting advice application platform used by millions of voters across 7 countries. It's a Turborepo monorepo with modular architecture designed for reusability across different voting advice application instances.

## Key Commands

### Development
- `npm install` - Install dependencies
- `npm run dev` - Start all development servers in watch mode (Storybook, ReDoc, and country-specific apps)
- `npm run build` - Build all packages and apps
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with Vitest UI

### Code Quality
- `npm run lint` - Run Biome linter checks
- `npm run lint:fix` - Auto-fix linting issues with Biome

### Dependency Management
- `npm run ncu` - Check for package updates
- `npm run ncu:upgrade` - Upgrade packages to latest versions

## Architecture

The codebase follows a Turborepo structure with two main directories:

### `/apps` - Next.js Applications
- Each app is named by its production URL (e.g., `www.volebnikalkulacka.cz`)
- Apps serve as country-specific voting advice application instances
- Development ports:
  - `localhost:3001` - Design System (Storybook)
  - `localhost:3002` - Schema docs (ReDoc)
  - `localhost:3010` - Kalkulacka.1 platform site
  - `localhost:3020` - Czech Volební kalkulačka

### `/packages` - Shared Libraries
- `@repo/design-system` - Presentational components and themes
- `@repo/app` - Core voting advice application logic (state management, calculations)
- `@repo/schema` - Data validation and type definitions
- `@repo/database` - ORM client and database schema
- `@repo/typescript-config` - Shared TypeScript configuration

## Development Standards

### Code Formatting
- Biome is used for linting and formatting
- 2 spaces indentation
- Double quotes for strings
- Line width: 200 characters
- Self-closing JSX elements required

### Tailwind CSS Classes (Design System Package)
- The `ko:` prefix must ALWAYS come first before any responsive modifiers
- Correct: `ko:lg:grid-cols-3`, `ko:sm:hidden`, `ko:md:flex`
- Incorrect: `lg:ko:grid-cols-3`, `sm:ko:hidden`, `md:ko:flex`
- This applies to all Tailwind utilities in the `@repo/design-system` package

### Testing
- Vitest for unit testing
- React Testing Library for component testing
- JSDOM environment configured

### TypeScript
- Strict type checking enabled
- No explicit any allowed
- No non-null assertions

### Import Organization
Biome organizes imports in this order:
1. URL and package imports
2. `@repo/**` workspace imports
3. Relative path imports

## Tech Stack
- Node.js 22.x required
- React 19 with Next.js 15
- TypeScript 5.9
- Tailwind CSS 4
- Biome for linting/formatting
- Vitest for testing
- Turborepo for monorepo management

## Mandatory Post-Task Checks

**IMPORTANT**: After completing any task that updates code, the following checks MUST be run in this exact order (no exceptions):

1. `npm run typecheck` - Verify TypeScript types are correct
2. `npm run lint:fix` - Auto-fix and check linting issues
3. `npm run test` - Ensure all tests pass

These commands must always be run from the root of the monorepo, never from individual packages or apps.

## app ports

repository uses hardocded ports. you have to lunch the apps using custom ports to resolve conflicts figure it out