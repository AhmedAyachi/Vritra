

export {Router} from "./Router";

export const map=(array=[],treatment)=>{
    let str="";
    const maped=[...array];
    for(let i=0;i<maped.length;i++){
       str+=treatment(maped[i],i,array); 
    }
    return str;
}

export const useRef=(startswith="")=>`${startswith}_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;

export const useStore=(Reducer={})=>{
    const store=window.store=new function Store(){
        let strReducer=null;
        if(Reducer&&typeof(Reducer)==="object"){
            Object.assign(this,Reducer);
            strReducer=JSON.stringify(Reducer);
        }
        else{
            strReducer="{}";
        }
        Object.assign(this,{
            reset:()=>{
                Object.assign(this,JSON.parse(strReducer));
            },
            store:this,
        });
    };
    return store;
}