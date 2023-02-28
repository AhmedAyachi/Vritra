

export function HashRouter({target,routes,globalize=true}){
    const {history,location}=window;
    const state={
        data:null,
        route:null,//{...,params,data} to store last data and params values
    };
 
    setRoute();
    window.addEventListener("hashchange",setRoute);

    const hashrouter={
        push:(hash,data)=>{
            if(typeof(hash)==="string"){
                state.data=data;
                location.hash=getDecentHash(hash);
            }
        },
        append:(hash,data)=>{
            if(typeof(hash)==="string"){
                state.data=data;
                location.hash+=getDecentHash(hash);
            }
        },
        replace:(hash,data)=>{
            if(typeof(hash)==="string"){
                const oldhash=location.hash;
                state.data=data;
                history.replaceState(null,null,`${location.origin}/${getDecentHash(hash)}`);
                (location.hash!==oldhash)&&setRoute();
            }
        },
        refresh:()=>{
            const {route}=state;
            if(route){
                const {memorize}=route;
                route.memorize=false;
                renderRoute(route,target);
                if(memorize){route.memorize=true};
            }
        },
    };
    if(globalize){
        window.HashRouter=hashrouter;
    }

    function setRoute(){
        let {route}=state;
        if(route){
            const {memorize,element}=route;
            if(memorize&&(element instanceof HTMLElement)){
                const {scroll}=route;
                scroll.top=element.scrollTop;
                scroll.left=element.scrollLeft;
            }
        }
        route=getRoute(routes);
        if(route){
            new Promise(resolve=>{
                if(typeof(route.restrictor)==="function"){
                    route.restrictor(resolve,target);
                }
                else{
                    resolve(true);
                }  
            }).
            then(unlocked=>{
                if(unlocked){
                    state.route=route;
                    route.data=state.data;
                    renderRoute(route,target);
                }
                else{
                    history.back();
                }
            }).
            finally(()=>{
                state.data=null;
            });
        }
        else{
            target.innerHTML="";
        }
    }
    

    return hashrouter;
}

const renderRoute=(route,target)=>{
    const context=getContext(route);
    target.innerHTML="";
    const {memorize}=route;
    let {element}=route;
    if(memorize&&(element instanceof HTMLElement)){
        const {scroll}=route;
        target.appendChild(element);
        element.scrollTo(scroll);
    }
    else if(typeof(route.component)==="function"){
        route.name=route.component.name;
        element=route.element=route.component({...context,parent:target});
    }
    route.onLoaded?.(context);
    element.onLoaded?.(context);
    window.scrollTo(0,0);
}

const getDecentHash=(hash)=>hash.startsWith("#")?hash:("#"+hash);

const getContext=({params,data})=>{
    let {hash}=location;
    if(hash&&!hash.startsWith("#")){
        hash="#"+hash;
    }
    const context={
        params,
        location:{
            hash,
            url:`${location.origin}/${hash}`,
        },
    };
    if(data){
        context.data=data;
    }
    return context;
}

const getRoute=(routes)=>{
    const hashs=getHashs(location.hash);
    const route=findBestRoute(hashs,routes);
    if(route){
        const params=route.params={};
        route.hashs.forEach((hash,i)=>{
            if(hash.startsWith(":")){
                const varname=hash.substring(1);
                params[varname]=hashs[i];
            }
        });
        if(!route.scroll){
            route.scroll={top:0,left:0};
        }
    }
    return route;
}

const findBestRoute=(hashs,routes)=>{
    const hashcount=hashs.length;
    const fullhash=location.hash;
    let i=0,routecount=routes.length,exactfound;
    let bestroute,bestscore=-1;
    while((!exactfound)&&(i<routecount)){
        const route=routes[i],{hash}=route;
        let routehashs=route.hashs;
        if(!routehashs){
            routehashs=route.hashs=getHashs(hash);
        }
        if(fullhash===hash){
            exactfound=true;
            bestroute=route;
        }
        else{
            if(routehashs.length===hashcount){
                let score=0;
                const isProbable=routehashs.every((hash,i)=>{
                    const match=hash===hashs[i];
                    if(match){
                        score++;
                    }
                    return match||hash.startsWith(":");
                });
                if(isProbable&&(score>bestscore)){
                    bestscore=score;
                    bestroute=route;
                }
            }
            i++;
        }
    }
    return bestroute;
}

const getHashs=(hash)=>{
    const hashs=hash.split("#");
    if((hashs.length>1)&&(!hashs[0])){
        hashs.shift();
    }
    return hashs;
}
