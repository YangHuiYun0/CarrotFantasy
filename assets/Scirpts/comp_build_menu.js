import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
       img_turret_1 : [cc.SpriteFrame],
       img_turret_2 : [cc.SpriteFrame],
       teurret_1 : cc.Sprite,
       teurret_2 : cc.Sprite,
    },

    button_click:function(event,CustomEventData){
        cc.log("点击的是" + CustomEventData);
        // global.event.fire("build_tower",CustomEventData);
        if(this.level_id ===1){
            this.node.parent.getComponent("comp_level_1").Newbuildtower(CustomEventData);
        }else{
            this.node.parent.getComponent("game_level_2").Newbuildtower(CustomEventData);
        }
    
        
    },

    init:function(_id){
        this.level_id = _id;
        this.teurret_1.spriteFrame = this.img_turret_1[_id-1];
        this.teurret_2.spriteFrame = this.img_turret_2[_id-1];
    },

    start () {

    },

   
});
