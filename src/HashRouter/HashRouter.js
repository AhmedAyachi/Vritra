

export function HashRouter({target,routes}){
    const {history,location}=window;
    const state={
        data:null,
        route:null,//{...,params,data,element} to store last data and params values
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
                renderRoute(route,target).then(()=>{
                    if(memorize){
                        route.memorize=true;
                    };
                });
            }
        },
    };

    function setRoute(){
        let {route}=state;
        if(route){
            const {element}=route;
            if(element instanceof HTMLElement){
                const {onHide}=element;
                if(route.memorize){
                    const {scroll}=route;
                    scroll.top=element.scrollTop;
                    scroll.left=element.scrollLeft;
                }
                element.remove();
                onHide&&onHide();
            }
        }
        route=getRoute(routes);
        if(route){
            new Promise(resolve=>{
                if(typeof(route.restrictor)==="function"){
                    route.restrictor(resolve,target);
                }
                else resolve(true);
            }).
            then(unlocked=>{
                if(unlocked){
                    state.route=route;
                    route.data=state.data;
                    return renderRoute(route,target);
                }
                else history.back();
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

const renderRoute=async (route,target)=>{
    target.innerHTML="";
    const {memorize}=route;
    let {element}=route;
    if(memorize&&element instanceof HTMLElement){
        const {scroll}=route;
        target.appendChild(element);
        element.scrollTo(scroll);
    }
    else if(typeof(route.component)==="function"){
        const context=getContext(route);
        route.name=route.component.name;
        element=route.component({...context,parent:target});
        if(element instanceof Promise){
            element=await element;
        }
        route.element=element;
    }
    element&&element.onShow?.();
    window.scrollTo(0,0);
}

const getDecentHash=(hash)=>hash.startsWith("#")?hash:("#"+hash);

const getContext=({params,data})=>{
    let {hash}=location;
    if(hash&&!hash.startsWith("#")){
        hash="#"+hash;
    }
    const context={
        params:params||{},
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
        const oldParams=route.params;
        const params={};
        route.hashs.forEach((hash,i)=>{
            if(hash.startsWith(":")){
                const varname=hash.substring(1);
                params[varname]=hashs[i];
            }
        });
        if(Object.keys(params).length){
            route.params=params;
            if(route.memorize&&(!areSameParams(route.params,oldParams))){
                delete route.element;
            }
        };
        if(!route.scroll){
            route.scroll={top:0,left:0};
        }
    }
    return route;
}

const areSameParams=(params0,params1)=>{
    let same=params0===params1;
    if(params0&&params1){
        const values0=Object.values(params0),values1=Object.values(params1);
        same=values0.length===values1.length;
        if(same){
            let i=0;
            const {length}=values0;
            while(same&&(i<length)){
                const value0=values0[i];
                if(!values1.some(value1=>value0===value1)){same=false};
                i++;
            }
        }
    }
    return same;
}

const findBestRoute=(hashs,routes)=>{
    const routeCount=routes.length;
    let i=0,exactfound;
    let bestRoute,bestRouteScore={exact:0,param:0};
    while((!exactfound)&&(i<routeCount)){
        const route=routes[i],{hash}=route;
        let routeHashs=route.hashs;
        if(!routeHashs) routeHashs=route.hashs=getHashs(hash);
        if(location.hash===hash){
            exactfound=true;
            bestRoute=route;
        }
        else{
            const routeHashCount=routeHashs.length;
            if(routeHashCount===hashs.length){
                let rejected=false;
                const score={exact:0,param:0};
                for(let j=0;j<routeHashCount;j++){
                    const routeHash=routeHashs[j];
                    const asparam=routeHash.startsWith(":");
                    if(asparam){
                        if(hashs[j]) score.param++;
                    }
                    else{
                        const exact=routeHash===hashs[j];
                        if(exact) score.exact++;
                        else{
                            j=routeHashCount;
                            rejected=true;
                            continue;
                        }
                    };
                }
                if(!rejected){
                    const exactScore=score.exact,bestExactScore=bestRouteScore.exact;
                    if((exactScore>bestExactScore)||((exactScore===bestExactScore)&&(score.param>bestRouteScore.param))){
                        bestRouteScore=score;
                        bestRoute=route;
                    }
                }
            }
            i++;
        }
    }
    return bestRoute;
}

const getHashs=(hash)=>{
    const hashs=hash.split("#");
    if((hashs.length>1)&&(!hashs[0])){
        hashs.shift();
    }
    return hashs;
}
