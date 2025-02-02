import {NativeView,sanitize} from "../index";
import css from "./Switch.module.css";


export default function Switch(props){
    const {parent,thumbColor,trackColor,readonly,onChange}=props;
    const switchEl=NativeView({
        parent,at:props.at,
        id:props.id,style:props.style,
        className:[css.switch,props.className],
    }),state={
        active:!Boolean(props.active),
        editable:!readonly,
    },{editable}=state;

    switchEl.innateHTML=`
        <div class="${css.thumb}"></div>
    `;

    if(editable){
        switchEl.onclick=()=>{
            switchEl.toggle();
            onChange&&onChange(state.active);
        };
    }

    switchEl.toggle=(active=!state.active)=>{
        state.active=active;
        const thumb=switchEl.querySelector(`.${css.thumb}`);
        thumb.style.transform=`translateX(${active?100:0}%)`;
        thumb.style.backgroundColor=getColor(thumbColor,active)||statics.thumbColor,
        switchEl.style.backgroundColor=getColor(trackColor,active)||statics.trackColor[active];
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
