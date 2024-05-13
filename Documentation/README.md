# Adroit Frontend Manager - Documentation

This directory contains the documentation for the Adroit Frontend Manager, built with VitePress.

## Getting Started

To run the documentation locally, follow these steps:

1. Install the dependencies: `pnpm install`
2. Start the documentation server: `pnpm docs:dev`
3. Open the documentation in your browser at `http://localhost:3000`

## Directory Structure

The documentation is structured as follows:

- `docs/`: Contains the Markdown files for the documentation pages
- `docs/.vitepress/`: Contains the VitePress configuration and theme files
- `docs/.vitepress/config.js`: The main configuration file for VitePress
- `docs/.vitepress/theme/`: Contains custom theme components and styles

## Writing Documentation

To add or modify documentation pages, follow these guidelines:

1. Create a new Markdown file in the `docs/` directory with a descriptive name (e.g., `intro/getting-started.md`)
2. Add the necessary front matter to the Markdown file (e.g., `title`, `description`)
3. Write the content of the documentation page using Markdown syntax
4. If necessary, update the sidebar configuration in `docs/.vitepress/config.js` to include the new page

## Deploying Documentation

The documentation is deployed using AWS Amplify. The deployment process is triggered when changes are pushed to the `main` or `staging` branch on GitHub. The necessary environment variables for deployment are set up in the Amplify console.