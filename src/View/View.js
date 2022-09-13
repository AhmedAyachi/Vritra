import {useId} from "../index";


export default function View(props){
    const {parent,id=useId("view"),className,style,position="beforeend"}=props;
    parent.insertAdjacentHTML(position,`<div id="${id}" ${className?`class="${className}"`:""} ${style?`style="${style}"`:""}></div>`);
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
    });

    return view;
}
