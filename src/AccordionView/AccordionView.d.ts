import {View,ExtendableViewProps} from "../View/View";
import {ActionSetAction,NativeIcon} from "../ActionSetView/ActionSetView";


/**
 * 
 * @param props AccordionView props
 * @notice AccordionView css variables : paddingHorizontal borderRadius
 */
export default function AccordionView(props:ExtendableViewProps<"div">&{
    /**
     * Default header title
     */
    title?:string,
    /**
     * Header container className
     */
    headerClassName?:string,
    /**
     * Content container className
     * @notice when separate is true, specify a paddingTop value to get the desired behavior 
     */
    containerClassName?:string,
    renderHeader(props:{
        /** custom header container */
        parent:HTMLElement,
    }):HTMLElement,
    renderContent(props:{
        /** content container */
        parent:HTMLElement,
    }):HTMLElement,
    /**
     * If true, renderContent is called once, using the returned HTMLElement for next renders.
     * @default true
     */
    memorize?:boolean,
    /**
     * Default header indicator icon as url/base64 string or function
     */
    indicator?:NativeIcon,
    /**
     * Specifies if the content view will be connected to the header or not to 
     * remove header bottom border radius when open
     * @default false
     */
    separate?:boolean,
    /**
     * If true, prevents accordion opening via user interaction
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

interface AccordionView extends View<"div"> {
    /**
     * Locks and unlocks the accordionview
     * @param locked default to false
     */
    setLocked(locked:boolean):void,
    /**
     * Opens and closes the accordionview
     * @param open 
     * @default true if closed, false if open
     */
    toggle(open?:boolean):void,
}

