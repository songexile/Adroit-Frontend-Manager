import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Frontend Documentation',
  description: 'Adroit Frontend Manager Dashboard Documentation Website',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started/introduction' },
      { text: 'Installation', link: '/getting-started/installation' },
      { text: 'Create New Page', link: '/development/create-new-page' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        collapsed: false,
        items: [
          { text: 'Introduction', link: '/getting-started/introduction' },
          { text: 'Installation', link: '/getting-started/installation' },
        ],
      },
      {
        text: 'Configurations',
        collapsed: false,
        items: [
          { text: 'Routes', link: '/configurations/routes' },
          { text: 'Site Config', link: '/configurations/site-config' },
          { text: 'Environment', link: '/configurations/environment' },
          { text: 'Scripts', link: '/configurations/scripts' },
        ],
      },
      {
        text: 'Development',
        collapsed: false,
        items: [
          { text: 'Project Structure', link: '/development/project-structure' },
          { text: 'Create New Page', link: '/development/create-new-page' },
          { text: 'Environment', link: '/development/environment' },
          { text: 'Build And Deploy', link: '/development/build-deploy' },
          { text: 'Resource Credits', link: '/development/resource-credits' },
        ],
      },
      {
        text: 'Integrations',
        collapsed: false,
        items: [
          { text: 'Next Auth', link: '/integrations/next-auth' },
          { text: 'React Email (Resend)', link: '/integrations/resend' },
          { text: 'Toastify', link: '/integrations/toastify' },
        ],
      },
      {
        text: 'Components',
        collapsed: false,
        items: [
          { text: 'Navbar', link: '/components/navbar' },
          { text: 'Tables', link: '/components/tables' },
          { text: 'Gauge Chart', link: '/components/gauge-chart' },
        ],
      },
      {
        text: 'Pages',
        collapsed: false,
        items: [
          { text: 'Main Page', link: '/pagesDoc/main-page' },
          { text: 'Stats Page', link: '/pagesDoc/stats-page' },
          { text: 'Ticket Page', link: '/pagesDoc/ticket-page' },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/songexile/Adroit-Frontend-Manager',
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 - Adriot Iot FrontEnd Manager Team',
    },

    search: {
      provider: 'local',
    },
  },
});
