import {View,ViewProps} from "../View/View";

/**
 * 
 * @param props ActionSetView props
 * @see CSS variables : spacing
 */
export default function ActionSetView(props:ViewProps&{
    actions:ActionSetActionProp[],
    /**
     * ActionSet Actions Icons color
     */
    color?:string,
}):ActionSetView;


interface ActionSetView extends View {

}

export type ActionSetActionProp={
    /**
     * Action id. Required
     */
    id:string,
    /**
     * Used to add custom action component 
     * @returns action HTMLElement
     */
    component:(props:ActionSetActionProp&{parent:ActionSetView})=>HTMLElement,
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
    onTrigger(action:ActionSetActionProp&{element:HTMLElement}):void,
};
