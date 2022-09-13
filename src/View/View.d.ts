 

export default function View(props:ViewProps):View;

type ViewProps={
    parent:HTMLElement,
    id:String,
    className:String,
    style:String,
    position:"beforebegin"|"afterbegin"|"beforeend"|"afterend",
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
}
