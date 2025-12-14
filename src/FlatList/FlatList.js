import {NativeView,removeItem,FooMap,useSwipeGesture,findItem} from "../index";
import css from "./FlatList.module.css";
import EmptyIndicator from "./EmptyIndicator/EmptyIndicator";
import SmoothPagingContainer from "./SmoothPagingContainer/SmoothPagingContainer";


export default function FlatList(props){
    const {parent,horizontal,backwards,smoothPaging,pagingEnabled,scrollEnabled=true,threshold=0.5,transition="ease 300ms",pagingTransition=transition,renderItem,onReachEnd,onRemoveItem,onAddItems}=props;
    const flatlist=NativeView({
        parent,at:props.at,
        props:props.id,
        style:props.style,
        className:[css.flatlist,props.className],
    }),state={
        data:(it=>Array.isArray(it)?[...it]:[])(props.data),
        index:-1,//observed element index
        observedEl:null,//observed element
        infocusIndex:null,//for paging, the index of the element in focus
        itemsMap:new FooMap(),// [item,element] map
        endReached:!props.data?.length,
        firstOffset:null,//for paging lists: firstEl offset
        popuplist:null,
        offsetSide:"offset"+(horizontal?"Left":"Top"),
        filled:false,
        emptinessEl:null,
        step:Math.max(1,props.step)||1,
        scrollLength:0,
        triggerOnScrollEnd:true,
        snapOffsetThreshold:props.snapOffsetThreshold||props.offsetThreshold||(flatlist["client"+(horizontal?"Width":"Height")]/3),
    },{data,offsetSide,step,snapOffsetThreshold}=state;

    flatlist.innateHTML=`
        ${scrollEnabled&&pagingEnabled&&smoothPaging?"":`
            <div 
                ref="container"
                class="${css.container} ${props.containerClassName||""}" 
                style="${styles.container({pagingEnabled,pagingTransition,horizontal})}"
            ></div>
        `}
    `;
    const container=flatlist.container=flatlist.container||SmoothPagingContainer({
        parent:flatlist,
        className:`${css.container} ${props.containerClassName||""}`,
        data:state,
        snapOffsetThreshold,
        horizontal,backwards,
    });
    container.setAttribute("style",styles.container({
        pagingEnabled,horizontal,
        pagingTransition,smoothPaging,
    }));
    const attribute=backwards?"backwards"+(horizontal?"Horizontal":"Vertical"):"";
    attribute&&container.setAttribute(attribute,"");

    if(props.snapToItems&&(!pagingEnabled)){
        addScrollEndListener(container,()=>{
            const scrollLength=horizontal?container.scrollLeft:container.scrollTop;
            if(state.triggerOnScrollEnd){
                const dscroll=scrollLength-state.scrollLength;
                const lengthSuffix=horizontal?"Width":"Height";
                const clientLengthKey="client"+lengthSuffix;
                let itemIndex;
                if(Math.abs(dscroll)>=snapOffsetThreshold){
                    const item=findItem(state.itemsMap.values(),(element)=>element[offsetSide]>=scrollLength)||{
                        index:0,
                        value:state.itemsMap.at(0,true),
                    };
                    itemIndex=item.index;
                    if(itemIndex>0){
                        const element=item.value;
                        if(dscroll>0){
                            if((scrollLength+container[clientLengthKey]-element[offsetSide])<snapOffsetThreshold){
                                itemIndex--;
                            }
                        }
                        else{
                            const prevElement=state.itemsMap.at(item.index-1,true);
                            const sideOffset=prevElement[offsetSide]+prevElement[clientLengthKey];
                            if(Math.abs(scrollLength-sideOffset)>=snapOffsetThreshold){
                                itemIndex--;
                            }
                        }
                    }
                }
                else{
                    itemIndex=state.infocusIndex;
                }
                flatlist.scrollToIndex(itemIndex);
                if((scrollLength<=0)||((container["scroll"+lengthSuffix]-(scrollLength+container[clientLengthKey]))<=2)){
                    state.scrollLength=scrollLength;
                    state.triggerOnScrollEnd=true;
                }
            }
            else{
                state.scrollLength=scrollLength;
                state.triggerOnScrollEnd=true;
            } 
        });
    }

    (!data.length)&&showEmptinessElement();
    const observer=new IntersectionObserver(([entry])=>{
        const {isIntersecting}=entry;
        let entryTargetIndex=state.index;
        if(isIntersecting){
            const lastItemIndex=data.length-1;
            if(state.index<lastItemIndex){
                const max=Math.min(step,lastItemIndex-state.index);
                for(let i=1;i<=max;i++){
                    createNextElement(i===1);
                }
            }
            else if(!state.endReached){
                state.endReached=true;
                state.observedEl=null;
                observer.disconnect();
                onReachEnd&&onReachEnd({container,data:props.data});
            }
        }
        if(props.onFilled&&(!state.filled)){
            let fillerIndex;
            if(isIntersecting){
                if((entry.intersectionRatio<1)||(entryTargetIndex>=(data.length-1))){
                    fillerIndex=entryTargetIndex;
                }
            } else {
                fillerIndex=entry.intersectionRatio>0?state.index:state.index-1;
            }
            if(fillerIndex!==undefined){
                state.filled=true;
                const element=state.itemsMap.at(fillerIndex,true);
                props.onFilled({
                    index:fillerIndex,
                    item:data[fillerIndex],element,
                    visibilityRatio:entry.intersectionRatio||1,
                });
            }
        }
    },{root:flatlist,threshold});

    //In case the flatlist was inserted into the DOM using appendChild, 
    //and the observer is not triggered, this forces observation by unobserve/observe.
    if(flatlist.isConnected) setTimeout(()=>{
        const {observedEl}=state;
        if(observedEl instanceof Element){
            observer.disconnect();
            observer.observe(observedEl);
        }
    },15);
    
    if(renderItem&&data.length){
        state.infocusIndex=0;
        createNextElement();
        state.firstOffset=state.observedEl[offsetSide];
    }
    else{
        onReachEnd&&onReachEnd({container,data:props.data});
    }

    if(pagingEnabled){
        flatlist.style.overflow="hidden";
        if(scrollEnabled&&!smoothPaging) useSwipeGesture({
            element:flatlist,
            onSwipe:(event)=>{if(horizontal?event.axis==="horizontal":event.axis==="vertical"){
                let index;
                const {direction}=event;
                const {infocusIndex}=state;
                const forward=(direction==="left")||(direction==="top");
                const backward=(direction==="right")||(direction==="bottom");
                if(backwards?backward:forward){
                    const {itemsMap}=state;
                    const lastIndex=itemsMap.size-1;
                    index=infocusIndex<lastIndex?infocusIndex+1:lastIndex;
                }
                else{
                    index=infocusIndex?infocusIndex-1:0;
                }
                flatlist.scrollToIndex(index,true);
                Object.assign(event,{index,container});
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
        if(state.endReached){
            if(length){
                state.endReached=false;
                createNextElement();
                if(data.length===length){
                    //if the flatlist data was initially empty
                    setTimeout(()=>{
                        state.firstOffset=state.itemsMap.at(0,true)[offsetSide];
                    },0);
                }
            } else {
                onReachEnd&&onReachEnd({container,data:props.data});
            }
        }
        onAddItems&&onAddItems(items);
    }}

    flatlist.removeItem=(predicate,withElement=true)=>{
        const item=removeItem(data,predicate);
        if(item){
            const {itemsMap}=state;
            const element=itemsMap.get(item);
            if(element){
                const removed={item,element};
                if(withElement){
                    const {element}=removed;
                    if(element instanceof Element) element.remove();
                }
                itemsMap.delete(item);
                state.index--;
                if((!data.length)&&(!container.childNodes.length)){
                    showEmptinessElement();
                }
                onRemoveItem&&onRemoveItem(removed);
            }
            else return null;
        }
        else return null;
    }

    flatlist.clear=()=>{if(data.length){
        const {observedEl,itemsMap}=state;
        state.index=-1;
        state.filled=false;
        state.endReached=true;
        state.infocusIndex=null;
        if(observedEl instanceof Element){
            state.observedEl=null;
            observer.disconnect();
        }
        data.forEach(item=>{
            const element=itemsMap.get(item);
            itemsMap.delete(itemsMap);
            removeItem(item,data);
            element?.remove();
            onRemoveItem&&onRemoveItem({item,element});
        });
        itemsMap.clear();
        data.splice(0,data.length);
        flatlist.scrollToOffset(0,false);
        showEmptinessElement();
    }}

    flatlist.showItems=(predicate,popupProps)=>{
        const {popuplist}=state;
        if(popuplist) popuplist.remove();
        flatlist.style.overflow=null;
        const items=(typeof(predicate)==="function")?data.filter((item,i)=>predicate(item,i)):predicate;
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
        } else {
            state.popuplist=null;
            
        }
        return state.popuplist;
    }

    flatlist.scrollToOffset=(offset,smoothly=true)=>{
        state.triggerOnScrollEnd=false;
        if(offset<=0) offset=0;
        else if(data.length>0){
            let lastEl=state.itemsMap.at(state.index,true);
            let reachedOffset=lastEl[offsetSide];
            const lastIndex=data.length-1;
            while((offset>=reachedOffset)&&(state.index<lastIndex)){
                createNextElement(reachedOffset===offset);
                lastEl=state.observedEl;
                reachedOffset=lastEl[offsetSide];
            }
            const scrollLength=reachedOffset+(horizontal?lastEl.clientWidth:lastEl.clientHeight);
            if(offset>=scrollLength) offset=scrollLength;
        }
        if(pagingEnabled){
            if(scrollEnabled){
                const item=findItem(state.itemsMap.values(),(element)=>offset>=(element[offsetSide]-state.firstOffset),true);
                if(item){
                    state.infocusIndex=item.index;
                }
            }
            if(!smoothly){
                container.style.transition="none";
                setTimeout(()=>{container.style.transition=pagingTransition},40);
            }
            const axis=horizontal?"X":"Y";
            if(scrollEnabled&&smoothPaging){
                const coef=backwards?1:-1;
                if(backwards){
                    container.style.transform=`scale${axis}(-1)`;
                }
                container.setPosition({
                    x:(horizontal?offset:0)*coef,
                    y:(horizontal?0:offset)*coef,
                    easing:smoothly?.easing||"ease-in-out",
                    duration:smoothly?.duration||(smoothly?300:0),
                });
            }
            else{
                container.style.transform=`${backwards?`scale${axis}(-1) `:""}translate${axis}(-${offset}px)`;
            }
        }
        else{
            container.scrollTo({
                [horizontal?"left":"top"]:offset,
                behavior:smoothly?"smooth":"auto",
            });
        }
    }
    
    flatlist.scrollToIndex=(i,smoothly=true)=>{
        let element;
        if(data.length){
            const lastIndex=data.length-1;
            if(i>lastIndex) i=lastIndex; else if(i<0) i=0;
            const {index}=state;
            if(i>index){
                const {observedEl}=state;
                observer.unobserve(observedEl);
                for(let j=index+1;j<=i;j++){
                    createNextElement(i===j);
                }
                element=state.observedEl;
            }
            else element=state.itemsMap.at(i,true);
        }
        if(element){
            const offset=element[offsetSide]-state.firstOffset;
            const infocusChanged=i!==state.infocusIndex;
            flatlist.scrollToOffset(offset,smoothly);
            if(infocusChanged){
                const {onInFocusItemChange}=props;
                state.infocusIndex=i;
                onInFocusItemChange&&onInFocusItemChange({index:i,element,item:data[i]});
            }
        }
        else flatlist.scrollToOffset(0,smoothly);
    };

    flatlist.scrollToItem=(item,smoothly=true)=>{
        const index=data.indexOf(item);
        if(index>=0) flatlist.scrollToIndex(index,smoothly);
    }

    function createNextElement(observe=true){
        state.index++;
        const {index}=state,item=data[index];
        const element=renderItem({
            parent:container,item,
            data:props.data||[],index,
        });
        state.itemsMap.set(item,element);
        if(observe){
            const {observedEl}=state;
            if(observedEl){
                observer.unobserve(observedEl);
            }
            observer.observe(element);
            state.observedEl=element;
        }
        return element;
    }
    function showEmptinessElement(){
        const {EmptyComponent="no data"}=props;
        const type=typeof(EmptyComponent);
        if(type==="function"){
            state.emptinessEl=EmptyComponent({parent:container});
        }
        else if(type==="string"){
            state.emptinessEl=EmptyIndicator({
                parent:container,
                message:EmptyComponent,
            });
        }
        else throw new Error("EmptyComponent prop should be either a string or a function");
    }

    return flatlist;
}

const styles={
    container:({pagingTransition,horizontal,pagingEnabled,smoothPaging})=>`
        height:${horizontal?"-webkit-fill-available":"auto"};
        white-space:${horizontal?"nowrap":"normal"};
        overscroll-behavior-${horizontal?"y":"x"}:none;
        ${pagingEnabled?`
            overflow:visible;
            ${smoothPaging?"":`
                transition:${pagingTransition};
            `}
        `:`
            overflow-x:${horizontal?"auto":"visible"};
            overflow-y:${horizontal?"visible":"auto"};
        `}
    `,
}

const addScrollEndListener=(element,callback)=>{
    let frameId,timeout,start;
    function onScroll(event){
        clearTimeout(timeout);
        cancelAnimationFrame(frameId);
        frameId=requestAnimationFrame(timestamp=>{
            const elapsed=start===undefined?0:timestamp-start;
            start=timestamp;
            timeout=setTimeout(()=>{
                start=undefined;
                callback&&callback(event);
            },100-elapsed);
        });
    }
    element.addEventListener("scrollend",()=>{
        clearTimeout(timeout);
        cancelAnimationFrame(frameId);
        element.removeEventListener("scroll",onScroll);
    },{once:true});
    callback&&element.addEventListener("scrollend",callback);
    element.addEventListener("scroll",onScroll);
}
