// 封装函数
// 1. 页面通用温馨提示 text：传入的提示内容
function warmPrompt(text, btnStyle = "primary") {
  $('#hintModal').modal();
  $('#hintModal .modal-body p').text(text)
  $('#hintModal .modal-footer button').attr('class', `btn btn-${btnStyle}`);
}

// 2：刷新/渲染服务器文章数据 - 需多次调用，使用封装。
function updateCategory() {
  $.ajax({
    type: "get",
    url: bigNews.category_list,
    success: function (response) {
      // console.log(response); // 测试获取数据
      const htmlStr = template('list', response);
      $('#allCategory').html(htmlStr);
    }
  });
}

// jQuery 入口函数
$(function () {

  // 功能1：新增文章分类
  $('#xinzengfenlei').click(function () {
    // 弹出模态框
    $('#addAndEdit').modal();
    // 提交按钮变换为点击的按钮名
    $('.modal-footer button').eq(1).text('新增分类').attr('class', 'btn btn-success')
  })

  // 功能2：编辑文章分类
  $('#allCategory').on('click', '.text-center .btn-info', function () {
    // 1. 弹出模态框
    $('#addAndEdit').modal();
    // 2.按钮改为编辑按钮以及颜色改变，重点是顺便给编辑按钮加上id好，为后面提交请求做准备
    const id = $(this).attr('data-id');
    $('.modal-footer button').eq(1).text('编辑分类').attr('class', 'btn btn-info').attr('data-id', id)
    // 3. 存储name/slug，并把name和slug初始化到表单输入框内
    const editName = $(this).parents('tr').children().eq(1).text().trim();
    const editSlug = $(this).parents('tr').children().eq(2).text().trim();
    $('#exampleInputName').val(editName)
    $('#exampleInputSlug').val(editSlug)
  })

  // 功能3：删除文章分类
  $('#allCategory').on('click', '.text-center .btn-danger', function () {
    // 获取当前文章分类的ID
    const delId = $(this).attr('data-id')
    $('#delCategory .modal-footer button').eq(1).attr('data-id', delId)
    // 弹出删除提示框
    $('#delCategory').modal();
  })

  // 需求1：首次刷新/渲染页面
  updateCategory()

  // 需求2：点击提交按钮实现不同功能
  //    功能1：创建文字分类功能
  //    功能2：文字分类功能
  $('.modal-footer button').eq(1).click(function () {
    // 使用 switch 分支
    switch ($(this).text().trim()) {
      case '新增分类':
        // 点击了“新增分类”
        $.ajax({
          type: "post",
          url: bigNews.category_add,
          data: {
            name: $('#exampleInputName').val().trim(),
            slug: $('#exampleInputSlug').val().trim()
          },
          dataType: "json",
          // 返回成功
          success: function (response) {
            // console.log(response);
            // 创建成功
            if (response.code == 201) {
              // 隐藏模态框
              $('#addAndEdit').modal('hide');
              // 设置提示框按钮颜色为绿色并弹出
              warmPrompt(response.msg, 'success')
              // 刷新页面数据
              updateCategory();
            }
          }
        });
        break;
      case '编辑分类':
        // 点击了“编辑分类”，发送修改内容数据到服务器
        if ($('#exampleInputName').val().trim() && $('#exampleInputSlug').val().trim()) {
          $.ajax({
            type: "post",
            url: bigNews.category_edit,
            data: {
              id: $(this).attr('data-id'),
              name: $('#exampleInputName').val().trim(),
              slug: $('#exampleInputSlug').val().trim(),
            },
            dataType: "json",
            success: function (response) {
              console.log(response);
              if (response.code == 200) {
                // 编辑成功
                $('#addAndEdit').modal('hide')
                warmPrompt('修改文章分类成功！', 'info');
                updateCategory(); // 刷新页面
              } else {
                warmPrompt(response.msg, 'warning');
              }
            }
          });
        } else {
          warmPrompt('名称或别名不能为空！', 'warning')
        }
        break;
    }

  })

  // 需求3：模态框隐藏清空表单域内容
  $('#addAndEdit').on('hide.bs.modal', function () {
    // 表单域内容重置，需转换为dom元素
    $('form')[0].reset();
  })

  // 需求4：删除模态框点击确定按钮则删除对应数据
  $('#delCategory .modal-footer button').eq(1).click(function () {
    $.ajax({
      type: "post",
      url: bigNews.category_delete,
      data: {
        id: $(this).attr('data-id')
      },
      dataType: "json",
      success: function (response) {
        console.log(response);
        if (response.code == 204) {
          // 删除成功刷新列表
          updateCategory();
          // 隐藏模态框
          $('#delCategory').modal('hide')
          // 提示删除成功
          warmPrompt('删除文章类别成功！', 'success')
        }
      }
    });
  });

})