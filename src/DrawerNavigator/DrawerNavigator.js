import {useId,View} from "../index";
import css from "./DrawerNavigator.module.css";
import DrawerView from "./DrawerView/DrawerView";
import icon0 from "./Icon_0";


export default function DrawerNavigator(props){
    const {parent,id=useId("drawernavigator"),routes}=props;
    const drawernavigator=View({
        parent,id,
        style:props.style,
        position:props.position,
        className:`${css.drawernavigator} ${props.className}`,
    }),state={
        activeId:routes[0].id,
    };

    drawernavigator.innateHTML=`
        <div class="${css.header}">
            <img class="${css.showbtn}" src="${icon0()}"/>
            <h3 class="${css.title}"></h3>
        </div>
        <div class="${css.content}"></div>
    `;

    const titleEl=drawernavigator.querySelector(`.${css.title}`);
    const contentEl=drawernavigator.querySelector(`.${css.content}`);
    const showbtn=drawernavigator.querySelector(`.${css.showbtn}`);
    showbtn.onclick=()=>{
        DrawerView({
            parent:drawernavigator,
            routes:routes,
            activeId:state.activeId,
            onChange:(route)=>{
                drawernavigator.setRoute(route.id);
            },
        });
    }

    drawernavigator.setRoute=(id)=>{
        const route=routes.find(route=>route.id===id);
        if(route){
            const {id,title=id,component,memorize=true,element,scrollTop=0,scrollLeft=0}=route;
            state.activeId=id;
            contentEl.innerHTML="";
            titleEl.innerHTML="";
            titleEl.innerText=title;
            if(memorize&&(element instanceof HTMLElement)){
                contentEl.appendChild(element);
                element.scrollTop=scrollTop
                element.scrollLeft=scrollLeft;
            }
            else if(component){
                const instance=component({parent:contentEl});
                if(memorize){
                    route.element=instance;
                }
            }
        }
    }
    drawernavigator.setRoute(state.activeId);

    return drawernavigator;
}
