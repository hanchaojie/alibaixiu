//当添加分类表单发生提交行为的时候
$('#addCategory').on('submit', function() {
    //获取用户在表单中输入的内容
    var formData = $(this).serialize();
    $.ajax({
            type: 'post',
            url: '/categories',
            data: formData,
            success: function() {
                location.reload();
            }
        })
        //阻止表单默认提交行为
    return false;
})
$.ajax({
    type: 'get',
    url: '/categories',
    success: function(response) {
        var html = template('categoryListTpl', { data: response });
        // console.log(html);
        $('#categoryBox').html(html);
    }
})


//为编辑按钮添加点击事件
$("#categoryBox").on('click', '.edit', function() {
    //获取要修改的分类数据的id
    var id = $(this).attr('data-id');
    //根据id获取分类数据的详情信息
    $.ajax({
        type: 'get',
        url: '/categories/' + id,
        success: function(response) {
            console.log(response);
            var html = template('modifyFormTpl', response);
            $('#formBox').html(html);
        }
    })
})
$('#formBox').on('submit', '#addCategory', function() {
    var id = $(this).attr('data-id');
    $.ajax({
        type: 'put', //get或post
        url: '/categories/' + id, //请求的地址
        data: $(this).serialize(), //如果不需要传，则注释掉 请求的参数，a=1&b=2或{a:1,b:2}或者jq中的serialize方法，或者formData收集
        success: function(result) { //成功的回调函数
            console.log(result)
            location.reload();
        }
    })
    return false;
})
$('#categoryBox').on('click', '.delete', function() {
    if (confirm('确定要删除吗？')) {
        var id = $(this).attr('data-id');
        $.ajax({
            type: 'delete', //get或post
            url: '/categories/' + id, //请求的地址
            data: {}, //如果不需要传，则注释掉 请求的参数，a=1&b=2或{a:1,b:2}或者jq中的serialize方法，或者formData收集
            success: function(result) { //成功的回调函数
                console.log(result)
                location.reload();
            }
        })
    }
})