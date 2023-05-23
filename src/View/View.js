import {useId} from "../index";
import HtmlSanitizer from "./HtmlSanitizer";


export default function View(props){
    const {parent,id=useId("view"),tag,className,at,style}=props;
    const view=document.createElement(tag||"div");
    view.id=id;
    view.className=className;
    style&&(typeof(style)==="string")&&view.setAttribute("style",style);
    parent&&((at==="start")?parent.insertAdjacentElement("afterbegin",view):parent.appendChild(view));

    Object.defineProperties(view,{
        innateHTML:{set:(html)=>{
            view.innerHTML=HtmlSanitizer.sanitizeHtml(html);
        }},
        beforeEndHTML:{set:(html)=>{
            view.insertAdjacentHTML("beforeend",HtmlSanitizer.sanitizeHtml(html));
        }},
        afterBeginHTML:{set:(html)=>{
            view.insertAdjacentHTML("afterbegin",HtmlSanitizer.sanitizeHtml(html));
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
