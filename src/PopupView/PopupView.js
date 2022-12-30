import {useId,View,fadeIn,fadeOut} from "../index";
import css from "./PopupView.module.css";


export default function PopupView(props){
    const {target,parent=target?target.parentNode:document.body,id=useId("popupview"),avoidable=true,keepinDOM,onUnmount}=props;
    const popupview=View({
        parent,id,
        style:props.style,
        position:props.position,
        className:`${css.popupview} ${props.className||""}`,
    });

    popupview.innateHTML=`
    `;

    function onTouchScreen(event){
        const {target}=event;
        if(!target.closest(`#${id}`)){
            popupview.unmount();
        }
    }
    avoidable&&statics.avoidevents.forEach(type=>{window.addEventListener(type,onTouchScreen)});

    popupview.unmount=()=>{
        avoidable&&statics.avoidevents.forEach(type=>{window.removeEventListener(type,onTouchScreen)});
        fadeOut(popupview,keepinDOM?undefined:()=>{
            popupview.remove();
        });
        onUnmount&&onUnmount();
    }
    fadeIn(popupview,200);
    target&&setTimeout(()=>{Object.assign(popupview.style,getPosition(popupview,target))},0);
    return popupview;
}

const statics={
    offset:5,
    avoidevents:["touchstart","mousedown"],
}

const getPosition=(popupview,target)=>{
    const {left:targetLeft,top:targetTop,width:targetWidth,height:targetHeight}=target.getBoundingClientRect();
    const {clientWidth:width,clientHeight:height}=popupview,position={};
    const spacingRight=window.innerWidth-targetLeft+statics.offset;
    if(width<spacingRight){
        position.left=targetLeft-statics.offset;
    }
    else{
        position.right=spacingRight-targetWidth;
    }
    const spacingBottom=window.innerHeight-targetTop+statics.offset;
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
