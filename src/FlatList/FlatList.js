import {useId,CherryView,removeItem,CherryMap,useSwipeGesture,findItem} from "../index";
import css from "./FlatList.module.css";
import EmptyIndicator from "./EmptyIndicator/EmptyIndicator";


export default function FlatList(props){
    const {parent,id=useId("flatlist"),emptymessage,renderItem,horizontal,backwards,pagingEnabled,scrollEnabled=true,threshold=0.5,transition="ease 300ms",onFilled,onReachEnd,onRemoveItem,onAddItems,onSwipe}=props;
    const flatlist=CherryView({
        parent,id,
        at:props.at,
        style:props.style,
        className:`${css.flatlist} ${props.className||""}`,
    }),state={
        data:Array.isArray(props.data)?[...props.data]:[],
        index:null,//last created element index
        itemEl:null,//last created element (observed)
        focus:null,//for paging, element in focus
        itemsmap:new CherryMap(),// [item,element] map
        endreached:!props.data?.length,
        firstOffset:null,//for paging lists: firstEl offset
        popuplist:null,
        isolatedcount:0,//elements with removed items count,
        offsetSide:"offset"+(horizontal?"Left":"Top"),
        filled:false,
    },{data,offsetSide}=state;

    flatlist.innateHTML=`
        <div 
            class="${css.container} ${props.containerClassName||""}" 
            ${backwards?"backwards"+(horizontal?"Horizontal":"Vertical"):""}
            style="${styles.container({nodata:state.endreached,pagingEnabled,transition,horizontal})}"
        ></div>
    `;
    let emptyindicator=(!(data&&data.length))&&EmptyIndicator({parent:flatlist,message:emptymessage});

    const container=flatlist.querySelector(`.${css.container}`);
    const observer=new IntersectionObserver(([entry])=>{
        const {isIntersecting}=entry;
        if(isIntersecting){
            if(onFilled&&(!state.filled)){
                const {index}=state;
                if((entry.intersectionRatio<1)||(index>=(data.length-1))){
                    state.filled=true;
                    onFilled({element:state.itemEl,item:data[index],index});
                }
            }
            state.index++;
            observer.unobserve(state.itemEl);
            const {index}=state;
            if(index<data.length){
                const item=data[index];
                createElement({item,index});
            }
            else{
                state.endreached=true;
                onReachEnd&&onReachEnd({container,data:props.data});
            }
        }
    },{root:flatlist,threshold});
    
    if(data&&data.length&&renderItem){
        state.index=state.focus=0;
        createElement({item:data[0],index:0});
        const {itemEl}=state;
        state.firstOffset=itemEl[offsetSide];
        observer.observe(itemEl);
    }

    if(pagingEnabled){
        //container.style.overflow="visible";
        flatlist.style.overflow="hidden";
        scrollEnabled&&useSwipeGesture({
            element:flatlist,
            onSwipe:(event)=>{if((horizontal&&(event.axis==="horizontal"))||((!horizontal)&&(event.axis==="vertical"))){
                const {focus}=state;
                const {direction}=event;
                let index;
                const forward=(direction==="left")||(direction==="top");
                const backward=(direction==="right")||(direction==="bottom");
                if(backwards?backward:forward){
                    const {itemsmap}=state;
                    if(focus<(itemsmap.length-1)){index=focus+1}
                }
                else{
                    if(focus){index=focus-1}
                    else{index=0}
                }
                if(index!==undefined){
                    flatlist.scrollToIndex(index);
                    Object.assign(event,{index,container});
                    onSwipe&&onSwipe(event);
                }
            }},
        });
    }
    else if(!scrollEnabled){
        container.style.overflow="hidden";
    }

    flatlist.addItems=(items)=>{
        if(Array.isArray(items)&&items.length){
            if(!data.length){
                container.style.display="block";
                emptyindicator.remove();
                emptyindicator=null;
            }
            data.push(...items);
            if(state.endreached){
                createElement({item:items[0],index:state.index});
                state.endreached=false;
            }
            onAddItems&&onAddItems(items);
        }
    }

    flatlist.removeItem=(predicate,withElement=true)=>{
        const {length}=data,item=removeItem(data,predicate),removed={item,element:null}; 
        if(data.length<length){
            const {itemsmap}=state;
            removed.element=itemsmap.get(item);
            if(withElement){
                const {element}=removed;
                (element instanceof Element)&&element.remove();
            }
            else{
                state.isolatedcount++;
            }
            itemsmap.delete(item);
            state.index--;
            if((!data.length)&&(!state.isolatedcount)){
                container.style.display="none";
                emptyindicator=EmptyIndicator({parent:flatlist,message:emptymessage});
            }
            onRemoveItem&&onRemoveItem(removed);
        }
        return removed;
    }

    flatlist.showItems=(predicate,popupProps)=>{
        const {popuplist}=state;
        popuplist&&popuplist.remove();
        flatlist.style.overflow=null;
        const items=(typeof(predicate)==="function")?data.filter(predicate):predicate;
        if(Array.isArray(items)){
            state.popuplist=FlatList({
                ...props,
                onReachEnd:null,
                onRemoveItem:null,
                ...popupProps,
                parent:flatlist,
                className:`${css.popuplist} ${props.popupClassName||""} ${popupProps.className||""}`,
                data:items,
            });
            flatlist.style.overflow="hidden";
        }
        else{
            state.popuplist=null;
        }
        return state.popuplist;
    }

    flatlist.scrollToOffset=(offset,smooth=true)=>{
        if(offset<0){offset=0};
        let lastEl=state.itemEl;
        observer.unobserve(lastEl);
        let reachedOffset=lastEl[offsetSide];
        const lastIndex=data.length-1;
        while((offset>=reachedOffset)&&(state.index<lastIndex)){
            const i=state.index=state.index+1;
            createElement({item:data[i],index:i},false);
            lastEl=state.itemEl;
            reachedOffset=lastEl[offsetSide];
        }
        observer.observe(lastEl);
        if(offset>=reachedOffset){offset=reachedOffset};
        if(pagingEnabled){
            if(scrollEnabled){
                const item=findItem(state.itemsmap.values(),(element)=>offset>=(element[offsetSide]-state.firstOffset),true);
                if(item){state.focus=item.index}
            }
            if(!smooth){
                container.style.transition="none";
                setTimeout(()=>{container.style.transition=transition},0);
            }
            const axis=horizontal?"X":"Y";
            container.style.transform=`${backwards?`scale${axis}(-1) `:""}translate${axis}(-${offset>0?offset:0}px)`;
        }
        else{
            container.scrollTo({
                [horizontal?"left":"top"]:offset,
                behavior:smooth?"smooth":"auto",
            });
        }
    }

    flatlist.scrollToIndex=(i,smooth=true)=>{
        const lastIndex=data.length-1;
        if(i>lastIndex){i=lastIndex} else if(i<0){i=0}
        state.focus=i;
        let element;
        const {index}=state;
        if(i>index){
            observer.unobserve(state.itemEl);
            for(let j=index+1;j<=i;j++){
                state.index=j;
                createElement({item:data[j],index:j},i===j);
            }
            element=state.itemEl;
        }
        else{
            element=state.itemsmap.at(i,true);
        }
        const offset=element[offsetSide]-state.firstOffset;
        flatlist.scrollToOffset(offset,smooth);
    };

    flatlist.container=container;

    function createElement(params,observe=true){
        const {item,index}=params;
        let element;
        element=renderItem({
            parent:container,
            item,index,
            data:props.data,
        });
        state.itemsmap.set(item,element);
        state.itemEl=element;
        observe&&observer&&observer.observe(element);
    }

    return flatlist;
}

const styles={
    container:({transition,horizontal,pagingEnabled,nodata})=>`
        height:${horizontal?"fit-content":"auto"};
        display:${nodata?"none":"block"};
        white-space:${horizontal?"nowrap":"normal"};
        ${pagingEnabled?`
            overflow:visible;
            transition:${transition};
        `:`
            overflow-x:${horizontal?"auto":"hidden"};
        `}
    `,
}
