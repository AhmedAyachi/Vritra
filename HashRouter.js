
export const HashRouter=(target=new HTMLElement(),routes/*=[{component:()=>{},hash:"",memorize:true}]*/)=>{
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
            if(memorize&&element){
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
    function getRoute(){
        const hashs=location.hash.split("#").reverse().map(hash=>hash&&("#"+hash));
        let target=null,routefound=false,i=0;
        const hashlength=hashs.length,routelength=routes.length;
        while(!routefound&&(i<hashlength)){
            let j=0;
            const thishash=hashs[i];
            while(!routefound&&(j<routelength)){
                const route=routes[j];
                routefound=route.hash===thishash;
                if(routefound){
                    target=route;
                }
                j++;
            }
            if(!routefound&&(i<hashlength-1)){
                const nexthash=hashs[i+1];
                j=0;
                while(!routefound&&(j<routelength)){
                    const route=routes[j],routehash=route.hash;
                    routefound=routehash.startsWith(nexthash+"#:");
                    if(routefound){
                        const datakey=routehash.substring(nexthash.length+2);
                        route.state={};
                        route.state[datakey]=thishash.substring(1);
                        target=route;
                    }
                    j++;
                }
            }
            i++;
        }
        if(target&&!target.scroll){
            target.scroll={top:0,left:0};
        }
        return target;
    }
}
