$(function () {
    // 定义一个查询的参数对象，将来请求数据的时候
    //需要将请求参数对象发给服务器

    var q = {
        pagenum : 1,//页码值（默认为第1页）
        pagesize : 2,//每页显示多少条数据
        cate_id : "",//文章分类的 Id
        state : "",//文章发布的状态（可选值有：已发布、草稿）
    }

    //初始化文章列表

    initArticleList(q);


    //获取文章类别
    initCate();

    //为筛选表单绑定submit事件
    $('#form-choose').on('submit',function (e) {
        //1阻止表单的默认行为
        e.preventDefault();
        //2获取筛选表单中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //3配置查询对象q
        q.cate_id = cate_id;
        q.state = state;
        //4再次渲染文章列表
        initArticleList(q);
    })

    //为删除文章按钮绑定代理事件
    $('tbody').on('click','.btn-delete',function () {
        let idDelete = $(this).attr('data-id');
        //获取当前页面删除按钮的个数
        var len = $('.btn-delete').length;
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method : 'GET',
                url : '/my/article/delete/' +idDelete,
                success : function (res) {
                    console.log(res);
                    if (res.status !== 0) return layer.msg('删除文章失败！');
                    layer.msg('删除文章成功！');
                    // 1.当删除完毕时，判断此页是否还有数据
                    // 2.当没有数据时，将页码-1
                    //3.重新渲染页面
                    //如果删除按钮只有一个
                    // 那么就渲染
                    if (len === 1){
                        //判断页码值是否等于1（最小只能为1）
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initArticleList(q);
                }
            })


            layer.close(index);
        });
    })

    //为编辑按钮绑定监听事件
    $('tbody').on('click','.btn-edit',function () {
        var idEdit = $(this).attr('data-id');
        location.href = '../../../article/article_edit.html?Id=' + idEdit;
    })
})

//定义一个格式化时间的函数
template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
}

// 定义一个补零函数
function padZero(n) {
    return n>9 ? n : '0' + n;
}


var layer = layui.layer;

// 封装了一个发起ajax请求渲染页面的函数
function initArticleList(q) {
    $.ajax({
        method : 'GET',
        url : '/my/article/list',
        data : q,
        success : function (res) {
            if (res.status !== 0) return layer.msg('获取文章列表失败！');
            //利用模板引擎快速渲染到页面上
            var htmlStr = template('fpl-list',res);
            $('tbody').html(htmlStr);
            //调用渲染分页的方法
            renderPages(res.total,q);
        }
    })
}

var form = layui.form;
// 封装了一个获取分类的函数
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success : function (res) {
            if (res.status !== 0 ) return layer.msg('获取分类数据失败！');
            var htmlStr = template('fpl-type',res);
            $('select[name=cate_id]').html(htmlStr);
            // 通知layui重新渲染表单的UI结构
            form.render();
        }
    })
}

var laypage = layui.laypage;
// 封装一个渲染分页的函数
function renderPages(total,q) {
    // 调用laypage.render()方法来渲染分页的结构
    laypage.render({
        elem : 'pageBox',//分页的容器
        count : total,//总数据条数
        limit : q.pagesize,//每页显示的条数
        curr : q.pagenum,//默认选中的分页
        layout : ['count','limit','prev','page','next','skip'],
        limits : [2,3,5,10],
        //切换分页时，触发jump回调
    // 触发 jump回调的方式有两种:
    // 1．点击页码的时候，会触发jump回调
    // 2．只要调用了 laypage.render()方法，就会触发jump回调

    //obj.curr获取点击的页码值
        jump : function (obj,first) {
            //如果 first的值为true，证明是方式2触发的
            // 否则就是方式1触发的
            // 把最新的页码值，赋值到q这个查询参数对象中
            q.pagenum = obj.curr;
            // 把最新的条目数，赋值到q这个查询参数对象的pagesize属性中
            q.pagesize = obj.limit;
            if (!first) {
                initArticleList(q);
            }
        }
    })
}