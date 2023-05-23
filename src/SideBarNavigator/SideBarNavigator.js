import {useId,CherryView} from "../index";
import css from "./SideBarNavigator.module.css";
import SideBar from "./SideBar/SideBar";


export default function SideBarNavigator(props){
    const {parent,id=useId("sidebarnavigator"),entries,tintColor="dodgerblue",folderColor="black",endpointColor="rgba(0,0,0,0.35)",onNavigate}=props;
    const sidebarnavigator=CherryView({
        parent,id,
        style:props.style,
        at:props.at,
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
        scrollTheme:props.sideBarScrollTheme,
    });


    sidebarnavigator.navigate=(entryId,triggerOnNavigate=true)=>{
        const {current}=state;
        if(entryId&&(current?.id!==entryId)){
            const container=sidebarnavigator.querySelector(`:scope>.${css.container}`);
            const entry=entryId&&findEntry(entryId,entries);
            if(entry){
                current&&(!current.entries)&&current.element.toggle(false);
                state.current=entry;
                const {path=[entry]}=entry;
                let i=path.length;
                !function selectEntry(){
                    i--;
                    if(i>-1){
                        const {element}=path[i];
                        element?.toggle(true,selectEntry);
                    }
                }();
                delete entry.parentId;
                delete entry.path;
                container.innerHTML="";
                renderEntry(entry,container);
                triggerOnNavigate&&onNavigate&&onNavigate(entry.id,current?.id);
            }
        }
    }

    sidebarnavigator.getCurrentEntryId=()=>state.current?.id;
    sidebarnavigator.toggleSideBar=sidebar.toggle;

    return sidebarnavigator;
}

const renderEntry=(entry,container)=>{
    const {content,memorize=true}=entry;
    container.scrollTop=0;
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
                if(!target.path){target.path=[target]};
                target.parentId=entry.parentId;
                delete entry.parentId;
                target.path.push(entry);
            }
        }
    }
    return target;
}
