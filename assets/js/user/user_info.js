$(function () {
    // 设置昵称的验证规则
    form.verify({
        nickname : function (value) {
            if (value.length < 6){
                return '昵称必须在6位以上！';
            }
        }
    });
    //获取用户信息，并打印在页面上
    initUserInfo();

    // 重置表单的数据
    $('#btnReset').on('click',function (e) {
        //1.阻止重置的默认行为
        e.preventDefault();
        //2.重新获取用户信息并打印在表单上
        initUserInfo();
    })

    //监听表单的提交行为，并发起ajax请求，重新渲染页面
    $('.layui-form').on('submit',function (e) {
        //1.阻止表单的默认提交行为
        e.preventDefault();
        //2.发起ajax请求，修改用户信息
        $.ajax({
            method: 'POST',
            url : '/my/userinfo',
            data : $(this).serialize(),
            success : function (res) {
                if (res.status !== 0 ) return layer.msg('修改用户信息失败！');
                layer.msg('修改用户信息成功！');
                //3.重新渲染用户在主页的信息(调用父页面的方法)
                window.parent.getUserInfo();

            }
        })


    })

})
var layer = layui.layer;
var form = layui.form;
// 初始化用户的信息
function initUserInfo() {
    $.ajax({
        method : 'GET',
        url : '/my/userinfo',
        success : function (res) {
            if (res.status !== 0) return layer.msg('获取用户信息失败！');
            // 利用form.val()快速给表单赋值
            form.val('formUserInfo',res.data);
        }
    })
}


