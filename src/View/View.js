import {useId} from "../index";


export default function View(props){
    const {parent,id=useId("view"),className,style,position="beforeend"}=props;
    parent.insertAdjacentHTML(getPosition(position),`<div id="${id}" ${className?`class="${className}"`:""} ${style?`style="${style}"`:""}></div>`);
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
            view.innerHTML=html;
        }},
        addBefore:{value:(element)=>{
            element.before(view);
            return view;
        }},
        addAfter:{value:(element)=>{
            element.after(view);
            return view;
        }},
        substitute:{value:(element)=>{
            view.replaceWith(element);
            return element;
        }},
    });

    return view;
}

const getPosition=(position)=>{
    switch(position){
        case "top": return "afterbegin";
        case "bottom": return "beforeend";
        default: return position;
    }
}
