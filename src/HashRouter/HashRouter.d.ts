
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
         * Route hash
         * @example "#one"
         * @for hash params use "#:"
         * @examples
         * 1) #:something
         * 2) #things#:name
         * @for nested hash params, just add more params, like this :
         * @#categry#:things#:name
         */
        hash:string,
        /**
         * Hash param matches, will rerender anyway if any of the params value changes.
         * @default false
         */
        memorize?:boolean,
        restrictor?:(unlock:(unlocked:boolean)=>void,target:HTMLElement)=>void,
        component(props:HashRouteComponentProps):HashRouteElement|Promise<HashRouteElement>,
    }[],
}):HashRouter;
 
interface HashRouter {
    /**
     * Adds an entry to the browser's session history stack 
     * @param hash 
     * @param data Data object to pass to the new route component
     */
    push(hash:string,data:object):void,
    /**
     * Appends the hash to the end of the current hash
     * @param hash Hash to append
     * @param data Data object to pass to the new route component
     */
    append(hash:string,data:object):void,
    /**
     * Replaces the current history entry
     * @param data Data object to pass to the new route component
     */
    replace(hash:string,data:object):void,
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
    params:object,
    location:{
        hash:string,
        url:string,
    },
}
