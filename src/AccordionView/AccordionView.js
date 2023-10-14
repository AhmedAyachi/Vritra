import {useId,NativeView,ActionSetView} from "../index";
import css from "./AccordionView.module.css";
import ContentView from "./ContentView/ContentView";
import icon from "./IndicatorIcon";


export default function AccordionView(props){
    const {parent,renderHeader,indicator=icon,renderContent,actions,color="black",memorize=true,separate,onOpen,onClose}=props;
    const accordionview=NativeView({
        parent,id:props.id,at:props.at,
        className:`${css.accordionview} ${props.className||""}`,
        style:`opacity:${props.locked?0.5:1};${props.style||""}`,
    }),state={
        expanded:false,
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
                <h3 class="${css.title}" style="color:${color};">${props.title||""}</h3>
                <div class="${css.actions}">
                    <img class="${css.indicator}" src="${typeof(indicator)==="function"?indicator(color,2):indicator}" alt=""/>
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
            actions,color,
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
    accordionview.toggle=(expanded=!state.expanded)=>{
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
            const contentview=state.contentview=ContentView({parent:accordionview,className:props.containerClassName});
            if(memorize&&state.contentEl){
                contentview.appendChild(state.contentEl);
            }
            else{
                state.contentEl=renderContent&&renderContent({parent:contentview});
            }
            onOpen&&onOpen(contentview);
        }
        else{
            const {contentview}=state;
            contentview&&contentview.unmount();
            state.contentview=null;
            onClose&&onClose();
        }
    };


    return accordionview;
}
