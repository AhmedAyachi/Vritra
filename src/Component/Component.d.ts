 

export default class Component {
    constructor(props:{
        parent:Component|HTMLElement,
        id:String,
        className:String,
        style:String,
        position:InsertPosition,
    }):Component;
    /**
    * Component's DOM element
    */
    element:HTMLElement;
    /**
     * Parent element of the component's element
     */
    parentNode:HTMLElement;
    /**
     * Returns the first element that is a descendant of node that matches selector
     */
    querySelector(selector:String):HTMLElement;
    /**
     * Returns all element descendants of node that match selector
     */
    querySelectorAll(selector:String):HTMLElement[];
    insertAdjacentHTML(position:InsertPosition,html:String):void;
    insertAdjacentElement(position:InsertPosition,node:Element):Element|null;
    /**
     * Replaces node with nodes, while replacing strings in nodes with equivalent Text nodes.
     * Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated
     */
    replaceWith(...nodes:(string|Node)[]):void;
    /**
     * Removes element
     */
    remove():void;
    /**
     * Sets the HTML or XML markup inside the element 
     */
    innerHTML:String;
    /**
     * Appends HTML or XML markup to the end of the element.
     */
    beforeEndHTML:string;
};
