//当表单发生提交行为的时候
$('#userForm').on('submit', function() {
    //获取到用户在表单中输入的内容并将内容格式化成参数字符串
    var formData = $(this).serialize();
    //向服务器端发送添加用户的请求
    $.ajax({
            type: 'post',
            url: '/users',
            data: formData,
            success: function() {
                //刷新页面
                location.reload();
            },
            error: function() {
                alert('用户添加失败');
            }
        })
        //阻止表单默认行为
    return false;
})

//上传用户头像
$('#modifyBox').on('change', '#avatar', function() {
    var formData = new FormData();
    formData.append('avatar', this.files[0]);
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        //告诉$.ajax不要转换数据参数
        processData: false,
        //告诉$.ajax不要默认设置请求头为application/x-www-form-urlencoded
        contentType: false,
        success: function(response) {
            // console.log(response);
            //实现头像预览功能
            $('#preview').attr('src', response[0].avatar);
            //这一行的作用是后面我们提交表单的时候，保证上传头像的地址也能够作为一项提交给后台服务器
            //http://js-class.gitee.io/albx_new/%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3/%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3.html#10101
            $('#hiddenAvatar').val(response[0].avatar);
        }
    })
})

//向服务器端发送请求 索要用户列表数据
$.ajax({
    type: 'get',
    url: '/users',
    success: function(response) {
        // console.log(response);
        var html = template('userTpl', { data: response });
        $('#userBox').html(html);
    }
})


//通过事件委托的方式为编辑按钮添加点击事件
$('#userBox').on('click', '.edit', function() {
    //获取被点击用户的id值
    var id = $(this).attr('data-id');
    //根据id获取用户的详情信息
    $.ajax({
        type: 'get',
        url: '/users/' + id,
        success: function(response) {
            // console.log(response);
            var html = template('modifyTpl', response);
            $('#modifyBox').html(html);
        }
    })
})

$('#modifyBox').on('submit', '#userForm', function() {
    var formData = $(this).serialize();
    var id = $(this).attr('data-id');
    $.ajax({
        type: 'put',
        url: '/users/' + id,
        data: formData,
        success: function(response) {
            location.reload();
        }
    })
    return false;
})

//当删除按钮被点击的时候
$('#userBox').on("click", '.delete', function() {
    //如果管理员确认要删除用户
    if (confirm('您真的要删除用户吗?')) {
        var id = $(this).attr('data-id');
        // console.log(id);
        $.ajax({
            type: 'delete',
            url: '/users/' + id,
            success: function() {
                location.reload();
            }
        })
    }
})

//当全选按钮的状态发生改变时
var selectAll = $('#selectAll');
selectAll.on('change', function() {
    //获取到全选按钮当前的状态
    var status = $(this).prop('checked');
    //获取到所有的用户并将用户的状态和全选按钮保持一致
    $('#userBox').find('input').prop('checked', status);
    if (status) {
        $('#deleteMany').show();
    } else {
        $('#deleteMany').hide();
    }
})
var deleteMany = $('#deleteMany');
//当用户前面的复选框发生改变时
$('#userBox').on('change', '.userStatus', function() {
    //获取到所有的用户 在所有的用户中过滤出选中的用户
    //判断选中用户的数量和所有用户的数量是否一致
    //如果一致，就说明所有的用户都是选中的
    //否则 就是有用户没有被选中
    var inputs = $('#userBox').find('input');
    if (inputs.filter(':checked').length > 1) {
        selectAll.prop('checked', true);
        $('#deleteMany').show();
    } else {
        selectAll.prop('checked', false);
        $('#deleteMany').hide();
    }
})

$('#deleteMany').on('click', function() {
    var ids = [];
    //获取选中的用户
    var checkedUser = $('#userBox').find('input').filter(':checked');
    //循环复选框 从复选框元素的身上获取data-id属性的值
    checkedUser.each(function(index, element) {
        ids.push($(element).attr('data-id'));
    });
    if (confirm('您真的要批量删除?')) {
        $.ajax({
            type: 'delete',
            url: '/users/' + ids.join('-'),
            success: function() {
                location.reload();
            }
        })
    }
})