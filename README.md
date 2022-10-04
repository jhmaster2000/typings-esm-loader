# ESM Loader Typings
> Type definitions for Node.js custom ESM loaders

[![license][license-image]][license-url]
[![GitHub version][github-image]][github-url]
[![npm release][npm-image]][npm-url]
[![node-current][node-image]][node-url]

Node.js custom ESM loaders need to be in JS as they're passed directly to Node.js on startup, but that doesn't mean we can't have types on them.

## Install
```sh
npm i -D typings-esm-loader
```

## Usage
At the top of your loader's JS file:
```js
/// @ts-check
/// <reference types="typings-esm-loader" />
```
The `/// @ts-check` line is not needed for TS files and optional for JS files, it can be removed if you only want type hints with no strict type checking on JS.

### Using JavaScript
You can now use **JSDoc** comments to typecast your hooks to their respective types as such:
```js
/** @type {resolve} */
export async function resolve(specifier, context, nextResolve) { ... }

/** @type {load} */
export async function load(url, context, nextLoad) { ... }

/** @type {globalPreload} */
export function globalPreload(context) { ... }
```

### Using TypeScript
```ts
export async function resolve(...[specifier, context, nextResolve]: Parameters<resolve>): ReturnType<resolve> { ... }

export async function load(...[url, context, nextLoad]: Parameters<load>): ReturnType<load> { ... }

export function globalPreload(...[context]: Parameters<globalPreload>): ReturnType<globalPreload> { ... }
```

#### Other types provided
- `Loader`: an `interface` representing an ESM loader when imported as a module, useful when using multiple loaders.
- `ModuleFormat`: a union type representing all valid module formats to pass to the `load` hooks return value `format` field.
- `getBuiltin`: a type declaration for the function of same name provided in the global scope of `globalPreload` hooks scripts.
- ***namespace*** `Resolve`
  - `Context`: the `interface` representing the import context object passed to `resolve` hooks.
  - `Return`: the `interface` representing the required return type of `resolve` hooks.
  - `Function`: the type of the `nextResolve` parameter.
- ***namespace*** `Load`
  - `Context`: the `interface` representing the import context object passed to `load` hooks.
  - `Return`: the `interface` representing the required return type of `load` hooks.
  - `Function`: the type of the `nextLoad` parameter.

[github-url]:https://github.com/jhmaster2000/typings-esm-loader
[github-image]:https://img.shields.io/github/package-json/v/jhmaster2000/typings-esm-loader.svg
[license-url]:https://github.com/jhmaster2000/typings-esm-loader/blob/master/LICENSE
[license-image]:https://img.shields.io/npm/l/typings-esm-loader.svg
[npm-url]:http://npmjs.org/package/typings-esm-loader
[npm-image]:https://img.shields.io/npm/v/typings-esm-loader.svg?color=darkred&label=npm%20release
[node-url]:https://nodejs.org/en/download
[node-image]:https://img.shields.io/node/v/typings-esm-loader.svg
