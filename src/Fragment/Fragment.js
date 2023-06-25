import HtmlSanitizer from "../HtmlSanitizer";


export default function Fragment(props){
    const {parent,at}=props;
    let nodes;
    const fragment=new DocumentFragment();

    Object.defineProperties(fragment,{
        nodes:{get:()=>{
            freeNodes(fragment,nodes);
            return [...nodes];   
        }},
        innateHTML:{set:(html)=>{
            nodes=[];
            fragment.beforeEndHTML=html;
            if(parent){
                (at==="start")?parent.prepend(fragment):parent.appendChild(fragment);
            }
        }},
        beforeEndHTML:{set:(html)=>{
            const sanitizedEl=HtmlSanitizer.sanitizeHtml(html,fragment);
            if(sanitizedEl){
                const childNodes=[...sanitizedEl.childNodes];
                fragment.append(...childNodes);
                freeNodes(fragment,nodes);
                const lastNode=nodes[nodes.length-1];
                nodes.push(...childNodes);
                lastNode?.parentNode.insertBefore(fragment,lastNode.nextSibling);
            }
        }},
        afterBeginHTML:{set:(html)=>{
            const sanitizedEl=HtmlSanitizer.sanitizeHtml(html,fragment);
            if(sanitizedEl){
                const childNodes=[...sanitizedEl.childNodes];
                fragment.prepend(...childNodes);
                freeNodes(fragment,nodes);
                const firstNode=nodes[0];
                nodes.unshift(...childNodes);
                firstNode?.parentNode.insertBefore(fragment,firstNode);
            }
        }},
        substitute:{value:(element)=>{
            const firstChild=nodes?.find(node=>node.isConnected);
            if(firstChild){
                firstChild.replaceWith(element);
                fragment.remove();
            }
            return element;
        }},
        adjacentTo:{value:(element,before)=>{
            const firstChild=nodes?.find(node=>node.isConnected);
            if(firstChild){
                element[before?"before":"after"](firstChild);
                const {length}=nodes;
                for(let i=1;i<length;i++){
                    nodes[i-1].after(nodes[i]);
                }
            }
            return fragment;
        }},
        remove:{value:()=>{
            freeNodes(fragment,nodes);
            const {length}=nodes;
            for(let i=0;i<length;i++){
                const node=nodes[i];
                fragment.appendChild(node);
            }
        }},
    });

    return fragment;
}

const freeNodes=(fragment,nodes)=>{
    let {length}=nodes;
    for(let i=0;i<length;i++){
        const node=nodes[i];
        /* console.log({
            node,
            parent:node.parentNode,
            connected:node.isConnected,
        }); */
        if(!(node.isConnected||(node.parentNode===fragment))){
            nodes.splice(i,1);
            length=nodes.length;
        }
    }
}
