import {getArrayMax} from "../index";


export function HashRouter(target=new HTMLElement(),routes){
    const {history,location}=window;
    let data=null,route=null;
 
    setRoute();
    window.addEventListener("hashchange",setRoute);

    history.push=(hash,state)=>{
        if(typeof(hash)==="string"){
            setData(hash,state);
            location.hash=hash;
        }
    }
    history.append=(hash,state)=>{
        if(typeof(hash)==="string"){
            setData(hash,state);
            location.hash+=hash;
        }
    }
    history.replace=(hash,state)=>{
        if(typeof(hash)==="string"){
            const oldhash=location.hash;
            setData(hash,state);
            history.replaceState(null,null,`${location.origin}/${hash}`);
            (location.hash!==oldhash)&&setRoute();
        }
    }

    location.refresh=()=>{
        const {hash}=location;
       hash?location.replace(`#${hash}`):location.reload();
    }


    function setRoute(){
        if(route){
            const {memorize,element}=route;
            if(memorize&&(element instanceof HTMLElement)){
                const {scroll}=route;
                scroll.top=element.scrollTop;
                scroll.left=element.scrollLeft;
            }
        }
        route=getRoute();
        target.innerHTML="";
        if(route){
            if(!(typeof(route.restricted)==="function")||route.restricted()){
                if(route&&(typeof(route.component)==="function")){
                    const {element,memorize}=route;
                    if(memorize&&(element instanceof HTMLElement)){
                        const {scroll}=route;
                        target.appendChild(element);
                        element.scrollTo(scroll);
                    }
                    else if(typeof(route.component)==="function"){
                        route.name=route.component.name;
                        route.element=route.component({parent:target,...data,...(route.state||{})});
                    }
                    (typeof(route.onLoad)==="function")&&route.onLoad(data,target);
                    window.scrollTo(0,0);
                }
            }
            else{
                history.back();
            }   
        }
        data=null;
    }
    function setData(hash,state={}){
        if(hash&&!hash.startsWith("#")){
            hash="#"+hash;
        }
        data={
            ...(state||{}),
            location:{
                hash,
                url:`${location.origin}/${hash}`,
            },
        };
    }
    
    function getPotentialRoutes(hashs){
        const hashcount=hashs.length;
        const fullhash=location.hash;
        let i=0,routecount=routes.length,exactfound;
        let potentials=[];
        while((!exactfound)&&(i<routecount)){
            const route=routes[i],{hash}=route;
            route.score=0;
            let routehashs=route.hashs;
            if(!routehashs){
                routehashs=route.hashs=getHashs(hash);
            }
            if(fullhash===hash){
                exactfound=true;
                potentials=[route];
            }
            else{
                if(routehashs.length===hashcount){
                    const isProbable=routehashs.every((hash,i)=>{
                        const match=hash===hashs[i];
                        if(match){
                            route.score++;
                        }
                        return match||hash.startsWith(":");
                    });
                    if(isProbable){
                        potentials.push(route);
                    }
                }
                i++;
            }
        }
        return potentials;
    }

    function getRoute(){
        const hashs=getHashs(location.hash);
        const potentials=getPotentialRoutes(hashs);
        const potentialcount=potentials.length;
        let route;
        if(potentialcount===1){
            route=potentials[0]||null;
        }
        else if(potentialcount){
            console.log(potentials);
            const {index}=getArrayMax(potentials.map(({score})=>score));
            route=potentials[index];
            
        }
        if(route){
            const state=route.state={};
            route.hashs.forEach((hash,i)=>{
                if(hash.startsWith(":")){
                    const varname=hash.substring(1);
                    state[varname]=hashs[i];
                }
            });
            if(!route.scroll){
                route.scroll={top:0,left:0};
            }
        }
        return route;
    }
}

const getHashs=(hash)=>{
    const hashs=hash.split("#");
    if((hashs.length>1)&&(!hashs[0])){
        hashs.shift();
    }
    return hashs;
}
