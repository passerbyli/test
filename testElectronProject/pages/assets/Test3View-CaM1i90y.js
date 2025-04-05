import{r as w,G as k}from"./index-3eR4IEZC.js";import{_ as E,f as I,o as A,c as p,b as z,n as B,e as h,t as b,i as x}from"./index-C6GkaOyR.js";const $={id:"field-graph",class:"w-full h-full relative"},N={class:"text-gray-500"},T={__name:"Test3View",setup(F){const t=I({visible:!1,x:0,y:0,field:"",table:"",nodeId:"",shape:null});let o=null;function v(){`${t.value.table}${t.value.field}`,o.getEdges().forEach(a=>{const s=a.getModel();s.target===t.value.table?o.setItemState(a,"highlight",s.targetAnchor===t.value.anchor):o.setItemState(a,"highlight",!1)})}function _(){`${t.value.table}${t.value.field}`,o.getEdges().forEach(a=>{const s=a.getModel();s.source===t.value.table?o.setItemState(a,"highlight",s.sourceAnchor===t.value.anchor):o.setItemState(a,"highlight",!1)})}return A(()=>{const a=[{name:"orders",fields:["order_id","customer_id"]},{name:"special_orders",fields:["oid","cid"]}],s=[{source:"orders.order_id",target:"special_orders.oid"},{source:"orders.customer_id",target:"special_orders.cid"}],y=a.map(e=>{const l=(e.fields.length+1)*20+10;return{id:e.name,label:e.name,type:"table-node",size:[200,l],fields:e.fields}}),S=s.map(({source:e,target:l})=>{var u,f;const[n,i]=e.split("."),[c,r]=l.split(".");return{source:n,target:c,sourceAnchor:((u=a.find(g=>g.name===n))==null?void 0:u.fields.indexOf(i))+1,targetAnchor:((f=a.find(g=>g.name===c))==null?void 0:f.fields.indexOf(r))+1}});w("table-node",{draw(e,l){const{label:n,fields:i}=e,c=200,r=(i.length+1)*20+10,u=l.addShape("rect",{attrs:{x:-200/2,y:-r/2,width:c,height:r,radius:4,stroke:"#5B8FF9",fill:"#fff"},name:"table-box",draggable:!0});return l.addShape("text",{attrs:{text:n,x:0,y:-r/2+20,fontSize:14,fill:"#000",textAlign:"center",textBaseline:"middle"},name:"table-title"}),i.forEach((f,g)=>{const m=-r/2+20*(g+2);l.addShape("text",{attrs:{text:f,x:-200/2+20,y:m,fontSize:12,fill:"#333",textAlign:"start",textBaseline:"middle"},name:`field-${f}`}),l.addShape("rect",{attrs:{x:-200/2,y:m-10,width:c,height:20,fill:"transparent",cursor:"pointer"},name:`field-bg-${f}`})}),u},getAnchorPoints(e){return e.fields.map((n,i)=>[0,(i+2)/(e.fields.length+3)])}},"single-node");const d=new k({container:"field-graph",width:window.innerWidth,height:window.innerHeight,layout:{type:"dagre",rankdir:"LR",nodesep:50,ranksep:100},defaultNode:{type:"table-node"},defaultEdge:{style:{stroke:"#999",endArrow:!0},stateStyles:{highlight:{stroke:"#f00",lineWidth:2}}},modes:{default:["drag-canvas","zoom-canvas","drag-node"]}});d.data({nodes:y,edges:S}),d.render(),o=d,d.on("node:contextmenu",e=>{var r;e.preventDefault();const l=e.item.getModel(),{shape:n}=e;if(!n||!((r=n.cfg.name)!=null&&r.startsWith("field-")))return;const i=n.cfg.name.replace("field-",""),c=l.fields.indexOf(i);t.value={visible:!0,x:e.clientX,y:e.clientY,table:l.id,field:i,anchor:c+1}}),d.on("canvas:click",()=>{t.value.visible=!1,d.getEdges().forEach(e=>d.clearItemStates(e))})}),(a,s)=>(x(),p("div",$,[t.value.visible?(x(),p("div",{key:0,style:B({left:t.value.x+"px",top:t.value.y+"px"}),class:"absolute bg-white border p-2 text-sm rounded shadow z-10"},[h("div",null,[h("strong",null,b(t.value.field),1)]),h("div",N,"所属表："+b(t.value.table),1),h("div",{class:"mt-2 space-y-1"},[h("button",{onClick:v,class:"text-blue-500 hover:underline"},"查看来源字段"),s[0]||(s[0]=h("br",null,null,-1)),h("button",{onClick:_,class:"text-blue-500 hover:underline"},"查看去向字段")])],4)):z("",!0)]))}},C=E(T,[["__scopeId","data-v-18f81319"]]);export{C as default};
