import global from './global'
//敌人的状态机
const EnemyState = {
    Invalid : -1,  //无效的
    Running : 1,
    EndPath : 2,
    Dead : 3
};
cc.Class({
    extends: cc.Component,

    properties: {
        img_enemy :cc.Sprite,
        enemy_frames : [cc.SpriteFrame],
        health_peogressBar : cc.ProgressBar,
        audio_gongji_enemy : cc.AudioClip,
    },

    onLoad:function(){
        //设置敌人的状态
        this.state = EnemyState.Invalid;
        this.node.opaciy = 0;
        //敌人的偏移方向
        this.enemy_direction = cc.p(0,0);
        //当前敌人走过的路径的点
        this.enemy_path_point = 0;
        //当前的血量
        this.enemy_now_health = 0;
        //总的血量
        this.enemy_all_health = 1;
        //死的怪物个数
        this.enemy_dead_num = 0;
       

    },

    initWithData:function(_type,_path,_enemylist){
        //换敌人的纹理
        this.img_enemy.spriteFrame = this.enemy_frames[_type];
        this.pathPoints = _path;
        this.enemylist = _enemylist;
        this.node.position = _path[0].position;
        //加载敌人文件
        cc.loader.loadRes("config/monster.json",(err,result)=>{
            if(err){
                cc.log("文件错误");
            }else{
                let config = result["enemy_"+_type];
                //敌人的速度
                this.enemy_speed = config.speed;
                //敌人当前的血量
                this.enemy_now_health = config.health;
                //敌人总的血量
                this.enemy_all_health = config.health;
                //设置状态机
                this.setState(EnemyState.Running);
            }
        });
    },

    setState:function(state){
        if(this.state === state){
            return;
        }
        switch(state){
            case EnemyState.Running :
                this.node.opaciy = 255;//设置透明度
                break;
            case EnemyState.Dead:
            //设置1秒消失
                let action = cc.fadeOut(1);
                //播放动作系列
                let sequence = cc.sequence(action,cc.callFunc(()=>{
                    cc.log("敌人死");
                    this.node.destroy();
                    cc.log("打印数组",this.enemylist);
                }));
                this.node.runAction(sequence);
                break;
            case EnemyState.EndPath:
                break;
            default:
                break;
        }
        this.state = state;
    },

    update:function(dt){
        if(this.state === EnemyState.Running){
            //获取一个距离，第一值是当前节点的位置，第二个
            let distance = cc.pDistance(this.node.position, this.pathPoints[this.enemy_path_point].position);
            if(distance < 10){
                this.enemy_path_point++;
                if(this.enemy_path_point === this.pathPoints.length){
                    //敌人跑到最后面了
                    this.setState(EnemyState.EndPath);
                    this.node.destroy();
                    if(this.comp_level_1 !== undefined){
                        this.comp_level_1.eat_num +=1;
                        this.comp_level_1.gain_play();
                    }else if (this.game_level_2 !== undefined){
                        this.game_level_2.eat_num +=1;
                        this.game_level_2.gain_play();
                    }   
                    return;
                }
                // else{
                //     this.comp_level_1.load_next_level();
                // }
                //计算偏移方向   下一个点的位置减去我当前节点的位置  cc.pNormaliz单位向量
                this.enemy_direction = cc.pNormalize(cc.pSub(this.pathPoints[this.enemy_path_point].position,this.node.position));                   
            }else{
                this.node.position = cc.pAdd(this.node.position,cc.pMult(this.enemy_direction,this.enemy_speed*dt));                
            }
            if(this.comp_level_1 !== undefined){
                if(this.comp_level_1.eat_num >= 6){
                    this.node.active = false;
                }
            }else if (this.game_level_2 !== undefined){
                if(this.game_level_2.eat_num >= 6){
                    this.node.active = false;
                }
            }
           
        }
        //血量的变化
        this.health_peogressBar.progress = this.enemy_now_health/this.enemy_all_health;
    },

    isLiving :function(){
        if(this.state === EnemyState.Running){
            return true;
        }
        return false;
    },
    //敌人被攻击
    beAttacked:function(damage){
        cc.audioEngine.setEffectsVolume(0.2);
        //背景音乐，循环播放
        cc.audioEngine.playMusic(this.audio_gongji_enemy,false);
        //当前的血量减去伤害值
        this.enemy_now_health -= damage;
        if(this.enemy_now_health < 0){
            //设置死亡的状态
            this.enemy_now_health = 0;
            this.setState(EnemyState.Dead);
            this.enemy_dead_num = 1;
            if(this.node.parent.name === "comp_level_1"){
                this.node.parent.getComponent("comp_level_1").enemy_dead(this.enemy_dead_num);
            }else if (this.node.parent.name === "comp_level_2"){
                this.node.parent.getComponent("game_level_2").enemy_dead(this.enemy_dead_num);
            }
            
        }
    },

     isDead:function(){
         if(this.state === EnemyState.Dead){
             return true;
         }
         return false;
     },

    start () {

    },


});
