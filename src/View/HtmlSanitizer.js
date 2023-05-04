

export default new (function(){
	const tagBlackList={"SCRIPT":true,"STYLE":true};
	const attributeBlackList={}
	const schemaWhiteList=["http:","https:","data:","m-files:","file:","ftp:","mailto:","pw:"]; //which "protocols" are allowed in "href", "src" etc
	const uriAttributes={"href":true,"action":true};

	const domparser=new DOMParser();

	this.sanitizeHtml=(input)=>{
		input=input.trim();
		if((input=="")||(input==="<br>")) return "";
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
					let i=0;
					while(newNode&&(i<attrcount)){
						const attr=attributes[i],{name}=attr;
						if(name.startsWith("on")){newNode=null}
						if(newNode&&(!attributeBlackList[name])){
							const {value}=attr;
							if(name==="style"){
								if(hasJavascriptScheme(value)){newNode=null};
							}
							else if(uriAttributes[name]){
								if(value.includes(":")&&(!startsWithAny(value,schemaWhiteList))){newNode=null};
							}
							newNode?.setAttribute(attr.name,value);
						}
						i++;
					}
					if(newNode){
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

		return getSanitizedClone(body).innerHTML;
	}
	const startsWithAny=(str,searchStrs)=>{
		const {length}=searchStrs;
		let does=false,i=0;;
		while((!does)&&(i<length)){
			if(str.includes(searchStrs[i])){does=true};
			i++;
		}
		return does;
	}
	const hasJavascriptScheme=(str)=>Boolean(str.includes(":")&&str.match(/javascript:/im));
});
