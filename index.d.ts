declare module "vanilla";


export const useRef:(startsWith:string)=>string;
export const map:(array:any[],callback:(value:any,index:number,array:any)=>string)=>string;
export const map:(count:number,callback:(index:number)=>string)=>string;
export const Router:(
    target:HTMLElement,
    routes:[{
        hash:string,
        memorize:boolean,
        component:(props:{parent:HTMLElement})=>HTMLElement,
    }]
)=>void;
export const createStore:(value:object)=>any;
