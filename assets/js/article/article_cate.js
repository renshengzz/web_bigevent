$(function () {

    // 初始化文章列表
    initArticleCateList()

    var addID = null;
    //监听添加类别按钮
    $('#btnAddType').on('click',function () {
        addID = layer.open({
            type : 1,
            area :['500px','250px'],
            title : '添加文章类别',
            content: $('#dialog-add-type').html(),
        })
    })

    //为动态创建的弹出添加分类表单，添加事件委托（代理）
    $('body').on('submit','#dialog-form-add-type',function (e) {
        // 1.阻止表单的默认提交行为
        e.preventDefault();
        console.log($(this).serialize());
        // 2.发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data : $(this).serialize(),
            success : function (res) {
                if (res.status !== 0) return layer.msg('添加分类失败！');
                layer.msg('添加分类成功！');
                // 3.重新渲染分类列表
                initArticleList();
                // 4.关闭弹出层（此表单）
                layer.close(addID);
            }
        })
    })

    var indexEdit = null;
    //为动态创建的编辑按钮添加弹出层表单并监听提交事件
    $('tbody').on('click','#btnEditType',function () {
        indexEdit = layer.open({
            type : 1,
            area :['500px','250px'],
            title : '修改文章类别',
            content: $('#dialog-edit-type').html(),
        })

        //获得编辑项目的id值
        var editId = $(this).attr('data-id');
        //根据id值，发起ajax请求，获取数据，并填充到表单
        $.ajax({
            method : 'GET',
            url : '/my/article/cates/' + editId,
            success : function (res) {
                if (res.status !== 0) return layer.msg('获取编辑项目数据失败！');
                //利用form.val()迅速渲染到表单上
                form.val('dialog-form-edit-type',res.data)
            }
        })
    })

    //为编辑弹出层监听提交事件，发起ajax请求
    $('body').on('submit','#dialog-form-edit-type',function (e) {
        //阻止默认提交行为
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method : 'POST',
            url : '/my/article/updatecate',
            data : $(this).serialize(),
            success : function (res) {
                if (res.status !== 0) return layer.msg('修改分类数据失败！');
                layer.msg('修改分类数据成功！');
                //关闭弹出层
                layer.close(indexEdit);
                //重新渲染分类列表
                initArticleList();
            }
        })
    })

    //为动态创建的删除按钮添加弹出层表单并监听提交事件
    $('body').on('click','#btnDeleteType',function () {
       layer.confirm('确认删除此类别吗?', {icon: 3, title:'提示'}, function(index){
            // 1.获取删除项目的id值
            var DeleteId = $(this).attr('data-id');
            // 2.根据id发起ajax请求
            $.ajax({
                method : 'GET',
                url : '/my/article/deletecate/' + DeleteId,
                success : function (res) {
                    if (res.status !== 0) return layer.msg('删除分类数据失败！');
                    layer.msg('删除分类数据成功！');
                    // 3.关闭弹出层
                    layer.close(index)
                    //4.重新渲染分类列表
                    initArticleCateList();
                }
            })

            });

    })

})

var layer = layui.layer;
var form = layui.form;
// 封装了一个获取文章类别数据，并渲染到页面的函数
function initArticleCateList() {
    // 1.发起ajax请求获取数据
    $.ajax({
        method : 'GET',
        url : '/my/article/cates',
        success : function (res) {
            if (res.status !== 0) return layer.msg('获取文章类别列表失败！');
            // 2.利用模板引擎快速将数据渲染到页面上
            var htmlStr = template('fpl_list',res);
            $('tbody').html(htmlStr);
        }
    })
}
