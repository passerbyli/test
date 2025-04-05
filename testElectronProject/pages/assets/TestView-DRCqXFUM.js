import{G as p}from"./index-3eR4IEZC.js";import{_ as v,f as g,o as h,c as n,b as f,e as d,j as c,t as _,F as b,k as w,n as x,i}from"./index-C6GkaOyR.js";const y={id:"field-graph",class:"w-full h-full relative"},k={key:0,class:"absolute top-4 left-4 bg-white border rounded shadow p-4 z-10 max-w-md"},E={class:"font-bold text-lg mb-2"},I={class:"text-sm whitespace-pre-wrap cursor-pointer"},C=["onClick"],S={class:"font-bold"},N={class:"text-xs text-gray-500"},z={__name:"TestView",setup(B){const o=g(null),a=g({visible:!1,x:0,y:0,field:"",table:""});function m(u,e){alert(`字段跳转: ${u}.${e}`)}return h(()=>{const u={nodes:[{id:"orders",label:`orders
────────────
order_id
user_id
amount
order_time`},{id:"users",label:`users
────────────
user_id
username
created_at`},{id:"tmp_raw_orders",label:`tmp_raw_orders
────────────
order_id
user_id
amount
order_time`},{id:"user_stats",label:`user_stats (CTE)
────────────
user_id
order_count
total_amount`},{id:"latest_orders",label:`latest_orders (CTE)
────────────
user_id
last_order`},{id:"user_orders_wide",label:`user_orders_wide
────────────
user_id
username
order_count
total_amount
last_order`},{id:"user_orders_staging",label:`user_orders_staging
────────────
user_id
order_count`},{id:"tmp_final_orders",label:`tmp_final_orders
────────────
(order_id, user_id, ...)`}],edges:[{source:"orders",target:"tmp_raw_orders"},{source:"users",target:"tmp_raw_orders"},{source:"tmp_raw_orders",target:"user_stats"},{source:"tmp_raw_orders",target:"latest_orders"},{source:"user_stats",target:"user_orders_wide"},{source:"latest_orders",target:"user_orders_wide"},{source:"users",target:"user_orders_wide"},{source:"user_orders_staging",target:"user_orders_wide"},{source:"tmp_raw_orders",target:"tmp_final_orders"}]},e=new p({container:"field-graph-canvas",width:document.getElementById("field-graph-canvas").clientWidth,height:document.getElementById("field-graph-canvas").clientHeight,layout:{type:"dagre",rankdir:"LR",nodesep:30,ranksep:50},modes:{default:["drag-canvas","zoom-canvas","drag-node"]},defaultNode:{type:"rect",size:[220,110],style:{fill:"#ffffff",stroke:"#1890ff",radius:8},labelCfg:{style:{fontSize:12,fill:"#000",lineHeight:16,textAlign:"left"}}},defaultEdge:{style:{stroke:"#999",endArrow:!0},labelCfg:{style:{fill:"#666",fontSize:10}}}});e.data(u),e.render(),e.on("node:click",t=>{const r=t.item.getModel();o.value=r,e.getEdges().forEach(s=>{const l=s.getModel();e.setItemState(s,"highlight",l.source===r.id||l.target===r.id)}),e.getNodes().forEach(s=>{const l=e.hasEdge(r.id,s.getID())||e.hasEdge(s.getID(),r.id);e.setItemState(s,"highlight",l||s.getID()===r.id)})}),e.on("node:mouseenter",t=>{const r=t.item.getModel(),s=t.target;if(s.cfg&&s.cfg.name==="text"){const l=s.cfg.text;a.value={visible:!0,x:t.clientX+10,y:t.clientY+10,field:l,table:r.id}}}),e.on("node:mouseleave",()=>{a.value.visible=!1}),e.on("canvas:click",()=>{o.value=null,a.value.visible=!1,e.getNodes().forEach(t=>e.clearItemStates(t)),e.getEdges().forEach(t=>e.clearItemStates(t))})}),(u,e)=>(i(),n("div",y,[o.value?(i(),n("div",k,[e[3]||(e[3]=c("1 ")),d("h3",E,"表："+_(o.value.id),1),d("pre",I,[e[1]||(e[1]=c("        ")),(i(!0),n(b,null,w(o.value.label.split(`
`).slice(2),t=>(i(),n("span",{key:t,onClick:r=>m(o.value.id,t.trim()),class:"hover:text-blue-600"},_(t)+"\\n",9,C))),128)),e[2]||(e[2]=c(`
      `))]),d("button",{class:"mt-2 text-blue-500 hover:underline",onClick:e[0]||(e[0]=t=>o.value=null)},"关闭")])):f("",!0),e[4]||(e[4]=d("div",{id:"field-graph-canvas",class:"w-full h-full"},null,-1)),a.value.visible?(i(),n("div",{key:1,style:x({top:a.value.y+"px",left:a.value.x+"px"}),class:"g6-tooltip"},[d("div",S,"字段："+_(a.value.field),1),d("div",N,"属于表："+_(a.value.table),1)],4)):f("",!0)]))}},V=v(z,[["__scopeId","data-v-fe1d0f04"]]);export{V as default};
