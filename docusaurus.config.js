module.exports = {
  title: "React Next Form",
  tagline: "Build complex form with ease",
  url: "https://inkOfPixel.github.io",
  baseUrl: "/react-next-form/",
  onBrokenLinks: "throw",
  favicon: "/img/favicon.ico",
  organizationName: "inkOfPixel", // Usually your GitHub org/user name.
  projectName: "react-next-form", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "React Next Form",
      logo: {
        alt: "React Next Form logo",
        src: "/react-next-form/img/logo.svg",
      },
      items: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "right",
        },
        { to: "blog", label: "Blog", position: "right" },
        {
          href: "https://github.com/inkOfPixel/react-next-form",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Learn",
          items: [
            {
              label: "Quickstart",
              to: "docs/",
            },
            {
              label: "API Reference",
              to: "docs/use-form",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Twitter",
              href: "https://twitter.com/dhmacs",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/inkOfPixel/react-next-form",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} inkOfPixel, Srl. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl:
            "https://github.com/inkOfPixel/react-next-form/edit/master/docs",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/inkOfPixel/react-next-form/edit/master/docs/blog/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
