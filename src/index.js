import css from "./index.module.css";


export {default as DrawerNavigator} from "./DrawerNavigator/DrawerNavigator";
export {default as Switch} from "./Switch/Switch";
export {default as PopupView} from "./PopupView/PopupView";
export {default as ActionSetView} from "./ActionSetView/ActionSetView";
export {default as AccordionView} from "./AccordionView/AccordionView";
export {default as ColorPicker} from "./ColorPicker/ColorPicker";
export {default as FlatList} from "./FlatList/FlatList";
export {default as DraggableView} from "./DraggableView/DraggableView";
export {default as View} from "./View/View";
export {default as HashMap} from "./HashMap/HashMap";
export {HashRouter} from "./HashRouter/HashRouter";
export {useZoomGesture,usePinchGesture,useSwipeGesture} from "./Gestures";


export const randomItem=(array)=>array[Math.floor(Math.random()*array.length)]

export const parseJSON=(json)=>{
    let data=null;
    try{
        data=JSON.parse(json);
    }
    catch{}
    return data;
}

export const useBlobImageData=(blob,callback)=>{
    const filereader=new FileReader();
    filereader.onloadend=()=>{
        const image=new Image();
        image.onload=()=>{
            const canvas=document.createElement("canvas");
            canvas.width=image.width;
            canvas.height=image.height;
            const context=canvas.getContext("2d");
            context.drawImage(image,0,0);
            const imageData=context.getImageData(0,0,image.width,image.height);
            callback&&callback(imageData);
        } 
        image.src=filereader.result;
    }
    filereader.readAsDataURL(blob);
}

export const getTimeDuration=(start,end)=>{
    const [starth=0,startmin=0,startsec=0]=start.split(":").map(str=>parseInt(str));
    const [endh=0,endmin=0,endsec=0]=end.split(":").map(str=>parseInt(str));
    const startsecs=starth*3600+startmin*60+startsec;
    const endsecs=endh*3600+endmin*60+endsec;
    let duration=endsecs-startsecs;
    if(duration<0){
        duration+=86400;
    }
    return duration;
}

export const getMonths=(isLeapYear=false)=>[
    {name:"january",length:31},
    {name:"february",length:isLeapYear?29:28},
    {name:"march",length:31},
    {name:"april",length:30},
    {name:"may",length:31},
    {name:"june",length:30},
    {name:"july",length:31},
    {name:"august",length:31},
    {name:"september",length:30},
    {name:"october",length:31},
    {name:"november",length:30},
    {name:"december",length:31},
];

export const isLeapYear=(year=new Date(Date.now()).getFullYear())=>!Boolean((year-1752)%4);

const defaultdays=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
export const getDays=(start="monday")=>{
    const days=[],index=Math.max(0,defaultdays.indexOf(start));
    for(let i=index;i<7;i++){
        days.push(defaultdays[i]);
    }
    for(let i=0;i<index;i++){
        days.push(defaultdays[i]);
    }
    return days;
};

export const groupBy=(array,filter)=>{
    const groups=[],{length}=array;
    for(let i=0;i<length;i++){
        const item=array[i],predicate=filter(item,i,array);
        const group=groups.find(group=>group.predicate===predicate);
        if(group){
            group.items.push(item);
        }
        else{
            groups.push({predicate,items:[item]});
        }
    }
    return groups;
} 

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
export const useId=(prefix="",separator="_")=>`${prefix}${prefix?separator:""}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
export const useRef=useId;

//export const specialchars="+=}°)]@ç^_\\`-|(['{\"#~&²£$¤*µ%ù§!/:.;?,<>";
export const sanitize=(str="",param0,param1)=>{
    let escape,whilelist,sanitized="";
    if(typeof(param0)==="boolean"){
        escape=param0;
        whilelist=param1===undefined?" ":param1;
    }
    else if(typeof(param0)==="string"){
        whilelist=param0;
    }
    if(escape){
        for(const char of str){
            sanitized+=(whilelist&&whilelist.includes(char))?char:encodeURIComponent(char);
        }
    }
    else{
        const firstchar=str[0];
        let onlynumbers=((firstchar==="-")||(firstchar==="+"))&&(str.length>1)&&(!whilelist);
        if(onlynumbers){
            const secondchar=str[1];
            onlynumbers=("0"<=secondchar)&&(secondchar<="9");
        }
        if(onlynumbers){
            sanitized=`${firstchar}${str.replace(/[^0-9]/g,"")}`;
        }
        else{
            for(const char of str){
                if((whilelist&&whilelist.includes(char))||char.match(/[a-zA-Z0-9\s]/g)){
                    sanitized+=char;
                }
            }
        }
    }
    return sanitized;
}

export const fadeIn=(element,display=200,duration,callback)=>{
    if(element instanceof HTMLElement){
        if(typeof(display)==="number"){
            callback=duration;
            duration=display;
            display=undefined;
        }
        else if(typeof(display)==="function"){
            callback=display;
            duration=200;
            display=undefined;
        }
        const {style}=element;
        style.display=display||getComputedStyle(element).display||null;
        style.animation=`${css.fadeIn} ${duration}ms 1 linear forwards`;
        setTimeout(()=>{
            style.animation=null;
            callback&&callback();
        },duration);
    }
}

export const fadeOut=(element,duration=200,callback)=>{
    if(element instanceof HTMLElement){
        if(typeof(duration)==="function"){
            callback=duration;
            duration=200;
        }
        const {style}=element;
        style.animation=`${css.fadeOut} ${duration}ms 1 linear forwards`;
        setTimeout(()=>{
            style.display="none";
            style.animation=null;
            callback&&callback();
        },duration);
    }
}

export const toggle=(element,{display="block",duration=200},callback)=>{
    if(getComputedStyle(element).display==="none"){
        fadeIn(element,display,duration,callback);
    }
    else{
        display=fadeOut(element,duration,callback);
    }
}

export function randomColor(colors=[]){
    if(Array.isArray(colors)&&colors.length){
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

export const capitalize=(str="",count=0)=>str.split(" ").map((word,i)=>{
    const capitalized=(!count)||(i<count);
    return capitalized?word[0].toUpperCase()+word.substring(1):word
}).join(" ");

export const isEmail=(str)=>{
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
    if(Array.isArray(array)&&array.length){
        let index=-1;
        if(typeof(predicate)==="function"){
            item=array.find((item,i)=>{
                status=predicate(item,i,array);
                if(status){
                    index=i;
                }
                return status;
            });
        }
        else{
            item=array.find((item,i)=>{
                status=item===predicate;
                if(status){
                    index=i;
                }
                return status;
            });
        }
        (index>-1)&&array.splice(index,1);
    }
    return item;
};

export const findItem=(array=[],predicate)=>{
    let item=null;
    if(Array.isArray(array)&&array.length){
        const {length}=array;
        let found=false,i=0;
        while((!found)&&(i<length)){
            const target=array[i];
            if(predicate(target,i,array)){
                found=true;
                item={value:target,index:i}
            };
            i++;
        }
    }
    return item;
}

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
    const {length}=from;
    let i=0,startIndex=-1,endIndex=length,found=false;
    if(startChar){
        while((!found)&&(i<length)){
            if(from[i]===startChar){
                startIndex=i;
                found=true;
            }
            i++;
        }
    }
    if(endChar){
        found=false;
        while((!found)&&(i<length)){
            if(from[i]===endChar){
                endIndex=i;
                found=true;
            }
            i++;
        }
    }
    return from.substring(startIndex+1,endIndex);
}
