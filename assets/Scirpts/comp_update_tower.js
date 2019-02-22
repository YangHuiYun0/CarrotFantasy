import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
     
    },

    onLoad:function(){},

    button_click :function(event,coustomDate){
        //global.event.fire(coustomDate + "_tower");
        let a = coustomDate + "_tower";
        if(this.node.parent.name === "comp_level_1"){
            if(coustomDate === "update"){
                this.node.parent.getComponent("comp_level_1").update_tower();
            }else{
                this.node.parent.getComponent("comp_level_1").delete_tower();
            }
        }else{
            if(coustomDate === "update"){
                this.node.parent.getComponent("game_level_2").update_leve2_tower();
            }else{
                this.node.parent.getComponent("game_level_2").delete_leve2_tower(); 
            }
           
        }
    },

    start () {

    },

});
