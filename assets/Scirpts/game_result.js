
cc.Class({
    extends: cc.Component,

    properties: {

    },


    start () {

    },

    
    click_again:function(){
        cc.director.loadScene("game_world")
    },

    click_close : function(){
        cc.director.loadScene("login")
    },

});
