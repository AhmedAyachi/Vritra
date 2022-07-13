

export function HashRouter(
    target:HTMLElement,
    routes:[{
        hash:String,
        memorize:boolean,
        component:(props:{parent:HTMLElement})=>HTMLElement,
    }]
):void;
