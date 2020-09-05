# React Form Next

React primitives to quickly build complex form behaviors

<a href="https://www.npmjs.org/package/react-next-form">
  <img src="https://img.shields.io/npm/v/react-next-form.svg" alt="Current npm package version." />
</a>

## Install

```bash
yarn add -E react-next-form immer
```

## Contribute

### Install dependencies

```bash
npm install # or yarn
```

If you are making changes to the documentation site, install docs dependencies:

```bash
cd docs; npm install # or cd docs; yarn
```

### Commit messages

Based on the contribution, format your commit message this way so that the version is correctly bumped:

- If the contribution is a breaking change, put `BREAKING CHANGE` or `major` somewhere in your commit.
- If the contribution is a new feature format your message like this "`feat`: added this new cool stuff". You can also use `minor` or `feature`
- All other changes will increment the patch version

In case you might want to skip version bumping just add `[skip ci]` to your commit.

### Publishing to NPM

To publish a new version to npm, just create a Github release. Once you create the release a Github workflow will take care of the publishing process.

### Commands

The recommended workflow is to run TSDX in one terminal:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

To run docs use `npm run docs` or `yarn docs`.

## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log("foo");
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.
