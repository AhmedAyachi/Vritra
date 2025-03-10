import {ViewProps,View} from "../View/View";
import {VritraIcon} from "../ActionSetView/ActionSetView";


export default function TabNavigator(props:ViewProps<"div">&{
    headerClassName?:string,
    containerClassName?:string,
    tabs:TabNavigatorTab[],
    /**
     * Applied to all tabs
     * @notice can be overwritten by tab props
     * @default true
     */
    memorize?:boolean,
    activeTabId:string,
    /**
     * @default "#1e90ff"
     */
    tintColor?:string,
    /**
     * @default "#cecece"
     */
    tabTextColor?:string,
    onNavigate?(context:TabNavigatorContext):void,
}):TabNavigator;

type TabNavigator=View<"div">&{
    /**
     * 
     * @param tabId
     * @param triggerOnNavigate default: true
     */
    navigate(tabId:string,triggerOnNavigate:boolean):void;
}

type TabNavigatorContext={
    id:string,
    label:string,
    readonly tabEl:HTMLButtonElement,
    readonly contentEl:HTMLElement,
}

type TabNavigatorTab={
    id:string,
    label?:string,
    icon?:VritraIcon,
    tintColor?:string,
    /**
     * Applied to this tab only.
     * @notice Overwrites the parent prop, same as the parent prop value if undefined
     */
    memorize?:boolean,
    renderContent(props:{
        /**
         * Tab content container
         */
        parent:HTMLElement,
        context:TabNavigatorContext,
    }):HTMLElement,
}
