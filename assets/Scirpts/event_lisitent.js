//shuijian
const EventListener = function(obj){
    let Regsiter = {};
    obj.on = function(name,method){
        //检查事件里面有没有注册的name
        if(!Regsiter.hasOwnProperty(name)){
            Regsiter[name] = [];
        }
        Regsiter[name].push(method);
    };
    obj.fire = function(name){
        //先查找注册表里有没有我们的事件，如果有遍历列表
        //Object的hasOwnProperty()方法返回一个布尔值，判断对象是否包含特定的自身（非继承）属性。
        if(Regsiter.hasOwnProperty(name)){
            //处理程序列表:handlerList
            let handlerList = Regsiter[name];
            for(let i = 0 ;i<handlerList.length;i++){
                let handler = handlerList[i];
                let args = [];
                //遍历js默认的一个方法   arguments是一个类数组，这样做是为了转化为数组
                for(let j = 1; j<arguments.length;j++){
                    args.push(arguments[j]);
                }
                //运行这个东西   apply后面跟的是数组
                handler.apply(this,args);
            }
        }
    };
    obj.off = function(name,method){
        if(Regsiter.hasOwnProperty(name)){
            let handlerList = Regsiter[name];
            for(let i = 0 ;i < handlerList.length ; i ++){
                if(handlerList[i] === method){
                    //arrayObject.splice(index,howmany,item1,.....,itemX)
                    //index	必需。整数，规定添加/删除项目的位置，使用负数可从数组结尾处规定位置。
                    //howmany	必需。要删除的项目数量。如果设置为 0，则不会删除项目。
                    //item1, ..., itemX	可选。向数组添加的新项目。
                    handlerList.splice(i,1);
                }
            }
        }
    };
    return obj;
};
export default EventListener;
