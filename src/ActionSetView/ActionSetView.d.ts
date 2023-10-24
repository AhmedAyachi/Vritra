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
    definitions?:ActionSetDefinition[]
    /**
     * Function-icon color param value
     */
    color?:string,
}):ActionSetView;


interface ActionSetView extends View<"div"> {

}

interface ActionSetAction extends ActionSetDefinition {
    /**
     * an id of a defined action
     */
    ref:string,
}

interface ActionSetDefinition {
    /**
     * Action id. Required
     */
    id:string,
    /**
     * Used to add custom action component 
     * @returns action HTMLElement
     */
    component:(props:ActionSetDefinition&{parent:ActionSetView})=>HTMLElement,
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
    onReady(action:ActionSetDefinition&{
        element:ActionSetDefinitionElement,
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
    onTrigger(action:ActionSetDefinition&{
        element:ActionSetDefinitionElement,
        /**
         * The color prop value
         */
        color:string,
    }):void,
};

interface ActionSetDefinitionElement extends HTMLDivElement {
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
