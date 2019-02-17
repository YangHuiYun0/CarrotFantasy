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

        //敌人的路径列表
        enemyPathNodes: {
            default: [],
            type: cc.Node
        },
         //塔的位置的节点
        towerPosNodes: {
            default: [],
            type: cc.Node
        },
        //建塔的菜单预制件
        buildmenu : cc.Prefab,
        //塔的预制件
        towerPrefabs : [cc.Prefab],
        //升级塔的菜单的预制件
        updateMenuPrefab : cc.Prefab,
        //敌人的预制件
        enemyPrefab : cc.Prefab,
        //萝卜的资源
        img_hlb1 : cc.Sprite,
        frame_hlb : [cc.SpriteFrame],
        node_game_over : cc.Node,
        //子弹预制件
        bulletPrefab : cc.Prefab,
        dead_enemy :　cc.Label,
        enemy_live_num : cc.Label,
        tower_num : cc.Label,
        comp_level_2 : cc.Node,
    },

    onLoad:function(){
        this.mark = false;
        //塔的位置节点设置监听
        for(let i = 0 ;i<this.towerPosNodes.length;i++){
            let node_tower = this.towerPosNodes[i];
            //初始的时候给节点的状态设置为空
            this.setState(node_tower,towerState.Null);
            this.setTouchEvent(node_tower);           
        }
       //接收消息
       global.event.on("build_tower",(_msg)=>{
        this.Newbuildtower(_msg); 
       },this);
       global.event.on("update_tower",this.update_tower.bind(this));
       global.event.on("delete_tower",this.delete_tower.bind(this));
       global.event.on("game_start",this.gameStart.bind(this));
       global.event.on("shoot_bullet",this.addBullet.bind(this));
       global.event.on("enemy_dead",this.enemy_dead.bind(this));
        //当前的波次
        this.nowCount = 0;
        //当前波次的敌人的数量
        this.nowCountnemynum = 0;
        //当前增加的敌人的时间
        this.nowAddnemytime = 0;
        //当前增加的波次的时间
        this.nowAddcounttime = 0;
        //敌人的列表
        this.enemyList = [];
         //标志位  记录有多少只敌人吃了萝卜
         this.eat_num = 0;
         //敌人死亡次数
         this.enemy_dead_sum = 0 ;
         //建塔的数量
         this.set_tower_num = 0 ;
         //敌人出现总个数
         this.enemy_all_num = 0 ;
        
    },

    start () {
        
    },


    //塔事件的监听
    setTouchEvent:function(node){
        node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            cc.log("点击的位置"+event.target.name);
            //显示塔的菜单
            if(node.state === towerState.Null){
                this.show_build_menu(event.target);
            }else if(node.state === towerState.Tower){
                this.show_update_menu(event.target);
            }
            
        });
    },
     //显示塔的菜单
    show_build_menu : function(node){
        //在建立塔的菜单时要先关闭菜单
        this.close_build_menu();
        let node_menu = cc.instantiate(this.buildmenu);
        node_menu.init(1);
        node_menu.parent = this.node;
        node_menu.position = node.position;
        //引入状态机
        this.setState(node,towerState.BuildMenu);
        node.buildmenu = node_menu;

    },

    //显示升级塔的菜单
    show_update_menu:function(node){
        this.close_build_menu();
        //添加升级塔的菜单
        let upgrade_tower = cc.instantiate(this.updateMenuPrefab);
        
        upgrade_tower.parent = this.node;
        upgrade_tower.position = node.position;
        this.setState(node,towerState.UpdateMune);
        node.buildmenu = upgrade_tower;
    },

    //关闭建立菜单
    close_build_menu:function(){
        //首先遍历塔  如果塔已经建立菜单，则将塔的建立菜单关掉
        for(let i = 0 ; i < this.towerPosNodes.length; i++){
            let node_tower = this.towerPosNodes[i];
            if(node_tower.state === towerState.BuildMenu){
                node_tower.buildmenu.destroy();
                this.setState(node_tower,towerState.Null);
                return node_tower;
            }

             //如果有升级菜单的时候，并且关掉的时候
            if(node_tower.state === towerState.UpdateMune){
                node_tower.buildmenu.destroy();
                this.setState(node_tower,towerState.Tower);
                return node_tower;
            }
        }      
    },

    //状态机的函数
    setState:function(node,state){
        //判断状态机的状态
        if(node.state === state){
            return
        };
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

    //建立防御塔
    Newbuildtower:function(tower_id){
        //建塔的时候要先关掉菜单项
        let node = this.close_build_menu();
        //建立塔  取预制件
        let tower = cc.instantiate(this.towerPrefabs[tower_id]);
        tower.parent = this.node;
        tower.position = node.position; //位置放在刚才关掉预制件的位置
        this.setState(node,towerState.Tower);
        node.tower = tower;
        this.set_tower_num += 1;
        this.tower_num.string = this.set_tower_num;
    },
    //关监听
    onDestroy:function(){
        global.event.off("build_tower",this.Newbuildtower);
    },

    //塔升级
    update_tower:function(){
        let node = this.close_build_menu();
        node.tower.getComponent("tower").updateTower();
    },

    //塔清除
    delete_tower:function(){
        let node = this.close_build_menu();
        this.setState(node,towerState.Null);
        node.tower.getComponent("tower").deleteTower();
        node.tower = undefined;
    },

    //敌人出现
    gameStart:function(){
        //读取关卡数据
        cc.loader.loadRes("config/level_config.json",(err,result)=>{
            if(err){
                cc.log("表格出错");
            }else{
                cc.log("s读取"+JSON.stringify(result));
            }
            //取出第一关数据
            this.levelConfing = result.level_1;
            this.currentWaveConfig = this.levelConfing.waves[0];
            this.mark = true;
        });
    },

    update:function(dt){
        if(this.mark === true){
            if(this.currentWaveConfig){
                //如果当前的波次存在  则加敌人
                if(this.nowAddnemytime > this.currentWaveConfig.dt){
                    this.nowAddnemytime = 0;
                    this.nowCountnemynum ++;
                    this.enemy_all_num += 1;
                    this.enemy_live_num.string = this.enemy_all_num;
                    this.dead_enemy.string = this.enemy_dead_sum || 0;
                    this.addEnemy(this.currentWaveConfig.type);
                    if(this.nowCountnemynum === this.currentWaveConfig.count){
                        this.currentWaveConfig = undefined;
                        this.nowCountnemynum = 0;
                    }
                }else{
                    this.nowAddnemytime += dt;
                }
             }//增加第二波敌人
            else{
                //如果加波次的时间大于配置里的时间
                if(this.nowAddcounttime > this.levelConfing.dt){
                    this.currentWaveConfig = this.levelConfing.waves[this.nowCount+1];
                    //如果当前波次小于配置表的总波次
                    if(this.nowCount < this.levelConfing.waves.length){
                        this.nowCount ++;
                    }else{
                        this.currentWaveConfig = undefined;
                    }
                    this.nowAddcounttime = 0;
                    //实现波次波次之间的间隔
                }else{
                    this.nowAddcounttime += dt;
                }
            }
        }

        //如果被吃了6次萝卜消失  则弹出游戏失败
        if(this.eat_num >= 6){
            //this.node_game_over.active = true;
            cc.director.loadScene("game_result")
        }

        if((this.enemy_dead_sum + this.eat_num) >= 25 ){
            cc.director.loadScene("game_level_2");
            return;
        }


        //做攻击敌人的循环
        for(let i = 0 ; i<this.towerPosNodes.length;i++){
            //取出塔
            let tower = this.towerPosNodes[i].tower;
            if(tower != undefined && tower.getComponent("tower").isFree()){
                for(let j = 0; j<this.enemyList.length;j++){
                    let enemy = this.enemyList[j];
                    if(this.enemyList[0].name === ""){
                        this.enemyList.shift();
                        return;
                    } 
                    if(enemy._name){
                        //判断敌人的状态  获取敌人的脚本 判断是或活着
                        if(enemy.getComponent("comp_enemy").isLiving()){
                        tower.getComponent("tower").setEnemy(enemy);
                        }else if(enemy.getComponent("comp_enemy").isDead()){
                            this.enemyList.splice(j,1);
                        }
                    }else{
                        cc.log("xxxxxxxxxxxxxxxxxxx");
                    }
                    
                }
            }
        }      
    },

    //增加敌人
    addEnemy:function(type){

        cc.log("加敌人" + this.currentWaveConfig.type);
        //初始化敌人
        let enemy = cc.instantiate(this.enemyPrefab);
        enemy.parent = this.node;
        //把敌人加入列表
        this.enemyList.push(enemy);
        //向敌人的脚本里传敌人的类型和敌人的路径
        enemy.getComponent("comp_enemy").initWithData(type,this.enemyPathNodes,this.enem);
        enemy.getComponent('comp_enemy').comp_level_1 = this;
        
    },

    addBullet:function(tower,enemy_position){
        //创建子弹
        let bullet = cc.instantiate(this.bulletPrefab);
        bullet.parent = this.node;
        bullet.getComponent("comp_bullet").initWithData(tower,enemy_position,this.enemyList);
    },

    gain_play:function(){
        this.img_hlb1.spriteFrame = this.frame_hlb[this.eat_num];
        cc.log("hlb1_"+this.eat_num);
    },

    enemy_dead:function(_num){
        this.enemy_dead_sum += 1;
       
    },

    click_again:function(){
        cc.director.loadScene("game_world")
    },

    click_close : function(){
        cc.director.loadScene("login")
    },

  

   
});
