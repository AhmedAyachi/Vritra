import {VritraFragment} from "../Fragment/Fragment";
import HtmlSanitizer,{decorateNode} from "../HtmlSanitizer";


export default function View(props){
    const {parent,id,tag,className,at,style}=props;
    const view=document.createElement(tag||"div");
    if(id){view.id=id};
    if(className){
        if(Array.isArray(className)){
            view.className=className.flat(Infinity).filter(Boolean).join(" ");
        }
        else{
            view.className=className;
        }
    };
    if(style){
        if(Array.isArray(style)){
            const styles=style.flat(Infinity);
            for(const styleItem of styles){
                if(styleItem) setViewStyle(view,styleItem);
            }
        }
        else setViewStyle(view,style);
    }
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
    
    return decorateNode(view);
}

const setViewStyle=(view,style)=>{
    if(typeof(style)==="string"){
        view.style.cssText+=style;
    }
    else{
        Object.assign(view.style,style);
    }
}
