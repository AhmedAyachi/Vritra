import {useId,View} from "../index";
import css from "./ColorPicker.module.css";
import BubblesView from "./BubblesView/BubblesView";
import palette0 from "./Palette_0";


export default function ColorPicker(props){
    const {parent,id=useId("colorpicker"),color,colors,onShowColors,onChange}=props;
    const colorpicker=View({parent,id,className:css.colorpicker}),state={
        bubblesview:null,
    };

    colorpicker.innateHTML=`
        <img class="${css.button}" alt="Pick" src="${palette0(color||"#B5B9BD")}"/>
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
            button.src=palette0(color);
            onChange&&onChange(color);
        }
    }

    return colorpicker;
}
