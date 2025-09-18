

export function HashRouter(options){
    const {target,routes,fallbackRoute}=options;
    const {history,location}=window;
    const state={
        data:null,
        route:null,//{...,params,data,element} to store last data and params values
    };
 
    setRoute();
    window.addEventListener("hashchange",setRoute);

    const hashrouter={
        push:(path,data)=>{
            if(typeof(path)==="string"){
                state.data=data;
                location.hash=getDecentHash(path);
            }
        },
        append:(path,data)=>{
            if(typeof(path)==="string"){
                state.data=data;
                location.hash+=getDecentHash(path);
            }
        },
        replace:(path,data)=>{
            if(typeof(path)==="string"){
                const oldhash=location.hash;
                state.data=data;
                history.replaceState(null,null,`${location.origin}/#${getDecentHash(path)}`);
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
        route=getRoute(routes,fallbackRoute);
        if(route){
            new Promise(resolve=>{
                if(typeof(route.restrictor)==="function"){
                    route.restrictor(resolve,target);
                }
                else resolve(true);
            }).then(unlocked=>{
                if(unlocked){
                    state.route=route;
                    route.data=state.data;
                    return renderRoute(route,target);
                }
                else history.back();
            }).finally(()=>{
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

const getDecentHash=(path)=>path.startsWith("/")?path:("/"+path);

const getContext=({params,data})=>{
    let path=location.hash;
    const startsWithHash=path.startsWith("#");
    const context={
        params:params||{},
        location:{
            path:startsWithHash?path.substring(1):path,
            url:`${location.origin}/${startsWithHash?path:"#"+path}`,
        },
    };
    if(data){
        context.data=data;
    }
    
    return context;
}

const getRoute=(routes,fallbackRoute)=>{
    const paths=getHashs(location.hash);
    let route=findBestRoute(paths,routes);
    if(route){
        const oldParams=route.params,params=route.params=getURLParams();
        route.paths?.forEach((path,i)=>{
            if(path.startsWith(":")){
                const varname=path.substring(1);
                params[varname]=paths[i];
            }
        });
        if(route.memorize&&(!areSameParams(params,oldParams))){
            delete route.element;
        }
    }
    else route=fallbackRoute;
    if(route&&!route.scroll){
        route.scroll={top:0,left:0};
    }
    return route;
}
const getURLParams=(initials)=>{
    const params=initials||{},path=location.hash;
    const index=path.indexOf("?");
    if(index>=0){
        const searchParams=new URLSearchParams(path.substring(index));
        for(const [key,value] of searchParams){
            if(value) params[key]=value;
        }
    }
    return params;
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

const findBestRoute=(paths,routes)=>{
    const pathCount=paths.length;
    if(pathCount<1) return routes.find(it=>!it.path);
    else{
        let bestRoute,i=0,found;
        let bestRouteScore={exact:0,param:0};
        const routeCount=routes.length;
        while((!found)&&(i<routeCount)){
            const route=routes[i],path=route.path;
            let routePaths=route.paths;
            if(!routePaths) routePaths=route.paths=getHashs(path);
            const routePathCount=routePaths.length;
            if(routePathCount===pathCount){
                let rejected=false;
                const score={exact:0,param:0};
                for(let j=0;j<routePathCount;j++){
                    const routeHash=routePaths[j];
                    const asparam=routeHash.startsWith(":");
                    if(asparam){
                        if(paths[j]) score.param++;
                    }
                    else{
                        const exact=routeHash===paths[j];
                        if(exact) score.exact++;
                        else{
                            j=routePathCount;
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
        return bestRoute;
    }
}

const getHashs=(path)=>{
    path=getLocationPath(path);
    const paths=path.split("/").filter(Boolean);
    if((paths.length>1)&&(!paths[0])){
        paths.shift();
    }
    return paths;
}

const getLocationPath=(path=location.hash)=>{
    if(path.startsWith("#")) path=path.substring(1);
    const index=path.indexOf("?");
    if(index>=0) return path.substring(0,index);
    else return path;
}
