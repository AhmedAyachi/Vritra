import {useId,NativeView,fadeIn,fadeOut} from "../index";
import css from "./PopupView.module.css";


export default function PopupView(props){
    const {parent=document.documentElement,id=useId("popupview"),target,avoidable=true,keepinDOM,onRemove,onUnmount}=props;
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
    avoidable&&statics.avoidEvents.forEach(type=>{
        window.addEventListener(type,onTouchScreen);
    });

    popupview.cleanupEventListeners=()=>{
        avoidable&&statics.avoidEvents.forEach(type=>{
            window.removeEventListener(type,onTouchScreen);
        });
    }
    popupview.remove=(()=>{
        const remove=popupview.remove.bind(popupview);
        return ()=>{
            (!keepinDOM)&&popupview.cleanupEventListeners();
            fadeOut(popupview,keepinDOM?undefined:()=>{
                remove();
                onRemove?onRemove():onUnmount&&onUnmount();
            });
        }
    })();
    popupview.unmount=popupview.remove;
    
    target&&setTimeout(()=>{
        Object.assign(popupview.style,getPosition(popupview,target,parent,props.position));
    },0);
    return fadeIn(popupview,200);
}

const statics={
    offset:5,
    avoidEvents:["touchstart","mousedown"],
}

const getPosition=(popupview,target,container,defaultPosition)=>{
    if(defaultPosition&&typeof(defaultPosition)==="object"){
        if(typeof(defaultPosition.x)!=="number") defaultPosition.x=0;
        if(typeof(defaultPosition.y)!=="number") defaultPosition.y=0;
    }
    else{
        defaultPosition={x:0,y:0};
    }
    const {left,top}=target.getBoundingClientRect();
    const {left:containerLeft,top:containerTop}=container.getBoundingClientRect();
    const targetLeft=left-containerLeft;
    const targetTop=top-containerTop;
    const {clientWidth:width,clientHeight:height}=popupview,position={};
    const spacingRight=container.clientWidth-targetLeft-defaultPosition.x+statics.offset;
    if(width<spacingRight){
        position.left=targetLeft+defaultPosition.x-statics.offset;
    }
    else{
        const right=spacingRight-statics.offset,offsetLeft=right+width;
        if(offsetLeft>=container.clientWidth){
            position.bottom=offsetLeft-container.clientWidth;
        }
        else{
            position.right=right;
        }
    }
    const spacingBottom=container.clientHeight-targetTop-defaultPosition.y+statics.offset;
    if(height<spacingBottom){
        position.top=targetTop+defaultPosition.y-statics.offset;
    }
    else{
        const bottom=spacingBottom-statics.offset,offsetTop=bottom+height;
        if(offsetTop>=container.clientHeight){
            position.bottom=offsetTop-container.clientHeight;
        }
        else{
            position.bottom=bottom;
        }        
    }
    for(const key in position){
        position[key]=`${100*position[key]/window.innerWidth}vw`;
    }
    return position;
}
