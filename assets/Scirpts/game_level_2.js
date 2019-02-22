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
        this.gameStart_leve2();
        //遍历塔
        for(let i = 0 ; i < this.level2_towernodes.length;i++){
            let node_tower = this.level2_towernodes[i];
            //初始将塔设置为空
            this.setState(node_tower,towerState.Null);
            this.setTouchEvent(node_tower);
        }
        global.event.on("update_tower",this.update_leve2_tower.bind(this));
        global.event.on("delete_tower",this.delete_leve2_tower.bind(this));
        // global.event.on("game_start_2",()=>{
            
        // },this.node);
        //当前波次
        this.now_count = 0 ;
        //当前波次敌人的数量
        this.now_count_enemy_num = 0
        //当前增加敌人的时间
        this.now_add_enemy_time = 0;
        //当前增加的波次的时间
        this.now_add_count_time = 0;
        //敌人的列表
        this.enemy_list = [];
         //标志位  记录有多少只敌人吃了萝卜
         this.eat_num = 0;
         //敌人死亡次数
        this.enemy_dead_sum = 0 ;
         //建塔的数量
         this.set_tower_num = 0 ;
         //敌人出现总个数
         this.enemy_all_num = 0 ;
         this.level2_enemy_live_num.string = 45 ;

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

    //升级塔
    show_update_level2_menu:function(node){
        this.close_tower();
        let update_tower = cc.instantiate(this.level2_updateMenuPrefab);
       // update_tower.getComponent("comp_update_tower").init(2);
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
        this.set_tower_num += 1;
        this.level2_tower_num.string = this.set_tower_num;
    },
    
    //塔升级
    update_leve2_tower : function(){
        let node = this.close_tower();
        node.tower.getComponent("tower").updateTower();
    },

    //塔清除
    delete_leve2_tower:function(){
        let node = this.close_tower();
        this.setState(node,towerState.Null);
        node.tower.getComponent("tower").deleteTower();
        node.tower = undefined;
    },

    //敌人出现
    gameStart_leve2:function(){
        cc.loader.loadRes("config/level_config.json",(err,result)=>{
            if(err){
                cc.log("表格出错");
            }else{
                cc.log("s读取"+JSON.stringify(result));
            }
            //取出第一关数据
            this.level2Confing = result.level_2;
            this.leve2_currentWaveConfig = this.level2Confing.waves[0];
            this.mark = true;
        });
    },

    update:function(dt){
        if(this.mark=== true){
            if(this.leve2_currentWaveConfig){
               if(this.now_add_enemy_time>this.leve2_currentWaveConfig.dt){
                   this.now_add_enemy_time = 0;
                   this.now_count_enemy_num ++;
                   this.level2_dead_enemy.string = this.enemy_dead_sum || 0;
                   //增加敌人
                   this.add_enemy(this.leve2_currentWaveConfig.type);
                   if(this.now_count_enemy_num === this.leve2_currentWaveConfig.count){
                       this.leve2_currentWaveConfig = undefined;
                       this.now_count_enemy_num = 0;
                   }
                  
               }else {
                   this.now_add_enemy_time += dt;
               }
            }//增加第二波
            else{
                if(this.now_add_count_time > this.level2Confing.dt){
                    this.leve2_currentWaveConfig = this.level2Confing.waves[this.now_count+1];
                    //如果当前波次小于配置表的总波次
                    if(this.now_count < this.level2Confing.waves.length){
                        this.now_count ++;
                    }else{
                        this.leve2_currentWaveConfig = undefined;
                    }
                    this.now_add_count_time = 0;
                }else{
                    this.now_add_count_time += dt;
                }
            }
        }

        //做攻击敌人
        for(let i = 0 ; i < this.level2_towernodes.length;i++){
            let tower =  this.level2_towernodes[i].tower;
            if(tower !== undefined && tower.getComponent("tower").isFree()){
                for(let j = 0 ; j < this.enemy_list.length ; j++){
                    let enemy = this.enemy_list[j];
                    if(this.enemy_list[0].name === ""){
                        this.enemy_list.shift();
                        return;
                    }
                    if(enemy._name){
                        if(enemy.getComponent("comp_enemy").isLiving()){
                            tower.getComponent("tower").setEnemy(enemy);
                        }else if (enemy.getComponent("comp_enemy").isDead()){
                            this.enemy_list.splice(j,1);
                        }
                    }else{

                    }
                }
            }
        }
    },

    add_enemy : function(_type){
        //初始化敌人
        let enemy = cc.instantiate(this.level2_enemyPrefab);
        enemy.parent = this.node;
        this.enemy_list.push(enemy);
        enemy.getComponent("comp_enemy").initWithData(_type,this.level2_enemynodes,this.enemy_list);
        enemy.getComponent("comp_enemy").game_level_2 = this;
    },

    //创建子弹
    add_bullet : function(tower,enemy_position,_id){
        let bullet = cc.instantiate(this.level2_bulletPrefab);
        bullet.getComponent("comp_bullet").init(Number(_id));
        bullet.parent = this.node;
        bullet.getComponent("comp_bullet").initWithData(tower,enemy_position,this.enemy_list);
    },

    //敌人死的个数
    enemy_dead : function(_num){
        this.enemy_dead_sum += 1;
    },
});
