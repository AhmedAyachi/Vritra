import {View,fadeIn,fadeOut} from "../../index";
import css from "./OverlayView.module.css";
import DrawerView from "./DrawerView/DrawerView";


export default function OverlayView(props){
    const {parent,drawerScrollTop,onHide}=props;
    const overlayview=View({parent,className:css.overlayview}),state={
        drawerScrollTop:0,
    };

    overlayview.innateHTML=`
        <div class="${css.background}"></div>
    `;
    const drawerview=DrawerView({
        ...props,
        parent:overlayview,id:undefined,
        className:props.drawerClassName,
        scrollTop:drawerScrollTop,
    });
    const background=overlayview.querySelector(`.${css.background}`);

    fadeIn(background,DrawerView.statics.duration,()=>{
        background.onclick=()=>{
            overlayview.unmount();
        }
    });

    overlayview.unmount=()=>{
        state.drawerScrollTop=drawerview.getContainerScrollTop();
        drawerview.unmount();
        fadeOut(background,DrawerView.statics.duration+100,()=>{
            overlayview.remove();
            onHide&&onHide(drawerview);
        });
    }

    overlayview.getDrawerContainerScrollTop=()=>state.drawerScrollTop;
    
    return overlayview;
}
