import {View,ExtendableViewProps} from "../View/View";
import {ActionSetAction,VritraIcon} from "../ActionSetView/ActionSetView";


/**
 * @deprecated renamed to Accordion
 */
export function AccordionView<HeaderRenderer extends RendererType,ContentRenderer extends RendererType>(props:AccordionProps<HeaderRenderer,ContentRenderer>):Accordion<ExtractRendererType<HeaderRenderer>,ExtractRendererType<ContentRenderer>>;

type RendererType=(props:{parent:HTMLElement})=>any;
type ExtractRendererType<T>=T extends (props:{parent:HTMLElement})=>infer R?R:null;

/**
 * 
 * @param props Accordion props
 * @notice Accordion css variables : paddingHorizontal borderRadius
 */
export default function Accordion<HeaderRenderer extends RendererType,ContentRenderer extends RendererType>(props:AccordionProps<HeaderRenderer,ContentRenderer>):Accordion<ExtractRendererType<HeaderRenderer>,ExtractRendererType<ContentRenderer>>;

type AccordionProps<HeaderRenderer,ContentRenderer>=ExtendableViewProps<"div">&{
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
    renderHeader?:HeaderRenderer,
    renderContent?:ContentRenderer,
    /**
     * If true, renderContent is called once, using the returned HTMLElement for next renders.
     * @default true
     */
    memorize?:boolean,
    /**
     * Default header indicator icon as url/base64 string or function
     */
    indicator?:VritraIcon,
    /**
     * @default false
     */
    open?:boolean,
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
    tintColor?:string,
    /**
     * title, indicator and actions color of the default header
     * @deprecated use tintColor instead
     */
    color?:string,
    /**
     * Called when Accordion is opened
     * @param container content view container
     */
    onOpen?(container:HTMLElement):void,
    /**
     * Called when Accordion is closed
     */
    onClose?():void,
}

//type ContentType=ReturnType<AccordionProps["renderContent"]>;

type Accordion<HeaderRenderer,ContentType>=View<"div">&{
    /**
     * Locks and unlocks the accordion
     * @param locked default to false
     */
    setLocked(locked:boolean):void,
    /**
     * Opens and closes the accordion
     * @param open 
     * @default true if closed, false if open
     */
    toggle(open?:boolean):void,
    /**
     * Gets the element returned by renderHeader
     */
    readonly header:HeaderRenderer|null;
    /**
     * Gets the element returned by renderContent
     */
    readonly content:ContentType|null;
}

