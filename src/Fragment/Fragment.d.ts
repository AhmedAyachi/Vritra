import {ViewProps,View} from "../View/View";

/**
 * Experimental
 * @param props 
 */
export default function Fragment(props:FragmentProps):CherryFragment;

type FragmentProps=Pick<ViewProps,"parent"|"at">&{
    
};

interface CherryFragment extends DocumentFragment {
    /**
     * Same as View.innateHTML
     */
    innateHTML:string,
    /**
     * Inserts safely the HTML or XML markup after the last node.
     */
    beforeEndHTML:string,
    /**
     * Inserts safely the HTML or XML markup before the first node.
     */
    afterBeginHTML:string,
    /**
     * Replaces all the fragment nodes by another node and returns the substitute
     * @param substitute 
     */
    substitute<Type>(substitute:Type):Type,
    /**
     * Inserts the fragment childNodes before or after an element
     * @param element Element before/after which the view is inserted
     * @param before if true the nodes are inserted before the element otherwise after
     * @default false
     * @returns The current fragment
     */
    adjacentTo(element:Element,before?:boolean):CherryFragment,
    /**
     * Inserts nodes before the first child of the fragment
     * @param nodes 
     */
    prepend(...nodes:Node[]):void,
    /**
     * Inserts a node after the last child of the fragment
     * @param node 
     */
    appendChild<Type extends Node>(node:Type):Type;
    /**
     * Removes All fragment nodes from DOM
     */
    remove():void,
    /**
     * Returns the children
     */
    readonly childNodes:Node[];
    /**
     * Returns the child elements
     */
    readonly children:Element[];
}
