import {useId,CherryView} from "../index";
import css from "./DrawerNavigator.module.css";
import DrawerView from "./DrawerView/DrawerView";
import icon0 from "./Icon_0";


export default function DrawerNavigator(props){
    const {parent,id=useId("drawernavigator"),routes,initialId,renderHeader}=props;
    const drawernavigator=CherryView({
        parent,id,
        style:props.style,
        at:props.at,
        className:`${css.drawernavigator} ${props.className}`,
    }),state={
        activeId:initialId&&routes.some(({id})=>initialId===id)?initialId:routes[0].id,
        drawerview:null,
    };

    drawernavigator.innateHTML=`
        <header 
            class="${css.header} ${props.headerClassName||""}" 
            ${renderHeader?"":`style="padding:4em"`}
        >
            ${renderHeader?"":`
                <img class="${css.showbtn}" src="${icon0()}"/>
                <h3 class="${css.title}"></h3>
            `}
        </header>
        <div class="${css.container} ${props.containerClassName||""}"></div>
    `;
    routes?.forEach(route=>{
        if(!route.title){route.title=route.id};
    });
    
    if(!renderHeader){
        const showbtn=drawernavigator.querySelector(`.${css.showbtn}`);
        showbtn.onclick=()=>{drawernavigator.showDrawer()};
    }

    drawernavigator.showDrawer=()=>{
        const {drawerview}=state;
        drawerview&&drawerview.unmount();
        state.drawerview=DrawerView({
            parent:drawernavigator,
            routes:routes,
            activeId:state.activeId,
            drawerClassName:props.drawerClassName,
            tintColor:props.tintColor||"#1e90ff",
            onChange:(route)=>{drawernavigator.navigate(route.id)},
            onHide:()=>{state.drawerview=null},
        });
    }
    drawernavigator.navigate=(id)=>{
        const route=routes.find(route=>route.id===id);
        if(route){
            const {id,memorize=true,element,scrollTop=0,scrollLeft=0}=route;
            const blocking=id===state.activeId;
            state.activeId=id;
            const container=drawernavigator.querySelector(`.${css.container}`);
            container.innerHTML="";
            if(renderHeader){
                const header=drawernavigator.querySelector(`.${css.header}`);
                header.innerHTML="";
                renderHeader&&renderHeader({parent:header,route:{...route}});
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
            else{
                blocking?instantiateRoute(route,container):setTimeout(()=>{instantiateRoute(route,container)},20);
            }
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
    }
}
