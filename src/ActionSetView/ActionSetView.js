import {useId,map,NativeView} from "../index";
import css from "./ActionSetView.module.css";


export default function ActionSetView(props){
    const {parent,id=useId("actionsetview"),color="black"}=props;
    const actionsetview=NativeView({
        parent,id,
        at:props.at,
        style:props.style,
        className:`${css.actionsetview} ${props.className||""}`,
    }),state={
        actions:getActions(props.actions,props.definitions),
    },{actions}=state;

    actionsetview.innateHTML=`
        ${map(actions.filter(action=>action.icon),(action)=>{
            const {id,icon,size,alt}=action;
            return `
                <div ref="${id}" class="button ${css.action}">
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
            const actionId=action.id;
            try{
                actionEl=actionsetview[actionId];
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
            catch{
                throw new Error(actionId?`invalid action with id: ${actionId}`:"action with no id");
            }
        }
        action.color=color;
        action.element=actionEl;
        action.onReady?.(action);
    });

    return actionsetview;
}

const getActions=(actions,definitions)=>Array.isArray(definitions)?actions?.map(action=>{
    const isref=typeof(action)==="string";
    const actionId=(isref?action:(action.ref||action.id)).trim();
    const definition=definitions.find(({id})=>actionId===id);
    return {...definition,...(!isref)&&action};
}):actions;
