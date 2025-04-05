import{_ as P,d as M,c as p,a as i,b as C,w as u,r as c,e as v,t as N,o as B,f as d,g as I,h as q,i as s,j as R,F as y,k as w,l as D}from"./index-C6GkaOyR.js";const $=M({setup(){const l=async()=>{await window.ipc.sendInvoke("toMain",{event:"getDataBases"}).then(n=>{T.value=n})},t=async()=>{o.value&&(await window.ipc.sendInvoke("toMain",{event:"getTables",params:{database:o.value}}).then(n=>{o.value==="sys"?n=n.filter(e=>e.Tables_in_sys!=="sys").map(e=>e.Tables_in_sys):o.value==="mysql"?n=n.filter(e=>e.Tables_in_mysql!=="mysql").map(e=>e.Tables_in_mysql):o.value==="performance_schema"?n=n.filter(e=>e.Tables_in_performance_schema!=="performance_schema").map(e=>e.Tables_in_performance_schema):o.value==="information_schema"?n=n.filter(e=>e.Tables_in_information_schema!=="information_schema").map(e=>e.Tables_in_information_schema):o.value==="mall"&&(n=n.filter(e=>e.Tables_in_mall!=="mall").map(e=>e.Tables_in_mall)),h.value=n}),await window.ipc.sendInvoke("toMain",{event:"getRoutines",params:{database:o.value}}).then(n=>{m.value=n.map(e=>e.Name)}))},k=async n=>{await window.ipc.sendInvoke("toMain",{event:"getTableData",params:{database:o.value,table:n}}).then(e=>{if(r.value=e,console.log(r.value),r.value.length===0){f.value=[];return}else f.value=Object.keys(r.value[0])})},V=async n=>{await window.ipc.sendInvoke("toMain",{event:"getProcedureDefinition",params:{database:o.value,procName:n}}).then(e=>{a.value=e,e&&e.length>0&&(a.value=e[0]["Create Procedure"])})};B(()=>{l()});const T=d([]),h=d([]),m=d([]),o=d(""),b=d(""),_=d(""),r=d([]),f=d([]),a=d(""),g=I({databases:T,tables:h,routines:m,selectedDatabase:o,selectedTable:b,selectedProcedure:_,tableData:r,tableHeaders:f,procedureDefinition:a,loadTablesAndRoutines:t,loadTableData:k,loadProcedureDefinition:V});return{...q(g)}}}),A={id:"about"},U={key:0},j={key:1};function F(l,t,k,V,T,h){const m=c("el-option"),o=c("el-select"),b=c("el-col"),_=c("el-row"),r=c("el-table-column"),f=c("el-table");return s(),p("div",A,[i(_,null,{default:u(()=>[i(b,{span:24},{default:u(()=>[t[3]||(t[3]=R(" 数据库： ")),i(o,{modelValue:l.selectedDatabase,"onUpdate:modelValue":t[0]||(t[0]=a=>l.selectedDatabase=a),placeholder:"请选择数据库",onChange:l.loadTablesAndRoutines,style:{width:"200px"}},{default:u(()=>[(s(!0),p(y,null,w(l.databases,a=>(s(),D(m,{key:a.Database,label:a.Database,value:a.Database},null,8,["label","value"]))),128))]),_:1},8,["modelValue","onChange"])]),_:1})]),_:1}),i(_,null,{default:u(()=>[i(b,{span:12},{default:u(()=>[t[4]||(t[4]=v("p",null,"Table",-1)),i(o,{modelValue:l.selectedTable,"onUpdate:modelValue":t[1]||(t[1]=a=>l.selectedTable=a),placeholder:"请选择数据库",onChange:l.loadTableData,style:{width:"200px"}},{default:u(()=>[(s(!0),p(y,null,w(l.tables,a=>(s(),D(m,{key:a,label:a,value:a},null,8,["label","value"]))),128))]),_:1},8,["modelValue","onChange"])]),_:1}),i(b,{span:12},{default:u(()=>[t[5]||(t[5]=v("p",null,"Procedure",-1)),i(o,{modelValue:l.selectedProcedure,"onUpdate:modelValue":t[2]||(t[2]=a=>l.selectedProcedure=a),placeholder:"请选择数据库",onChange:l.loadProcedureDefinition,style:{width:"200px"}},{default:u(()=>[(s(!0),p(y,null,w(l.routines,a=>(s(),D(m,{key:a,label:a,value:a},null,8,["label","value"]))),128))]),_:1},8,["modelValue","onChange"])]),_:1})]),_:1}),l.tableData.length?(s(),p("div",U,[t[6]||(t[6]=v("h3",null,"数据",-1)),i(f,{data:l.tableData},{default:u(()=>[(s(!0),p(y,null,w(l.tableHeaders,(a,g)=>(s(),D(r,{key:g,label:a,prop:a},null,8,["label","prop"]))),128))]),_:1},8,["data"])])):C("",!0),l.procedureDefinition?(s(),p("div",j,[t[7]||(t[7]=v("h3",null,"存储过程内容",-1)),v("pre",null,N(l.procedureDefinition),1)])):C("",!0)])}const S=P($,[["render",F]]);export{S as default};
