import {View,ExtendableViewProps} from "../View/View";
import {ActionSetAction,VritraIcon} from "../ActionSetView/ActionSetView";


type RendererType<R=HTMLElement>=(props:{parent:HTMLElement})=>R;
/**
 * 
 * @param props Accordion props
 * @notice CSS Variables: paddingHorizontal borderRadius
 */
export default function Accordion<
    HeaderRenderer extends RendererType,
    ContentRenderer extends RendererType,
>(props:AccordionProps<HeaderRenderer,ContentRenderer>):Accordion<
    ReturnType<HeaderRenderer>,
    ReturnType<ContentRenderer>
>;

type AccordionProps<
    HeaderRenderer extends RendererType,
    ContentRenderer extends RendererType,
>=ExtendableViewProps<"section">&{
    /**
     * Default header title.
     */
    title?:string,
    /**
     * Header container className.
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
     * @param container content view container
     */
    onClose?(container:HTMLElement):void,
}

//type ContentType=ReturnType<AccordionProps["renderContent"]>;

type Accordion<HeaderType,ContentType>=View<"section">&{
    /**
     * Locks and unlocks the accordion.
     * @param locked default to false
     * @deprecated use the isLocked setter
     */
    setLocked(locked:boolean):void,
    /**
     * Locks and unlocks the accordion.
     * @default false
     * @notice isLocked does not close the accordion as 
     * the deprecated setLocked does.
     */
    isLocked:boolean,
    /**
     * Opens and closes the accordion
     * @param open 
     * @default true if closed, false if open
     */
    toggle(open?:boolean):void,
    readonly isOpen:boolean,
    /**
     * Gets the element returned by renderHeader
     */
    readonly header:HeaderType,
    /**
     * Gets the element returned by renderContent
     */
    readonly content:ContentType|null,
}

