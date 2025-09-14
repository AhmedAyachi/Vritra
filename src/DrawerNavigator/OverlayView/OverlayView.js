import {View,fadeIn,fadeOut} from "../../index";
import css from "./OverlayView.module.css";
import DrawerView from "./DrawerView/DrawerView";


export default function OverlayView(props){
    const {parent,drawerScrollTop,onHide}=props;
    const overlayview=View({parent,className:css.overlayview});

    overlayview.innateHTML=`
        <div ref="background" class="${css.background}"></div>
    `;
    const drawerview=DrawerView({
        ...props,
        parent:overlayview,id:undefined,
        className:props.drawerClassName,
        scrollTop:drawerScrollTop,
    });
    const {background}=overlayview;
    background.onclick=()=>{
        if(!drawerview.style.animation) overlayview.hide();
    }

    overlayview.show=(routeId)=>{
        overlayview.hidden=false;
        drawerview.show(routeId);
        fadeIn(background,"block",DrawerView.statics.duration);
    }
    overlayview.hide=()=>{
        drawerview.hide();
        fadeOut(background,DrawerView.statics.duration+100,()=>{
            overlayview.hidden=true;
            onHide&&onHide(drawerview);
        });
    }

    return overlayview;
}
