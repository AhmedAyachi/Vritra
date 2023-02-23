import {View,ViewProps} from "../View/View";

/**
 * 
 * @param props ActionSetView props
 * @see CSS variables : spacing
 */
export default function ActionSetView(props:ViewProps&{
    actions:ActionSetAction[],
    /**
     * ActionSet Actions Icons color
     */
    color?:string,
}):ActionSetView;


interface ActionSetView extends View {

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
    icon:string|((color:string,weight=2)=>string),
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
        element:ActionSetActionElement|HTMLElement,
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
    setIcon(icon:string|((color:string,weight=2)=>string),save=true):void,
}
