import {View,ExtendableViewProps} from "../View/View";

/**
 * 
 * @param props ActionSetView props
 * @notice CSS variables : spacing
 */
export default function ActionSetView(props:ExtendableViewProps<"div">&{
    actions:ActionSetAction[],
    /**
     * Function-icon color param value
     */
    color?:string,
}):ActionSetView;


interface ActionSetView extends View<"div"> {

}

export type ActionSetAction={
    /**
     * Action id. Required
     */
    id:string,
    /**
     * Used to add custom action component 
     * @returns action HTMLElement
     */
    component:(props:ActionSetAction&{parent:ActionSetView})=>HTMLElement,
    /**
     * Action icon as url, base64 string or function
     */
    icon:NativeIcon,
    /**
     * Action icon size
     * @unit em
     * @default 6.4
     */
    size:number,
    /**
     * Action image element alt attribute value
     */
    alt:string,
    /**
     * Called when the action HTMLElement is ready to click on
     * @param action the action object
     */
    onReady(action:ActionSetAction&{
        element:ActionSetActionElement,
        /**
         * The color prop value
         */
        color:string,
    }):void,
    /**
     * Called when the action HTMLElement clicked
     * Not triggered when action created with component prop
     * @param action the action object
     */
    onTrigger(action:ActionSetAction&{
        element:ActionSetActionElement,
        /**
         * The color prop value
         */
        color:string,
    }):void,
};

interface ActionSetActionElement extends HTMLDivElement {
    /**
     * Not available for custom actions
     * @param icon 
     * @param save if true, sets the action.icon property, default false
     * @notice you can just edit the img element src yourself, but this method will make sure that your code
     * keeps behaving the same way independently of package versions.
     */
    setIcon(icon:NativeIcon,save?:boolean):void,
}

type NativeIcon=string|((
    color?:string,
    /**
     * @default 2
     */
    weight?:number,
)=>string);
