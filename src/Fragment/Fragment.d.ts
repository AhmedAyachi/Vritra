import {RefElement,VritraProps,VritraElement} from "../VritraElement/VritraElement";


export default function Fragment(props:FragmentProps):Fragment;

interface FragmentProps extends VritraProps {
    
}

type Fragment=(
    Omit<DocumentFragment,
        "append"|"prepend"|"appendChild"|
        "remove"|"querySelectorAll"|
        "childNodes"|"children"|"parentNode"
    >&
    Omit<VritraElement,"onClick">&IFragment&{
        [ref:string]:RefElement,
    }
)


interface IFragment {
    /**
     * Inserts nodes after the last child of the fragment.
     * @param nodes 
     */
    append(...nodes:Node[]):void;
    /**
     * Inserts nodes before the first child of the fragment.
     * @param nodes 
     */
    prepend(...nodes:Node[]):void;
    /**
     * Inserts a node after the last child of the fragment.
     * @param node 
     */
    appendChild<Type extends Node>(node:Type):Type;
    /**
     * Removes All fragment nodes from DOM.
     */
    remove():void,
    /**
     * Returns all element descendants of node that match the selector.
     */
    querySelectorAll(selector:string):Element[];
    /**
     * Returns the children
     */
    readonly childNodes:Node[];
    /**
     * Returns the child elements
     */
    readonly children:Element[];
    /**
     * Returns the fragment's parent node else null
     */
    readonly parentNode:ParentNode;

    readonly nextElementSibling:Element;
    readonly previousElementSibling:Element;
    /**
     * Inserts the fragment childNodes before or after an element
     * @param element Element before/after which the nodes are inserted
     * @param before if true the nodes are inserted before the element otherwise after
     * @default false
     * @returns The current fragment
     */
    adjacentTo(element:Element,before?:boolean):this,
    /**
     * Inserts the fragment nodes before the first child of the new parent
     * @param newParent
     * @ should be used instead of newParent.prepend(fragment)
    */
    prependTo(newParent:HTMLElement):void,
    /**
     * Inserts the fragment nodes after the last child of the new parent
     * @param newParent 
     * @notice should be used instead of newParent.append(fragment)
    */
    appendTo(newParent:HTMLElement):void,
    /**
     * Inserts nodes at index
     * @param nodes 
     */
    insertAt(index:number,...nodes:Node[]):void;
}
