

export default new (function(){
	const tagBlackList={"script":true,"SCRIPT":true,"STYLE":true,"OBJECT":true};
	const attributeBlackList={"as":true}
	const schemaWhiteList=["http:","https:","data:","m-files:","file:","ftp:","mailto:","pw:"]; //which "protocols" are allowed in "href", "src" etc
	const uriAttributes={"href":true,"action":true};

	const domparser=new DOMParser();

	this.sanitizeHtml=(input,view)=>{
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
					const {attributes}=node;
					const istext=tagName==="TEXT";
					if(istext){
						const {as}=attributes;
						tagName=(as&&as.value)||"p";
					}
					newNode=isDecentNode(tagName,attributes)&&doc.createElement(tagName);
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
								newNode.setAttribute(attribute.name,value);
							}
						}
						i++;
					}
					if(newNode){
						if(ref&&view){view[ref]=newNode};
						setNode(tagName,newNode);
						if(istext){
							newNode.innerText=node.innerHTML;
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

	const isDecentNode=(tagName,attributes)=>{
		let decent;
		switch(tagName){
			case "EMBED":
				const {src}=attributes;
				if(src){
					const {value}=src;
					if(value&&value.endsWith(".svg")){decent=true}
				}
				break;
			default:
				decent=true;
				break;
		}
		return decent;
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
			case "EMBED":
				const {attributes}=node,{value}=attributes.src;
				node.removeAttribute("src");
				const request=new XMLHttpRequest();
				request.open("GET",value,true);
				request.onreadystatechange=()=>{
					if((request.readyState===4)&&(request.status===200)){
						const svgbody=this.sanitizeHtml(request.responseText);
						const svg=svgbody.getElementsByTagName("svg")[0];
						if(svg){
							const {color,fill,weight}=attributes;
							const {style}=svg,{className}=node;
							className&&svg.classList.add(className);
							if(color){style.stroke=color.value};
							if(fill){style.fill=fill.value};
							if(weight){style.strokeWidth=weight.value};
							node.outerHTML=svg.outerHTML;
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
