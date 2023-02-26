import {useId,CherryView} from "../index";
import css from "./Palette.module.css";
import BubblesView from "./BubblesView/BubblesView";
import icon0 from "./Icon_0";


export default function Palette(props){
    const {parent,id=useId("palette"),icon=icon0,color="black",colors=statics.colors,onShowColors,onChange}=props;
    const palette=CherryView({
        parent,id,
        style:props.style,
        position:props.position,
        className:`${css.palette} ${props.className}`,
    }),state={
        bubblesview:null,
    };

    palette.innateHTML=`
        <img class="button ${css.button}" alt="Pick" src="${typeof(icon)==="function"?icon(color,2):(icon||"")}"/>
    `;

    const button=palette.querySelector(`.${css.button}`);
    button.onclick=()=>{
        const {bubblesview}=state;
        if(bubblesview){
            bubblesview.unmount();
            state.bubblesview=null;
        }
        else{
            state.bubblesview=BubblesView({parent:palette,colors});
            onShowColors&&onShowColors(palette);
        }
    }

    palette.setColor=(value,callOnChange=true)=>{
        const {bubblesview}=state;
        if(bubblesview){
            bubblesview.unmount();
            state.bubblesview=null;
        }
        if(!colors.includes(value)){
            value=color;
        }
        if(typeof(icon)==="function"){button.src=icon(value)};
        callOnChange&&onChange&&onChange(value);
    }

    return palette;
}

const statics={
    colors:["red","purple","blue","cyan","green","yellow","orange","black","white"],
}
