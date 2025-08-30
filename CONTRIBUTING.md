# Contributing guide

We're thrilled that you're interested in contributing to the Kalkulacka.1 platform!

## Development

### Getting started

#### Prerequisites

You'll need:

- Git [installed](https://git-scm.com/downloads), a [GitHub account](https://github.com/signup) and basic [knowledge](https://docs.github.com/en/get-started/start-your-journey/git-and-github-learning-resources) of both,
- [Node.js](https://nodejs.org/en/download) (version 21) installed
- [Kalkulacka.1 account](https://identity.kalkulacka.one) for logging into the [Kalkulacka.1 Talk](https://talk.kalkulacka.one) communication platform *(optional, but recommended for quicker communication with the team)*


#### Step-by-step guide

1. Fork the repository by clicking the *Fork* button in the top right corner of the repository page on GitHub.

2. Open your terminal and clone your forked repository to your local machine:

   ```console
   git clone { your-fork-url }
   cd kalkulacka
   ```

3. Install the dependencies:

   ```console
   npm install
   ```

4. Start the development server:

   ```console
   npm run dev
   ```

5. Follow the instructions in the terminal to open the individual apps and components in your browser:

- **[Kalkulacka.1 Design System](https://design-system.kalkulacka.one)** docs via [Storybook](http://storybook.js.org) @ [`localhost:3001`](http://localhost:3001)
- **[Kalkulacka.1 Schema](https://schema.kalkulacka.one)** docs via [ReDoc](https://redocly.com/docs/redoc)  @ [`localhost:3002`](http://localhost:3002)
- **[Kalkulacka.1](https://www.kalkulacka.one)** platform site Next.js app live @ [`localhost:3010`](http://localhost:3010)
- 🇨🇿 Czech **[Volební kalkulačka](https://www.volebnikalkulacka.cz)** Next.js app @ [`localhost:3020`](http://localhost:3020)

### What next?

- Learn more about the overall **[architecture](docs/architecture.md)** of the platform