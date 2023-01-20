import {useId,View,sanitize} from "../index";
import css from "./Switch.module.css";


export default function Switch(props){
    const {parent,id=useId("switch"),thumbColor=statics.thumbColor,trackColor=statics.trackColor,onChange}=props;
    const switchEl=View({
        parent,id,
        style:props.style,
        position:props.position,
        className:`${css.switch} ${props.className}`,
    }),state={
        active:!Boolean(props.active),
    };

    switchEl.innateHTML=`
        <div class="${css.thumb}"></div>
    `;

    switchEl.onclick=()=>{switchEl.toggle()};

    switchEl.toggle=(active=!state.active)=>{
        state.active=active;
        const thumb=switchEl.querySelector(`.${css.thumb}`);
        thumb.style.transform=`translateX(${active?100:0}%)`;
        thumb.style.backgroundColor=getColor(thumbColor,active),
        switchEl.style.backgroundColor=getColor(trackColor,active);
        onChange&&onChange(active);
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