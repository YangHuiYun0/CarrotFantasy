import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
     
    },

    onLoad:function(){},

    button_click :function(event,coustomDate){
        global.event.fire(coustomDate + "_tower");
    },

    start () {

    },

});
