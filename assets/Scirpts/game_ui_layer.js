import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
    
        lbl_down_time : cc.Label,
        anm_game_ui_layer : cc.Animation,
    },

    onLoad:function(){
       // this.nowtime = 4;
        this.anm_game_ui_layer.play("go_time");
    },

    go_downtime :function(){
        global.event.fire("game_start");
        
       // this.lbl_down_time.string = "2";
    },

    update:function(dt){
        // if(this.nowtime > 0){
        //     this.nowtime -= dt;
        //     if((this.nowtime - Math.floor(this.nowtime))< 0.1) {
        //         this.lbl_down_time.string = (Math.floor(this.nowtime) - 1);
        //         if(Math.floor(this.nowtime) === 0){
        //             this.lbl_down_time.string = "";
        //             this.nowtime = 0;
        //             //游戏开始
        //             global.event.fire("game_start");
        //         }
        //     }
        // }
    },

    start () {

    },

});
