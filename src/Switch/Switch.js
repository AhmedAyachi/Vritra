import {useId,CherryView,sanitize} from "../index";
import css from "./Switch.module.css";


export default function Switch(props){
    const {parent,id=useId("switch"),thumbColor=statics.thumbColor,trackColor=statics.trackColor,readonly,onChange}=props;
    const switchEl=CherryView({
        parent,id,
        style:props.style,
        at:props.at,
        className:`${css.switch} ${props.className}`,
    }),state={
        active:!Boolean(props.active),
        editable:!readonly,
    },{editable}=state;

    switchEl.innateHTML=`
        <div class="${css.thumb}"></div>
    `;

    switchEl.onclick=editable&&(()=>{switchEl.toggle()});

    switchEl.toggle=(active=!state.active)=>{
        state.active=active;
        const thumb=switchEl.querySelector(`.${css.thumb}`);
        thumb.style.transform=`translateX(${active?100:0}%)`;
        thumb.style.backgroundColor=getColor(thumbColor,active),
        switchEl.style.backgroundColor=getColor(trackColor,active);
        editable&&onChange&&onChange(active);
    }
    switchEl.toggle();

    return switchEl;
}

const statics={
    thumbColor:"white",
    trackColor:{
        false:"rgba(0,0,0,0.25)",
        true:"#00A14B",
    },
}

const getColor=(value,active)=>{
    let color;
    if(value&&(typeof(value)==="object")){
        color=value[active];
    }
    else if(typeof(value)==="string"){
        color=value;
    }
    return sanitize(color,"#(,.");
}
