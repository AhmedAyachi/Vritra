import {useId,CherryView} from "../index";
import css from "./DrawerNavigator.module.css";
import DrawerView from "./DrawerView/DrawerView";
import icon0 from "./Icon_0";


export default function DrawerNavigator(props){
    const {parent,id=useId("drawernavigator"),routes,initialId,renderHeader}=props;
    const drawernavigator=CherryView({
        parent,id,
        style:props.style,
        position:props.position,
        className:`${css.drawernavigator} ${props.className}`,
    }),state={
        activeId:initialId&&routes.some(({id})=>initialId===id)?initialId:routes[0].id,
        drawerview:null,
    };

    drawernavigator.innateHTML=`
        <div 
            class="${css.header} 
            ${props.headerClassName||""}" 
            ${renderHeader?"":`style="padding:4em"`}
        >
            ${renderHeader?"":`
                <img class="${css.showbtn}" src="${icon0()}"/>
                <h3 class="${css.title}"></h3>
            `}
        </div>
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
            const {id,component,memorize=true,element,scrollTop=0,scrollLeft=0}=route;
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
            else if(component){
                const instance=component({parent:container});
                if(memorize){
                    route.element=instance;
                }
            }
        }
    }
    drawernavigator.navigate(state.activeId);

    return drawernavigator;
}
