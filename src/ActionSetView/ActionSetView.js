import {useId,map,NativeView} from "../index";
import css from "./ActionSetView.module.css";


export default function ActionSetView(props){
    const {parent,id=useId("actionsetview"),actions,color="black"}=props;
    const actionsetview=NativeView({
        parent,id,
        at:props.at,
        style:props.style,
        className:`${css.actionsetview} ${props.className||""}`,
    });

    actionsetview.innateHTML=`
        ${map(actions.filter(action=>action.icon),(action)=>{
            const {id,icon,size,alt}=action;
            return `
                <div id="${id}" class="button ${css.action}">
                    <img 
                        src="${typeof(icon)==="function"?action.icon(color,2):(icon||"")}" alt="${alt||""}"
                        ${size?`style="width:${size}em"`:""}
                    />
                </div>
            `
        })}
    `;
    actions.forEach((action,i)=>{
        const {component}=action;
        let actionEl;
        if(component){
            actionEl=component({...action,parent:actionsetview});
            actionEl?.classList.add(css.action);
            actionEl?.addEventListener("click",(event)=>{event.stopPropagation()});
            if(!i){
                actionsetview.insertAdjacentElement("afterbegin",actionEl);
            }
            else{
                const pvaction=actions[i-1];
                pvaction?.element?.insertAdjacentElement("afterend",actionEl);
            }
        }
        else{
            actionEl=actionsetview.querySelector(`:scope>#${action.id}.${css.action}`);
            actionEl.onclick=(event)=>{
                event.stopPropagation();
                action.onTrigger?.(action);
            }
            actionEl.setIcon=(icon,save)=>{
                if(save){action.icon=icon};
                const img=actionEl.querySelector(":scope>img");
                img.src=typeof(icon)==="function"?icon(color):icon;
            }
        }
        action.color=color;
        action.element=actionEl;
        action.onReady?.(action);
    });

    return actionsetview;
}
