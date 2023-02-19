import {useId,CherryView} from "../index";
import css from "./SideBarNavigator.module.css";
import SideBar from "./SideBar/SideBar";


export default function SideBarNavigator(props){
    const {parent,id=useId("sidebarnavigator"),entries,tintColor="dodgerblue",folderColor="black",endpointColor="rgba(0,0,0,0.35)",onNavigate}=props;
    const sidebarnavigator=CherryView({
        parent,id,
        style:props.style,
        position:props.position,
        className:`${css.sidebarnavigator} ${props.className||""}`,
    }),state={
        current:null,
    };

    sidebarnavigator.innateHTML=`
        <div class="${css.container} ${props.containerClassName||""}"></div>
    `;
    const sidebar=SideBar({
        parent:sidebarnavigator,entries,
        className:props.sidebarClassName,
        tintColor,folderColor,endpointColor,
    });


    sidebarnavigator.navigate=(entryId,triggerOnNavigate=true)=>{
        const {current}=state;
        const container=sidebarnavigator.querySelector(`:scope>.${css.container}`);
        if(entryId&&(current?.id!==entryId)){
            const entry=entryId&&findEntry(entryId,entries);
            current&&current.element.toggle(Boolean(current.entries));
            state.current=entry;
            if(entry){
                delete entry.parentId;
                container.innerHTML="";
                entry.element.toggle(true);
                renderEntryContent(entry,container);
                triggerOnNavigate&&onNavigate&&onNavigate(entry.id,current?.id);
            }
        }
        else{
            container.innerHTML="";
            state.current=null;
            current&&current.element?.toggle(false);
        }
    }

    sidebarnavigator.getCurrentEntryId=()=>state.current?.id;
    sidebarnavigator.toggleSideBar=sidebar.toggle;

    return sidebarnavigator;
}

const renderEntryContent=(entry,container)=>{
    const {content,memorize=true}=entry;
    if(memorize&&(content instanceof HTMLElement)){
        container.appendChild(content);
    }
    else{
        entry.content=entry.renderContent?.(container);
    }
}

const findEntry=(entryId,entries)=>{
    const {length}=entries;
    let i=0,target;
    while((!target)&&(i<length)){
        const entry=entries[i];
        if(entry.id===entryId){
            target=entry;
        }
        i++;
    }
    if(!target){
        const subentries=entries.flatMap(entry=>{
            const {entries}=entry;
            entries?.forEach(subentry=>{
                subentry.parentId=entry.id;
            });
            return entries;
        }).filter(entry=>entry);
        target=subentries.length&&findEntry(entryId,subentries);
        if(target){
            const entry=entries.find(entry=>entry.id===target.parentId);
            if(entry){
                target.parentId=entry.parentId;
                delete entry.parentId;
                entry.element.toggle(true);
            }
        }
    }
    return target;
}
