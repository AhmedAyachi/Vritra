

export default new (function(){
	const tagBlackList={"script":true,"SCRIPT":true,"STYLE":true,"OBJECT":true};
	const attributeBlackList={"as":true}
	const schemaWhiteList=["http:","https:","data:","m-files:","file:","ftp:","mailto:","pw:"]; //which "protocols" are allowed in "href", "src" etc
	const uriAttributes={"href":true,"action":true};
	const svgSpecificAttributes={
		"viewbox":"viewBox",
		"preserveaspectratio":"preserveAspectRatio",
		"color":"stroke",
		"weight":"stroke-width",
	}

	const domparser=new DOMParser();

	this.sanitizeHtml=(input,vritraEl)=>{
		input=input.trim();
		if((input=="")||(input==="<br>")) return null;
		if(input.includes("<body")){input=`<body>${input}</body>`};

		const doc=domparser.parseFromString(input,"text/html");
		const {body}=doc;
		if(body.tagName!=="BODY"){body.remove()};
		if(typeof(doc.createElement)!=="function"){doc.createElement.remove()};
		function getSanitizedClone(node){
			let newNode;
			if(node.nodeType==Node.TEXT_NODE){
				newNode=node.cloneNode(true);
			} 
			else{
				let {tagName}=node;
				if((node.nodeType===Node.ELEMENT_NODE)&&((!tagBlackList[tagName]))){
					const {attributes}=node,isText=tagName==="TEXT";
					tagName=getDecentTag(tagName,attributes);
					if(tagName){
						const isSvg=tagName==="SVG";
						newNode=isSvg?document.createElementNS("http://www.w3.org/2000/svg","svg"):document.createElement(tagName);
						const attrcount=attributes.length;
						let i=0,ref;
						while(newNode&&(i<attrcount)){
							const attribute=attributes[i],{name}=attribute;
							if(name.startsWith("on")){newNode=null;continue}
							else if(!attributeBlackList[name]){
								const {value}=attribute;
								if(name==="ref"){if(value){ref=value}}
								else{
									if(name==="style"){
										if(hasJavascriptScheme(value)){newNode=null;continue};
									}
									else if(uriAttributes[name]){
										if(value.includes(":")&&(!startsWithAny(value,schemaWhiteList))){newNode=null;continue};
									}
									newNode.setAttribute((isSvg&&svgSpecificAttributes[name])||name,value);
								}
							}
							i++;
						}
						if(newNode){
							if(ref&&vritraEl){
								const node=vritraEl[ref]=decorateNode(newNode,ref);
								const remove=node.remove.bind(node);
								node.remove=()=>{
									delete vritraEl[ref];
									remove();
								}
							};
							setNode(tagName,newNode);
							if(isText){
								newNode.innerText=node.innerHTML?.trim();
							}
							else{
								const {childNodes}=node,{length}=childNodes;
								for(let i=0;i<length;i++){
									const clone=getSanitizedClone(childNodes[i]);
									(clone instanceof Node)&&newNode.appendChild(clone);
								}
							}
						}
					}
				}
				else{
					newNode=doc.createDocumentFragment();
				}
			}
			return newNode;
		};

		return getSanitizedClone(body);
	}

	const startsWithAny=(str,searchStrs)=>{
		const {length}=searchStrs;
		let does=false,i=0;
		while((!does)&&(i<length)){
			if(str.includes(searchStrs[i])){does=true};
			i++;
		}
		return does;
	}

	const getDecentTag=(tagName,attributes)=>{
		switch(tagName){
			case "EMBED":
				const {src}=attributes;
				if(src){
					const {value}=src;
					return value&&value.endsWith(".svg")&&"SVG";
				}
				else return undefined;
			case "TEXT":
				const {as}=attributes;
				tagName=(as&&as.value?.toUpperCase())||"p";
				return getDecentTag(tagName,attributes);
			default: return (!tagBlackList[tagName])&&tagName;
		}
	}

	const setNode=(tagName,node)=>{
		switch(tagName){
			case "BUTTON":
				if(!node.hasAttribute("type")){node.setAttribute("type","button")};
				break;
			case "IMG":
				if(!node.hasAttribute("alt")){node.setAttribute("alt","img")};
				break;
			case "IFRAME":
				node.setAttribute("sandbox","");
				break;
			case "SVG":
				const src=node.attributes.src.value;
				node.removeAttribute("src");
				const request=new XMLHttpRequest();
				request.open("GET",src,true);
				request.onreadystatechange=()=>{
					if((request.readyState===4)&&(request.status===200)){
						const svgbody=this.sanitizeHtml(request.responseText);
						const svg=svgbody.getElementsByTagName("svg")[0];
						if(svg){
							const {attributes}=svg,{length}=attributes;
							for(let i=0;i<length;i++){
								const attribute=attributes[i];
								let {name}=attribute;
								if(!node.hasAttribute(name)){
									node.setAttribute(svgSpecificAttributes[name]||name,attribute.value);
								}
							}
							node.innerHTML=svg.innerHTML;
						}
					}
				};
				request.send();
				break;
			default:break;
		}
	}

	const hasJavascriptScheme=(str)=>Boolean(str.includes(":")&&str.match(/javascript:/im));
});

export const decorateNode=(node)=>{
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
