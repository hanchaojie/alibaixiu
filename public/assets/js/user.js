$('#userForm').on('submit', function() {
    console.log($('#userForm').serialize()) //自动收集数据
    $.ajax({
            type: 'post', //get或post
            url: '/users', //请求的地址
            data: $('#userForm').serialize(), //如果不需要传，则注释掉 请求的参数，a=1&b=2或{a:1,b:2}或者jq中的serialize方法，或者formData收集
            success: function(result) { //成功的回调函数
                location.reload();
            }
        })
        // 阻止默认行为
    return false;
})
$('#avatar').on('change', function() {
    var formData = new FormData();
    formData.append('avatar', this.files[0]);
    $.ajax({
        type: 'post', //get或post
        url: '/upload', //请求的地址
        contentType: false,
        processData: false,
        data: formData, //如果不需要传，则注释掉 请求的参数，a=1&b=2或{a:1,b:2}或者jq中的serialize方法，或者formData收集
        success: function(result) { //成功的回调函数
            $('#preview').attr('src', result[0].avatar);
            $('#hiddenImg').val(result[0].avatar);
        }
    })
})