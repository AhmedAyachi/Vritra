import {useId} from "../index";


export default function View(props){
    const {parent,id=useId("view"),className,style}=props;
    parent.insertAdjacentHTML("beforeend",`<div id="${id}" ${className?`class="${className}"`:""} ${style?`style="${style}"`:""}></div>`);
    const view=parent.querySelector(`#${id}`);

    view.innerHTML=`
    `;

    Object.defineProperty(view,"beforeEndHTML",{
        set:(html)=>{
            view.insertAdjacentHTML("beforeend",html);
        }
    });

    return view;
}
