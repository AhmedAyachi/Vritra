import {useId,View,capitalize} from "../index";
import css from "./DraggableView.module.css";


export default function DraggableView(props){
    const {parent,ref=useId("draggableview"),id=ref,position={x:0,y:0},horizontalDrag=true,verticalDrag=true}=props;
    const draggableview=View({parent,id,style:props.style,className:`${css.draggableview} ${props.className||""}`}),state={
        coords:getInitialCoords({parent,position}),
        dragX:null,dragY:null,//drag position relative to viewport
        dragDX:null,dragDY:null,//drag position relative to the draggableview
        onDrag:props.onDrag,
        onMove:props.onMove,
        onDrop:props.onDrop,
        isTouchDevice:isTouchDevice(),
    },{coords}=state;
    Object.assign(draggableview.style,{left:`${coords.px}px`,top:`${coords.py}px`});
    
    draggableview.innerHTML="";

    if(verticalDrag||horizontalDrag){
        const {style}=draggableview,{isTouchDevice}=state;
        style.position="absolute";
        draggableview.addEventListener(isTouchDevice?"touchstart":"mousedown",(event)=>{
            const {clientX:cx,clientY:cy}=(isTouchDevice?event.changedTouches[0]:event);
            const {offsetLeft,offsetTop}=draggableview,{left,top}=draggableview.getBoundingClientRect();
            Object.assign(coords,{
                x:left,y:top,
                dx:0,dy:0,
                px:offsetLeft,py:offsetTop,
            });
            state.dragX=left;
            state.dragY=top;
            state.dragDX=cx-offsetLeft;
            state.dragDY=cy-offsetTop;
            const {onDrag}=state;
            onDrag&&onDrag(structuredClone(coords),draggableview);
            function onPointerMove(event){
                const {clientX:cx,clientY:cy}=(isTouchDevice?event.changedTouches[0]:event),{left,top}=draggableview.getBoundingClientRect();
                Object.assign(coords,{
                    x:left,y:top,
                    dx:left-state.dragX,
                    dy:top-state.dragY,
                    px:cx-state.dragDX,
                    py:cy-state.dragDY,
                });
                if(horizontalDrag){
                    style.left=`${coords.px}px`;
                }
                if(verticalDrag){
                    style.top=`${coords.py}px`;
                }
                const {onMove}=state;
                onMove&&onMove(structuredClone(coords,draggableview));
            }
            window.addEventListener(isTouchDevice?"touchmove":"mousemove",onPointerMove);
            window.addEventListener(isTouchDevice?"touchend":"mouseup",(event)=>{
                const {left,top}=draggableview.getBoundingClientRect();
                Object.assign(coords,{
                    x:left,y:top,
                    dx:left-state.dragX,
                    dy:top-state.dragY,
                    px:draggableview.offsetLeft,
                    py:draggableview.offsetTop,
                });
                const {onDrop}=state;
                onDrop&&onDrop(structuredClone(coords,draggableview));
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
    draggableview.getPosition=()=>{
        const {width,height}=parent.getBoundingClientRect();
        const {x,y,px,py}=coords;
        return {
            x,y,px,py,
            xpercent:100*x/window.innerWidth,
            ypercent:100*y/window.innerHeight,
            pxpercent:100*px/width,
            pypercent:100*py/height,
        }
    };
    draggableview.setPosition=({x,y})=>{
        const xchanged=coords.x!==x,ychanged=coords.y!==y;
        if(xchanged){
            coords.x=x*window.innerWidth;
            draggableview.style.left=`${coords.x}px`;
        }
        if(ychanged){
            coords.y=y*window.innerHeight;
            draggableview.style.top=`${coords.y}px`;
        }
        if(xchanged||ychanged){
            const {onMove}=state;
            onMove&&onMove(structuredClone(coords,draggableview));
        }
    }

    return draggableview;    
}

const eventtypes=["drag","move","drop"];
const isTouchDevice=()=>((("ontouchstart" in window)||(navigator.maxTouchPoints>0)||(navigator.msMaxTouchPoints>0)));

const getInitialCoords=({parent,position})=>{
    const {width,height}=parent.getBoundingClientRect();
    return {
        x:null,y:null,//relative to viewport
        px:position.x*width,//relative to parent
        py:position.y*height,
        dx:null,dy:null,//relative to last position
    }
}
