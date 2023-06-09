 

export default function View<Tag extends keyof HTMLElementTagNameMap|undefined=undefined>(props:ViewProps<Tag>):Tag extends undefined?View<"div">:View<Tag>;

type ViewProps<Tag>={
    parent?:HTMLElement,
    /**
     * @default useId("view")
     */
    id?:String,
    className?:String,
    style?:String,
    /**
     * @default "div"
     */
    tag?:Tag,
    /**
     * Sets the element initial location.
     * 
     * start : at the beginning of the parent
     * 
     * end : at the end of the parent
     * @default "end"
     * @see For between-elements insertion, use adjacentTo method
     */
    at?:"start"|"end";
};

type View<Tag>=(Tag extends keyof HTMLElementTagNameMap?HTMLElementTagNameMap[Tag]:HTMLDivElement)&{
    /**
     * Sets safely the HTML or XML markup contained within the element.
     * 
     * Removes script/style elements.
     * 
     * Removes any element that has at least one attribute starting with "on".
     * 
     * Removes any element whose style attribute containes "javascript:"
     * 
     * Removes any element whose href attribute does not start with ["http:","https:","data:","m-files:","file:","ftp:","mailto:","pw:"]
     * @see Safer version of innerHTML
     */
    innateHTML:string,
    /**
     * Inserts safely the HTML or XML markup at the end of the element.
     */
    beforeEndHTML:string,
    /**
     * Inserts safely the HTML or XML markup at the beginning of the element.
     */
    afterBeginHTML:string,
    /**
     * Replaces the view by another node and returns the substitute
     * @param substitute 
     */
    substitute<type>(substitute:type):type,
    /**
     * Inserts the view before or after an element
     * @param element Element before/after which the view is inserted
     * @param before if true the view is inserted before the element otherwise after
     * @default false
     * @returns The current view
     */
    adjacentTo(element:Element,before?:boolean):View<Tag>,
    /**
     * @param element Element before which the view is inserted 
     * @returns The current view
     * @deprecated
     */
    addBefore(element:Element):View<Tag>,
    /**
     * @param element Element after which the view is inserted 
     * @returns The current view
     * @deprecated
     */
    addAfter(element:Element):View<Tag>,
}

type ExtendableViewProps<Tag>=Omit<ViewProps<Tag>,"tag">
