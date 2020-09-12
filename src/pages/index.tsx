import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const features = [
  {
    title: "Fully typed",
    imageUrl: "img/undraw_docusaurus_mountain.svg",
    description: (
      <>
        React Next Form codebase is built in Typescript allowing you to fully
        type your forms and get rid of annoying bugs.
      </>
    ),
  },
  {
    title: "Easy to adopt",
    imageUrl: "img/undraw_docusaurus_tree.svg",
    description: (
      <>
        Since form state is local, React Next Form can be adopted incrementally
        without an high impact on your bundle size. It also help you save lot of
        boilerplate code saving you time and bytes.
      </>
    ),
  },
  {
    title: "Supports advanced use cases",
    imageUrl: "img/undraw_docusaurus_react.svg",
    description: (
      <>
        React Next Form supports realtime updates with partial reset, so the
        user will get updated data without losing drafted fields. It has builtin
        support for array fields and can be easily wired up with UI libraries.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="A React library to make it easy to simplify CRUD form"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--outline button--secondary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
