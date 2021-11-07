

export {HashRouter} from "./HashRouter";
export {default as DraggableView} from "./DraggableView/DraggableView";
export {default as Modal} from "./Modal/Modal";
export {default as FlatList} from "./FlatList/FlatList";

export const map=(array=[],treatment)=>{
    let str="";
    if(Array.isArray(array)){
        const maped=[...array];
        for(let i=0;i<maped.length;i++){
           str+=treatment(maped[i],i,array); 
        }
    }
    else if(typeof(array)==="number"){
        for(let i=0;i<array;i++){
            str+=treatment(i); 
        }
    }
    return str;
}

export const useRef=(startswith="")=>`${startswith}_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;

export const setSwipeAction=(params)=>{
    const state={...params},{element}=state;
    element.addEventListener("touchstart",(event)=>{
        event.stopPropagation();
        const {clientX,clientY}=event.changedTouches[0];
        state.touchX=clientX;
        state.touchY=clientY;
    },{passive:true});
    const onTouchEnd=(event)=>{
        const {clientX,clientY}=event.changedTouches[0];
        const swipewidth=state.touchX-clientX,swipeheight=Math.abs(clientY-state.touchY);
        const {onSwipeLeft,onSwipeRight}=state;
        if(swipeheight<60){
            if(onSwipeLeft&&(swipewidth>40)){
                onSwipeLeft(()=>{
                    state.onSwipeLeft=null;
                },()=>{
                    state.onSwipeLeft=params.onSwipeLeft;
                });
            }
            else if(onSwipeRight&&(swipewidth<-40)){
                onSwipeRight(()=>{
                    state.onSwipeRight=null;
                },()=>{
                    state.onSwipeRight=params.onSwipeRight;
                });
            }
        }
    }
    element.addEventListener("touchend",onTouchEnd,{passive:true});
}

export const specialchars="+=}°)]@ç^_\\`-|(['{\"#~&²£$¤*µ%ù§!/:.;?,<>";

export const fadeIn=(element,props={},callback)=>{
    if(element!==null){
        const {display="block",duration=200}=props;
        const style=element.style;
        style.display=display;
        style.transition=`${duration}ms`;
        //style.animation=`fadeIn ${duration}ms 1 linear forwards`;
        style.opacity="1";
        callback&&setTimeout(()=>{
            style.transition=null;
            callback&&callback();
        },duration);
    }/*
    @keyframes fadeIn{
        from {opacity:0}
        to {opacity:1}
    }
*/}

export const fadeOut=(element,duration=200,callback)=>{
    if(element!==null){
        const style=element.style;
        style.opacity="0";
        style.transition=`${duration}ms`;
        //style.animation=`fadeOut ${duration}ms 1 linear forwards`;
        setTimeout(()=>{
            style.display="none";
            style.transition=null;
            //style.animation="";
            callback&&callback();
        },duration);
    }/*
    @keyframes fadeOut{
        from {opacity:1}
        to {opacity:0}
    }
*/}

export const toggle=(element,{display="block",duration=0.2},callback)=>{
    if(element.style.display==="none"){
        fadeIn(element,{display,duration},callback);
    }
    else{
        fadeOut(element,duration,callback);
    }
}

export function randomColor(style="color",colors=[]){
    if(style==="hue-rotate"){
        return`hue-rotate(${Math.floor(Math.random()*1000)}deg)`;
    }
    else if(style==="color"){
        if(colors.length>0){
            return colors[Math.floor(Math.random()*colors.length)];
        }
        else{
            return `rgb(
                ${Math.floor(Math.random()*255)},
                ${Math.floor(Math.random()*255)},
                ${Math.floor(Math.random()*255)}
            )`
        }
    }
}

export function createCode(length){
    let str="";
    let charindex;
    for(let i=0;i<length;i++){
        switch(Math.floor(Math.random()*3)){
            case 0:
                charindex=65+Math.floor(Math.random()*26);
                break;
            case 1:
                charindex=97+Math.floor(Math.random()*26);
                break;
            case 2:
                charindex=48+Math.floor(Math.random()*9);
                break;
        }
        str+=String.fromCharCode(charindex);
    }
    return str;
}

export const replaceAt=(index=0,replaceValue="",targetString="")=>targetString.substr(0,index-1)+replaceValue+targetString.substr(index+1,targetString.length);

export const capitalize=(str)=>str?replaceAt(0,str[0].toUpperCase(),str.toLowerCase()):"";

export const emailCheck=(str)=>{
    str=str.trim();
    const p_number=str.split(".").length-1;
    const p_lastindex= str.lastIndexOf("."),at_index=str.indexOf("@");
    return Boolean(
        str!=="" &&
        p_lastindex>at_index &&
        0<p_number&&p_number<4 &&
        str.length-p_lastindex>2 &&
        str.match(/^[a-z0-9@.]+$/) &&
        (str.match(/@/g)||[]).length===1&&at_index>5 &&
        str.slice(at_index+1,at_index+5).match(/^[a-z]+$/)
    )
}

export const getArrayMax=(array=[],start=0,end=array.length)=>{
    let maxv=array[start];
    let maxi=start;
    start++;
    for(let i=start;i<end;i++){
        const max=Math.max(maxv,array[i]);
        if(maxv!==max){
            maxv=max;
            maxi=i;
        }
    }
    return {value:maxv,index:maxi};
}

export const removeItem=(array,predicate)=>{
    let item=null,status=null;
    if(Array.isArray(array)&&(typeof(predicate)==="function")){
        let index=-1;
        item=array.find((item,i)=>{
            status=predicate(item,i,array);
            if(status){
                index=i;
            }
            return status;
        });
        (index>-1)&&array.splice(index,1);
    }
    return item;
};

export const replaceAll=(target="",searchValue="",replaceValue="")=>{
    let str="";
    for(let i=0;i<target.length;i++){
        const char=target[i];
        str+=char===searchValue?replaceValue:char;
    }
    return str;
}

export const factorial=(n=0)=>n?n*factorial(n-1):1;

export const getCharsInBetween=(startChar="",endChar="",from="")=>{
    const length=from.length;
    let i=0,startIndex=-1,endIndex=0;
    while(startIndex<0&&i<length){
        if(from[i]===startChar){
            startIndex=i;
        }
        i++;
    }
    while(!endIndex&&i<length){
        if(from[i]===endChar){
            endIndex=i;
        }
        i++;
    }
    return startIndex>-1?from.slice(startIndex+1,endIndex||length):"";
}
