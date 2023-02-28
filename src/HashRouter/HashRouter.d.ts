

export function HashRouter(props:{
    target:HTMLElement,
    routes:[{
        hash:String,
        memorize:boolean,
        restrictor:(unlock:(unlocked:boolean)=>void,target:HTMLElement)=>void,
        onLoaded(context:HashRouteContext&{target:HTMLElement}):void,
        component(props:HashRouteContext&{parent:HTMLElement}):HTMLElement,
    }],
    /**
     * If true, the HashRouter is accessible in the global scope via window.HashRouter
     * 
     * If you want to create multiple HashRouters for multiple targets, only one should be global
     * @default true
     */
    globalize:boolean,
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

type HashRouteContext={
    data?:Object,
    params?:Object,
    location:{
        hash:string,
        url:string,
    },
}
