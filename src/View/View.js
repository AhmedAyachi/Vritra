import VritraElement,{setElementStyle,setElementClassName,HtmlSanitizer} from "../VritraElement/VritraElement";
import {VritraFragment} from "../Fragment/Fragment";


export default function View(props){
    const {parent,id,tag,className,at,style}=props;
    const view=document.createElement(tag||"div");
    if(id) view.id=id;
    setElementStyle(view,style);
    setElementClassName(view,className);
    if(parent){
        const atStart=(at==="start")||(at<=0);
        if(parent instanceof VritraFragment){
            if(atStart) parent.prepend(view);
            else if(typeof(at)==="number"){
                parent.insertAt(at,view);
            }
            else parent.append(view);
        }
        else{
            if(atStart) parent.insertAdjacentElement("afterbegin",view);
            else if(typeof(at)==="number"){
                const child=parent.children[at];
                parent.insertBefore(view,child);
            }
            else parent.appendChild(view);
        }
    }

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
            view.innerHTML="";
            return element;
        }},
        adjacentTo:{value:(element,before)=>{
            if(element instanceof Element){
                element[before?"before":"after"](view);
            }
            return view;
        }},
        queryAllSelectors:{value:(...selectors)=>{
            return selectors.flatMap(it=>view.querySelector(it));
        }},
    });
    
    return VritraElement(view);
}
