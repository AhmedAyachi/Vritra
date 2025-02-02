import {withSequence,NativeView,View} from "../index";
import css from "./TabNavigator.module.css";
import TabView from "./TabView/TabView";


export default function TabNavigator(props){
    const {parent,tabs,memorize=true,activeTabId,tabTextColor="#cecece",tintColor="#1e90ff",onNavigate}=props;
    const tabnavigator=NativeView({
        parent,id:props.id,at:props.at,style:props.style,
        className:[css.tabnavigator,props.className],
    }),state={
        activeTab:null,
        navigating:false,
        context:{},
    };

    tabnavigator.innateHTML=`
        <div ref="headerEl" class="${css.header} ${props.headerClassName||""}"></div>
        <div ref="container" class="${css.container} ${props.containerClassName||""}"></div>
    `;

    const {headerEl}=tabnavigator;
    const indicator=View({
        className:css.indicator,
        style:{backgroundColor:tintColor},
    });
    tabs.forEach(tab=>{
        if(tab.memorize===undefined){
            tab.memorize=memorize;
        };
        TabView({
            parent:headerEl,tab,
            textColor:tabTextColor,
        });
    });
    
    tabnavigator.navigate=(tabId,triggerOnNavigate=true)=>{if(!state.navigating){
        state.navigating=true;
        const tab=tabs.find(tab=>tab.id===tabId);
        if(tab){
            //reset
            const {activeTab}=state;
            headerEl.appendChild(indicator);
            if(activeTab){
                const activeEl=activeTab.element;
                indicator.style.width=`${activeEl.offsetWidth}px`;
                indicator.style.transform=`translateX(${activeEl.offsetLeft}px)`;
                const iconEl=activeEl.querySelector(":scope>img");
                if(iconEl){
                    const {icon}=activeTab;
                    iconEl.src=typeof(icon)==="function"?icon(tabTextColor,2):icon;
                };
                activeEl.style.color=tabTextColor;
            }
            //set new active tab
            state.activeTab=tab;
            //move indicator to tab 
            const tabview=tab.element;
            withSequence(indicator,[{
                toStyle:{
                    width:`${tabview.offsetWidth}px`,
                    transform:`translateX(${tabview.offsetLeft}px)`,
                    backgroundColor:tab.tintColor||tintColor,
                },
                duration:300,
                easing:"ease",
            }],()=>{
                tabview.appendChild(indicator);
                indicator.style.transform=null;
                indicator.style.width="100%";
                state.navigating=false;
            });
            const {container}=tabnavigator,{contentEl}=tab;
            container.innerHTML=""; 
            if(contentEl){container.appendChild(contentEl)}
            else{
                const {context}=state,{renderContent}=tab;
                const contentEl=renderContent&&renderContent({parent:container,context});
                if(tab.memorize&&(contentEl instanceof HTMLElement)){
                    tab.contentEl=contentEl;
                }
                else{
                    state.context.contentEl=contentEl;
                }
            }
            setContext(state.context,tab);
            tabview.setColor(tab.tintColor||tintColor);
            (headerEl.scrollWidth>headerEl.clientWidth)&&headerEl.scrollTo({
                behavior:"smooth",
                left:tabview.offsetLeft+tabview.clientWidth/2-headerEl.clientWidth/2,
            });
            triggerOnNavigate&&onNavigate&&onNavigate(state.context);
        }
    }};
   
    tabnavigator.navigate(tabs.find(tab=>tab.id===activeTabId)?.id||tabs[0].id);
    return tabnavigator;
}

const setContext=(context,tab)=>{
    const {contentEl}=tab;
    if(contentEl instanceof HTMLElement){
        context.contentEl=contentEl;
    }
    context.id=tab.id;
    context.label=tab.label;
    context.tabEl=tab.element;
};
