$(function () {
    //创建密码验证规则
   form.verify({
       // 1.定义旧密码的验证规则
       pwd : [/^[\S]{6,12}$/
           ,'密码必须6到12位，且不能出现空格'
       ],
       // 2.定义新密码的验证规则（不能和旧密码一样）
       samePwd : function (value) {
           if(value === $('[name=oldPwd]').val())
               return '新密码不能和旧密码一致！';
       },

       diffPwd : function (value) {
           if (value !== $('[name=newPwd]').val()){
               return '两次输入的密码不一致！请重新输入！';
           }
       }

   })
    //监听表单的提交行为
    $('.layui-form').on('submit',function (e) {
        // 1.阻止表单的默认提交行为
        e.preventDefault();
        // 2.发起ajax请求，返回响应消息
        $.ajax({
            method : 'POST',
            url : '/my/updatepwd',
            data : $(this).serialize(),
            success : function (res) {
                if (res.status !== 0 ) return layer.msg('修改密码失败！');
                layer.msg('修改密码成功！');
                //3.清空表单
                $('.layui-form')[0].reset();
            }
        })
    })
})

var form = layui.form;
var layer = layui.layer;