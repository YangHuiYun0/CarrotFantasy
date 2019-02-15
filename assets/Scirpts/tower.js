import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
        towerFrames:[cc.SpriteFrame],
        node_tower : cc.Sprite,
        //塔的类型
        tower_type:""
  
    },

    onLoad:function(){
        //初始化塔的级数
        this.towerCount = 0 ;
        //当前的攻击力
        this.tower_damage = 0;
        //塔的识别范围
        this.tower_look_range = 0;
        //塔的攻击范围
        this.tower_attack_range = 0;
        //射击间隔
        this.shoot_interval_dt = 0;
        //当前的射击时间
        this.now_shoot_time = 0;
        //取塔的文件
        cc.loader.loadRes("config/tower.json",(err,result)=>{
            if(err){
                cc.log("文件错误");
            }
            else{
                //文件里的damage是伤害值   
                //攻击范围是：attack ，随着等级的增加会变大  
                //识别范围： look_range  射击间隔：shoot
                this.towerConfig = result[this.tower_type];
                //取出攻击力的值 传进当前塔等级
                this.tower_damage = this.towerConfig.damages[this.towerCount];
                this.tower_attack_range = this.towerConfig.attack_ranges[this.towerCount];
                this.tower_look_range = this.towerConfig.look_range;
                this.shoot_interval_dt = this.towerConfig.shoot_dts[this.towerCount];
            }
        });
    },

    //升级塔  与comp_level_1建立的关系
    updateTower:function(){
        if(this.towerCount < this.towerFrames.length - 1){
            this.towerCount ++;
            this.node_tower.spriteFrame = this.towerFrames[this.towerCount];

            //每次攻击伤害值都会刷新
            this.tower_damage = this.towerConfig.damages[this.towerCount];
            this.tower_attack_range = this.towerConfig.attack_ranges[this.towerCount];
            this.tower_look_range = this.towerConfig.look_range;
            this.shoot_interval_dt = this.towerConfig.shoot_dts[this.towerCount];
            cc.log(this.node_tower.SpriteFrame);
        }else{
            cc.log("满级");
        }

    },

    //清除塔
    deleteTower:function(){
        this.node.destroy();
    },

    isFree:function(){
        //检查敌人
        if(this.enemy === undefined){
            return true;
        }
        return false;
    },

    setEnemy:function(enemy){
        let distance = cc.pDistance(enemy.position,this.node.position);
        //在攻击范围之内  就给赋值
        if(distance < this.tower_look_range){
            this.enemy = enemy;  //当前攻击的点
        }
    },
    update:function(dt){
        if(this.enemy !== undefined){
            //如果塔不为空，就让塔旋转
            ////取出向量  当前的敌人的位置  与当前节点的位置
            let direction = cc.pSub(this.enemy.position,this.node.position);
            //取出一个夹角  向量转弧度
            let angle = cc.pAngleSigned(direction,cc.p(0,-1));
            //弧度转角度
            this.node.rotation = (180/Math.PI)*angle;
            //如果我们的当前的射击时间大于时间间隔  就射击一次
            if(this.now_shoot_time > this.shoot_interval_dt){
                this.now_shoot_time = 0;//让射击时间为0
                this.shootBullet();
            }else{
                this.now_shoot_time += dt;
            }

            //实时检测距离
            let distance = cc.pDistance(this.enemy.position,this.node.position);
           //如果距离大于攻击范围  如果敌人是活着的话 不做处理 如果是死的  让敌人为空
           if(distance >this.tower_attack_range || this.enemy.getComponent("comp_enemy").isLiving() === false){
               //敌人不在范围内或者敌人已死
               this.enemy = undefined;
           } 
        }
    },
    //射击方法
    shootBullet:function(){
        //如果我们的当前的射击时间大于时间间隔  就射击一次
        global.event.fire("shoot_bullet",this.node,this.enemy.position);
    },

     //返回我们的伤害值  返回当前的伤害值  因为塔升级的时候伤害也会升级 
     getDamage: function () {
        return this.tower_damage;
    },

    start () {

    },

});
