import HtmlSanitizer from "../HtmlSanitizer";


export default function View(props){
    const {parent,id,tag,className,at,style}=props;
    const view=document.createElement(tag||"div");
    if(id){view.id=id};
    if(className){view.className=className};
    if(style){
        typeof(style)==="string"?view.setAttribute("style",style):Object.assign(view.style,style);
    }
    parent&&((at==="start")?parent.insertAdjacentElement("afterbegin",view):parent.appendChild(view));

    Object.defineProperties(view,{
        innateHTML:{set:(html)=>{
            view.innerHTML="";
            view.beforeEndHTML=html;
        }},
        beforeEndHTML:{set:(html)=>{
            const sanitizedEl=HtmlSanitizer.sanitizeHtml(html,view);
            sanitizedEl&&view.append(...sanitizedEl.childNodes);
        }},
        afterBeginHTML:{set:(html)=>{
            const sanitizedEl=HtmlSanitizer.sanitizeHtml(html,view);
            sanitizedEl&&view.prepend(...sanitizedEl.childNodes);
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
