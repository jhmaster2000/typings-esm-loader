# ESM Loader Typings
> Typings for Node.js custom ESM loaders

Node.js custom ESM loaders need to be written in JS as they're passed directly to Node.js on startup, but that doesn't mean we can't have types on them.

## Install
```sh
npm i -D jhmaster2000/typings-esm-loader
```

## Usage
At the top of your loader's JS file:
```js
/// <reference types="typings-esm-loader" />
/// @ts-check
```
The `/// @ts-check` line is optional and can be removed if you only want type hints with no strict type checking.
