import {useId,View,capitalize} from "../index";
import css from "./DraggableView.module.css";


export default function DraggableView(props){
    const {parent,ref=useId("draggableview"),id=ref,position={x:0,y:0},horizontalDrag=true,verticalDrag=true}=props;
    const draggableview=View({parent,id,style:props.style,className:`${css.draggableview} ${props.className||""}`}),state={
        coords:{
            pagex:null,pagey:null,//relative to viewport
            x:position.x,//relative to parent
            y:position.y,//relative to parent
            dx:null,dy:null,//relative to last position
        },
        dragX:null,dragY:null,//drag position relative to viewport
        dragDX:null,dragDY:null,//drag position relative to the draggableview
        onDrag:props.onDrag,
        onMove:props.onMove,
        onDrop:props.onDrop,
        isTouchDevice:isTouchDevice(),
    },{coords}=state;
    Object.assign(draggableview.style,{left:`${coords.x}px`,top:`${coords.y}px`});
    
    draggableview.innerHTML="";

    if(verticalDrag||horizontalDrag){
        const {style}=draggableview,{isTouchDevice}=state;
        style.position="absolute";
        draggableview.addEventListener(isTouchDevice?"touchstart":"mousedown",(event)=>{
            const {clientX:cx,clientY:cy}=(isTouchDevice?event.changedTouches[0]:event);
            const {offsetLeft,offsetTop}=draggableview,{left,top}=draggableview.getBoundingClientRect();
            Object.assign(coords,{
                pagex:left,pagey:top,
                dx:0,dy:0,
                x:offsetLeft,y:offsetTop,
            });
            state.dragX=left;
            state.dragY=top;
            state.dragDX=cx-offsetLeft;
            state.dragDY=cy-offsetTop;
            const {onDrag}=state;
            onDrag&&onDrag(structuredClone(coords),draggableview);
            function onPointerMove(event){
                const {clientX:cx,clientY:cy}=(isTouchDevice?event.changedTouches[0]:event);
                draggableview.setPosition({
                    x:cx-state.dragDX,
                    y:cy-state.dragDY,
                });
            }
            window.addEventListener(isTouchDevice?"touchmove":"mousemove",onPointerMove);
            window.addEventListener(isTouchDevice?"touchend":"mouseup",(event)=>{
                const {left,top}=draggableview.getBoundingClientRect();
                Object.assign(coords,{
                    pagex:left,pagey:top,
                    dx:left-state.dragX,
                    dy:top-state.dragY,
                    x:draggableview.offsetLeft,
                    y:draggableview.offsetTop,
                });
                const {onDrop}=state;
                onDrop&&onDrop(structuredClone(coords),draggableview);
                window.removeEventListener(isTouchDevice?"touchmove":"mousemove",onPointerMove);
            },{once:true})
        });
    }

    draggableview.setEventListener=(type,listener)=>{
        if(type&&eventtypes.includes(type)){
            type=capitalize(type);
            state[`on${type}`]=listener;
        }
    }
    draggableview.getPosition=(asratio)=>{
        const {x,y,pagex,pagey}=coords;
        let position;
        if(asratio){
            const {width,height}=parent.getBoundingClientRect();
            position={
                x:x/width,
                y:y/height,
                pagex:pagex/window.innerWidth,
                pagey:pagey/window.innerHeight,
            };
        }
        else{
            position={x,y,pagex,pagey};
        }
        return position;
    };
    draggableview.setPosition=({x,y},triggerOnMove=true)=>{
        Object.assign(coords,{x,y});
        const {style}=draggableview;
        if(horizontalDrag){
            style.left=`${coords.x}px`;
        }
        if(verticalDrag){
            style.top=`${coords.y}px`;
        }
        const {left,top}=draggableview.getBoundingClientRect();
        Object.assign(coords,{
            pagex:left,pagey:top,
            dx:left-state.dragX,
            dy:top-state.dragY,
        });
        if(triggerOnMove){
            const {onMove}=state;
            onMove&&onMove(structuredClone(coords),draggableview);
        }
    }
    draggableview.setPositionRatio=({x,y},triggerOnMove=true)=>{
        const {width,height}=parent.getBoundingClientRect();
        draggableview.setPosition({x:x*width,y:y*height},triggerOnMove);
    }

    return draggableview;    
}

const eventtypes=["drag","move","drop"];
const isTouchDevice=()=>((("ontouchstart" in window)||(navigator.maxTouchPoints>0)||(navigator.msMaxTouchPoints>0)));
