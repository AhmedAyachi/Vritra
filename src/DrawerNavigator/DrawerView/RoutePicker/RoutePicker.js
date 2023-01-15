import {useId,View,map} from "../../../index";
import css from "./RoutePicker.module.css";


export default function RoutePicker(props){
    const {parent,id=useId("routepicker"),routes,activeId,onChange}=props;
    const routepicker=View({parent,id,style:styles.routepicker(),className:css.routepicker});

    routepicker.innateHTML=`
        ${map(routes,({id,title})=>`
            <p id="${id}" class="${css.drawer}" ${id===activeId?"active":""}>${title||id||""}</p>
        `)}
    `;

    const drawerEls=routepicker.querySelectorAll(`.${css.drawer}`);
    drawerEls.forEach(drawerEl=>{
        const {id}=drawerEl,route=routes.find(route=>route.id===id);
        drawerEl.onclick=()=>{
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
}
