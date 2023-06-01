import {useId,View,map,hexColorToRGBA} from "../../../index";
import css from "./RoutePicker.module.css";


export default function RoutePicker(props){
    const {parent,id=useId("routepicker"),routes,activeId,tintColor,onChange}=props;
    const routepicker=View({
        parent,id,
        style:styles.routepicker(),
        className:`${css.routepicker} ${props.className||""}`,
    });

    routepicker.innateHTML=`
        ${map(routes,({id,title})=>`
            <p 
                id="${id}" 
                class="${css.entry}" 
                ${id===activeId?`style="${styles.entry(tintColor)}"`:""}
            >${title||id||""}</p>
        `)}
    `;

    const entryEls=routepicker.querySelectorAll(`.${css.entry}`);
    entryEls.forEach(entryEl=>{
        const {id}=entryEl,route=routes.find(route=>route.id===id);
        entryEl.onclick=()=>{
            if(id!==activeId){
                const activeroute=routes.find(({id})=>activeId===id),{element}=activeroute;
                if(element instanceof HTMLElement){
                    activeroute.scrollTop=element.scrollTop;
                    activeroute.scrollLeft=element.scrollLeft;
                }
                onChange&&onChange(route);
            }
            parent.unmount();
        };
    });

    routepicker.onclick=(event)=>{
        event.stopPropagation();
    }

    routepicker.unmount=()=>{
        setTimeout(()=>{
            routepicker.remove();
        },statics.duration);
        routepicker.setAttribute("style",styles.routepicker(true));
    }

    setTimeout(()=>{routepicker.style.animation=null},statics.duration);
    return routepicker;
}

const statics=RoutePicker.statics={
    closeeasing:"cubic-bezier(1,.01,.86,.58)",
    duration:500,
},styles={
    routepicker:(reversed)=>`
        animation:${css.slideRight} ${statics.duration}ms ${reversed?statics.closeeasing:"ease-in-out"} 1 ${reversed?"reverse":"normal"} forwards;
    `,
    entry:(tintColor)=>`
        color:${tintColor};
        background-color:${hexColorToRGBA(tintColor+"26")};
    `,
}
