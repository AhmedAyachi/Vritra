
/**
 * A HashRouter with nested hash params support
 * Only one route is shown at a time
 * 
 * Prioritizes exact matches
 * 
 * If more than one route matches the hash, the first one is picked
 * @param options HashRouter options
 */
export function HashRouter(options:{
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
         * @deprecated use path instead with "/" as a separator
         */
        hash:string,
        /**
         * Will rerender anyway if any of the params value changes.
         * @default false
         */
        memorize?:boolean,
        /**
         * If defined, either unlock or redirect must be called.
         * @param context 
         * @returns 
         */
        restrictor?:(context:{
            data?:object,
            params?:[string:string],
            target:HTMLElement,
            /**
             * Unlocks the route.
             */
            unlock():void,
            /**
             * 
             * @param to default to ""
             * @param data default to undefined
             */
            redirect(to?:string,data?:any):void;
        })=>void,
        component(props:HashRouteComponentProps):HashRouteElement|Promise<HashRouteElement>,
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
    push(path:string,data?:object):void,
    /**
     * Appends the path to the end of the current path
     * @param path Hash to append
     * @param data Data object to pass to the new route component
     */
    append(path:string,data?:object):void,
    /**
     * Replaces the current history entry
     * @param data Data object to pass to the new route component
     */
    replace(path:string,data?:object):void,
    /**
     * Rerenders the current route even if memorize true is specified
     */
    refresh():void,
    /**
     * Causes the browser to move back one page in the session history.
     */
    back(data?:object):void,
    /**
     * Resets all routes.
     */
    reset():void,
}

interface HashRouteElement extends HTMLElement {
    onShow():void,
    onHide():void,
}

interface HashRouteComponentProps {
    parent:HTMLElement,
    data?:object,
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
