
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
             * @param to default to ""
             * @param data default to undefined
             */
            redirect(to?:string,data?:any):void;
        })=>void|Promise<void>,
        /**
         * @deprecated use guard instead
         */
        restrictor:(
            unlock:(unlocked:boolean)=>any,
            target:HTMLElement,
        )=>void,  
    }[],
    fallbackRoute?:{
        memorize?:boolean,
        component(props:HashRouteComponentProps):HashRouteElement|Promise<HashRouteElement>,
    },
}):HashRouter;
 
interface HashRouter {
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
    location:{
        /**
         * An URL pathname, beginning with "/".
         */
        pathname:string,
        /**
         * The current url path, beginning with "/".
         */
        path:string,
        /**
         * The full url.
         */
        url:string,
        /**
         * An URL fragment identifier, beginning with "#".
         */
        hash:string,
        /**
         * An URL search string, beginning with "?".
         */
        search:string,
    },
}
