import {findItem} from "../index";
import HtmlSanitizer from "../HtmlSanitizer";


class VritraFragment extends DocumentFragment {
    #parent;#at;
    #nodes=[];

    constructor(props={}){
        super(props);
        this.#parent=props.parent||null;
        this.#at=props.at;
    }

    set innateHTML(html){
        if(this.#nodes?.length){
            const nodes=this.#getNodes();
            if(nodes.length){
                for(const node of nodes){node.remove()};
            }
        }
        this.#nodes=[];
        this[this.#at==="start"?"afterBeginHTML":"beforeEndHTML"]=html;
    }

    set beforeEndHTML(html){
        const sanitizedEl=HtmlSanitizer.sanitizeHtml(html,this);
        if(sanitizedEl){
            const childNodes=[...sanitizedEl.childNodes];
            this.append(...childNodes);
        }
    }

    set afterBeginHTML(html){
        const sanitizedEl=HtmlSanitizer.sanitizeHtml(html,this);
        if(sanitizedEl){
            const childNodes=[...sanitizedEl.childNodes];
            this.prepend(...childNodes);
        }
    }

    adjacentTo(element,before){
        if(element instanceof Element){
            const firstChild=this.firstChild;
            if(firstChild){
                this.#parent=element.parentNode;
                element[before?"before":"after"](firstChild);
                const nodes=this.#nodes,{length}=nodes;
                for(let i=1;i<length;i++){
                    nodes[i-1].after(nodes[i]);
                }
            }
        }
        else{
            throw "first param is not of type Element";
        }
        return this;
    }

    substitute(element){
        const firstChild=this.firstChild;
        if(firstChild){
            firstChild.replaceWith(element);
            this.remove();
        }
        return element;
    }

    remove(){
        const nodes=this.#getNodes();
        this.#parent=null;
        const {length}=nodes;
        for(let i=0;i<length;i++){
            const node=nodes[i];
            super.appendChild(node);
        }
    }

    prepend(...newNodes){
        const firstNode=this.firstChild;
        this.#nodes.unshift(...newNodes);
        const parent=this.#parent;
        for(const node of newNodes){
            if(parent){this.insertBefore(node,firstNode)}
            else{super.insertBefore(node,firstNode)};
        }
    }

    append(...newNodes){
        const lastNode=this.lastChild;
        this.#nodes.push(...newNodes);
        const {length}=newNodes,parent=this.#parent;
        for(let i=0;i<length;i++){
            const node=newNodes[i];
            const prevNode=i?newNodes[i-1]:lastNode;
            if(parent){parent.insertBefore(node,prevNode?.nextSibling)}
            else{super.insertBefore(node,prevNode?.nextSibling)};
        }   
    }

    insertBefore(newNode,refNode=null){
        const nodes=this.#getNodes(),noRefNode=!refNode;
        const refNodeIndex=refNode&&nodes.indexOf(refNode);
        if(noRefNode||(refNodeIndex>-1)){
            if(noRefNode){refNode=nodes[nodes.length-1]?.nextSibling};
            if(noRefNode){nodes.push(newNode)}
            else{nodes.splice(refNodeIndex,0,newNode)}
            const parent=this.#parent;
            if(parent){parent.insertBefore(newNode,refNode)}
            else{super.insertBefore(newNode,refNode)};
        }
        else{
            throw new DOMException("Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node");
        }
    }
    
    appendChild(node){
        if(node instanceof Node){
            const nodes=this.#getNodes(),parent=this.#parent||this;
            nodes.push(node);
            parent.insertBefore(node,this.lastNode?.nextSibling);
            return node;
        }
        else{
            throw "parameter is not of type Node";
        }
    }

    prependTo(element){
        if(element instanceof HTMLElement){
            if(element!==this.#parent){
                this.#parent=element;
                const nodes=this.#getNodes();
                element.prepend(...nodes);
            }
        }
        else{
            throw "Can't append a fragment to a none HTMLElement"
        }
    }
     
    appendTo(element){
        if(element instanceof HTMLElement){
            if(element!==this.#parent){
                this.#parent=element;
                const nodes=this.#getNodes();
                for(const node of nodes){
                    element.appendChild(node);
                }
            }
        }
        else{
            throw "Can't append a fragment to a none HTMLElement"
        }
    }

    get firstChild(){
        const nodes=this.#getNodes();
        return nodes[0];
    }

    get firstElementChild(){
        const nodes=this.#getNodes();
        const firstEl=nodes.find(node=>node instanceof Element);
        return firstEl;
    }

    get lastChild(){
        const nodes=this.#getNodes();
        return nodes[this.#nodes.length-1];
    }

    get lastElementChild(){
        const nodes=this.#getNodes();
        const item=findItem(nodes,(node)=>node instanceof Element,true);
        return item&&item.value;
    }

    get childNodes(){
        const nodes=this.#getNodes();
        return [...nodes]; 
    }

    get children(){
        const children=[],nodes=this.#getNodes();
        for(const node of nodes){
            (node instanceof Element)&&children.push(node);
        }
        return children;
    }

    get childElementCount(){
        let count=0;
        const nodes=this.#getNodes();
        for(const node of nodes){
            if(node instanceof Element){count++};
        }
        return count;
    }

    get parentNode(){
        return this.#parent||null;
    }

    get parentElement(){
        const parent=this.#parent;
        return parent instanceof Element?parent:parent?.parentElement;
    }

    get nextSibling(){
        const lastChild=this.lastChild;
        return lastChild?.nextSibling||null;
    }

    get nextElementSibling(){
        const lastChild=this.lastChild;
        return lastChild?.nextElementSibling||null;
    }

    #getNodes(){
        const nodes=this.#nodes;
        const parent=this.#parent;//||nodes[0]?.parentNode;
        let {length}=nodes;
        for(let i=0;i<length;i++){
            const node=nodes[i];
            const {parentNode}=node;
            if(!((parentNode===parent)||(parentNode===this))){
                nodes.splice(i,1);
                length=nodes.length;
            }
        }
        return nodes;
    }
}

export default function Fragment(props){return new VritraFragment(props)};
