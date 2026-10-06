
/**
 * A HashRouter with nested hash params support
 * Only one route is shown at a time
 * 
 * Prioritizes exact matches
 * 
 * If more than one route matches the hash, the first one is picked
 * @param options HashRouter options
 */
export default function HashRouter(options:{
    /**
     * Element to insert the route component element in
     */
    target:HTMLElement,
    routes:{
        /**
         * Route path
         * @example "/one"
         * @for hash params use "/:"
         * @examples
         * 1) /:something
         * 2) /things/:name
         * 
         * for nested hash params, just add more params, like this :
         * 
         * /categry/:things/:name
         */
        path:string,
        /**
         * Will rerender anyway if any of the params value changes.
         * @default false
         */
        memorize?:boolean,
        component(props:HashRouteComponentProps):HashRouteElement|Promise<HashRouteElement>,
        /**
         * If defined, either allow or redirect must be called.
         */
        guard?:(context:{
            data?:any,
            params?:[string:string],
            target:HTMLElement,
            /**
             * allows navigation to the route.
             */
            allow():void,
            /**
             * 
             * @param to
             * use null to redirect to previous route
             * @default null
             * @param data default to undefined
             */
            redirect(to?:string|null,data?:any):void;
        })=>void|Promise<void>,
    }[],
    fallbackRoute?:{
        memorize?:boolean,
        component(props:HashRouteComponentProps):HashRouteElement|Promise<HashRouteElement>,
    },
}):HashRouter;
 
interface HashRouter {
    
    readonly location:HashRouterLocation,

    getUrlParams():{[key:string]:string},
    /**
     * Adds an entry to the browser's session history stack 
     * @param path 
     * @param data Data object to pass to the new route component
     */
    push(path:string,data?:any):void,
    /**
     * Appends the path to the end of the current path
     * @param path Hash to append
     * @param data Data object to pass to the new route component
     */
    append(path:string,data?:any):void,
    /**
     * Replaces the current history entry
     * @param data Data object to pass to the new route component
     */
    replace(path:string,data?:any):void,
    /**
     * Rerenders the current route even if memorize true is specified
     */
    refresh():void,
    /**
     * Causes the browser to move back one page in the session history.
     */
    back(data?:any):void,
    /**
     * Resets all routes.
     */
    reset():void,
}

interface HashRouteElement extends HTMLElement {
    onShow(context:HashRouterContext):void,
    onHide():void,
}

interface HashRouteComponentProps extends HashRouterContext {
    parent:HTMLElement,
}

interface HashRouterContext {
    data?:any,
    params?:[string:string],
    location:HashRouterLocation,
}

type HashRouterLocation={
    /**
     * An URL pathname, beginning with "/".
     */
    readonly pathname:string,
    /**
     * The current url path, beginning with "/".
     */
    readonly path:string,
    /**
     * The full url.
     */
    readonly url:string,
    /**
     * An URL fragment identifier, beginning with "#".
     */
    readonly hash:string,
    /**
     * An URL search string, beginning with "?".
     */
    readonly search:string,
    readonly searchParams:{[key:string]:string},
}
