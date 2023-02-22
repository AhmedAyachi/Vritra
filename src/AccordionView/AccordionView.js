import {useId,CherryView,ActionSetView} from "../index";
import css from "./AccordionView.module.css";
import ContentView from "./ContentView/ContentView";
import icon from "./IndicatorIcon";


export default function AccordionView(props){
    const {parent,id=useId("accordionview"),headerStyle,renderHeader,indicator=icon,renderContent,actions,color="black",memorize=true,separate,onOpen,onClose}=props;
    const accordionview=CherryView({
        parent,id,
        position:props.position,
        className:`${css.accordionview} ${props.className||""}`,
        style:`opacity:${props.locked?0.5:1};${props.style||""}`,
    }),state={
        expanded:false,
        locked:Boolean(props.locked),
        contentEl:null,
        contentview:null,
        borderBottomLeftRadius:null,
        borderBottomRightRadius:null,
    };

    accordionview.innateHTML=`
        <div class="${css.header} ${renderHeader?"":css.defaultheader}" style="${headerStyle||""}">
            ${renderHeader?"":`
                <h3 class="${css.title}" style="color:${color};">${props.title||""}</h3>
                <div class="${css.actions}">
                    <img class="${css.indicator}" src="${typeof(indicator)==="function"?indicator(color,2):indicator}" alt=""/>
                </div>
            `}
        </div>
    `;
    const headerEl=accordionview.querySelector(`.${css.header}`);
    if(renderHeader){renderHeader(headerEl)}
    else if(actions){
        const actionsEl=accordionview.querySelector(`.${css.actions}`);
        const actionsetview=ActionSetView({
            parent:actionsEl,
            className:css.actionset,
            actions,color,
        });
        actionsetview.scrollLeft=actionsetview.scrollWidth;
    }

    headerEl.onclick=({status})=>{
        if(!state.locked){
            const expanded=state.expanded=(typeof(status)==="boolean")?status:(!state.expanded);
            if(!separate){
                const {style}=headerEl,{borderBottomLeftRadius,borderBottomRightRadius}=state;
                if(!borderBottomLeftRadius){
                    state.borderBottomLeftRadius=style.borderBottomLeftRadius;
                }
                if(!borderBottomRightRadius){
                    state.borderBottomRightRadius=style.borderBottomRightRadius;
                }
                Object.assign(style,{
                    borderBottomLeftRadius:expanded?0:borderBottomLeftRadius,
                    borderBottomRightRadius:expanded?0:borderBottomRightRadius,
                });
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
                    state.contentEl=renderContent&&renderContent(contentview);
                }
                onOpen&&onOpen(contentview);
            }
            else{
                const {contentview}=state;
                contentview&&contentview.unmount();
                state.contentview=null;
                onClose&&onClose();
            }
        }
    }

    accordionview.setLocked=(value)=>{
        state.expanded&&headerEl.click();
        state.locked=Boolean(value);
        accordionview.style.opacity=state.locked?0.5:1;
    }
    accordionview.toggle=(value=!state.expanded)=>{
        headerEl.onclick({status:Boolean(value)});
    }


    return accordionview;
}
