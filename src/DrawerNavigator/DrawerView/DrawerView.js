import {useId,View,fadeIn,fadeOut} from "../../index";
import css from "./DrawerView.module.css";
import RoutePicker from "./RoutePicker/RoutePicker";


export default function DrawerView(props){
    const {parent,id=useId("drawerview")}=props;
    const drawerview=View({parent,id,className:css.drawerview});

    drawerview.innateHTML=`
        <div class="${css.background}"></div>
    `;
    const routepicker=RoutePicker({...props,parent:drawerview,id:undefined});
    const background=drawerview.querySelector(`.${css.background}`);

    drawerview.unmount=()=>{
        routepicker.unmount();
        fadeOut(background,RoutePicker.statics.duration+100,()=>{
            drawerview.remove();
        });
    }

    fadeIn(background,RoutePicker.statics.duration,()=>{
        background.onclick=()=>{
            drawerview.unmount();
        }
    });
    return drawerview;
}
