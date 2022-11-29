 

export default function View(props:ViewProps):View;

type ViewProps={
    parent:HTMLElement,
    id:String,
    className:String,
    style:String,
    position:"afterbegin"|"beforeend",
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
     * @param element element before which the view is inserted 
     */
    addBefore(element:Element):View,
    /**
     * @param element element after which the view is inserted 
     */
    addAfter(element:Element):View,
    /**
     * Replaces the view by another node and returns the substitute
     * @param substitute 
     */
    substitute<type>(substitute:type):type,
}
