import {useId,View,sanitize} from "../index";
import css from "./SwitchView.module.css";


export default function SwitchView(props){
    const {parent,id=useId("switchview"),thumbColor=statics.thumbColor,trackColor=statics.trackColor,onChange}=props;
    const switchview=View({
        parent,id,
        style:props.style,
        position:props.position,
        className:`${css.switchview} ${props.className}`,
    }),state={
        active:!Boolean(props.active),
    };

    switchview.innateHTML=`
        <div class="${css.thumb}"></div>
    `;

    switchview.onclick=()=>{switchview.toggle()};

    switchview.toggle=(active=!state.active)=>{
        state.active=active;
        const thumb=switchview.querySelector(`.${css.thumb}`);
        thumb.style.transform=`translateX(${active?100:0}%)`;
        thumb.style.backgroundColor=getColor(thumbColor,active),
        switchview.style.backgroundColor=getColor(trackColor,active);
        onChange&&onChange(active);
    }
    switchview.toggle();

    return switchview;
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
