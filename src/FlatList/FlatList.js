import {NativeView,removeItem,FooMap,useSwipeGesture,findItem} from "../index";
import css from "./FlatList.module.css";
import EmptyIndicator from "./EmptyIndicator/EmptyIndicator";


export default function FlatList(props){
    const {parent,EmptyComponent=props.emptymessage,renderItem,horizontal,backwards,pagingEnabled,scrollEnabled=true,threshold=0.5,transition="ease 300ms",onReachEnd,onRemoveItem,onAddItems,onSwipe}=props;
    const flatlist=NativeView({
        parent,at:props.at,
        props:props.id,
        style:props.style,
        className:`${css.flatlist} ${props.className||""}`,
    }),state={
        data:Array.isArray(props.data)?[...props.data]:[],
        index:-1,//observed element index
        itemEl:null,//observed element
        infocusIndex:null,//for paging, the index of the element in focus
        itemsmap:new FooMap(),// [item,element] map
        endreached:!props.data?.length,
        firstOffset:null,//for paging lists: firstEl offset
        popuplist:null,
        isolatedcount:0,//elements with removed items count,
        offsetSide:"offset"+(horizontal?"Left":"Top"),
        filled:false,
        emptinessEl:null,
    },{data,offsetSide}=state;

    flatlist.innateHTML=`
        <div 
            ref="container"
            class="${css.container} ${props.containerClassName||""}" 
            ${backwards?"backwards"+(horizontal?"Horizontal":"Vertical"):""}
            style="${styles.container({pagingEnabled,transition,horizontal})}"
        ></div>
    `;
    const {container}=flatlist;
    (!data.length)&&showEmptinessElement();

    const observer=new IntersectionObserver(([entry])=>{
        const {isIntersecting}=entry;
        if(isIntersecting){
            if(state.index<(data.length-1)){
                createNextElement();
            }
            else if(!state.endreached){
                state.endreached=true;
                onReachEnd&&onReachEnd({container,data:props.data});
            }
        }
        if(props.onFilled&&(!state.filled)){
            let fillerIndex;
            if(isIntersecting){
                const {index}=state;
                if((entry.intersectionRatio<1)||(index>=(data.length-1))){
                    fillerIndex=index;
                }
            }
            else{
                fillerIndex=entry.intersectionRatio>0?state.index:state.index-1;
            }
            if(fillerIndex!==undefined){
                state.filled=true;
                props.onFilled({
                    index:fillerIndex,
                    item:data[fillerIndex],
                    element:state.itemsmap.at(fillerIndex,true),
                });
            }
        }
    },{root:flatlist,threshold});
    
    if(renderItem&&data.length){
        state.infocusIndex=0;
        createNextElement();
        state.firstOffset=state.itemEl[offsetSide];
    }
    else{
        onReachEnd&&onReachEnd({container,data:props.data});
    }

    if(pagingEnabled){
        //container.style.overflow="visible";
        flatlist.style.overflow="hidden";
        scrollEnabled&&useSwipeGesture({
            element:flatlist,
            onSwipe:(event)=>{if((horizontal&&(event.axis==="horizontal"))||((!horizontal)&&(event.axis==="vertical"))){
                const {infocusIndex}=state;
                const {direction}=event;
                let index;
                const forward=(direction==="left")||(direction==="top");
                const backward=(direction==="right")||(direction==="bottom");
                if(backwards?backward:forward){
                    const {itemsmap}=state;
                    const lastIndex=itemsmap.size-1;
                    index=infocusIndex<lastIndex?infocusIndex+1:lastIndex;
                }
                else{
                    index=infocusIndex?infocusIndex-1:0;
                }
                flatlist.scrollToIndex(index,true);
                Object.assign(event,{index,container});
                onSwipe&&onSwipe(event);
            }},
        });
    }
    else if(!scrollEnabled){
        container.style.overflow="hidden";
    }

    flatlist.addItems=(items)=>{if(Array.isArray(items)){
        const {length}=items;
        if(length){
            if(!data.length){
                container.style.display="block";
                state.emptinessEl.remove();
                state.emptinessEl=null;
            }
            data.push(...items);
        }
        if(state.endreached){
            if(length){
                state.endreached=false;
                createNextElement();
                //state.firstOffset=state.itemEl[offsetSide];
            }
            else{
                onReachEnd&&onReachEnd({container,data:props.data});
            }
        }
        onAddItems&&onAddItems(items);
    }}

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
                showEmptinessElement();
            }
            onRemoveItem&&onRemoveItem(removed);
        }
        return removed;
    }

    flatlist.showItems=(predicate,popupProps)=>{
        const {popuplist}=state;
        popuplist&&popuplist.remove();
        flatlist.style.overflow=null;
        const items=(typeof(predicate)==="function")?data.filter((item,i)=>{predicate(item,i)}):predicate;
        if(Array.isArray(items)){
            state.popuplist=FlatList({
                ...props,
                onReachEnd:null,
                onRemoveItem:null,
                ...popupProps,
                parent:flatlist,
                className:`${css.popuplist} ${props.popupClassName||""} ${popupProps?.className||""}`,
                data:items,
            });
            //flatlist.style.overflow="hidden";
        }
        else{
            state.popuplist=null;
        }
        return state.popuplist;
    }

    flatlist.scrollToOffset=(offset,smooth=true)=>{
        if(offset<0){offset=0};
        let lastEl=state.itemEl;
        let reachedOffset=lastEl[offsetSide];
        const lastIndex=data.length-1;
        while((offset>=reachedOffset)&&(state.index<lastIndex)){
            createNextElement(false);
            lastEl=state.itemEl;
            reachedOffset=lastEl[offsetSide];
        }
        observer.observe(lastEl);
        if(offset>=reachedOffset){offset=reachedOffset};
        if(pagingEnabled){
            if(scrollEnabled){
                const item=findItem(state.itemsmap.values(),(element)=>offset>=(element[offsetSide]-state.firstOffset),true);
                if(item){state.infocusIndex=item.index}
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
        const {onInFocusItemChange}=props;
        const lastIndex=data.length-1;
        if(i>lastIndex){i=lastIndex} else if(i<0){i=0}
        const infocusChanged=i!==state.infocusIndex;
        state.infocusIndex=i;
        let element;
        const {index}=state;
        if(i>index){
            observer.unobserve(state.itemEl);
            for(let j=index+1;j<=i;j++){
                createNextElement(i===j);
            }
            element=state.itemEl;
        }
        else{
            element=state.itemsmap.at(i,true);
        }
        const offset=element[offsetSide]-state.firstOffset;
        flatlist.scrollToOffset(offset,smooth);
        infocusChanged&&onInFocusItemChange&&onInFocusItemChange({index:i,element,item:data[i]});
    };

    function createNextElement(observe=true){
        state.index++;
        const {index}=state,item=data[index];
        const element=renderItem({
            parent:container,item,
            data:props.data,index,
        });
        state.itemsmap.set(item,element);
        if(observe){
            const {itemEl}=state;
            itemEl&&observer.unobserve(itemEl);
            observer.observe(element);
        }
        state.itemEl=element;
    }
    function showEmptinessElement(){
        if(typeof(EmptyComponent)==="function"){
            state.emptinessEl=EmptyComponent({parent:container});
        }
        else{
            state.emptinessEl=EmptyIndicator({
                parent:container,
                message:EmptyComponent,
            });
        }
    }

    return flatlist;
}

const styles={
    container:({transition,horizontal,pagingEnabled})=>`
        height:${horizontal?"fit-content":"auto"};
        white-space:${horizontal?"nowrap":"normal"};
        ${pagingEnabled?`
            overflow:visible;
            transition:${transition};
        `:`
            overflow-x:${horizontal?"auto":"visible"};
            overflow-y:${horizontal?"visible":"auto"};
        `}
    `,
}
