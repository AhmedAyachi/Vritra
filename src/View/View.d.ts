 

export default function View<Tag extends keyof HTMLElementTagNameMap|undefined=undefined>(props:ViewProps<Tag>):Tag extends undefined?View<"div">:View<Tag>;

type ViewProps<Tag>=VritraProps&{
    id?:string,
    className?:ViewClassName,
    style?:ViewStyle,
    /**
     * @default "div"
     */
    tag?:Tag,
};
type View<Tag>=VritraElement&
    (Tag extends keyof HTMLElementTagNameMap?HTMLElementTagNameMap[Tag]:HTMLDivElement)&
    {[ref:string]:RefElement}&
    Pick<RefElement,"onClick">
;
type Falsy=false|null|undefined|0|"";
type ViewClassName=string|Falsy|ViewClassName[];
type ViewStyle=string|CSSStyleDeclaration|Falsy|ViewStyle[];

interface VritraProps {
    parent?:HTMLElement,
    /**
     * Sets the element initial location.
     * @example 
     * "end" //at the end of the parent
     * "start" //at the beginning of the parent
     * number //to specifiy the index 
     * @notice For between-elements insertion, use adjacentTo method
     */
    at?:"start"|"end"|number;
}

interface VritraElement {
    /**
     * Sets safely the HTML or XML markup contained within the element.
     * 
     * Removes script/style elements, 
     * any element that has at least one attribute starting with "on", 
     * whose style attribute containes "javascript:", 
     * whose href attribute does not start with "http:","https:","data:","m-files:","file:","ftp:","mailto:","tel:","pw:".
     * @notice Safer version of innerHTML
     */
    innateHTML:string;
    /**
     * Inserts safely the HTML or XML markup at the end of the element.
     */
    beforeEndHTML:string;
    /**
     * Inserts safely the HTML or XML markup at the beginning of the element.
     */
    afterBeginHTML:string;
    /**
     * Replaces the element by another node and returns the substitute
     * @param substitute 
     * @notice only use it when the element is no longer required and it's not gonna be cached for later use
     */
    substitute<Type>(substitute:Type):Type;
    /**
     * Inserts the view before or after an element
     * @param element Element before/after which the view is inserted
     * @param before if true the view is inserted before the element otherwise after
     * @default false
     * @returns The current view
     */
    adjacentTo(element:Element,before?:boolean):this;
    /**
     * Returns a list of the first element-descendants of node that match every single selector.
     * @param selectors 
     */
    queryAllSelectors(...selectors:string):Element[];
}

/**
 * If the ref is defined, the property points to the HTML element
 * with such ref else undefined
 */ 
type RefElement=HTMLElementTagNameMap[keyof HTMLElementTagNameMap]&{
    /**
     * Prevents successive fast clicks to be all triggered
     */
    onClick:(event:PointerEvent)=>void;
    /** Overrides the remove method and deletes the reference to the element */
    remove():void;
}

type ExtendableViewProps<Tag>=Omit<ViewProps<Tag>,"tag">;
