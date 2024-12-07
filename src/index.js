import css from "./index.module.css";


export {default as View} from "./View/View";
export {default as Fragment} from "./Fragment/Fragment";
export {default as NativeView} from "./NativeView/NativeView";
export {default as SideBarNavigator} from "./SideBarNavigator/SideBarNavigator";
export {default as DrawerNavigator} from "./DrawerNavigator/DrawerNavigator";
export {default as TabNavigator} from "./TabNavigator/TabNavigator";
export {default as Switch} from "./Switch/Switch";
export {default as PopupView} from "./PopupView/PopupView";
export {default as ActionSetView} from "./ActionSetView/ActionSetView";
export {default as AccordionView} from "./AccordionView/AccordionView";
export {default as Palette} from "./Palette/Palette";
export {default as FlatList} from "./FlatList/FlatList";
export {default as DraggableView} from "./DraggableView/DraggableView";
export {default as FooMap} from "./FooMap/FooMap";
export {HashRouter} from "./HashRouter/HashRouter";
export {useZoomGesture,usePinchGesture,useSwipeGesture,usePressGesture} from "./Gestures";
export {default as withSequence} from "./withSequence/withSequence";

export const hexColorToRGBA=(hexcolor="",asarray)=>{
    if(hexcolor.startsWith("#")){
        hexcolor=hexcolor.substring(1);
    }
    const hexcodes=["","","",""],count=Math.min(2*hexcodes.length,hexcolor.length);
    for(let i=0;i<count;i++){
        const char=hexcolor[i];
        const index=Math.floor(i/2);
        hexcodes[index]+=char;
    }
    const lastIndex=hexcodes.length-1;
    hexcodes.forEach((hexcode,i)=>{
        let decimal=hexToDecimal(hexcode);
        if(i===lastIndex){
            decimal=(hexcode.length<2)?1:(decimal/255);
            if((decimal!==0)&&decimal!==1){
                decimal=decimal.toFixed(5);
            }
        }
        hexcodes[i]=decimal;
    });

    return asarray?hexcodes.map(parseFloat):`rgba(${hexcodes.join(",")})`;
}

export const hexToDecimal=(hexcode)=>{
    let decimal=0;
    const lasti=hexcode.length-1;
    for(let j=0;j<=lasti;j++){
        const value=hexs.indexOf(hexcode[j].toLowerCase());
        if(value>-1){
            decimal+=value*(16**(lasti-j));
        }
        else{
            throw "the hexcode is malformed";
        }
    }
    return decimal;
},hexs="0123456789abcdef";

export const interpolate=(invalue,inrange,outrange,extrapolationType="extend")=>{
    const {length}=inrange;
    if((length>1)&&outrange.length===length){
        let inpred,insuc;
        let outpred,outsuc;
        if(length===2){
            [inpred,insuc]=inrange;
            [outpred,outsuc]=outrange;
        }
        else{
            let {index,value}=findItem(inrange,(item)=>item<invalue,true)||{value:inrange[0],index:0};
            if(index>=(length-1)){
                index=length-2;
                value=inrange[index]; 
            }
            inpred=value;
            insuc=inrange[index+1];
            outpred=outrange[index];
            outsuc=outrange[index+1];
        }
        let outvalue=outpred+((invalue-inpred)/(insuc-inpred))*(outsuc-outpred);
        if(extrapolationType!=="extend"){
            const clamp=extrapolationType==="clamp";
            const outmax=Math.max(...outrange);
            if(outvalue>outmax){outvalue=clamp?outmax:invalue}
            else{
                const outmin=Math.min(...outrange);
                if(outvalue<outmin){outvalue=clamp?outmin:invalue}
            };
        }
        return outvalue;
    }
    else{
        throw "inrange and outrange must be of same length >=2";
    }
}

export const getAdjacentDate=(str,...args)=>{
    const format=args.find(arg=>typeof(arg)==="string")||"dmy";
    let offset=args.find(arg=>typeof(arg)==="number");
    if(offset===undefined){offset=1};
    if(format!=="ymd"){
        const parts=str.split(/-| |\/|,/g).slice(0,3);
        switch(format){
            case "dmy": parts.reverse();break;
            case "mdy": parts.unshift(parts.pop());break;
            default:break;
        }
        str=parts.join("-");
    }
    const date=new Date(new Date(str).getTime()+86400000*offset);
    const day=date.getDate(),month=date.getMonth()+1,year=date.getFullYear();
    let parts;
    switch(format){
        case "mdy":parts=[month,day,year];break; 
        case "ymd":parts=[year,month,day];break;
        case "dmy":
        default:parts=[day,month,year];break;
    }
    return parts.map(part=>`${part<10?"0":""}${part}`).join("/");
}

