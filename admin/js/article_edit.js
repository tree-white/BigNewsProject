// 入口函数
$(function () {
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
  /* 
    说明：
      1、文章编辑页是由文章列表页跳转过来的页面
      2、文章编辑页中需要有文章的id参数
      3、location.search  用于获取页面参数(字符串格式)
      4、.split('=')      用等号把字符串分隔成数组
      5、[1]              选择数组中的第二个元素，也就是分隔后的id
  */
  // console.log(window.location);
  // console.log(window.location.search.split('=')[1]);
  // 获取公共当前文章id
  const articleId = location.search.split('=')[1]
  console.log(articleId);
  // 防止文章编辑页直接打开，没有 id 参数就直接跳转到首页
  if (articleId === undefined) {
    alert('没有ID参数，跳转到首页')
  } else {
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

    // 获取文章详细信息
    $.ajax({
      type: "get",
      url: bigNews.article_search,
      data: {
        id: articleId
      },
      dataType: "json",
      success: function (response) {
        console.log(response);
        if (response.code === 200) {
          const state = response.data.state
          const title = response.data.title;            // 标题
          const cover = response.data.cover;            // 封面图
          const categoryId = response.data.categoryId;  // 对应分类的ID
          const date = response.data.date;              // 日期
          const content = response.data.content;        // 内容
          // 1. 渲染标题
          $('[name="title"]').val(title);
          // 2. 渲染封面
          $('.article_cover').attr('src', cover)
          // 3. 设置 select 首选项
          $('[name="categoryId"]').val(categoryId)
          // 4. 设置默认日期
          $('#myDate').val(date)
          // 4.1 点击日期显示年月日
          jeDate("#myDate", {
            format: 'YYYY-MM-DD'
          });
          // 5. 新闻内容设置 - 放到富文本编辑器里
          setTimeout(() => tinymce.activeEditor.setContent(content),200)
          // 6. 进入页面判断文章状态是否为草稿
          // state == "草稿" 则禁用“存为草稿”按钮，并显示提示当前文章已是草稿状态
          // state != "草稿" 则开启“存为草稿”按钮，并显示提示当前文章已是草稿状态
          state === '草稿' ? $('#btnHint').html('（文章是"草稿"状态）') : $('#btnHint').html('（文章是"已发布"状态）')
        }
      }
    });
  }

  let fileUrl = ''
  // 图片本地上传预览 1. 绑定状态变化事件
  $('#inputCover').change(function (e) {
    console.dir(this);
    // 内容发生变化 获取 files 内容
    const fileImg = this.files[0]
    // 2. 获取 file 对象在浏览器缓存中的路径
    fileUrl = URL.createObjectURL(fileImg)
    // 3. 把特殊的 url 设置到图片的 src 中
    $('.article_cover').attr('src', fileUrl)
  })

  // 点击修改
  $('.col-sm-offset-2 button').click(function (e) {
    e.preventDefault(); // 取消默认行为

    // 获取 文章内容
    const htmlStr = tinymce.activeEditor.getContent()
    console.log(htmlStr);

    // 文章ID 是开头进入就获取的 articleId
    const fd = new FormData(this.form)
    fd.append('id', articleId)      // 添加 文章id
    fd.append('content', htmlStr)   // 添加 文章内容
    fd.append('cover', fileUrl)     // 添加 文章封页
    
    console.log(this);
    $(this).hasClass('btn-edit') && fd.append('state', '已发布')
    $(this).hasClass('btn-draft') && fd.append('state', '草稿')
    // if ($(this).hasClass('btn-edit')) {
    //   // console.log('点击了“修改”');
    //   // 点击修改，则发布状态为数据传过来的状态
    //   fd.append('state', '已发布')       // 添加 文章状态 以获取到的文章详细信息来决定

    // } else if ($(this).hasClass('btn-draft')) {
    //   // console.log('点击了“存为草稿”');
    //   // 如果点击是“存为草稿”，则把状态直接改为草稿
    //   fd.append('state', '草稿')       // 添加 文章状态 以获取到的文章详细信息来决定
    // }
    console.log(fd);

    // 调用文章编辑接口
    $.ajax({
      type: "post",
      url: bigNews.article_edit,
      contentType: false,
      processData: false,
      data: fd,
      dataType: "json",
      success: function (response) {
        console.log(response);
        if (response.code === 200) {
          // 弹出提示框告知结果
          alert(`修改成功`)
          // 然后返回列表页
          location.href = './article_list.html'
        }
      }
    });
  });


})