import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Frontend Documentation",
  description: "Adroit Frontend Manager Dashboard Documentation Website",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        collapsed: false,
        items: [
          { text: 'Introduction', link: '/getting-started/introduction' },

        ],
      },
      {
        text: 'Configurations',
        collapsed: false,
        items: [
          { text: 'Routes', link: '/configurations/routes' },

        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/songexile/Adroit-Frontend-Manager' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 - Adriot Iot FrontEnd Manager Team'
    },

    search: {
      provider: 'local'
    }
  }
})
