/**
 * Type definitions for custom Node.js ESM loaders
 * @docs https://nodejs.org/api/esm.html#loaders
 * @docsversion v18.10.0
 * @stability 1 - Experimental
 * @description
 * To customize the default module resolution, loader hooks can optionally be
 * provided via a `--experimental-loader ./loader-name.mjs` argument to Node.js.
 * 
 * When hooks are used they apply to the entry point and all `import` calls.
 * They won't apply to `require` calls; those still follow _CommonJS_ rules.
 */
declare module 'typings-esm-loader' {

// @ts-expect-error tsserver sometimes glitches out and complains about the 'declare global', but still works fine
declare global {
    /** An ESM loader when imported as a module. */
    interface Loader {
        resolve?: resolve;
        load?: load;
        globalPreload?: globalPreload;
        [key: string]: unknown;
    }

    /**
     * `format` | Description | Acceptable types for `source` returned by `load`
     * -|-|-
     * `'builtin'` | Load a Node.js builtin module | Not applicable
     * `'commonjs'` | Load a Node.js CommonJS module | Not applicable
     * `'json'` | Load a JSON file | { {@linkcode String string}, {@linkcode ArrayBuffer}, {@linkcode Uint8Array TypedArray} }
     * `'module'` | Load an ES module | { {@linkcode String string}, {@linkcode ArrayBuffer}, {@linkcode Uint8Array TypedArray} }
     * `'wasm'` | Load a WebAssembly module | { {@linkcode ArrayBuffer}, {@linkcode Uint8Array TypedArray} }
     */
    type ModuleFormat = 'builtin' | 'commonjs' | 'json' | 'module' | 'wasm';

    /**
     * The `resolve` hook chain is responsible for resolving file URL for a given module specifier and parent URL,
     * and optionally its format (such as `'module'`) as a hint to the `load` hook.
     * 
     * If a format is specified, the `load` hook is ultimately responsible for providing the final `format` value
     * (and it is free to ignore the hint provided by `resolve`); if `resolve` provides a `format`,
     * a custom `load` hook is required even if only to pass the value to the Node.js default `load` hook.
     * 
     * @param specifier The string in an `import` statement or `import()` expression.
     * @param nextResolve The subsequent `resolve` hook in the chain, or the Node.js default `resolve` hook after the last user-supplied `resolve` hook
     */
    type resolve = (specifier: string, context: Resolve.Context, nextResolve: Resolve.Function) => Promise<Resolve.Return>;

    namespace Resolve {
        interface Context {
            /** Export conditions of the relevant `package.json`
             * 
             * An array of conditions for {@link https://nodejs.org/api/packages.html#conditional-exports package exports conditions} that apply to this resolution request.
             * 
             * They can be used for looking up conditional mappings elsewhere or to modify the list when calling the default resolution logic. */
            conditions: string[];
            /** @undocumented */
            importAssertions: Record<string, unknown>;
            /** The URL of the module that imported this one, or `undefined` if this is the main entry point for the application. */
            parentURL?: string;
        }

        interface Return {
            /** A hint to the load hook (it might be ignored) `'builtin' | 'commonjs' | 'json' | 'module' | 'wasm'`
             * @see {@link ModuleFormat} */
            format?: ModuleFormat | string | null;
            /** A signal that this hook intends to terminate the chain of `resolve` hooks.
             * @default false */
            shortCircuit?: boolean;
            /** The absolute URL to which this input resolves */
            url: string;
        }

        /** Same as {@linkcode resolve} hook but without the `nextResolve` parameter. */
        type Function = (specifier: string, context?: Partial<Resolve.Context>) => Promise<Resolve.Return>;
    }

    /**
     * The `load` hook provides a way to define a custom method of determining how a URL should be interpreted, retrieved, and parsed.
     * It is also in charge of validating the import assertion.
     * @param url The URL returned by the `resolve` chain
     * @param nextLoad The subsequent `load` hook in the chain, or the Node.js default `load` hook after the last user-supplied `load` hook
     */
    type load = (url: string, context: Load.Context, nextLoad: Load.Function) => Promise<Load.Return>;

    namespace Load {
        interface Context {
            /** Export conditions of the relevant `package.json` */
            conditions: string[];
            /** The format optionally supplied by the `resolve` hook chain
             * @see {@link ModuleFormat} */
            format?: ModuleFormat | string | null;
            /** @undocumented */
            importAssertions: Record<string, unknown>; 
        }

        interface Return {
            /** The final value of `format` must be one of the following:
             * @see {@link ModuleFormat} */
            format: ModuleFormat;
            /** A signal that this hook intends to terminate the chain of `load` hooks.
             * @default false */
            shortCircuit?: boolean;
            /** The source for Node.js to evaluate
             * 
             * If the source value of a text-based format (i.e., `'json'`, `'module'`) is not a string,
             * it is converted to a string using {@linkcode https://nodejs.org/api/util.html#class-utiltextdecoder util.TextDecoder}.
             */
            source: string | ArrayBuffer | SharedArrayBuffer | Uint8Array;
        }

        /** Same as {@linkcode load} hook but without the `nextLoad` parameter. */
        type Function = (url: string, context?: Partial<Load.Context>) => Promise<Load.Return>;
    }

    /**
     * Sometimes it might be necessary to run some code inside of the same global scope that the application runs in.
     * This hook allows the return of a string that is run as a sloppy-mode script on startup.
     * 
     * Similar to how CommonJS wrappers work, the code runs in an implicit function scope.
     * The only argument is a `require`-like function that can be used to load builtins like "fs": {@linkcode getBuiltin getBuiltin(request: string)}.
     * 
     * If the code needs more advanced `require` features, it has to construct its own `require` using `module.createRequire()`.
     * @param context Information to assist the preload code
     * @returns Code to run before application startup
     */
    type globalPreload = (context: {
        /** 
         * In order to allow communication between the application and the loader,
         * another argument is provided to the preload code: `port`.
         * 
         * This is available as a parameter to the loader hook and inside of the source text returned by the hook.
         * 
         * Some care must be taken in order to properly call
         * {@linkcode https://nodejs.org/dist/latest-v17.x/docs/api/worker_threads.html#portref port.ref()} and
         * {@linkcode https://nodejs.org/dist/latest-v17.x/docs/api/worker_threads.html#portunref port.unref()}
         * to prevent a process from being in a state where it won't close normally.
         */
        port: MessagePort
    }) => string;

    /**
     * A `require`-like function that can be used to load builtins like "fs"
     * @requires - Only available inside {@linkcode globalPreload} return value scope.
     */
    type getBuiltin = (request: string) => any;
}

}
