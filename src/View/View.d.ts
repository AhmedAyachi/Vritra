 

export default function View(props:{
    parent:HTMLElement,
    id:String,
    className:String,
    style:String,
    position:"beforebegin"|"afterbegin"|"beforeend"|"afterend",
}):View;

interface View extends HTMLDivElement {
    /**
     * Sets the HTML or XML markup contained at the end of the element.
     */
    beforeEndHTML:string,
}
