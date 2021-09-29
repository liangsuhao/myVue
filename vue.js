import Observer from './observer.js'
import Compiler from './complier.js'

export default class Vue {

    constructor(options = {}){
        this.$options = options;
        this.$data = options.data;
        this.$methos = options.methos;

        this.initRootElement(options);

        this._proxyData(this.$data);

        new Observer(this.$data);

        new Compiler(this);
    }

    /**
     * 获取根元素，并存储到vue实例中
     */
    initRootElement(options){
        if(typeof options.el === 'string'){
            this.$el = document.querySelector(options.el);
        } else if(options.el instanceof HTMLElement){
            this.$el = options.el;
        }

        if(!this.$el){
            throw new Error("请传入正确的el")
        }
    }

    /**
     * 将data中的元素属性注入到vue实例中
     */
    _proxyData(data){
        Object.keys(data).forEach((item,key)=>{
            // this[item] = data[item];
            //用下面这种方法赋值更高层
            Object.defineProperty(this, item, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[item];
                },
                set(newValue) {
                    if(data[item] === newValue){
                        return;
                    }
                    data[item] = newValue;
                }
            })
        })
    }
}