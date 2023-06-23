import {findItem} from "../index";
import HtmlSanitizer from "./HtmlSanitizer";


export default function View(props){
    const {parent,id,tag,className,at,style}=props;
    const isFragment=(tag==="fragment"),nodes=isFragment&&[];
    const view=isFragment?document.createDocumentFragment():document.createElement(tag||"div");
    if(id){view.id=id};
    if(className){view.className=className};
    if(style){
        typeof(style)==="string"?view.setAttribute("style",style):Object.assign(view.style,style);
    }
    if((!isFragment)&&parent){
        (at==="start")?parent.insertAdjacentElement("afterbegin",view):parent.appendChild(view);
    }

    Object.defineProperties(view,{
        innateHTML:{set:(html)=>{
            if(!isFragment){view.innerHTML=""};
            view.beforeEndHTML=html;
            if(isFragment&&parent){
                (at==="start")?parent.prepend(view):parent.appendChild(view);
            }
        }},
        beforeEndHTML:{set:(html)=>{
            const sanitizedEl=HtmlSanitizer.sanitizeHtml(html,view);
            if(sanitizedEl){
                const childNodes=[...sanitizedEl.childNodes];
                view.append(...childNodes);
                if(isFragment){
                    const lastNode=getFragmentTargetNode(nodes,true);
                    console.log("lastNode",lastNode);
                    nodes.push(...childNodes);
                    lastNode?.parentNode.insertBefore(view,lastNode.nextSibling);
                }
            }
        }},
        afterBeginHTML:{set:(html)=>{
            const sanitizedEl=HtmlSanitizer.sanitizeHtml(html,view);
            if(sanitizedEl){
                const childNodes=sanitizedEl.childNodes;
                view.prepend(...childNodes);
                if(isFragment){
                    const firstNode=getFragmentTargetNode(nodes);
                    console.log("firstNode",firstNode);
                    nodes.unshift(...childNodes);
                    firstNode?.parentNode.insertBefore(view,firstNode);
                }
            }
        }},
        substitute:{value:(element)=>{
            view.replaceWith(element);
            return element;
        }},
        adjacentTo:{value:(element,before)=>{
            element[before?"before":"after"](view);
            return view;
        }},
        addBefore:{value:(element)=>{
            element.before(view);
            return view;
        }},
        addAfter:{value:(element)=>{
            element.after(view);
            return view;
        }},
    });

    return view;
}

const getFragmentTargetNode=(nodes,last)=>{
    console.log("before",nodes);
    const {length}=nodes;
    let i=last?length-1:0,target;
    if(last){
        while((!target)&&(i>-1)){
            const node=nodes[i];
            if(node?.isConnected){
                target=node;
            }
            else{
                nodes.pop();
            }
            i--;
        }
    }
    else{
        while((!target)&&(i<length)){
            const node=nodes[i];
            if(node?.isConnected){
                target=node;
                i++;
            }
            else{
                nodes.shift();
            }
        }
    }
    console.log("after",nodes);
    return target;
}
