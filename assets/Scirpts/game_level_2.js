import global from './global'
import { EAFNOSUPPORT } from 'constants';
//设置状态机
const towerState = {
    //无效的状态
    Invalid : -1,
    Null : 1,
    BuildMenu : 2,
    Tower : 3,
    UpdateMune : 4,  //升级塔

}

cc.Class({
    extends: cc.Component,

    properties: {
       //敌人的路径
       level2_enemynodes :[cc.Node],
       //塔的位置
       level2_towernodes : [cc.Node],
       //建塔的菜单预制件
       level2_buildmenu : cc.Prefab,
       //塔的预制件
       level2_towerprefab : [cc.Prefab],
       //升级塔的菜单的预制件
       level2_updateMenuPrefab : cc.Prefab,
       //敌人的预制件
       level2_enemyPrefab : cc.Prefab,
       //萝卜的资源
       level2_img_hlb1 : cc.Sprite,
       level2_frame_hlb : [cc.SpriteFrame],
       level2_node_game_over : cc.Node,
       //子弹预制件
       level2_bulletPrefab : cc.Prefab,
       level2_dead_enemy :　cc.Label,
       level2_enemy_live_num : cc.Label,
       level2_tower_num : cc.Label,
       level2_comp_level_2 : cc.Node,
    },

    onLoad(){
        //标志位
        this.mark = false;
        //遍历塔
        for(let i = 0 ; i < this.level2_towernodes.length;i++){
            let node_tower = this.level2_towernodes[i];
            //初始将塔设置为空
            this.setState(node_tower,towerState.Null);
            this.setTouchEvent(node_tower);
        }
    },

    start () {

    },

    //塔事件的监听
    setTouchEvent : function(node){
        node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            //显示塔的菜单
            if(node.state === towerState.Null){
                this.show_build_level2_menu(event.target);
            }else if (node.state === towerState.Tower){
                this.show_update_level2_menu(event.target);
            }
        });
    },
    //状态机
    setState:function(node,state){
        if(node.state === state){
            return;
        }
        switch(state){
            case towerState.Null:
            break;
            case towerState.BuildMenu:
            break;
            default:
            break 
        }
        node.state = state;
    },

    show_build_level2_menu:function(node){
        //建塔
        this.close_tower();
        let node_menu = cc.instantiate(this.level2_buildmenu);
        node_menu.getComponent("comp_build_menu").init(2);
        node_menu.parent = this.node;
        node_menu.position = node.position;
        this.setState(node,towerState.BuildMenu);
        node.buildmenu = node_menu;
    },

    show_update_level2_menu:function(node){
        this.close_tower();
        let update_tower = cc.instantiate(this.level2_updateMenuPrefab);
        update_tower.parent = this.node;
        update_tower.position = node.position;
        this.setState(node,towerState.UpdateMune);
        node.buildmenu = update_tower;
    },

    //关闭塔的菜单项
    close_tower : function(){
        for(let i = 0 ; i< this.level2_towernodes.length;i++){
            let node_tower = this.level2_towernodes[i];
            if(node_tower.state === towerState.BuildMenu){
                node_tower.buildmenu.destroy();
                this.setState(node_tower,towerState.Null);
                return node_tower;
            }
            if(node_tower.state === towerState.UpdateMune){
                node_tower.buildmenu.destroy();
                this.setState(node_tower,towerState.Tower);
                return node_tower;
            }
        }
    },

    //建塔
    Newbuildtower:function(tower_id){
        //建塔的时候要先关掉菜单项
        let node = this.close_tower();
        //建立塔  取预制件
        let tower = cc.instantiate(this.level2_towerprefab[tower_id]);
        tower.parent = this.node;
        tower.position = node.position; //位置放在刚才关掉预制件的位置
        this.setState(node,towerState.Tower);
        node.tower = tower;
    },

});
