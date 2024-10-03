import {NativeView,removeItem,FooMap,useSwipeGesture,findItem} from "../index";
import css from "./FlatList.module.css";
import EmptyIndicator from "./EmptyIndicator/EmptyIndicator";
import SmoothPagingContainer from "./SmoothPagingContainer/SmoothPagingContainer";


export default function FlatList(props){
    const {parent,horizontal,backwards,smoothPaging,pagingEnabled,scrollEnabled=true,threshold=0.5,transition="ease 300ms",pagingTransition=transition,renderItem,onReachEnd,onRemoveItem,onAddItems,onSwipe}=props;
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
        offsetSide:"offset"+(horizontal?"Left":"Top"),
        filled:false,
        emptinessEl:null,
        step:Math.max(1,props.step)||1,
        scrollLength:0,
        triggerOnScrollEnd:true,
        offsetThreshold:props.offsetThreshold||(flatlist["client"+(horizontal?"Width":"Height")]/3),
    },{data,offsetSide,step,offsetThreshold}=state;

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
        offsetThreshold,
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
                if(Math.abs(dscroll)>=offsetThreshold){
                    const item=findItem(state.itemsmap.values(),(element)=>element[offsetSide]>=scrollLength)||{
                        index:0,
                        value:state.itemsmap.at(0,true),
                    };
                    itemIndex=item.index;
                    if(itemIndex>0){
                        const element=item.value;
                        if(dscroll>0){
                            if((scrollLength+container[clientLengthKey]-element[offsetSide])<offsetThreshold){
                                itemIndex--;
                            }
                        }
                        else{
                            const prevElement=state.itemsmap.at(item.index-1,true);
                            const sideOffset=prevElement[offsetSide]+prevElement[clientLengthKey];
                            if(Math.abs(scrollLength-sideOffset)>=offsetThreshold){
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
        if(isIntersecting){
            if(state.index<(data.length-1)){
                const max=Math.min(step,data.length-state.index-1);
                for(let i=1;i<=max;i++){
                    createNextElement(i===1);
                }
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
        (scrollEnabled&&!smoothPaging)&&useSwipeGesture({
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
                if(data.length===length){
                    state.firstOffset=state.itemEl[offsetSide];
                }
            }
            else{
                onReachEnd&&onReachEnd({container,data:props.data});
            }
        }
        onAddItems&&onAddItems(items);//hidden
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
            itemsmap.delete(item);
            state.index--;
            if((!data.length)&&(!container.childNodes.length)){
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
        }
        else{
            state.popuplist=null;
        }
        return state.popuplist;
    }

    flatlist.scrollToOffset=(offset,smooth=true)=>{
        state.triggerOnScrollEnd=false;
        if(offset<=0){
            offset=0;
        }
        else if(data.length>0){
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
        }
        if(pagingEnabled){
            if(scrollEnabled){
                const item=findItem(state.itemsmap.values(),(element)=>offset>=(element[offsetSide]-state.firstOffset),true);
                if(item){
                    state.infocusIndex=item.index;
                }
            }
            if(!smooth){
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
                    easing:smooth?.easing||"ease-in-out",
                    duration:smooth?.duration||(smooth?300:0),
                });
            }
            else{
                container.style.transform=`${backwards?`scale${axis}(-1) `:""}translate${axis}(-${offset}px)`;
            }
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
        if(i>lastIndex){i=lastIndex} else if(i<0){i=0};
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
        if(element){
            const offset=element[offsetSide]-state.firstOffset;
            const infocusChanged=i!==state.infocusIndex;
            flatlist.scrollToOffset(offset,smooth);
            if(infocusChanged){
                state.infocusIndex=i;
                onInFocusItemChange&&onInFocusItemChange({index:i,element,item:data[i]});
            }
        }
        else{
            flatlist.scrollToOffset(0,smooth);
        }
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
            state.itemEl=element;
        }
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
