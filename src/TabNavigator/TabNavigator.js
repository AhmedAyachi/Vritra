import {useId,NativeView,View,FlatList} from "../index";
import css from "./TabNavigator.module.css";
import TabView from "./TabView/TabView";


export default function TabNavigator(props){
    const {parent,tabs,memorize=true,activeTabId,tabTextColor="#cecece",tintColor="#1e90ff",onNavigate}=props;
    const tabnavigator=NativeView({
        parent,id:props.id,at:props.at,style:props.style,
        className:`${css.tabnavigator} ${props.className||""}`,
    }),state={
        activeTab:null,
    };

    tabnavigator.innateHTML=`
        <div class="${css.container} ${props.containerClassName||""}" ref="container"></div>
    `;
    const headerlist=FlatList({
        parent:tabnavigator,
        at:"start",
        className:`${css.header} ${props.headerClassName||""}`,
        containerClassName:css.tabcontainer,
        horizontal:true,
        data:tabs,
        threshold:0,
        EmptyComponent:"",
        renderItem:({parent,item:tab})=>{
            if(tab.memorize===undefined){tab.memorize=memorize};
            return TabView({
                parent,tab,tabTextColor,tintColor,
                onClick:()=>{
                    const {activeTab}=state;
                    headerlist.appendChild(barview);
                    const {scrollLeft}=parent;
                    if(activeTab){
                        const activeEl=activeTab.element;
                        const iconEl=activeEl.querySelector(":scope>img");
                        if(iconEl){
                            const {icon}=activeTab;
                            iconEl.src=typeof(icon)==="function"?icon(tabTextColor,2):icon;
                        };
                        activeEl.style.color=tabTextColor;
                        barview.style.transform=`translateX(${activeEl.offsetLeft-scrollLeft}px)`;
                    }
                    state.activeTab=tab;
                    onNavigate&&onNavigate(tab.context);
                },
            });
        },
        onFilled:()=>{
            const tab=activeTabId?tabs.find(({id})=>id===activeTabId):tabs[0];
            headerlist.scrollToIndex(tabs.indexOf(tab),false);
            tab.element?.click();
        },
    });
    const barview=View({
        id:useId("bar"),
        className:css.bar,
        style:`background-color:${tintColor}`,
    });
    
    tabnavigator.getIndicator=()=>barview;
    tabnavigator.getContentContainer=()=>tabnavigator.container;
    tabnavigator.getActiveId=()=>state.activeTab?.id;

    return tabnavigator;
}
