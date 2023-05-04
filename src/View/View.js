import {useId} from "../index";
import HtmlSanitizer from "./HtmlSanitizer";


export default function View(props){
    const {parent,id=useId("view"),className,style,at=props.position||"end"}=props;
    parent.insertAdjacentHTML(getPosition(at),`<div id="${id}" ${className?`class="${className}"`:""} ${style?`style="${style}"`:""}></div>`);
    const view=parent.querySelector(`#${id}`);

    view.innerHTML=`
    `;

    Object.defineProperties(view,{
        beforeEndHTML:{set:(html)=>{
            view.insertAdjacentHTML("beforeend",html);
        }},
        afterBeginHTML:{set:(html)=>{
            view.insertAdjacentHTML("afterbegin",html);
        }},
        innateHTML:{set:(html)=>{
            view.innerHTML=HtmlSanitizer.sanitizeHtml(html);
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

const getPosition=(position)=>{
    switch(position){
        case "top": 
        case "start": return "afterbegin";
        case "bottom": 
        case "end": return "beforeend";
        default: return position;
    }
}
