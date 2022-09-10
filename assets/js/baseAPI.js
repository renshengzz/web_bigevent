// 注意：每次调用$.post()、$().get()、$.ajax()请求时,
// 会先调用ajaxPrefilter这个函数
//而在这个函数里，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    //在发起真正的ajax请求时，会统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    console.log(options.url);
})