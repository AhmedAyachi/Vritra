import {ViewProps,View} from "../View/View";


export default function DrawerNavigator(props:ViewProps&{
    /**
     * Header container className
     */
    headerClassName?:string,
    /**
     * Route component container className
     */
    containerClassName?:string,
    routes:DrawerNavigatorRoute[],
    /**
     * First chosen route id
     * @default routes[0].id
     */
    initialId?:string,
}):DrawerNavigator;

interface DrawerNavigator extends View {
    
}

type DrawerNavigatorRoute={
    /**
     * Route id, required
     */
    id:string,
    /**
     * Route header title. If title is undefined, the id value is used.
     */
    title?:string,
    /**
     * If true, the route is rendered once, using the HTMLElement returned by the component property for next renders.
     * 
     * Useful when the route is static (returns the same UI everytime).
     * @default true
     */
    memorize?:boolean,
    component:(props:{
        /**
         * Route component container
         */
        parent:HTMLElement,
    })=>HTMLElement,
}
