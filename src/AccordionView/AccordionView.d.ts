import {View,ViewProps} from "../View/View";
import {ActionSetAction} from "../ActionSetView/ActionSetView";


/**
 * 
 * @param props AccordionView props
 * @see AccordionView css variables : paddingHorizontal borderRadius
 */
export default function AccordionView(props:ViewProps<"div">&{
    /**
     * Default header title
     */
    title?:string,
    /**
     * Header container style
     */
    headerStyle?:string,
    /**
     * Content container className
     * @see when separate is true, specify a paddingTop value to get the desired behavior 
     */
    containerClassName?:string,
    /**
     * For custom header generation
     * @param container custom header container
     */
    renderHeader(container:HTMLElement):HTMLElement,
    /**
     * 
     * @param container content container
     */
    renderContent(container:HTMLElement):HTMLElement,
    /**
     * If true, renderContent is called once, using the returned HTMLElement for next renders.
     * @default true
     */
    memorize?:boolean,
    /**
     * Default header indicator icon as url/base64 string or function
     */
    indicator?:string|((color="black",weight=1)=>string),
    /**
     * Specifies if the content view will be connected to the header or not to 
     * remove header bottom border radius when open
     * @default false
     */
    separate?:boolean,
    /**
     * If true, prevents accordion opening 
     * @default false
     */
    locked?:boolean,
    /**
     * Actions of the default header ActionsSetView
     */
    actions?:ActionSetAction[],
    /**
     * title, indicator and actions color of the default header
     */
    color?:string,
    /**
     * Called when Accordion is opened
     * @param container content view container
     */
    onOpen(container:HTMLElement):void,
    /**
     * Called when Accordion is closed
     */
    onClose():void,
}):AccordionView;


//type AccordionViewProps=

interface AccordionView extends View<"div"> {
    /**
     * Locks and unlocks the accordionview
     * @param locked 
     */
    setLocked(locked:boolean):void,
    /**
     * Opens and closes the accordionview
     * @param open 
     * @default true if closed, false if open
     */
    toggle(open?:boolean):void,
}

