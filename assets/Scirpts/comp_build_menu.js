import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    button_click:function(event,CustomEventData){
        cc.log("点击的是" + CustomEventData);
        global.event.fire("build_tower",CustomEventData);
    },

    start () {

    },

   
});
