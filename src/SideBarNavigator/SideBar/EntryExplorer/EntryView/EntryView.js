import {useId,View} from "../../../../index";
import css from "./EntryView.module.css";
import EntryExplorer from "../EntryExplorer";
import icon0 from "./Icon_0";


export default function EntryView(props){
    const {parent,id=useId("entryview"),entry,tintColor,folderColor,endpointColor}=props;
    const entryview=entry.element=View({parent,id,className:css.entryview}),state={
        explorer:null,
        highlighted:false,
        isfolder:Boolean(entry.entries),
        rendered:false,
        expandCallback:null,
    },{isfolder}=state,{icon}=entry;

    entryview.innateHTML=`
        <div class="${css.header}" style="color:${isfolder?folderColor:endpointColor};" ${isfolder?"folder":""}>
            ${isfolder?`
                <img class="${css.indicator}" src="${icon0(folderColor)}"/>
            `:""}
            ${icon?
                `<img class="${css.icon}" src="${typeof(icon)==="function"?icon(isfolder?folderColor:endpointColor):icon}"/>
            `:""}
            <span class="${css.name}">${entry.name||entry.id||""}</span>
        </div>
    `;

    const toggleEl=isfolder?entryview.querySelector(`.${css.header}`):entryview;
    toggleEl.onclick=(event)=>{
        event.stopPropagation();
        if(isfolder){
            entryview.toggle();
        }
        else if(!state.highlighted){
            const sidebarnavigator=entryview.closest("div[class*= sidebarnavigator]");
            sidebarnavigator.navigate(entry.id);
        }
    };
    
    entryview.toggle=(highlighted=!state.highlighted,callback)=>{
        state.highlighted=highlighted;
        if(isfolder){
            state.expandCallback=callback;
            const indicator=entryview.querySelector(`.${css.indicator}`);
            indicator.style.transform=`translateX(-100%) rotateZ(${highlighted?90:0}deg)`;
            const {explorer}=state;
            if(highlighted){
                if(explorer){
                    if(state.rendered){
                        (!entryview.contains(explorer))&&entryview.appendChild(explorer);
                        callback&&callback();
                    }
                }
                else{
                    state.explorer=EntryExplorer({
                        ...props,
                        parent:entryview,
                        className:css.explorer,
                        entries:entry.entries,
                        lazy:true,
                        onExpanded:()=>{
                            const {expandCallback}=state;
                            state.rendered=true;
                            expandCallback&&expandCallback();
                            delete state.expandCallback;
                        },
                    });
                }
            }
            else{
                explorer?.remove();
            }
        }
        else{
            const headerEl=entryview.querySelector(`.${css.header}`);
            const nameEl=entryview.querySelector(`.${css.name}`);
            headerEl.style.backgroundColor=highlighted?"rgba(0,0,0,0.03)":null;
            nameEl.style.color=highlighted?tintColor:null;
            const iconEl=(typeof(icon)==="function")&&entryview.querySelector(`.${css.icon}`);
            if(iconEl){
                iconEl.src=icon(highlighted?tintColor:endpointColor);
            }
        }
    }
    isfolder&&entry.expanded&&entryview.toggle(true);

    entryview.style.marginTop=isfolder?"1.5em":null;
    return entryview;
}
