import {View,ExtendableViewProps} from "../View/View";

/**
 * 
 * @param props ActionSetView props
 * @see CSS variables : spacing
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
    icon:CherryIcon,
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
     * Called when action clicked
     * 
     * Not triggered when action created with component prop
     * @param action this object with element property
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
     * @see you can just edit the img element src yourself, but this method will make sure that your code
     * keeps behaving the same way independently of package versions.
     */
    setIcon(icon:CherryIcon,save?:boolean):void,
}

type CherryIcon=string|((
    color?:string,
    /**
     * @default 2
     */
    weight?:number,
)=>string);
