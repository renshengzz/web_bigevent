// 注意：每次调用$.post()、$().get()、$.ajax()请求时,
// 会先调用ajaxPrefilter这个函数
//而在这个函数里，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    //在发起真正的ajax请求时，会统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    console.log(options.url);
    //统一为包含/my的请求路径，加上身份令牌
    if (options.url.indexOf('/my') !== -1){
        options.headers = {
            Authorization : localStorage.getItem('token') || '',
        }
    }

    // 全局统一挂载complete函数
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.清空本地token
            localStorage.removeItem('token');
            // 2.强制跳转访问登录页面
            location.href = '/login.html';
        }
    }
})