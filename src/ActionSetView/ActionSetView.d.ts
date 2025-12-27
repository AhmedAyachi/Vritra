import {View,ExtendableViewProps} from "../View/View";

/**
 * 
 * @param props ActionSetView props
 * @notice CSS variables : spacing
 */
export default function ActionSetView(props:ExtendableViewProps<"div">&{
    /**
     * overwrites a definition properties if found.
     * @notice
     * If an action is of type string, that string needs to be one of the definitions id.
     *
     * If an action is an object, it needs to have at least either an id or a ref value that matches one of the definitions ids.
     *
     * If an action id matches a definition id, no need for providing a ref value bacause that id is used as a ref.
     */
    actions:(ActionSetAction|string)[],
    definitions?:ActionSetDefinition[],
    /**
     * Function-icon color param value
     * @default "black"
     */
    tintColor?:string,
    /**
     * @deprecated renamed to tintColor
     */
    color?:string,
}):ActionSetView;


type ActionSetView=View<"div">&{

}

interface ActionSetAction extends ActionSetDefinition {
    /**
     * Should match an id of a defined action.
     */
    ref?:string,
}

interface ActionSetDefinition {
    /**
     * Action id. Required
     */
    id?:string,
    /**
     * For a custom action component.
     * @returns action HTMLElement
     * @notice none of the provided customization options 
     * are applied to the element when this option is used.
     */
    component?:(props:ActionSetDefinition&{parent:ActionSetView})=>HTMLElement,
    /**
     * Action icon as url, base64 string or function
     */
    icon?:VritraIcon,
    /**
     * Action label
     */
    label?:string,
    /**
     * Action image element alt attribute value
     * @deprecated use iconAlt instead
     */
    alt?:string,
    /**
     * Action img element alt attribute value
     * @default action id
     */
    iconAlt?:string,
    /**
     * Action size
     * @unit em
     * @default 6.4 
     */
    size?:number,
    /**
     * the icon function param value and label color.
     * @default tintColor
     */
    color?:string,
    /**
     * for custom styling.
     */
    style?:CSSStyleDeclaration,
    /**
     * Called when the action HTMLElement is ready to click on
     * @param action the action object
     */
    onReady?(action:ActionSetDefinition&{
        element:ActionSetDefinitionElement,
    }):void,
    /**
     * Called when the action HTMLElement clicked
     * Not triggered when action created with component prop
     * @param action the action object
     * @param event the pointer event object
     */
    onTrigger?(action:ActionSetDefinition&{
        element:ActionSetDefinitionElement,
    },event:PointerEvent):void,
}

interface ActionSetDefinitionElement extends HTMLDivElement {
    /**
     * Not available for custom actions
     * @param icon default to action.icon
     * @notice you can just edit the img element src yourself, but this method 
     * will make sure that your code keeps behaving the same way independently of package versions.
     */
    setIcon(icon?:VritraIcon):void,
    setLabel(label?:string):void,
}

type VritraIcon=string|((
    color?:string,
    /**
     * @default 2
     */
    weight?:number,
)=>string);
