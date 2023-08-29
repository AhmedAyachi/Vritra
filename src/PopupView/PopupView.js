import {useId,NativeView,fadeIn,fadeOut} from "../index";
import css from "./PopupView.module.css";


export default function PopupView(props){
    const {parent=document.documentElement,id=useId("popupview"),target,avoidable=true,keepinDOM,onUnmount}=props;
    const popupview=NativeView({
        parent,id,
        style:props.style,
        at:props.at,
        className:`${css.popupview} ${props.className||""}`,
    });

    popupview.innateHTML=`
    `;

    parent.style.position="relative";
    function onTouchScreen(event){
        const {target}=event;
        if(!target.closest(`#${id}`)){
            popupview.unmount();
        }
    }
    avoidable&&statics.avoidevents.forEach(type=>{window.addEventListener(type,onTouchScreen)});
    popupview.cleanupEventListeners=()=>{
        avoidable&&statics.avoidevents.forEach(type=>{
            window.removeEventListener(type,onTouchScreen);
        });
    }

    popupview.unmount=()=>{
        (!keepinDOM)&&popupview.cleanupEventListeners();
        fadeOut(popupview,keepinDOM?undefined:()=>{
            popupview.remove();
        });
        onUnmount&&onUnmount();
    }
    fadeIn(popupview,200);
    target&&setTimeout(()=>{Object.assign(popupview.style,getPosition(popupview,target,parent))},0);
    return popupview;
}

const statics={
    offset:5,
    avoidevents:["touchstart","mousedown"],
}

const getPosition=(popupview,target,container)=>{
    const {left,top,width:targetWidth,height:targetHeight}=target.getBoundingClientRect();
    const {left:containerLeft,top:containerTop}=container.getBoundingClientRect();
    const targetLeft=left-containerLeft;
    const targetTop=top-containerTop;
    const {clientWidth:width,clientHeight:height}=popupview,position={};
    const spacingRight=container.clientWidth-targetLeft+statics.offset;
    if(width<spacingRight){
        position.left=targetLeft-statics.offset;
    }
    else{
        position.right=spacingRight-targetWidth;
    }
    const spacingBottom=container.clientHeight-targetTop+statics.offset;
    if(height<spacingBottom){
        position.top=targetTop-statics.offset;
    }
    else{
        position.bottom=spacingBottom-targetHeight;
    }
    for(const key in position){
        position[key]=`${100*position[key]/window.innerWidth}vw`
    }
    return position;
}
