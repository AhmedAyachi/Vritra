import {useRef,useSwipeGesture} from "../index";
import css from "./FlatList.module.css";


export default function FlatList(props){
    const {parent,ref=useRef("flatlist"),className,containerClassName,data,renderItem,onReachEnd,horizontal,pagingEnabled=false,threshold=0.5,transition="250ms",onSwipe}=props;
    parent.insertAdjacentHTML("beforeend",`<div id="${ref}" class="${css.flatlist} ${className||""}"></div>`);
    const flatlist=parent.querySelector(`#${ref}`),state={
        index:null,
        itemEl:null,
        focus:null,
        itemEls:[],
        endreached:false,
        itemOffset:null,
        popuplist:null,
    };

    flatlist.innerHTML=`
        ${Array.isArray(data)&&data.length?`
            <div class="${css.container} ${containerClassName||""}" style="${styles.container({transition,horizontal})}">
        `:`
            <p class="${css.emptymsg}">no results</p>
        `}
        </div>
    `;

    if(Array.isArray(data)&&data.length&&renderItem){
        const container=flatlist.querySelector(`.${css.container}`);
        state.index=state.focus=0;
        state.itemEl=renderItem({parent:container,item:data[0],index:0,data});
        state.itemEls.push(state.itemEl);
        state.itemOffset=state.itemEl.offsetLeft;
        const observer=new IntersectionObserver(([entry])=>{
            const {isIntersecting}=entry;
            if(isIntersecting){
                state.index++;
                observer.unobserve(state.itemEl);
                const {index}=state,item=data[index];
                if(item){
                    state.itemEl=renderItem({parent:container,item,index,data});
                    state.itemEls.push(state.itemEl);
                    observer.observe(state.itemEl);
                }
                else if(onReachEnd){
                    state.endreached=true;
                    onReachEnd(container);
                }
            }
        },{root:flatlist,threshold});
        observer.observe(state.itemEl);

        if(pagingEnabled&&horizontal){
            const {itemEls,itemOffset}=state;
            container.style.overflow="visible";
            useSwipeGesture({
                element:flatlist,
                onSwipeLeft:()=>{
                    const {focus}=state,lastIndex=itemEls.length-1;
                    if(focus<lastIndex){
                        state.focus=focus+1;
                        const {offsetLeft}=itemEls[state.focus];
                        container.style.transform=`translateX(-${offsetLeft-itemOffset}px)`;
                        onSwipe&&onSwipe({direction:"left",index:state.focus,container});
                    }
                },
                onSwipeRight:()=>{
                    const {focus}=state;
                    if(focus){
                        state.focus=focus-1;
                        const {offsetLeft}=itemEls[state.focus],offsetX=offsetLeft-itemOffset;
                        container.style.transform=`translateX(-${offsetX>0?offsetX:0}px)`;
                        onSwipe&&onSwipe({direction:"right",index:state.focus,container});
                    }
                },
            });
        }
    }

    flatlist.addItems=(items)=>{
        if(Array.isArray(items)&&items.length){
            data.push(...items);
            if(state.endreached){
                state.itemEl=renderItem({parent:flatlist,item:items[0],index:state.index,data});
                observer.observe(state.itemEl);
                state.endreached=false;
            }
        }
    }

    flatlist.showItems=(items)=>{
        const {popuplist}=state;
        popuplist&&popuplist.remove();
        if(Array.isArray(items)){
            state.popuplist=FlatList({
                ...props,
                parent:flatlist,
                className:css.popuplist,
                data:items,
                onReachEnd:null,
            });
        }
    }

    return flatlist;
}

const styles={
    container:({transition,horizontal})=>`
        white-space:${horizontal?"nowrap":"normal"};
        transition:${transition||"250ms"};
    `,
}
