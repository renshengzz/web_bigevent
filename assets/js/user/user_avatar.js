$(function () {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //监听上传按钮
    $('#btnUpload').on('click',function () {
        $('#btnImage').click();
    })
    
    // 监听上传图片文件组件的change事件
    $('#btnImage').on('change',function (e) {
        console.log(e);
            // 1.获取上传图片的列表
        var files = e.target.files;
        // 2.判断是否上传了图片
        if (files.length === 0)
            return layer.msg('请选择上传的图片！');

        // 1.拿到用户选择的文件
        var file = e.target.files[0];
        // 2.根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);

        // 3.先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })
    
    //监听上传到服务器的确定事件
    $('#btnSure').on('click',function () {

        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            //得到的本身就是一个可以展示图片字符串
        // 发起ajax请求，上传更换头像图片
        $.ajax({
            method : 'POST',
            url : '/my/update/avatar',
            data : {
                avatar : dataURL,
            },
            success : function (res) {
                if (res.status !==0 ) return layer.msg('更换头像失败！');
                layer.msg('更换头像成功！');
                //重新渲染用户信息
                window.parent.getUserInfo();
            }
        })
    })
})