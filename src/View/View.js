import HtmlSanitizer from "./HtmlSanitizer";


export default function View(props){
    const {parent,id,tag,className,at,style}=props;
    const isFragment=(tag==="fragment");
    const nodes=isFragment&&[];
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
            parent?.appendChild(view);
        }},
        beforeEndHTML:{set:(html)=>{
            const sanitizedEl=HtmlSanitizer.sanitizeHtml(html,view);
            if(sanitizedEl){
                const childNodes=[...sanitizedEl.childNodes];
                view.append(...childNodes);
                if(isFragment){
                    const lastNode=nodes[nodes.length-1];
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
                    const firstNode=nodes[0]||parent;
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
