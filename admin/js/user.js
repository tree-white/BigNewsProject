// 函数封装

// 1. 通用提示
function userModal(title,msg, style = primary) {
   msg = msg.indexOf('参数有问题') != -1 ?
    `
    1、修改内容不能有空！
    <br />
    2、请检查邮箱书写规格是否正确！
    `: msg;

  $('#userModal').modal();
  $('#userModal .modal-title').text(title)
  $('#userModal .modal-body p').html(msg)
  $('#userModal .modal-footer button').attr('class',`btn btn-${style}`)
}

$(function () {
  // 功能1 - 获取用户信息并实现渲染
  // 1.1 封装页面加载获个人信息以及渲染
  function getDetail() {
    $.ajax({
      type: "get",
      url: bigNews.user_detail,
      dataType: "json",
      success: function (response) {
        // 优化上面代码 - 使用对象遍历 for...in
        for (let key in response.data) {
          $(`input.${key}`).val(response.data[key])
        }
        $('.user_pic').prop('src', response.data.userPic); // 用户图标

      }
    });
  }
  // 1.2 调用数据渲染
  getDetail();

  // 功能2 - 本地预览修改的头像
  // 2.1 给上传文件的file按钮绑定事件 - 状态变化就触发，实现要上传的图片预览
  $('#exampleInputFile').on('change', function () {
    // 获取浏览器本地慌促中的文件路径(特殊路径)
    let urlPic = URL.createObjectURL(this.files[0]);
    // console.log(urlPic); // 打印测试图片路径
    $('img.user_pic').prop('src', urlPic)
  })

  // 功能3 - 修改个人信息 - 优化后
  // 3.1 绑定点击事件，点击“修改”触发
  $('.btn-edit').click(function (e) {
    // 阻止 submit 默认行为
    e.preventDefault();
    // 在 xhr2 阶段 添加了 FormData 可用于图片上传 - 对象格式。
    // 点击后获取当前按钮所在的 form表单域创建成一个 fd
    const fd = new FormData(this.form);
    // 把修改好的内容发送到服务器
    $.ajax({
      type: "post",
      url: bigNews.user_edit,
      contentType: false, // 取消post默认请求头
      processData: false, // 取消data自动转换字符串
      data: fd,
      success: function (response) {
        console.log(response);
        // 判断是否发送成功
        if (response.code == 200) {
          userModal('成功提示！',response.msg,'success')
          getDetail();
          // 调用父窗口的数据刷新
          window.parent.upload()
        }
      },
    });
  });


})