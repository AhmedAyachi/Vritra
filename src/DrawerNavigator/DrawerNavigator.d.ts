import {ExtendableViewProps,View} from "../View/View";


export default function DrawerNavigator(props:ExtendableViewProps<"div">&{
    /**
     * Header container className
     */
    headerClassName?:string,
    /**
     * Route component container className
     */
    containerClassName?:string,
    drawerClassName?:string,
    routes:DrawerNavigatorRoute[],
    /**
     * First chosen route id
     * @default routes[0].id
     */
    initialId?:string,
    /**
     * Hexadecimal format required
     * @default "#1e90ff"
     */
    tintColor?:string,
    /**
     * For custom header generation
     * @param container custom header container
     */
    renderHeader(props:{parent:HTMLElement,route:DrawerNavigatorRoute}):HTMLElement,
}):DrawerNavigator;

interface DrawerNavigator extends View<"div"> {
    /**
     * Shows the drawer view
     */
    showDrawer():void,
    /**
     * Shows a specific route programmatically
     * @param routeId 
     */
    navigate(routeId:string):void,
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
