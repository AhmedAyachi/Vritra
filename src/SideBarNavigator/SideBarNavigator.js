import {useId,NativeView} from "../index";
import css from "./SideBarNavigator.module.css";
import SideBar from "./SideBar/SideBar";


export default function SideBarNavigator(props){
    const {parent,entries,tintColor="dodgerblue",folderColor="black",endpointColor="rgba(0,0,0,0.35)",onNavigate}=props;
    const sidebarnavigator=NativeView({
        parent,style:props.style,at:props.at,
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
        let successful=false;
        if(entryId&&(current?.id!==entryId)){
            const container=sidebarnavigator.querySelector(`:scope>.${css.container}`);
            const entry=entryId&&getEntry(entryId,entries);
            if(entry){
                current&&(!current.entries)&&current.element.toggle(false);
                state.current=entry;
                const {path=[entry]}=entry;
                let i=path.length;
                !function selectEntry(){
                    i--;
                    if(i>-1){
                        const {element}=path[i];
                        element.toggle(true,selectEntry);
                    }
                }();
                delete entry.parentId;
                delete entry.path;
                container.innerHTML="";
                renderEntry(entry,container);
                triggerOnNavigate&&onNavigate&&onNavigate({id:entry.id,name:entry.name},current&&{id:current.id,name:current.name});
                successful=true;
            }
        }
        return successful;
    }

    sidebarnavigator.getCurrentEntry=()=>{
        const {current}=state;
        return current?{id:current.id,name:current.name}:null;
    };
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
        entry.content=entry.renderContent?.({parent:container});
    }
}

const getEntry=(entryId,entries)=>{
    let entry=findEntry(entryId,entries);
    const subentries=entry?.entries;
    if(subentries&&subentries.length){
        let {path}=entry;
        delete entry.path;
        if(path){
            path.unshift(subentries[0]);
        }
        else{
            path=[subentries[0],entry];
        }
        entry=path[0];
        entry.path=path; 
    }
    return entry;
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
            Array.isArray(entries)&&entries.forEach(subentry=>{
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
