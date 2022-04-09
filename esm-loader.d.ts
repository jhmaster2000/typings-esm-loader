export {};

declare global {
    interface Loader {
        resolve?: resolve;
        load?: load;
        globalPreload?: globalPreload;
        [key: string]: any;
    }

    type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;

    /**
     * `format` | Description | Acceptable types for `source` returned by `load`
     * -|-|-
     * `'builtin'` | Load a Node.js builtin module | Not applicable
     * `'commonjs'` | Load a Node.js CommonJS module | Not applicable
     * `'json'` | Load a JSON file | { {@linkcode String string}, {@linkcode ArrayBuffer}, {@linkcode TypedArray} }
     * `'module'` | Load an ES module | { {@linkcode String string}, {@linkcode ArrayBuffer}, {@linkcode TypedArray} }
     * `'wasm'` | Load a WebAssembly module | { {@linkcode ArrayBuffer}, {@linkcode TypedArray} }
     */
    type ModuleFormat = 'builtin' | 'commonjs' | 'json' | 'module' | 'wasm';

    /**
     * The `resolve` hook returns the resolved file URL for a given module specifier and parent URL, and optionally its format (such as `'module'`) as a hint to the `load` hook.
     * 
     * If `resolve` provides a `format`, a custom `load` hook is required even if only to pass the value to the Node.js default `load` hook.
     * @param specifier The string in an `import` statement or `import()` expression.
     */
    type resolve = (specifier: string, context: Resolve.Context, defaultResolve: Resolve.Function) => Promise<Resolve.Return>;

    namespace Resolve {
        interface Context {
            /** An array of conditions for {@link https://nodejs.org/api/packages.html#conditional-exports package exports conditions} that apply to this resolution request.
             * 
             *  They can be used for looking up conditional mappings elsewhere or to modify the list when calling the default resolution logic. */
            conditions: string[];
            /** The URL of the module that imported this one, or `undefined` if this is the main entry point for the application. */
            parentURL: string | undefined;
            //!@upcoming importAssertions: object;
        }

        interface Return {
            /** The absolute url to the import target (such as `file://…`) */
            url: string;
            /** - See {@link ModuleFormat} */
            format?: ModuleFormat | string | null;
        }

        /**
         * @param specifier The string in an `import` statement or `import()` expression.
         */
        type Function = (specifier: string, context: Resolve.Context, resolver: Resolve.Function) => Promise<Resolve.Return>;
    }

    /**
     * The `load` hook provides a way to define a custom method of determining how a URL should be interpreted, retrieved, and parsed. It is also in charge of validating the import assertion.
     * @param context If `resolve` settled with a `format`, that value is included here.
     */
    type load = (url: string, context: Load.Context, defaultLoad: Load.Function) => Promise<Load.Return>;

    namespace Load {
        interface Context {
            /** The format optionally supplied by the `resolve` hook. See {@link ModuleFormat} */
            format: ModuleFormat | string | null | undefined; 
            //!@upcoming importAssertions: object; 
        }

        interface Return {
            /** - See {@link ModuleFormat} */
            format: ModuleFormat;
            source: string | ArrayBuffer | SharedArrayBuffer | TypedArray | Buffer;
        }

        type Function = (url: string, context: Load.Context, loader: Load.Function) => Promise<Load.Return>;
    }

    /**
     * Sometimes it might be necessary to run some code inside of the same global scope that the application runs in. This hook allows the return of a string that is run as a sloppy-mode script on startup.
     * @returns Code to run before application startup
     */
    type globalPreload = (/** @upcoming utilities: { port: MessagePort } - Things that preload code might find useful */) => string;

    /**
     * A `require`-like function that can be used to load builtins like "fs"
     * @requires - Only available inside {@linkcode globalPreload} return value scope.
     */
    type getBuiltin = (request: string) => any;
}
