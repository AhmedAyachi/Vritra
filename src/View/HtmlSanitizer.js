

export default new (function(){
	const tagBlackList={"SCRIPT":true,"STYLE":true};
	const attributeBlackList={}
	const schemaWhiteList=["http:","https:","data:","m-files:","file:","ftp:","mailto:","pw:"]; //which "protocols" are allowed in "href", "src" etc
	const uriAttributes={"href":true,"action":true};

	const domparser=new DOMParser();

	this.sanitizeHtml=(view,input)=>{
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
				const {tagName}=node;
				if((node.nodeType===Node.ELEMENT_NODE)&&((!tagBlackList[tagName]))){
					newNode=doc.createElement(tagName);
					const {attributes}=node;
					const attrcount=attributes.length;
					let i=0,ref;
					while(newNode&&(i<attrcount)){
						const attribute=attributes[i],{name}=attribute;
						if(name.startsWith("on")){newNode=null;continue}
						else if(name==="ref"){
							const {value}=attribute;
							if(value){ref=value};
						}
						else if(!attributeBlackList[name]){
							const {value}=attribute;
							if(name==="style"){
								if(hasJavascriptScheme(value)){newNode=null;continue};
							}
							else if(uriAttributes[name]){
								if(value.includes(":")&&(!startsWithAny(value,schemaWhiteList))){newNode=null;continue};
							} 
							newNode.setAttribute(attribute.name,value);
						}
						i++;
					}
					if(newNode){
						if(ref){view[ref]=newNode};
						setNode(tagName,newNode);
						const {childNodes}=node,{length}=childNodes;
						for(let i=0;i<length;i++){
							const clone=getSanitizedClone(childNodes[i]);
							(clone instanceof Node)&&newNode.appendChild(clone);
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

	const setNode=(tagName,node)=>{
		switch(tagName){
			case "BUTTON":
				if(!node.hasAttribute("type")){node.setAttribute("type","button")};
				break;
			case "IMG":
				if(!node.hasAttribute("alt")){node.setAttribute("alt","img")};
				break;
			case "EMBED":
				console.time("svg");
				const {color,fill,weight}=node.attributes;
				node.addEventListener("load",()=>{
					const svgdoc=node.getSVGDocument();
					const svg=svgdoc?.querySelector("svg");
					if(svg){
						const {style}=svg;
						svg.classList.add(node.className);
						if(color){style.stroke=color.value};
						if(fill){style.fill=fill.value};
						if(weight){style.strokeWidth=weight.value};
						node.replaceWith(svg);
					}
					console.timeEnd("svg");
				},{once:true});
				break;
			default:break;
		}
	}

	const hasJavascriptScheme=(str)=>Boolean(str.includes(":")&&str.match(/javascript:/im));
});
