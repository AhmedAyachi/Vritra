import {findItem} from "../index";
import {HtmlSanitizer} from "../VritraElement/VritraElement";


export class VritraFragment extends DocumentFragment {
    #at;
    #nodes=[];
    #parent=null;
    #nextParentNode=null;

    constructor(props={}){
        super(props);
        const at=this.#at=props.at;
        const parent=this.#parent=props.parent||null;
        if((this.#at==="start")||(this.#at<=0)){
            this.#nextParentNode=parent?parent.firstChild:null;
        }
        else if(typeof(at)==="number"){
            this.#nextParentNode=parent?parent.children[at]:null;
        }
    }

    set innateHTML(html){
        if(this.#nodes?.length){
            const nodes=this.#getNodes();
            this.#nodes=[];
            if(nodes.length){
                for(const node of nodes){
                    node.remove();
                };
            }
        }
        const atStart=(this.#at==="start")||(this.#at<=0);
        if(atStart) this.afterBeginHTML=html;
        else if(typeof(this.#at)==="number"){
            const parent=this.#parent;
            if(parent){
                const {children}=parent;
                if(children.length){
                    const sanitizedEl=HtmlSanitizer.sanitizeHtml(html,this);
                    if(sanitizedEl){
                        this.#nodes.push(...sanitizedEl.childNodes);
                        const child=children[this.#at];
                        this.#nodes.forEach(node=>{
                            parent.insertBefore(node,child);
                        });
                    }
                }
                else this.beforeEndHTML=html;
            }
            else this.beforeEndHTML=html;
        }
        else this.beforeEndHTML=html;
    }

    set beforeEndHTML(html){
        const sanitizedEl=HtmlSanitizer.sanitizeHtml(html,this);
        if(sanitizedEl){
            this.append(...sanitizedEl.childNodes);
        }
    }

    set afterBeginHTML(html){
        const sanitizedEl=HtmlSanitizer.sanitizeHtml(html,this);
        if(sanitizedEl){
            this.prepend(...sanitizedEl.childNodes);
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
            return this;
        }
        else throw "first param is not of type Element";
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

    querySelector(...params){
        const nodes=this.#getNodes();
        let element=nodes.find(node=>node.matches(...params));
        if(!element){
            let i=0;
            const {length}=nodes;
            while(!element&&(i<length)){
                element=nodes[i].querySelector(...params);
                i++;
            }
        }
        return element;
    }

    querySelectorAll(...params){
        const nodes=this.#getNodes();
        const list=nodes.filter(node=>node.matches(...params));
        nodes.forEach(node=>{
            list.push(...node.querySelectorAll(...params));
        });
        return list;
    }

    queryAllSelectors(...selectors){
        const nodes=this.#getNodes();
        const targets=[];
        for(const selector of selectors){
            const target=nodes.find(node=>node.matches(selector));
            targets.push(target);
        }
        return targets;
    }

    prepend(...newNodes){
        const firstNode=this.firstChild||this.previousSibling?.nextSibling;
        const parent=this.#parent;
        this.#nodes.unshift(...newNodes);
        for(const node of newNodes){
            if(parent){
                if(firstNode) this.insertBefore(node,firstNode);
                else parent.prepend(node);
            }
            else super.insertBefore(node,firstNode);
        }
    }

    append(...newNodes){
        const nextNode=this.lastChild?.nextSibling||this.nextSibling;
        this.#nodes.push(...newNodes);
        const {length}=newNodes,parent=this.#parent;
        for(let i=0;i<length;i++){
            const node=newNodes[i];
            if(parent) parent.insertBefore(node,nextNode);
            else super.insertBefore(node,nextNode);
        }   
    }

    insertAt(index,...newNodes){
        const nodes=this.#getNodes();
        if(nodes.length){
            const child=nodes[index];
            nodes.splice(index,0,...newNodes);
            const {length}=newNodes;
            for(let i=0;i<length;i++){
                this.#parent.insertBefore(newNodes[i],child);
            }
        }
        else this.append(...newNodes);
    }

    insertBefore(newNode,refNode=null){
        const nodes=this.#getNodes(),noRefNode=!refNode;
        const refNodeIndex=refNode&&nodes.indexOf(refNode);
        if(noRefNode||(refNodeIndex>-1)){
            if(noRefNode){
                refNode=nodes[nodes.length-1]?.nextSibling;
                nodes.push(newNode);
            }
            else nodes.splice(refNodeIndex,0,newNode);
            const parent=this.#parent;
            if(parent) parent.insertBefore(newNode,refNode);
            else super.insertBefore(newNode,refNode);
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
        else throw "parameter is not of type Node";
    }

    prependTo(element){
        if(element instanceof HTMLElement){
            if(element!==this.#parent){
                const nodes=this.#getNodes();
                this.#nextParentNode=element.firstChild;
                this.#parent=element;
                element.prepend(...nodes);
            }
        }
        else throw "Can't append a fragment to a none HTMLElement";
    }
     
    appendTo(element){
        if(element instanceof HTMLElement){
            if(element!==this.#parent){
                const nodes=this.#getNodes();
                this.#nextParentNode=null;
                this.#parent=element;
                for(const node of nodes){
                    element.appendChild(node);
                }
            }
        }
        else throw "Can't append a fragment to a none HTMLElement";
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

    get previousSibling(){
        const firstChild=this.firstChild;
        if(firstChild) return firstChild.previousSibling;
        else{
            const nextParentNode=this.#nextParentNode;
            if(nextParentNode) return nextParentNode.previousSibling;
            else return this.#parent.lastChild?.previousSibling||null;
        }
    }

    get previousElementSibling(){
        const firstChild=this.firstChild;
        if(firstChild) return firstChild.previousElementSibling;
        else{
            const nextParentNode=this.#nextParentNode;
            if(nextParentNode) return nextParentNode.previousElementSibling;
            else return this.#parent.lastChild?.previousElementSibling||null;
        }
    }

    get nextSibling(){
        const nextParentNode=this.#nextParentNode;
        if(nextParentNode) return nextParentNode;
        else{
            const {lastChild}=this;
            if(lastChild) return lastChild.nextSibling;
            else{
                if(this.#at==="start") return this.#parent.firstChild;
                else return this.#parent.lastChild?.nextSibling;
            }
        }
    }

    get nextElementSibling(){
        const nextParentNode=this.#nextParentNode;
        if(nextParentNode){
            if(nextParentNode instanceof Element) return nextParentNode;
            else return nextParentNode.nextElementSibling;
        }
        else{
            const lastChild=this.lastChild;
            if(lastChild) return lastChild.nextElementSibling;
            else{
                if(this.#at==="start") return this.#parent.firstElementChild;
                else return this.#parent.lastElementChild?.nextElementSibling;
            }
        }
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
                i--;
            }
        }
        return nodes;
    }
}

export default function Fragment(props){return new VritraFragment(props)};
