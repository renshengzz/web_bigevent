$(function () {

    //获取文章原本内容
    getArticle();

    // 初始化文章分类选项数据
    initArticleCateList();

    // 初始化富文本编辑器
    initEditor()

    //裁剪
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面绑定文件事件
    $('#btnChooseImage').on('click',function () {
        $('#coverFile').click();
    })

    //为裁剪区域重新设置图片
    $('#coverFile').on('change',function (e) {
        //获取选择的文件
        var files = e.target.files;
        //判断是否选择了文件
        if (files.length === 0 ){
            return layer.msg('未重新选择封面图片！');
        }
        //为选择的图片创建URL
        var newImgURL = URL.createObjectURL(files[0]);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    //初始化发布的状态
    var art_state = '已发布';

    //为‘存为草稿’绑定点击事件
    $('#btnSave').on('submit',function () {
        art_state = '存为草稿';
    })

    //为发布文章的表单绑定submit事件
    $('#fpl-edit').on('submit',function (e) {
        //1阻止表单的默认提交行为
        e.preventDefault();
        //2基于form表单，创建一个FormData的对象
        var fd = new FormData($(this)[0]);
        // 3将发布状态加入到FormData对象中
        fd.append('state',art_state);

        //4将裁剪出来的图片，输出为一个文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象，存储到fd中
                fd.append('cover_img',blob);
                //6发起ajax请求
                publishArticle(fd);
            })
    })

    var Id = null;
//封装一个文章原来内容的函数
    function getArticle() {
        // 1.获取从另一边发过的文章Id值
        var url = location.href;
        var temp = url.split('=');
        Id = temp[1]
        // 2.发起ajax，获取文章详细信息，并渲染到页面上
        $.ajax({
            method : 'GET',
            url : '/my/article/' + Id,
            success : function (res) {
                console.log(res)
                if (res.status !== 0) layer.msg('获取文章内容失败！');
                //利用表单快速渲染

                console.log(res.data);
                form.val('fpl-edit',res.data);
                //自己渲染内容区域
                $('[name=content]').html(res.data.content);
                // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：

                URLImage = 'http://www.liulongbin.top:3007' + res.data.cover_img;
                console.log(URLImage);
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', URLImage)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
                form.render();
            }
        })


    }

})
var layer = layui.layer;
var form = layui.form;
//封装一个获取文章分类列表的函数
function initArticleCateList() {
    $.ajax({
        method : 'GET',
        url  : '/my/article/cates',
        success : function (res) {
            //利用模板引擎快速渲染到表单
            if (res.status !== 0) return layer.msg('初始化文章类别失败！');
            var htmlStr = template('fpl-cate',res);
            $('#select').html(htmlStr);
            //一定要调用form.render()方法
            form.render();
        }
    })
}
//封装了一个重新发布的函数
function publishArticle(fd) {
    fd.append('Id',Id);
    $.ajax({
        method: 'POST',
        url : '/my/article/edit',
        data : fd,
        // 注意：如果向服务器提交的数据是FormData格式的，必须加上以下两个选项
        contentType : false,
        processData : false,
        success : function (res) {
            if (res.status !== 0 ) return layer.msg('修改文章失败！');
            layer.msg('修改文章成功！');
            setTimeout(function () {
                //跳转至文章列表页面
                location.href = '../../../article/article_list.html';
            },500)
        }

    })
}
