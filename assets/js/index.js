$(function () {
    // 首页一刷新就调用getUserInfo函数，发起ajax请求获取用户信息
    getUserInfo();

    var layer = layui.layer;
    //绑定点击退出按钮事件
    $('#btnLogout').on('click',function () {
        //点击“确认”按钮，询问用户是否退出
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
        // 1.从本地数据库删除token身份令牌
            localStorage.removeItem('token');
            // 2.跳转至登录页面
            location.href = '/login.html';
            // 3.关闭confirm询问框
            layer.close(index);
        });

    })
})

// 封装一个发起ajax请求获取用户信息的函数
function getUserInfo() {
    $.ajax({
        method : 'GET',
        url : '/my/userinfo',
        //发起数据里必须在headers里面以对象的形式，用Authorization填写身份令牌
        // headers : {
        //     Authorization : localStorage.getItem('token') || '',
        // },
        success : function (res) {
            //判断获取用户信息是否成功
            if (res.status !== 0 ) return layui.layer.msg('获取用户信息失败！');

            //获取用户信息成功
            //调用函数渲染头像
            renderAvatar(res.data);
        },
        //不论ajax请求是否成功和失败，都会调用complete回调（这样可以限制用户直接访问首页）
        // complete : function (res) {
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         // 1.清空本地token
        //         localStorage.removeItem('token');
        //         // 2.强制跳转访问登录页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}

//封装一个渲染用户信息的函数
function renderAvatar(userInfo){
    // 1.1获取用户名
    var username = userInfo.nickname || userInfo.username;
    // 1.1将用户名渲染到页面上
    $('#welcome').html('欢迎&nbsp;&nbsp;' + username);

    //2.按照获取的用户信息，渲染用户头像
    if (userInfo.user_pic !== null){
        // 2.1如果有头像，就渲染到页面上，并显示（同时隐藏字母用户头像的组件）
        $('.layui-nav-img').attr('src',userInfo.user_pic).show();
        $('.text-avatar').hide();
    }else {
        // 2.2如果没有头像，就默认把用户名的首字母大写，并渲染到页面上（同时有用户头像的组件）
       //获取用户名的大写首字母
        var userPigOne = username[0].toUpperCase();
        //渲染到页面，并显示
        $('.text-avatar').html(userPigOne).show();
        $('.layui-nav-img').hide();
    }
}