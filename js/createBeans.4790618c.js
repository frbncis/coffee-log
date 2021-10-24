(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["createBeans"],{"1eb7":function(e,a,t){"use strict";t.d(a,"a",(function(){return r}));t("b0c0");var n=t("d4ec"),r=function e(){Object(n["a"])(this,e),this.id="",this.name="",this.roaster="",this.varietal="",this.process="",this.originCountry="",this.originRegion="",this.story="",this.tastingNotes=[],this.imageUrl="",this.beanTypes=[]}},ebe0:function(e,a,t){"use strict";t.r(a);var n=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("v-container",[t("v-row",{staticClass:"mx-2"},[t("v-col",{attrs:{cols:"12"}},[t("v-text-field",{attrs:{placeholder:"Name",outlined:""},model:{value:e.beanModel.name,callback:function(a){e.$set(e.beanModel,"name",a)},expression:"beanModel.name"}}),t("v-combobox",{attrs:{items:e.roasterNames,placeholder:"Roaster",outlined:""},model:{value:e.beanModel.roaster,callback:function(a){e.$set(e.beanModel,"roaster",a)},expression:"beanModel.roaster"}}),t("v-combobox",{attrs:{multiple:"",placeholder:"Tasting Notes",outlined:""},model:{value:e.beanModel.tastingNotes,callback:function(a){e.$set(e.beanModel,"tastingNotes",a)},expression:"beanModel.tastingNotes"}}),t("v-combobox",{attrs:{items:e.varieties,label:"Varietal",outlined:"","item-value":"text"},model:{value:e.beanModel.varietal,callback:function(a){e.$set(e.beanModel,"varietal",a)},expression:"beanModel.varietal"}}),t("v-combobox",{attrs:{items:e.process,label:"Process",outlined:"","item-value":"text"},model:{value:e.beanModel.process,callback:function(a){e.$set(e.beanModel,"process",a)},expression:"beanModel.process"}}),t("v-combobox",{attrs:{items:e.originCountries,label:"Origin",outlined:"","item-value":"text"},model:{value:e.beanModel.originCountry,callback:function(a){e.$set(e.beanModel,"originCountry",a)},expression:"beanModel.originCountry"}}),t("v-text-field",{attrs:{outlined:"",placeholder:"Origin Region"},model:{value:e.beanModel.originRegion,callback:function(a){e.$set(e.beanModel,"originRegion",a)},expression:"beanModel.originRegion"}}),t("v-textarea",{attrs:{outlined:"",placeholder:"Story"},model:{value:e.beanModel.story,callback:function(a){e.$set(e.beanModel,"story",a)},expression:"beanModel.story"}}),""==e.beanModel.imageUrl?t("v-file-input",{attrs:{id:"bag-image-upload",label:"Bag",outlined:"","prepend-icon":"mdi-camera"},on:{change:e.bagImageChanged}}):t("v-card",{staticClass:"mb-5"},[t("v-img",{attrs:{height:"125",src:e.beanModel.imageUrl}})],1),t("v-btn",{attrs:{block:"",color:"success",dark:"",loading:e.saving,large:""},on:{click:e.saveBean}},[e._v(" Save ")])],1)],1)],1)},r=[],o=(t("d81d"),t("b0c0"),t("96cf"),t("1da1")),i=t("5530"),s=t("2b0e"),l=t("1eb7"),c=t("df31"),d=t("2f62"),u=t("0613"),b=t("d4ec"),m=function e(){Object(b["a"])(this,e),this.id="",this.name=""},g=s["default"].extend({name:"CreateBeans",computed:Object(i["a"])(Object(i["a"])(Object(i["a"])({},Object(d["c"])({user:"user"})),Object(d["e"])({roasters:"roasters"})),{},{roasterNames:function(){return this.roasters.map((function(e){return e.name})).sort()}}),data:function(){return{beanImageFile:void 0,beanModel:new l["a"],originCountries:["Brazil","Ethiopia","Burundi","Columbia","Kenya","Costa Rica","Guatamula","Honduras","Panama","Peru"].sort(),process:["Washed","Natural","Honey"],saving:!1,varieties:["Bourbon","Catuai","Heirloom","Red","Pacas","Various"]}},created:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function a(){var t;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(e.setTopNavigation([]),!e.$route.query.beanId){a.next=9;break}return t=e.$route.query.beanId,u["b"].commit("SET_TITLE","Edit Beans"),a.next=6,e.getBeanById(t);case 6:e.beanModel=a.sent,a.next=10;break;case 9:u["b"].commit("SET_TITLE","Add Beans");case 10:case"end":return a.stop()}}),a)})))()},methods:Object(i["a"])(Object(i["a"])(Object(i["a"])({},Object(d["d"])({setTopNavigation:"SET_TOP_NAVIGATION"})),Object(d["b"])({getBeanById:"getBeanById"})),{},{bagImageChanged:function(e){this.beanImageFile=e},saveBean:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function a(){var t,n,r,o,s;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(e.saving=!0,!e.beanImageFile){a.next=6;break}return a.next=4,e.uploadBeanImageFile();case 4:t=a.sent,e.beanModel.imageUrl=t;case 6:if(!e.beanModel.id){a.next=11;break}return a.next=9,c["d"].doc(e.beanModel.id).set(Object(i["a"])({},e.beanModel));case 9:a.next=17;break;case 11:return a.next=13,c["d"].add(Object(i["a"])({},e.beanModel));case 13:return n=a.sent,e.beanModel.id=n.id,a.next=17,c["d"].doc(e.beanModel.id).set(Object(i["a"])({},e.beanModel));case 17:return a.next=19,c["f"].where("name","==",e.beanModel.roaster).limit(1).get();case 19:if(r=a.sent,0!==r.size){a.next=29;break}return o=new m,o.name=e.beanModel.roaster,a.next=25,c["f"].add(Object(i["a"])({},o));case 25:return s=a.sent,o.id=s.id,a.next=29,s.update(Object(i["a"])({},o));case 29:e.$router.push({name:"Beans"});case 30:case"end":return a.stop()}}),a)})))()},uploadBeanImageFile:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function a(){var t,n,r;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return t=e.beanImageFile,n=c["g"].ref("images/".concat(t.name)),a.next=4,n.put(t);case 4:return r=n.getDownloadURL(),a.abrupt("return",r);case 6:case"end":return a.stop()}}),a)})))()}})}),v=g,p=t("2877"),f=Object(p["a"])(v,n,r,!1,null,null,null);a["default"]=f.exports}}]);