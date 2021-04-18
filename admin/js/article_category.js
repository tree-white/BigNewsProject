// 封装函数
// 1. 页面通用温馨提示 text：传入的提示内容
function warmPrompt(text) {
  $('#hintModal').modal();
  $('#hintModal .modal-body p').text(text)
}


// jQuery 入口函数
$(function () {
  // 功能1：刷新/渲染服务器文章数据 - 需多次调用，使用封装。
  function updateCategory() {
    $.ajax({
      type: "get",
      url: bigNews.category_list,
      error: function () {
        warmPrompt('数据刷新失败！')
      },
      success: function (response) {
        // console.log(response); // 测试获取数据
        const htmlStr = template('list', response);
        $('#allCategory').html(htmlStr);
      }
    });
  }
  // 需求：首次刷新/渲染页面
  updateCategory()

  // 功能2：点击新增分类模态框初始化
  $('#xinzengfenlei').click(function () {
    // 弹出模态框
    $('#addAndEdit').modal();
    // 提交按钮变换为点击的按钮名
    const str = $(this).text().trim();
    $('.modal-footer button').eq(1).text(str).attr('class', 'btn btn-success')
  })

  // 功能3：点击编辑分类模态框初始化
  $('#allCategory').on('click', '.text-center .btn-info', function () {
    console.log('点击了编辑');
    // 弹出模态框
    $('#addAndEdit').modal();
    const str = $(this).text().trim();
    const editName = $(this).parent().prev().prev().text().trim();
    const editSlug = $(this).parent().prev().text().trim();

    $('#exampleInputName').val(editName)
    $('#exampleInputSlug').val(editSlug)
    $('.modal-footer button').eq(1).text(str).attr('class', 'btn btn-info')
  })

  // 需求：模态框隐藏清空表单域内容
  $('#addAndEdit').on('hide.bs.modal', function () {
    // 表单域内容重置，需转换为dom元素
    $('form')[0].reset();
  })

  // 需求：点击提交按钮发送创建/编辑数据到服务器
  $('.modal-footer button').eq(1).click(function () {
    // console.log('点击了提交');
    // 发送创建的数据
    $.ajax({
      type: "post",
      url: bigNews.category_add,
      data: {
        name: $("form input").eq(0).val().trim(),
        slug: $("form input").eq(1).val().trim()
      },
      dataType: "json",
      // 返回错误
      error: function (error) {
        $('#hintModal .modal-footer button').attr('class', 'btn btn-danger')
        warmPrompt(error.responseJSON.msg)
      },
      // 返回成功
      success: function (response) {
        // console.log(response);
        // 创建成功
        if (response.code == 201) {
          // 隐藏模态框
          $('#addAndEdit').modal('hide');
          // 设置提示框按钮颜色为绿色并弹出
          $('#hintModal .modal-footer button').attr('class', 'btn btn-success')
          warmPrompt(response.msg)
          // 刷新页面数据
          updateCategory();
        }
      }
    });
  })



  window.parent.window.callModal;
})