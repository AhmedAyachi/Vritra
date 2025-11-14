

export default function VritraElement(node){
    let onClickHandler;
	Object.defineProperties(node,{
		onClick:{set:(handler)=>{
			node.removeEventListener&&node.removeEventListener("click",onClickHandler);
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
