
cc.Class({
    extends: cc.Component,

    properties: {

        img_bullet : cc.Sprite,
        spr_bullets : [cc.SpriteFrame],


    },

    onLoad:function(){
        //方向
        this.direction = cc.p(0,0);
        //子弹移动的速度
        this.bullet_speed = 600;
    },

    init:function(_id){
        this.img_bullet.spriteFrame = this.spr_bullets[_id-1];
    },

    initWithData:function(tower,enemy_position,enemylist){
        //计算向量
        this.direction = cc.pNormalize(cc.pSub(enemy_position,tower.position));
        //移动子弹的位置
        this.node.position = cc.pAdd(tower.position,cc.pMult(this.direction,100));
        //计算弧度的方向
        let angle = cc.pAngleSigned(this.direction,cc.p(0,1));
        //计算角度  实现子弹的旋转
        this.node.rotation = (180/Math.PI)*angle;
        //保存子弹的值
        this.enemylist = enemylist;
        //取出脚本中的伤害值的函数
        this.damage = tower.getComponent("tower").getDamage();
    },

    update:function(dt){
        //更新子弹的位置
        this.node.position = cc.pAdd(this.node.position,cc.pMult(this.direction,this.bullet_speed*dt));
        for(let i = 0;i<this.enemylist.length;i++){
            //取出第一个敌人
            let enemy = this.enemylist[i];
            if(this.enemylist[0].name === ""){
                this.enemylist.shift();
                return;
            } 
            //取出脚本 判断敌人是否有活着 只有敌人活着的时候才会发生碰撞
            if(enemy.getComponent("comp_enemy").isLiving()){
                //计算距离
                let distance = cc.pDistance(enemy.position,this.node.position);
                //如果距离小于敌人和子弹的宽的0.5  说明发生了碰撞
                if(distance<(enemy.width*0.5+this.node.width*0.5)){
                    //取出敌人脚本，将伤害值传给被攻击的敌人
                    enemy.getComponent("comp_enemy").beAttacked(this.damage);
                    this.node.destroy();
                }
            }
        }

         //如果我们的x要小于- 1920 * 0.5这个值  我们就把我们的子弹删掉
         if(this.node.position.x < - 1350 * 0.5 || this.node.position.x > 1350 * 0.5
            || this.node.position.y > 768 * 0.5 || this.node.position.y < - 768 * 0.5){
                this.node.destroy();
         }
    },


    start () {

    },

});
