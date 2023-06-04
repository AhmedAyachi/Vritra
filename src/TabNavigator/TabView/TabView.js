import {useId,View,withSequence} from "../../index";
import css from "./TabView.module.css";


export default function TabView(props){
    const {parent,id=useId("tabview"),tab,tabTextColor,tintColor,onClick}=props,{icon,label}=tab;
    const tabview=View({parent,id,tag:"button",style:`color:${tabTextColor}`,className:css.tabview});

    tabview.innateHTML=`
        ${icon?`
            <img src="${typeof(icon)==="function"?icon(tabTextColor):icon}"/>
        `:""}
        ${label?`<label>${label}</label>`:""}
    `;

    tab.context={id:tab.id,label:tab.label,tabEl:tabview};
    tab.element=tabview;
    delete tab.contentEl;
    
    tabview.onclick=()=>{
        const tabnavigator=parent.closest("div[id^=tabnavigator]");
        const barview=tabnavigator.getIndicator();
        withSequence(barview,[
            {
                toStyle:{
                    width:`${tabview.offsetWidth}px`,
                    transform:`translateX(${tabview.offsetLeft-parent.scrollLeft}px)`,
                },
                duration:200,
                easing:"ease",
            },
        ],()=>{
            barview.style.transform=null;
            tabview.appendChild(barview);
        });
        const container=tabnavigator.getContentContainer();
        container.innerHTML="";
        const {contentEl}=tab;
        if(contentEl){container.appendChild(contentEl)}
        else{
            const {context}=tab;
            const contentEl=context.contentEl=tab.renderContent&&tab.renderContent({parent:container,context});
            if(tab.memorize&&contentEl){tab.contentEl=contentEl};
        }
        tabview.style.color=tintColor;
        const iconEl=tabview.querySelector(":scope>img");
        if(iconEl){iconEl.src=tab.icon(tintColor)};
        onClick&&onClick();
    }

    return tabview;
}
