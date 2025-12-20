import {map,NativeView} from "../index";
import css from "./ActionSetView.module.css";


export default function ActionSetView(props){
    const {parent,tintColor=props.color||"black"}=props;
    const actionsetview=NativeView({
        parent,id:props.id,at:props.at,style:props.style,
        className:[css.actionsetview,props.className],
    }),state={
        actions:getActions(props.actions,props.definitions),
    },{actions}=state;

    actionsetview.innateHTML=`
        ${map(actions.filter(action=>action.icon||action.label),(action)=>{
            if(!action.color) action.color=tintColor;
            const {id,icon,label,size=6.4,color,iconAlt=action.alt}=action;
            return `
                <button 
                    ref="${id}" class="${css.action}" 
                    style="
                        font-size:${Number(size/6.4)}em;
                        ${label?`
                            color:${color};
                        `:""}
                    "
                >
                    ${icon?`<img 
                        alt="${iconAlt||id||""}"
                        src="${typeof(icon)==="function"?action.icon(color,2):(icon||"")}"
                    />`:""}
                    ${label?`<text as="label">${label}</text>`:""}
                </button>
            `
        })}
    `;
    actions.forEach((action,i)=>{
        const {component,onReady}=action;
        let actionEl;
        if(component){
            actionEl=component({
                color:tintColor,
                ...action,
                parent:actionsetview,
            });
            actionEl?.addEventListener("click",(event)=>{event.stopPropagation()});
            if(!i){
                actionsetview.insertAdjacentElement("afterbegin",actionEl);
            }
            else{
                const pvaction=actions[i-1];
                pvaction?.element?.insertAdjacentElement("afterend",actionEl);
            }
        } else {
            const actionId=action.id||action.ref;
            try {
                const {style}=action;
                actionEl=actionsetview[actionId];
                if(style) Object.assign(actionEl.style,style);
                actionEl.onClick=(event)=>{
                    event.stopPropagation();
                    action.onTrigger?.(action,event);
                }
                const img=actionEl.querySelector(":scope>img");
                if(img) actionEl.setIcon=(icon=action.icon)=>{
                    img.src=typeof(icon)==="function"?icon(action.color):icon;
                }
            } catch {
                throw new Error(actionId?`invalid action with id: "${actionId}"`:"action with no id");
            }
        }
        action.element=actionEl;
        onReady&&onReady(action);
    });

    return actionsetview;
}

const getActions=(actions,definitions)=>Array.isArray(definitions)?actions?.map(action=>{
    const isRef=typeof(action)==="string";
    const actionId=(isRef?action:(action.ref||action.id));
    const definition=definitions.find(({id})=>actionId===id);
    return {...definition,...(!isRef)&&action};
}):actions;
