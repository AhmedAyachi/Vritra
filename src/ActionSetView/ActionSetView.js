import {useId,map,CherryView} from "../index";
import css from "./ActionSetView.module.css";


export default function ActionSetView(props){
    const {parent,id=useId("actionsetview"),actions,color="black"}=props;
    const actionsetview=CherryView({
        parent,id,
        position:props.position,
        style:props.style,
        className:`${css.actionsetview} ${props.className||""}`,
    });

    actionsetview.innateHTML=`
        ${map(actions.filter(action=>action.icon),({id,icon,size,alt})=>`
            <div id="${id}" class="button ${css.action}">
                <img 
                    src="${typeof(icon)==="function"?icon(color,2):(icon||"")}" alt="${alt||""}"
                    ${size?`style="width:${size}em"`:""}
                />
            </div>
        `)}
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
                const {onTrigger}=action;
                onTrigger&&onTrigger(action);
            }
        }
        action.element=actionEl;
    });

    return actionsetview;
}
