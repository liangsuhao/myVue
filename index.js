import Vue from './vue.js'

const vm = new Vue({
    el: "#app",
    data: {
        count: 100,
        name: "liangsuhao",
        myHtml: "<ul><li>我是html测试代码</li></ul>"
    },
    methods: {
        handle: function(){
            console.log(this)
            // alert(this.count);
        }
    }

})

console.log(vm);