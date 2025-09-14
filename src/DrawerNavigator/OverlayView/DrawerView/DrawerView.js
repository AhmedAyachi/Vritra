import {View,map,hexColorToRGBA} from "../../../index";
import css from "./DrawerView.module.css";


export default function DrawerView(props){
    const {parent,routes,tintColor,renderHeader,renderFooter,onChange}=props;
    const drawerview=View({
        parent,tag:"nav",
        className:[css.drawerview,props.className],
    }),state={
        activeEl:null,
    };

    drawerview.innateHTML=`
        <div ref="container" class="${css.container}">
            ${map(routes,({id,title})=>`
                <text
                    data-id="${id}"
                    class="${css.entry}" 
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

    
    const entryEls=[...drawerview.querySelectorAll(`.${css.entry}`)];
    entryEls.forEach(entryEl=>{
        const {id}=entryEl.dataset,route=routes.find(route=>route.id===id);
        Object.defineProperty(entryEl,"routeId",{
            value:route.id,
        });
        entryEl.onclick=()=>{if(!drawerview.style.animation){
            const {activeEl}=state;
            if(entryEl!==activeEl){
                if(activeEl) activeEl.style.cssText=null;
                state.activeEl=entryEl;
                entryEl.style.cssText=styles.entry(tintColor);
                onChange&&onChange(route);
            }
            parent.hide();
        }};
    });
    
    drawerview.onclick=(event)=>{
        event.stopPropagation();
    }

    drawerview.show=(routeId)=>{
        setTimeout(()=>{
            drawerview.style.animation=null;
        },statics.duration);
        const entryEl=entryEls.find(it=>it.routeId===routeId);
        const {activeEl}=state;
        if(entryEl&&(entryEl!==activeEl)){
            if(activeEl) activeEl.style.cssText=null;
            state.activeEl=entryEl;
            drawerview.container.scrollTop=entryEl.offsetTop/2;
            entryEl.style.cssText=styles.entry(tintColor);
        }
        drawerview.setAttribute("style",styles.drawerview());
    }
    drawerview.hide=()=>{
        drawerview.setAttribute("style",styles.drawerview(true));
    }

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
