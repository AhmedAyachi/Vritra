import {useId,View,capitalize} from "../index";
import css from "./DraggableView.module.css";


export default function DraggableView(props){
    const {parent,ref=useId("draggableview"),id=ref,position={x:0,y:0},horizontalDrag=true,verticalDrag=true}=props;
    const draggableview=View({parent,id,style:props.style,className:`${css.draggableview} ${props.className||""}`}),state={
        x:position.x*window.innerWidth,
        y:position.y*window.innerHeight,
        dragX:null,dragY:null,dragDX:null,dragDY:null,
        dropX:null,dropY:null,dropDX:null,dropDY:null,
        onDrag:props.onDrag,
        onMove:props.onMove,
        onDrop:props.onDrag,
        isTouchDevice:isTouchDevice(),
    }
    Object.assign(draggableview.style,{left:`${state.x}px`,top:`${state.y}px`});
    
    draggableview.innerHTML="";

    if(verticalDrag||horizontalDrag){
        const {style}=draggableview,{isTouchDevice}=state;
        style.position="absolute";
        draggableview.addEventListener(isTouchDevice?"touchstart":"mousedown",(event)=>{
            const {clientX:x,clientY:y}=(isTouchDevice?event.changedTouches[0]:event),{offsetLeft,offsetTop}=draggableview,{onDrag}=state;
            state.dragX=x;
            state.dragY=y;
            state.dragDX=x-offsetLeft;
            state.dragDY=y-offsetTop;
            onDrag&&onDrag(draggableview,state);
            function onPointerMove(event){
                const {clientX:x,clientY:y}=(isTouchDevice?event.changedTouches[0]:event),{onMove,dragDX,dragDY}=state;
                state.x=x-dragDX;
                state.y=y-dragDY;
                if(horizontalDrag){
                    style.left=`${state.x}px`;
                }
                if(verticalDrag){
                    style.top=`${state.y}px`;
                }
                onMove&&onMove(draggableview,state);
            }
            window.addEventListener(isTouchDevice?"touchmove":"mousemove",onPointerMove);
            window.addEventListener(isTouchDevice?"touchend":"mouseup",(event)=>{
                const {clientX:x,clientY:y}=(isTouchDevice?event.changedTouches[0]:event),{onDrop}=state,{offsetLeft,offsetTop}=draggableview;
                state.dropX=x;
                state.dropY=y;
                state.dropDX=x-offsetLeft;
                state.dropDY=y-offsetTop;
                onDrop&&onDrop(draggableview,state);
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
    draggableview.getPosition=()=>({
        x:state.x/window.innerWidth,
        y:state.y/window.innerHeight,
    });
    draggableview.setPosition=({x,y})=>{
        const xchanged=state.x!==x,ychanged=state.y!==y;
        if(xchanged){
            state.x=x*window.innerWidth;
            draggableview.style.left=`${state.x}px`;
        }
        if(ychanged){
            state.y=y*window.innerHeight;
            draggableview.style.top=`${state.y}px`;
        }
        if(xchanged||ychanged){
            const {onMove}=state;
            onMove&&onMove(draggableview,state);
        }
    }

    return draggableview;    
}

const eventtypes=["drag","move","drop"];
const isTouchDevice=()=>((("ontouchstart" in window)||(navigator.maxTouchPoints>0)||(navigator.msMaxTouchPoints>0)));