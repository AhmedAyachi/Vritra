import {findItem} from "../index";
import HtmlSanitizer from "../HtmlSanitizer";


class CherryFragment extends DocumentFragment {
    #parent;#at;
    #nodes;

    constructor(props={}){
        super(props);
        this.#parent=props.parent;
        this.#at=props.at;
    }

    set innateHTML(html){
        this.#nodes=[];
        this.beforeEndHTML=html;
        const parent=this.#parent;
        if(parent){
            (this.#at==="start")?parent.prepend(this):parent.appendChild(this);
        }
    }

    set beforeEndHTML(html){
        const sanitizedEl=HtmlSanitizer.sanitizeHtml(html,this);
        if(sanitizedEl){
            const childNodes=[...sanitizedEl.childNodes];
            this.append(...childNodes);
            const lastNode=this.lastChild;
            this.#nodes.push(...childNodes);
            lastNode?.parentNode.insertBefore(this,lastNode.nextSibling);
        }
    }

    set afterBeginHTML(html){
        const sanitizedEl=HtmlSanitizer.sanitizeHtml(html,this);
        if(sanitizedEl){
            const childNodes=[...sanitizedEl.childNodes];
            this.prepend(...childNodes);
            const firstNode=this.firstChild;
            this.#nodes.unshift(...childNodes);
            firstNode?.parentNode.insertBefore(this,firstNode);
        }
    }

    adjacentTo(element,before){
        const firstChild=this.#nodes?.find(node=>node.isConnected);
        if(firstChild){
            element[before?"before":"after"](firstChild);
            const {length}=this.#nodes;
            for(let i=1;i<length;i++){
                this.#nodes[i-1].after(this.#nodes[i]);
            }
        }
        return this;
    }

    substitute(element){
        const firstChild=this.#nodes?.find(node=>node.isConnected);
        if(firstChild){
            firstChild.replaceWith(element);
            this.remove();
        }
        return element;
    }

    remove(){
        this.#freeNodes(this,this.#nodes);
        const {length}=this.#nodes;
        for(let i=0;i<length;i++){
            const node=this.#nodes[i];
            this.appendChild(node);
        }
    }

    prepend(...nodes){
        const firstNode=this.firstChild;
        if(firstNode){
            const {parentNode}=firstNode;
            for(const node of nodes){
                if(node instanceof Node){
                    this.#nodes.push(node);
                    parentNode.insertBefore(node,firstNode);
                }
            }
        }
    }

    appendChild(node){
        if(node instanceof Node){
            const lastNode=this.lastChild;
            this.#nodes.push(node);
            lastNode?.parentNode.insertBefore(node,lastNode.nextSibling);
            return node;
        }
        else{
            throw "parameter is not of type Node";
        }
    }

    get firstChild(){
        this.#freeNodes(this,this.#nodes);
        return this.#nodes[0];
    }

    get firstElementChild(){
        this.#freeNodes(this,this.#nodes);
        const firstEl=this.#nodes.find(node=>node instanceof Element);
        return firstEl;
    }

    get lastChild(){
        this.#freeNodes(this,this.#nodes);
        return this.#nodes[this.#nodes.length-1];
    }

    get lastElementChild(){
        this.#freeNodes(this,this.#nodes);
        const item=findItem(this.#nodes,(node)=>node instanceof Element,true);
        return item&&item.value;
    }

    get childNodes(){
        this.#freeNodes(this,this.#nodes);
        return [...this.#nodes]; 
    }
    get children(){
        const children=[];
        this.#freeNodes(this,this.#nodes);
        for(const node of this.#nodes){
            (node instanceof Element)&&children.push(children);
        }
        return children;
    }
    #freeNodes(){
        const nodes=this.#nodes,parent=this.#parent;
        let {length}=nodes;
        for(let i=0;i<length;i++){
            const node=nodes[i];
            const {parentNode}=node;
            if(!((parentNode===parent)||(parentNode===this))){
                nodes.splice(i,1);
                length=nodes.length;
            }
        }
    }
}
export default function Fragment(props){return new CherryFragment(props)};
