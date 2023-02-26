 

export default function View(props:ViewProps):View;

type ViewProps={
    parent:HTMLElement,
    id?:String,
    className?:String,
    style?:String,
    /**
     * top : same as afterbegin
     * 
     * bottom : same as beforeend
     * @default "beforeend"
     * @see
     * For between-elements insertion, use addBefore/addAfter methods
     */
    position?:"afterbegin"|"beforeend"|"top"|"bottom",
}

interface View extends HTMLDivElement {
    /**
     * Inserts the HTML or XML markup at the end of the element.
     */
    beforeEndHTML:string,
    /**
     * Inserts the HTML or XML markup at the beginning of the element.
     */
    afterBeginHTML:string,
    /**
     * Sets the HTML or XML markup contained within the element.
     */
    innateHTML:string,
    /**
     * @param element Element before which the view is inserted 
     * @returns The current view
     */
    addBefore(element:Element):View,
    /**
     * @param element Element after which the view is inserted 
     * @returns The current view
     */
    addAfter(element:Element):View,
    /**
     * Replaces the view by another node and returns the substitute
     * @param substitute 
     */
    substitute<type>(substitute:type):type,
}
