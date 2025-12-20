

export default function HashRouter(options){
    const {target,routes,fallbackRoute}=options;

    const invalidRouteIndex=routes.findIndex(it=>!(it&&(Object.getPrototypeOf(it)===Object.prototype)));
    if(invalidRouteIndex>=0){
        throw HashRouterError("invalid route object at index: "+invalidRouteIndex);
    }

    const {history,location}=window;
    const state={
        data:null,
        route:null,//{...,params,data,element} to store the last values of data and params.
    };
    setRoute();
    window.addEventListener("hashchange",setRoute);

    const hashrouter={
        push:(path,data)=>{if(typeof(path)==="string"){
            state.data=data;
            location.hash=getDecentPath(path);
        }},
        append:(path,data)=>{if(typeof(path)==="string"){
            state.data=data;
            let currentPath=location.hash;
            if(currentPath.startsWith("#")) currentPath=currentPath.substring(1);
            const url=new URL(`${location.origin}${getDecentPath(currentPath)}`);
            location.hash=`${url.pathname}${getDecentPath(path)}`;
        }},
        replace:(path,data)=>{if(typeof(path)==="string"){
            const oldhash=location.hash;
            state.data=data;
            history.replaceState(null,null,"#"+getDecentPath(path));
            (location.hash!==oldhash)&&setRoute();
        }},
        refresh:()=>{
            const {route}=state;
            if(route){
                const {memorize}=route;
                route.memorize=false;
                renderRoute(route,target).then(()=>{
                    if(memorize) route.memorize=true;
                });
            }
        },
        back:(data)=>{
            state.data=data;
            history.back();
        },
        reset:()=>{
            state.store={};
            routes.forEach(route=>{
                delete route.data;
                delete route.params;
                delete route.element;
                route.scroll={};
            });
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
                const {restrictor}=route;
                if(typeof(restrictor)==="function"){
                    restrictor({
                        target,
                        data:state.data,
                        params:route.params,
                        unlock:()=>{resolve(true)},
                        redirect:(path,data)=>{
                            resolve({path:String(path||""),data});
                        },
                    });
                }
                else resolve(true);
            }).then(result=>{
                if(result===true){
                    state.route=route;
                    route.data=state.data;
                    return renderRoute(route,target);
                }
                else hashrouter.replace(result.path,result.data);
            }).finally(()=>{
                state.data=null;
            });
        }
        else target.innerHTML="";
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
        if(scroll) element.scrollTo(scroll);
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

const getDecentPath=(path)=>(path.startsWith("/")?"":"/")+path.replace(/\/+/g,"/");

const getContext=({params,data})=>{
    let path=location.hash;
    const startsWithHash=path.startsWith("#");
    if(startsWithHash) path=path.substring(1);
    path=getDecentPath(path);
    const url=new URL(`${location.origin}${path}`);
    const context={
        location:{
            path,
            pathname:url.pathname,
            url:`${location.origin}/#${path}`,
            hash:url.hash,
            search:url.search,
        },
    };
    if(data) context.data=data;
    if(params) context.params=params;
    return context;
}

const getRoute=(routes,fallbackRoute)=>{
    const paths=getPaths(location.hash);
    let route=findBestRoute(paths,routes);
    if(route){
        const oldParams=route.params;
        let params=getSearchParams();
        route.paths?.forEach((path,i)=>{
            if(path.startsWith(":")){
                if(!params) params={};
                const varname=path.substring(1);
                params[varname]=paths[i];
            }
        });
        route.params=params;
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
const getSearchParams=()=>{
    let path=location.hash;
    if(path.startsWith("#")) path=path.substring(1);
    let index=path.indexOf("?");
    let markIndex=path.indexOf("#");
    if((index>markIndex)&&(markIndex>=0)) index=-1;
    if(index>=0){
        const params={};
        if(markIndex<0) markIndex=path.length;
        const searchParams=new URLSearchParams(path.substring(index,markIndex));
        for(const [key,value] of searchParams){
            if(value) params[key]=value;
        }
        return params;
    }
    else return null;
}
const areSameParams=(params0,params1)=>{
    let same=params0===params1;
    if(!same&&params0&&params1){
        const keys0=Object.keys(params0),keys1=Object.keys(params1);
        same=keys0.length===keys1.length;
        if(same){
            let i=0;
            const {length}=keys0;
            while(same&&(i<length)){
                const key0=keys0[i];
                if(keys1.some(key1=>key0===key1)){
                    if(params0[key0]===params1[key0]) i++;
                    else same=false;
                }
                else same=false;
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
            if(!routePaths) routePaths=route.paths=getPaths(path);
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

const getPaths=(path)=>{
    path=getLocationPathName(path);
    const paths=path.split("/").filter(Boolean);
    if((paths.length>1)&&(!paths[0])){
        paths.shift();
    }
    return paths;
}

const getLocationPathName=(path=location.hash)=>{
    if(path.startsWith("#")) path=path.substring(1);
    let markIndex=path.indexOf("?");
    if(markIndex<0) markIndex=path.length;
    let dashIndex=path.indexOf("#");
    if(dashIndex<0) dashIndex=path.length;
    const index=Math.min(markIndex,dashIndex);
    if(index===path.length) return path;
    else if(index>=0) return path.substring(0,index);
    else return path;
}

const HashRouterError=(message)=>{
    const error=new Error(message),{stack}=error;
    error.name="HashRouterError";
    if(stack) error.stack=stack.substring(stack.indexOf("at",stack.indexOf(error.name)));
    return error;
}
