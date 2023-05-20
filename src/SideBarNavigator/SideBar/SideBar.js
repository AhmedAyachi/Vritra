import {useId,View} from "../../index";
import css from "./SideBar.module.css";
import EntryExplorer from "./EntryExplorer/EntryExplorer";
import icon0 from "./Icon_0";


export default function SideBar(props){
    const {parent,id=useId("sidebar"),entries,tintColor,scrollTheme="dark"}=props;
    const sidebar=View({parent,id,at:"start",className:`${css.sidebar} ${props.className||""}`}),state={
        shown:true,
        width:sidebar.clientWidth,
    };

    sidebar.innateHTML=`
        <img class="${css.bartoggler}" src="${icon0(tintColor)}"/>
    `;

    const firstentry=entries[0];
    if(firstentry.expanded===undefined){
        firstentry.expanded=true;
    }
    EntryExplorer({
        ...props,entries,
        parent:sidebar,
        className:`${css.entryexplorer} ${css[scrollTheme+"explorer"]||""}`,
        lazy:false,
    });

    const bartoggler=sidebar.querySelector(`.${css.bartoggler}`);
    bartoggler.onclick=()=>{sidebar.toggle()};
    
    sidebar.toggle=(shown=!state.shown)=>{
        state.shown=shown;
        if(!shown){
            state.width=sidebar.offsetWidth;
        }
        Object.assign(sidebar.style,{
            minWidth:shown?null:0,
            width:shown?`${state.width}px`:0,
        });
        Object.assign(bartoggler.style,{
            right:shown?null:"-6em",
            transform:`rotateZ(${shown?0:180}deg)`,
        });
        shown&&setTimeout(()=>{
            sidebar.style.width=null;
        },200);
    }

    return sidebar;
}
