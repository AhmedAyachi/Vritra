declare module "vanilla";


export const useRef:(startsWith:string)=>string;
export const map:(array:any[],callback:(value:any,index:number,array:any)=>string)=>string;
export const Router:(
    target:HTMLElement,
    routes:[{
        hash:string,
        memorize:boolean,
        component:(props:{parent:HTMLElement})=>HTMLElement,
    }]
)=>void;
