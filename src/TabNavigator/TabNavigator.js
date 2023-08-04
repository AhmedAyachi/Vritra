import {useId,CherryView,View,FlatList} from "../index";
import css from "./TabNavigator.module.css";
import TabView from "./TabView/TabView";


export default function TabNavigator(props){
    const {parent,tabs,memorize=true,tabTextColor="#cecece",tintColor="#1e90ff",onNavigate}=props;
    const tabnavigator=CherryView({
        parent,id:props.id,at:props.at,style:props.style,
        className:`${css.tabnavigator} ${props.className||""}`,
    }),state={
        activeTab:null,
        //defaultId:(tabs.find(({active})=>active)||tabs[0]).id,
    };

    tabnavigator.innateHTML=`
        <div class="${css.container} ${props.containerClassName||""}"></div>
    `;
    const headerlist=FlatList({
        parent:tabnavigator,
        at:"start",
        className:`${css.header} ${props.headerClassName||""}`,
        containerClassName:css.tabcontainer,
        horizontal:true,
        data:tabs,
        threshold:0,
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
            const {element}=tabs[0];
            element.click();
        },
    });
    const barview=View({
        id:useId("bar"),
        className:css.bar,
        style:`background-color:${tintColor}`,
    });
    
    tabnavigator.getIndicator=()=>barview;
    tabnavigator.getContentContainer=()=>tabnavigator.querySelector(`.${css.container}`);
    tabnavigator.getActiveId=()=>state.activeTab?.id;

    return tabnavigator;
}
