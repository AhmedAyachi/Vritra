

export default function VritraElement(node){
    let onClickHandler;
	Object.defineProperties(node,{
		onClick:{set:(handler)=>{
			if(onClickHandler&&node.removeEventListener){
				clearTimeout(node.clickTimeout);
				node.removeEventListener("click",onClickHandler);
			}
			if((typeof(handler)==="function")&&node.addEventListener){
				!function addHandler(){
					onClickHandler=(event)=>{
						clearTimeout(node.clickTimeout);
						handler(event);
						node.clickTimeout=setTimeout(addHandler,300);
					}
					node.addEventListener("click",onClickHandler,{once:true});
				}();
			}
		}},
	});
	return node;
}

export {default as HtmlSanitizer} from "./HtmlSanitizer";

export const setElementClassName=(element,className)=>{if(className){
    if(Array.isArray(className)){
        element.className=className.flat(Infinity).filter(Boolean).join(" ");
    } else {
        element.className=className;
    }
}};

export const setElementStyle=(element,style)=>{if(style){
    const applyStyle=(element,style)=>{
        if(typeof(style)==="string") element.style.cssText+=style; 
        else Object.assign(element.style,style);
    }
    if(Array.isArray(style)){
        const styles=style.flat(Infinity);
        for(const styleItem of styles){
            if(styleItem) applyStyle(element,styleItem);
        }
    }
    else applyStyle(element,style);
}};
