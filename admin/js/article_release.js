// 函数封装
// 1. 通用系统提示
function globalModal(modalState = {}) {
  const title = modalState.title || '温馨提示'
  const text = modalState.text || '确定要进行操作吗？'
  const closeBtn = modalState.closeBtn || '取 消'
  const closeStyle = modalState.closeStyle || 'default'
  const sureBtn = modalState.sureBtn || '确 定'
  const sureStyle = modalState.sureStyle || 'primary'
  const sureBtnState = modalState.sureBtnState || 'none'
  $('#articleListModal').modal()
  $('#articleListModal .modal-title').text(title)
  $('#articleListModal .modal-body p').html(text)
  $('#articleListModal .modal-footer button').eq(0).text(closeBtn).attr('class', `btn btn-${closeStyle}`)
  $('#articleListModal .modal-footer button').eq(1).text(sureBtn).attr('class', `btn btn-${sureStyle}`).css({
    display: sureBtnState
  })
}

// 入口函数
$(function () {
  // 父窗口的发表文章高亮
  parent.$('.level02 li').eq(1).addClass('active').siblings().removeClass('active');
  // 启动富文本编辑器插件
  tinymce.init({                  // 初始化 tinymce 富文本编辑器
    selector: '#myTextarea',      // 选择器
    height: 300,                  // 初始高度
    language: 'zh_CN',            // 默认语言 - 需要语言包
    directionality: 'ltr',        // 默认 left to right 左对齐
    browser_spellcheck: true,     // 浏览器单词拼写
    contextmenu: false,           // 右键菜单
    // 插件
    plugins: [
      "advlist autolink lists link image charmap print preview anchor",
      "searchreplace visualblocks code fullscreen",
      "insertdatetime media table contextmenu paste imagetools wordcount",
      "code"
    ],
    // 工具栏
    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",

  });


  // 获取所有文章类别
  $.ajax({
    type: "get",
    url: bigNews.category_list,
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response.code === 200) {
        const htmlStr = template('articleType', response)
        $('[name="categoryId"]').html(htmlStr)
      }
    }
  });
  

  // 设置日期初始值为当前
  jeDate("#myDate", {
    isinitVal: true,
    format: 'YYYY-MM-DD'
  });
  

  // 实现本地图片上传预览，并存储在fileUrl里面
  // 绑定状态变化事件
  $('#inputCover').change(function (e) {
    console.dir(this);
    // 内容发生变化 获取 files 内容
    const fileImg = this.files[0]
    // 2. 获取 file 对象在浏览器缓存中的路径
    const fileUrl = URL.createObjectURL(fileImg)
    // 3. 把特殊的 url 设置到图片的 src 中
    $('.article_cover').attr('src', fileUrl)
  })

  $('.col-sm-offset-2 button').on('click',function (e) {
    // 取消默认行为
    e.preventDefault();
    // 判断点击了发布还是草稿
    let state = ''
    $(this).hasClass('btn-release') ? state = '已发布' : state = '草稿';
    // 获取文章内容
    const content = tinymce.activeEditor.getContent()
    // 获取表单内容
    const fd = new FormData(this.form);
    fd.append('state', state)
    fd.append('content', content)
    // 发布文章
    $.ajax({
      type: "post",
      url: bigNews.article_publish,
      contentType: false,
      processData: false,
      data: fd,
      dataType: "json",
      success: function (response) {
        console.log(response);
        if (response.code === 200) {
          alert('发布成功')
          location.href = './article_list.html'
        }
      }
    });

  })


})