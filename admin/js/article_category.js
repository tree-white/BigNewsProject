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
  // 1.1 首次刷新/渲染页面
  updateCategory()

  // 功能2：删除文章分类 - 由于是动态添加的数据，删除需要使用事件委托
  $('#allCategory').on('click', '.btn-danger', function () {
    // console.log('点击了删除按钮'); // 测试点击删除按钮
    let that = this; // 由于点击内嵌套点击，所需要设置好指向问题
    // 2.1 点击删除提示判断
    $('#removeModal').modal();
    // 2.2 点击了提示框的确定
    $('#removeModal .btn-danger').click(function () {
      // 2.2.1 则当前删除按钮，对应的父级 tr 整个删除
      $(that).parents('tr').remove();
      // 2.2.2 同时也删除服务器对应数据
      $.ajax({
        type: "post",
        url: bigNews.category_delete,
        data: {
          id: $(that).parent().siblings('.id').attr('data-index') // 点击删除对应的id
        },
        error: function () {
          $('#removeModal').modal('hide');
          warmPrompt(error.responseJSON.msg)
          updateCategory()
        },
        success: function (response) {
          $('#removeModal').modal('hide');
          // console.log(response);
          warmPrompt('删除成功！')
          updateCategory()
        }
      });
    })
  })

  // 功能3：新增文章分类
  $('#addModal .btn-primary').click(function () {
    // console.log('点击了提交'); // 测试是否点击了提交
    // 3.1 获取名称(name)和别名(slug)
    const addName = $('.addName').text().trim()
    const addSlug = $('.addSlug').text().trim()
    // console.log(addName, addSlug);
    if (addName && addSlug) {
      // 3.2 如果都有内容，则上传到数据库新增数据
      $.ajax({
        type: "post",
        url: bigNews.category_add,
        data: {
          name: addName,
          slug: addSlug
        },
        error: function (error) {
          warmPrompt(error.responseJSON.msg)
        },
        success: function (response) {
          // console.log(response); // 测试是否能获取创建成功信息
          // 创建成功 code == 201
          if (response.code == 201) {
            updateCategory(); // 刷新数据渲染
            $('#addModal').modal('hide'); // 编辑的模态框隐藏
            $('#addModal .addName').text(''); // 清空名称
            $('#addModal .addSlug').text(''); // 清空别名
            warmPrompt('新增成功！'); // 提示用户新增成功
          }
        }
      });
    } else {
      warmPrompt('新增的“名称”或“别名”不能有空！')
    }
  })

  // 功能4：编辑文章分类 - 由于是动态添加的数据，编辑需要使用事件委托
  let editId = 0;
  $('#allCategory').on('click', '.btn-info', function (e) {
    e.preventDefault();
    e.stopPropagation();
    // console.log('点击了编辑'); // 测试编辑按钮是否正常
    // 4.1 获取ID/名称(name)/别名(slug)
    editId = $(this).parent().siblings('.id').attr('data-index') // 点击删除对应的id
    // console.log(editId);

    // 4.2 获取初始值 - 方式一：根据ID查询指定文章类别
    $.ajax({
      type: "get",
      url: bigNews.category_search,
      data: {
        id: editId
      },
      error: function (error) {
        warmPrompt('数据获取失败,请重试！')
      },
      success: function (response) {
        console.log(response);
        if (response.code == 200) {
          $('#editModal').modal();
          // 通过服务器获取name值
          $('#editModal .editName').text(response.data[0].name);
          // 通过服务器获取slug值
          $('#editModal .editSlug').text(response.data[0].slug); 
        }
      }
    });

    // 4.2 获取初始值 - 方式二：直接获取本地的内容
    // $('#editModal').modal();
    // $('#editModal .editName').text($(this).parent().prev().prev().text().trim()); 
    // $('#editModal .editSlug').text($(this).parent().prev().text().trim());
  })

  // 4.3 点击修改发送服务器修改数据
  $('#editModal .btn-primary').click(function () {
    // 获取编辑模态框对应的内容
    let editName = $('#editModal .editName').text().trim()
    let editSlog = $('#editModal .editSlug').text().trim()
    // console.log('点击了提交'); // 测试是否点击了提交

    if ($('.editName').text().trim() && $('.editSlug').text().trim()) {
      $.ajax({
        type: "post",
        url: bigNews.category_edit,
        dataType: "json",
        data: {
          id: editId,
          name: editName,
          slug: editSlog
        },
        error: function (error) {
          warmPrompt(error.responseJSON.msg)
          updateCategory(); // 刷新数据渲染
        },
        success: function (response) {
          console.log(response); // 测试修改状态是否正常
          if (response.code == 200) {
            warmPrompt('修改成功！')
            $('#editModal').modal('hide');
            updateCategory(); // 刷新数据渲染
          } else {
            warmPrompt('修改失败，您是不是内容都没改动？')
            updateCategory();
          }
        }
      });
    } else {
      warmPrompt('名称(name)或别名(slug)不能有空哦！')
    }


  });
})