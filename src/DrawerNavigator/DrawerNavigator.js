import {NativeView} from "../index";
import css from "./DrawerNavigator.module.css";
import OverlayView from "./OverlayView/OverlayView";
import icon0 from "./Icon_0";


export default function DrawerNavigator(props){
    const {parent,routes,initialId,tintColor="#1e90ff",renderHeader}=props;
    const drawernavigator=NativeView({
        parent,id:props.id,
        style:props.style,
        at:props.at,
        className:[css.drawernavigator,props.className],
    }),state={
        overlayview:null,
        activeId:initialId&&routes.some(({id})=>initialId===id)?initialId:routes[0].id,
    };

    drawernavigator.innateHTML=`
        ${renderHeader?"":`
            <header 
                ref="header"
                class="${css.header} ${props.headerClassName||""}" 
            >
                <img class="${css.showbtn}"/>
                <h3 class="${css.title}"></h3>
            </header>
        `}
        <div ref="container" class="${css.container} ${props.containerClassName||""}"></div>
    `;
    routes?.forEach(route=>{
        if(!route.title) route.title=route.id;
    });
    
    let {header}=drawernavigator;
    if(header){
        header.style.backgroundColor=tintColor;
        const showbtn=drawernavigator.querySelector(`.${css.showbtn}`);
        showbtn.src=icon0(getComputedStyle(header).color);
        showbtn.onclick=()=>{drawernavigator.showDrawer()};
    }


    drawernavigator.showDrawer=()=>{
        if(!state.overlayview) state.overlayview=OverlayView({
            parent:drawernavigator,
            routes:routes,tintColor,
            drawerClassName:props.drawerClassName,
            renderHeader:props.renderDrawerHeader,
            renderFooter:props.renderDrawerFooter,
            onChange:(route)=>{drawernavigator.navigate(route.id)},
        });
        state.overlayview.show(state.activeId);
    }
    drawernavigator.navigate=(id)=>{
        const route=routes.find(route=>route.id===id);
        if(route){
            const {id,memorize=true,element,scrollTop=0,scrollLeft=0}=route;
            const blocking=id===state.activeId;
            state.activeId=id;
            const {container}=drawernavigator;
            container.innerHTML="";
            if(renderHeader){
                header&&header.remove();
                header=drawernavigator.insertAdjacentElement("afterbegin",renderHeader({
                    parent:drawernavigator,
                    defaultIcon:icon0,
                    route:{...route,
                        render:()=>{
                            container.innerHTML="";
                            return instantiateRoute(route,container);
                        },
                    },
                }));
            }
            else{
                const titleEl=drawernavigator.querySelector(`.${css.title}`);
                titleEl.innerHTML="";
                titleEl.innerText=route.title;
            }
            if(memorize&&(element instanceof HTMLElement)){
                container.appendChild(element);
                element.scrollTop=scrollTop
                element.scrollLeft=scrollLeft;
            }
            else if(blocking) instantiateRoute(route,container);
            else setTimeout(()=>{instantiateRoute(route,container)},20);
        }
    }

    drawernavigator.navigate(state.activeId);
    return drawernavigator;
}

const instantiateRoute=(route,parent)=>{
    const {component}=route;
    if(component){
        const {memorize=true}=route; 
        const instance=component({parent});
        if(memorize){
            route.element=instance;
        }
        return instance;
    }
}
