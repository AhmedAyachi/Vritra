import {useId,CherryView} from "../index";
/* import CherryView from "../CherryView/CherryView"; */
import css from "./DrawerNavigator.module.css";
import DrawerView from "./DrawerView/DrawerView";
import icon0 from "./Icon_0";


export default function DrawerNavigator(props){
    const {parent,id=useId("drawernavigator"),routes,initialId}=props;
    const drawernavigator=CherryView({
        parent,id,
        style:props.style,
        position:props.position,
        className:`${css.drawernavigator} ${props.className}`,
    }),state={
        activeId:initialId&&routes.some(({id})=>initialId===id)?initialId:routes[0].id,
    };

    drawernavigator.innateHTML=`
        <div class="${css.header} ${props.headerClassName||""}">
            <img class="${css.showbtn}" src="${icon0()}"/>
            <h3 class="${css.title}"></h3>
        </div>
        <div class="${css.container} ${props.containerClassName||""}"></div>
    `;

    const titleEl=drawernavigator.querySelector(`.${css.title}`);
    const container=drawernavigator.querySelector(`.${css.container}`);
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
            container.innerHTML="";
            titleEl.innerHTML="";
            titleEl.innerText=title;
            if(memorize&&(element instanceof HTMLElement)){
                container.appendChild(element);
                element.scrollTop=scrollTop
                element.scrollLeft=scrollLeft;
            }
            else if(component){
                const instance=component({parent:container});
                if(memorize){
                    route.element=instance;
                }
            }
        }
    }
    drawernavigator.setRoute(state.activeId);

    return drawernavigator;
}
