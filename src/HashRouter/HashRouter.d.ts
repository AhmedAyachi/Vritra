
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
         * @deprecated use path instead
         */
        hash:string,
        /**
         * Will rerender anyway if any of the params value changes.
         * @default false
         */
        memorize?:boolean,
        restrictor?:(unlock:(unlocked:boolean)=>void,target:HTMLElement)=>void,
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
    push(path:string,data:object):void,
    /**
     * Appends the path to the end of the current path
     * @param path Hash to append
     * @param data Data object to pass to the new route component
     */
    append(path:string,data:object):void,
    /**
     * Replaces the current history entry
     * @param data Data object to pass to the new route component
     */
    replace(path:string,data:object):void,
    /**
     * Rerenders the current route even if memorize true is specified
     */
    refresh():void,
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
        path:string,
        url:string,
    },
}
