import {View} from "../../index";
import css from "./SideBar.module.css";
import EntryExplorer from "./EntryExplorer/EntryExplorer";
import icon0 from "./Icon_0";


export default function SideBar(props){
    const {parent,entries,tintColor,scrollTheme="dark"}=props;
    const sidebar=View({
        parent,at:0,tag:"nav",
        className:[css.sidebar,props.className],
    }),state={
        shown:true,
        width:sidebar.clientWidth,
    };

    sidebar.innateHTML=`
        <button class="${css.togglebtn}" ref="togglebtn">
            <img  src="${icon0(tintColor)}"/>
        </button>
    `;

    const firstentry=entries[0];
    if(firstentry.expanded===undefined){
        firstentry.expanded=true;
    }
    EntryExplorer({
        ...props,entries,
        parent:sidebar,
        className:`${css.entryexplorer} ${css[scrollTheme+"explorer"]||""}`,
        containerClassName:css.entrycontainer,
        lazy:false,
    });

    const {togglebtn}=sidebar;
    togglebtn.onclick=()=>{sidebar.toggle()};
    
    sidebar.toggle=(shown=!state.shown)=>{if(shown!==state.shown){
        state.shown=Boolean(shown);
        if(!shown){
            state.width=sidebar.offsetWidth;
            sidebar.style.width=`${state.width}px`;
        }
        setTimeout(()=>{
            Object.assign(sidebar.style,{
                minWidth:shown?null:0,
                width:shown?`${state.width}px`:0,
            });
            Object.assign(togglebtn.style,{
                right:shown?null:"-7em",
                transform:`rotateZ(${shown?0:180}deg)`,
            });
            shown&&setTimeout(()=>{
                sidebar.style.width=null;
            },200);
        },10);
    }}

    return sidebar;
}
