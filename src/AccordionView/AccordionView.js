import {NativeView,ActionSetView} from "../index";
import css from "./AccordionView.module.css";
import ContentView from "./ContentView/ContentView";
import {VritraFragment} from "../Fragment/Fragment";
import icon from "./IndicatorIcon";


export default function AccordionView(props){
    const {parent,renderHeader,indicator=icon,renderContent,actions,tintColor=props.color||"black",memorize=true,separate,onOpen,onClose}=props;
    const accordionview=NativeView({
        parent,id:props.id,at:props.at,
        className:`${css.accordionview} ${props.className||""}`,
        style:`opacity:${props.locked?0.5:1};${props.style||""}`,
    }),state={
        expanded:false,
        interactive:true,
        locked:Boolean(props.locked),
        contentEl:null,
        contentview:null,
        borderBottomLeftRadius:undefined,
        borderBottomRightRadius:undefined,
    };

    accordionview.innateHTML=`
        <div 
            ref="headerEl"
            class="${css.header} ${renderHeader?"":css.defaultheader} ${props.headerClassName||""}"
        >
            ${renderHeader?"":`
                <h3 class="${css.title}" style="color:${tintColor};">${props.title||""}</h3>
                <div class="${css.actions}">
                    <img class="${css.indicator}" src="${typeof(indicator)==="function"?indicator(tintColor,2):indicator}" alt=""/>
                </div>
            `}
        </div>
    `;
    const {headerEl}=accordionview;
    if(renderHeader){renderHeader({parent:headerEl})}
    else if(actions){
        const actionsEl=accordionview.querySelector(`.${css.actions}`);
        const actionsetview=ActionSetView({
            parent:actionsEl,
            className:css.actionset,
            actions,color:tintColor,
        });
        actionsetview.scrollLeft=actionsetview.scrollWidth;
    }

    headerEl.onclick=()=>{
        if(!state.locked){accordionview.toggle()};
    }

    accordionview.setLocked=(value)=>{
        (value&&state.expanded)&&accordionview.toggle(false);
        state.locked=Boolean(value);
        accordionview.style.opacity=state.locked?0.5:1;
    }
    accordionview.toggle=(expanded=!state.expanded)=>{if(state.interactive){
        state.interactive=false;
        state.expanded=expanded;
        if(!separate){
            const {style}=headerEl,{borderBottomLeftRadius,borderBottomRightRadius}=state;
            if(expanded){
                state.borderBottomLeftRadius=style.borderBottomLeftRadius;
                state.borderBottomRightRadius=style.borderBottomRightRadius;
            }
            style.borderBottomLeftRadius=expanded?0:borderBottomLeftRadius;
            style.borderBottomRightRadius=expanded?0:borderBottomRightRadius;
        }
        const indicator=accordionview.querySelector(`.${css.indicator}`);
        if(indicator){
            indicator.style.transform=`rotateZ(${expanded?-180:0}deg)`;
        }
        if(expanded){
            const contentview=state.contentview=ContentView({
                parent:accordionview,
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
            onClose&&onClose();
        }
    }};
    
    return accordionview;
}