export const randomItem=(array)=>array[Math.floor(Math.random()*array.length)];

export const isTouchDevice=()=>((("ontouchstart" in window)||(navigator.maxTouchPoints>0)||(navigator.msMaxTouchPoints>0)));

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
    {name:"january",daycount:31},
    {name:"february",daycount:isLeapYear?29:28},
    {name:"march",daycount:31},
    {name:"april",daycount:30},
    {name:"may",daycount:31},
    {name:"june",daycount:30},
    {name:"july",daycount:31},
    {name:"august",daycount:31},
    {name:"september",daycount:30},
    {name:"october",daycount:31},
    {name:"november",daycount:30},
    {name:"december",daycount:31},
].map((item,i)=>({
    ...item,
    ordinal:i+1,
}));

export const isLeapYear=(year=new Date(Date.now()).getFullYear())=>!Boolean((year-1752)%4);

const defaultdays=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
export const getDays=(first="monday")=>{
    const days=[],index=Math.max(0,defaultdays.indexOf(first));
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
            str+=treatment(maped[i],i,array)||"";
        }
    }
    else if(typeof(array)==="number"){
        for(let i=0;i<array;i++){
            str+=treatment(i)||""; 
        }
    }
    return str;
}
export const useId=(prefix="",separator="_")=>`${prefix}${prefix?separator:""}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;

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

export const fadeIn=(element,...params)=>{
    if(element instanceof HTMLElement){
        clearTimeout(element.fadeTimeout);
        let display,duration=200,callback;
        params.forEach(param=>{
            switch(typeof(param)){
                case "string": display=param;break;
                case "number": duration=param;break;
                case "function": callback=param;break;
                default:break;
            }
        });
        const {style}=element;
        style.display=display||getComputedStyle(element).display||null;
        style.animation=`${css.fadeIn} ${duration}ms 1 linear forwards`;
        element.fadeTimeout=setTimeout(()=>{
            style.animation=null;
            delete element.fadeTimeout;
            callback&&callback();
        },duration);
    }
    return element;
}

export const fadeOut=(element,duration=200,callback)=>{
    if(element instanceof HTMLElement){
        clearTimeout(element.fadeTimeout);
        if(typeof(duration)==="function"){
            callback=duration;
            duration=200;
        }
        const {style}=element;
        style.animation=`${css.fadeOut} ${duration}ms 1 linear forwards`;
        element.fadeTimeout=setTimeout(()=>{
            style.display="none";
            style.animation=null;
            delete element.fadeTimeout;
            callback&&callback();
        },duration);
    }
    return element;
}

export function randomColor(colors){
    const fromColors=Array.isArray(colors)&&colors.length&&(Math.random()>0.5);
    if(fromColors){
        const color=randomItem(colors);
        if(color.startsWith("#")) return hexColorToRGBA(color);
        else return color;
    }
    else{
        const coef=Math.round(Math.random()*360);
        const r=coef%((Math.floor(coef/60)||1)*60);
        const value=Math.round(17*r/4);
        if((coef<60)||(coef===360)) return `rgb(255,${value},0)`;
        else if(coef<120) return `rgb(${255-value},255,0)`;
        else if(coef<180) return `rgb(0,255,${value})`;
        else if(coef<240) return `rgb(0,${255-value},255)`;
        else if(coef<300) return `rgb(${value},0,255)`;
        else if(coef<360) return `rgb(255,0,${255-value})`;
    };
}

export function randomId(prefix,length=15){
    let str=typeof(prefix)==="string"?prefix:"";
    let charindex;
    for(let i=0;i<length;i++){
        switch(Math.floor(Math.random()*3)){
            case 0: charindex=65+Math.floor(Math.random()*26);break;
            case 1: charindex=97+Math.floor(Math.random()*26);break;
            case 2: charindex=48+Math.floor(Math.random()*9);break;
            default:break;
        }
        str+=String.fromCharCode(charindex);
    }
    return str;
}

export const replaceAt=(index=0,replaceValue="",targetString="")=>targetString.substr(0,index-1)+replaceValue+targetString.substr(index+1,targetString.length);

export const capitalize=(str="",count=0)=>str.split(" ").map((word,i)=>{
    const capitalized=(!count)||(i<count);
    return (capitalized&&word.length)?(word[0].toUpperCase()+word.substring(1)):word;
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

export const findItem=(array=[],predicate,descending)=>{
    let item=null;
    if(Array.isArray(array)&&array.length){
        const {length}=array;
        let found=false,i=0;
        while((!found)&&(i<length)){
            const index=descending?length-i-1:i;
            const target=array[index];
            if(predicate(target,index,array)){
                found=true;
                item={value:target,index}
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
