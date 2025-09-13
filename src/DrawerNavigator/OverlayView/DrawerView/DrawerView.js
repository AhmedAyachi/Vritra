import {View,map,hexColorToRGBA} from "../../../index";
import css from "./DrawerView.module.css";


export default function DrawerView(props){
    const {parent,routes,activeId,scrollTop,tintColor,renderHeader,renderFooter,onChange}=props;
    const drawerview=View({
        parent,tag:"nav",
        style:styles.drawerview(),
        className:[css.drawerview,props.className],
    });

    drawerview.innateHTML=`
        <div ref="container" class="${css.container}">
            ${map(routes,({id,title})=>`
                <text
                    id="${id}" 
                    class="${css.entry}" 
                    ${id===activeId?`style="${styles.entry(tintColor)}"`:""}
                >${title||id||""}</text>
            `)}
        </div>
    `;
    if(typeof(renderHeader)==="function"){
        const header=renderHeader({parent:drawerview});
        if(header instanceof Element){
            drawerview.insertAdjacentElement("afterbegin",header);
        }
    }
    if(typeof(renderFooter)==="function"){
        renderFooter({parent:drawerview});
    }
    const {container}=drawerview;
    if(scrollTop===null){
        const activeEntry=drawerview.querySelector(`#${activeId}.${css.entry}`);
        container.scrollTop=activeEntry.offsetTop/2;
    }
    else container.scrollTop=scrollTop;

    setTimeout(()=>{
        const entryEls=drawerview.querySelectorAll(`.${css.entry}`);
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
    },statics.duration+50);
    
    drawerview.onclick=(event)=>{
        event.stopPropagation();
    }

    drawerview.unmount=()=>{
        setTimeout(()=>{
            drawerview.remove();
        },statics.duration);
        drawerview.setAttribute("style",styles.drawerview(true));
    }

    setTimeout(()=>{drawerview.style.animation=null},statics.duration);

    drawerview.getContainerScrollTop=()=>container.scrollTop;
    
    return drawerview;
}

const statics=DrawerView.statics={
    closeeasing:"cubic-bezier(1,.01,.86,.58)",
    duration:500,
},styles={
    drawerview:(reversed)=>`
        animation:${css.slideRight} ${statics.duration}ms ${reversed?statics.closeeasing:"ease-in-out"} 1 ${reversed?"reverse":"normal"} forwards;
    `,
    entry:(tintColor)=>`
        color:${tintColor};
        background-color:${hexColorToRGBA(tintColor+"26")};
    `,
}
