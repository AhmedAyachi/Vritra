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
        onDrop:({x,y,dx,dy})=>{setTimeout(()=>{
            const dtime=performance.now()-state.dragTime;
            const {offsetThreshold=100}=props;
            const distance=Math.abs(horizontal?dx:dy);
            if(distance>=offsetThreshold){
                const forward=horizontal?(dx<0):(dy<0);
                const velocity=100*distance/dtime;
                if((dtime<100)&&(velocity>150)){
                    data.transitionDuration=2.5*velocity;
                    parent.scrollToIndex(data.infocusIndex+(forward?1:-1));
                }
                else{
                    const scrollLength=horizontal?-x:-y;
                    if(scrollLength<0){
                        parent.scrollToOffset(0);
                    }
                    else{
                        const clientLength="client"+(horizontal?"Width":"Height");
                        const item=findItem(itemsmap.values(),(element)=>{
                            const offset=element[data.offsetSide];
                            return forward?(scrollLength>(offset-parent[clientLength])):
                            (offset+element[clientLength]>=(scrollLength));
                        },forward)||{index:0};
                        if(item){
                            data.transitionDuration=Math.max(velocity,200);
                            parent.scrollToIndex(item.index);
                        }
                    }
                }
            }
            else{
                parent.scrollToIndex(data.infocusIndex);
            }
        },10)},
    });

    smoothpagingcontainer.beforeEndHTML=`
    `;

    return smoothpagingcontainer;
}
