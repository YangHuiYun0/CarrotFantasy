import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
        //关卡预制件
        levelPrefabs: {
            default: [],
            type: cc.Prefab
        },
        //关卡存放的位置
        gameLayerNode:cc.Node,
        //游戏倒计时存放节点
        gameUilayerNode : cc.Node,
   
    },

    onLoad:function(){
        //生成预制件
        let level = cc.instantiate(this.levelPrefabs[0]);
        level.parent = this.gameLayerNode;
        global.event.on("have_level_2",this.open_leve1_2.bind(this));
    },

    open_leve1_2:function(){
       // this.gameLayerNode
       let level_2 = cc.instantiate(this.levelPrefabs[1]);
       level_2.parent = this.gameLayerNode;
    },

    start () {

    },

});
