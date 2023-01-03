import {useId,View} from "../index";
import css from "./ColorPicker.module.css";
import BubblesView from "./BubblesView/BubblesView";
import palette0 from "./Palette_0";


export default function ColorPicker(props){
    const {parent,id=useId("colorpicker"),icon=palette0,color="#B5B9BD",colors,onShowColors,onChange}=props;
    const colorpicker=View({
        parent,id,
        style:props.style,
        position:props.position,
        className:`${css.colorpicker} ${props.className}`,
    }),state={
        bubblesview:null,
    };

    colorpicker.innateHTML=`
        <img class="${css.button}" alt="Pick" src="${typeof(icon)==="function"?icon(color,2):(icon||"")}"/>
    `;

    const button=colorpicker.querySelector(`.${css.button}`);
    button.onclick=()=>{
        const {bubblesview}=state;
        if(bubblesview){
            bubblesview.unmount();
            state.bubblesview=null;
        }
        else{
            state.bubblesview=BubblesView({parent:colorpicker,colors});
            onShowColors&&onShowColors(colorpicker);
        }
    }

    colorpicker.setColor=(color)=>{
        const {bubblesview}=state;
        if(bubblesview){
            bubblesview.unmount();
            state.bubblesview=null;
        }
        if(color){
            if(typeof(icon)==="function"){button.src=icon(color)};
            onChange&&onChange(color);
        }
    }

    return colorpicker;
}
