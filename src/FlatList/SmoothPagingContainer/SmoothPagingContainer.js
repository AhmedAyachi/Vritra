import {DraggableView,findItem} from "../../index";
import css from "./SmoothPagingContainer.module.css";


export default function SmoothPagingContainer(props){
    const {parent,horizontal,data}=props,state={
        dragTime:null,
    },{itemsmap}=data;
    const smoothpagingcontainer=parent.container=DraggableView({
        parent,style:props.style,
        className:props.className,
        verticalDrag:!horizontal,
        horizontalDrag:horizontal,
        onDrag:()=>{
            state.dragTime=performance.now();
        },
        onDrop:({x,y,dx,dy})=>{
            const dtime=performance.now()-state.dragTime;
            if(horizontal?dx:dy){
                const forward=horizontal?(dx<0):(dy<0);
                const velocity=100*Math.abs(horizontal?dx:dy)/dtime;
                const clientLength="client"+(horizontal?"Width":"Height");
                if((dtime<100)&&(velocity>150)){
                    data.transitionDuration=2.5*velocity;
                    setTimeout(()=>{parent.scrollToIndex(data.infocusIndex+(forward?1:-1))},10);
                }
                else{
                    const scrollLength=horizontal?-x:-y;
                    if(scrollLength<0){
                        setTimeout(()=>{parent.scrollToOffset(0)},10);
                    }
                    else{
                        const {offsetThreshold=100}=props;
                        const item=findItem(itemsmap.values(),(element,i)=>{
                            const offset=element[data.offsetSide];
                            return forward?(scrollLength>(offset+offsetThreshold-parent[clientLength])):
                            (offset+element[clientLength]>=(scrollLength+offsetThreshold));
                        },forward)||{index:0};
                        item&&setTimeout(()=>{
                            data.transitionDuration=Math.max(velocity,200);
                            parent.scrollToIndex(item.index);
                        },10);
                    }
                }
            }
        },
    });

    smoothpagingcontainer.beforeEndHTML=`
    `;

    return smoothpagingcontainer;
}
