import {NativeView,ActionSetView} from "../index";
import css from "./Accordion.module.css";
import ContentView from "./ContentView/ContentView";
import {VritraFragment} from "../Fragment/Fragment";
import icon from "./IndicatorIcon";


export default function Accordion(props){
    const {parent,renderHeader,indicator=icon,renderContent,actions,tintColor=props.color||"black",memorize=true,separate,onOpen,onClose}=props;
    const accordion=NativeView({
        parent,tag:"section",
        id:props.id,at:props.at,
        className:[css.accordion,props.className],
        style:[props.style,props.locked&&{opacity:0.5}],
    }),state={
        open:false,
        interactive:true,
        locked:Boolean(props.locked),
        headerEl:null,
        contentEl:null,
        contentview:null,
        borderBottomLeftRadius:null,
        borderBottomRightRadius:null,
    };

    accordion.innateHTML=`
        <div 
            ref="headerEl"
            class="${css.header} ${renderHeader?"":css.defaultheader} ${props.headerClassName||""}"
        >
            ${renderHeader?"":`
                <h3 class="${css.title}" style="color:${tintColor};">${props.title||""}</h3>
                <div ref="tailEl" class="${css.tail}">
                    <img 
                        class="${css.indicator}" role="button" alt="toggle accordion"
                        src="${typeof(indicator)==="function"?indicator(tintColor,2):indicator}"   
                    />
                </div>
            `}
        </div>
    `;
    const {headerEl}=accordion;
    if(renderHeader) state.headerEl=renderHeader({parent:headerEl});
    else if(actions){
        const actionsetview=ActionSetView({
            parent:accordion.tailEl,
            style:{flexDirection:"row-reverse"},
            className:css.actionset,
            actions,color:tintColor,
        });
        actionsetview.scrollLeft=actionsetview.scrollWidth;
    }

    headerEl.onclick=()=>{
        if(!state.locked) accordion.toggle();
    }

    accordion.setLocked=(value)=>{
        if(value&&state.open) accordion.toggle(false);
        accordion.isLocked=value;
    }
    accordion.toggle=(open=!state.open)=>{
        open=Boolean(open);
        if(state.interactive&&(open!==state.open)){
            state.interactive=false;
            state.open=open;
            if(!separate){
                const {style}=headerEl,{borderBottomLeftRadius,borderBottomRightRadius}=state;
                if(open){
                    state.borderBottomLeftRadius=style.borderBottomLeftRadius;
                    state.borderBottomRightRadius=style.borderBottomRightRadius;
                }
                style.borderBottomLeftRadius=open?0:borderBottomLeftRadius;
                style.borderBottomRightRadius=open?0:borderBottomRightRadius;
            }
            const indicator=accordion.querySelector(`.${css.indicator}`);
            if(indicator){
                indicator.style.transform=`rotateZ(${open?-180:0}deg)`;
            }
            if(open){
                const contentview=state.contentview=ContentView({
                    parent:accordion,
                    className:props.containerClassName,
                    onShow:()=>{
                        state.interactive=true;
                    },
                });
                const {contentEl}=state;
                if(memorize&&contentEl){
                    if(contentEl instanceof VritraFragment){
                        contentEl.appendTo(contentview);
                    }
                    else{
                        contentview.appendChild(contentEl);
                    }
                }
                else{
                    state.contentEl=renderContent&&renderContent({parent:contentview});
                }
                onOpen&&onOpen(contentview);
            }
            else{
                const {contentview}=state;
                contentview&&contentview.unmount(()=>{
                    state.interactive=true;
                });
                state.contentview=null;
                onClose&&onClose(contentview);
            }
        }
    };
    
    Object.defineProperties(accordion,{
        header:{get:()=>state.headerEl},
        content:{get:()=>state.contentEl},
        isOpen:{get:()=>state.open},
        isLocked:{
            get:()=>state.locked,
            set:(value)=>{
                state.locked=Boolean(value);
                headerEl.style.opacity=state.locked?0.5:null;
            },
        },
    });

    if(props.open) setTimeout(()=>{accordion.toggle(true)},0);
    return accordion;
}
