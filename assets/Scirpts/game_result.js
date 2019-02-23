
cc.Class({
    extends: cc.Component,

    properties: {

        lbl_dead_enemy :cc.Label,
        lbl_all_enemy : cc.Label,

    },


    start () {

    },
    onLoad:function(){
        let dead_num =cc.sys.localStorage.getItem("dead_num");
        let all_num = cc.sys.localStorage.getItem("all_num");

        this.lbl_dead_enemy.string = dead_num;
        this.lbl_all_enemy.string = all_num;
    },

    
    click_again:function(){
        cc.director.loadScene("game_world")
    },

    click_close : function(){
        cc.director.loadScene("login")
    },

});
