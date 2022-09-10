$(function () {
    // 点击"去注册账号"的链接
    $('#link_reg').on('click',function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    // 点击'去登录'的链接
    $('#link_login').on('click',function () {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    // 利用layui获取form对象
    var form = layui.form;
    //利用layui获取layer对象
    var layer = layui.layer;
    //通过form.verify()函数自定义校验规则
    form.verify({
        //自定义了一个叫‘pwd’的校验规则
        'pwd' : [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        //定义校验两次拿到的密码是否一致的规则
        'repwd':function (value) {
            //value得到的再次确认密码输入的值
            //还需要获取上次输入的密码值
            //把两次的密码值进行比较
            //如果计较结果不正确，就返回提示消息
            var pwd = $('.reg-box input[name=password]').val();
            if (pwd !== value){
                return '对不起，两次输入的密码不一致！';
            }
        }
    })

    //监听注册表单的提交行为，并发起数据请求注册用户
    $('#form-reg').on('submit',function (e) {
        // 1.阻止表单的默认提交行为
        e.preventDefault();
        //注册提交的地址
        var reg_url = '/api/reguser';
        //注册用户提交的信息
        var data = {
            username : $('#form-reg input[name=username]').val(),
            password : $('#form-reg input[name=password]').val()
        }
        // 2.发起ajax请求，得到响应消息，并判断是否成功
        $.post(reg_url,data,function (res) {
            if (res.status !== 0 ) return layer.msg( res.message)
            layer.msg('恭喜！注册成功！');
            // 3.注册成功跳转至登录页面(即模拟点击‘去登录’链接)
            $('#link_login').click();
        })
    })

    //监听登录表单的提交事件，并发起ajax请求，得到响应数据，并进行页面的跳转
    $('#form-login').submit(function (e) {
        //1.阻止表单的默认提交默认行为
        e.preventDefault();
        //2.发起ajax请求获取
        var login_url = '/api/login';
        //快速获取表单的数据
        var data = $(this).serialize();
        $.ajax({
            method : 'POST',
            url : login_url,
            data : data,
            success :function (res) {
                if (res.status !== 0 ) return layer.msg('抱歉，密码错误！' + res.message);
                layer.msg('恭喜您！登录成功！请进入首页...');
                //3.存储返回的用户身份令牌到本地数据库
                localStorage.setItem('token',res.token);
                // 4.登录成功跳转至首页
                setTimeout(function () {
                    location.href = '/index.html'
                },200);

            }
        })
    })
})