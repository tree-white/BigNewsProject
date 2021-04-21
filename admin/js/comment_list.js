// 函数㓞

// 1.文章评论搜索 - 刷新评论数据
function commentSearch(page, backData) {
  $.ajax({
    type: "get",
    url: bigNews.comment_search,
    data: {
      page: page || 1,         // 当前页
      perpage: 10    // 每页显示条数 - 初始默认10
    },
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response.code === 200) {
        // 数据获取成功就渲染
        const htmlStr = template('updateComment', response.data)
        $('tbody').html(htmlStr)
        // 调用分类赋值总页数
        usePaging({
          totalPages: response.data.totalPage,
          startPage: page
        })
        // 回调函数
        backData && backData(response.data)

      }
    }
  });
}

// 2.分页按钮 - 调用函数
function usePaging(pagination = {}) {
  const totalPages = Number(pagination.totalPages) || 30;
  const visiblePages = Number(pagination.visiblePages) || 10
  const startPage = Number(pagination.startPage) || 1

  $('#pagination-Box').twbsPagination('destroy');
  $('#pagination-Box').twbsPagination({
    totalPages: totalPages,       // 总页数
    visiblePages: visiblePages,     // 可见的页数
    startPage: startPage,          // 当前页
    first: '首页',
    prev: '上一页',
    next: '下一页',
    last: '尾页',
    onPageClick: function (event, page) {
      if (startPage != page) commentSearch(page)
    }
  });
}


// 入口函数
$(function () {

  // 初始调用页面刷新
  commentSearch()

  // 操作功能
  $('tbody').on('click','.text-center a',function () {
    // 获取当前id
    const id = $(this).attr('data-id')
    // 点击的操作
    console.log($(this).text().trim());    // 批准/拒绝/删除
    // 获取当前的页码
    let pageNum = Number($('#pagination-Box').children('li.active').text().trim());
    console.log(typeof pageNum);

    switch ($(this).text().trim()) {
      case '批准':
        $.ajax({
          type: "post",
          url: bigNews.comment_pass,
          data: {
            id: id
          },
          dataType: "json",
          success: function (response) {
            console.log(response);
            if (response.code === 200) {
              // 弹框提示
              // alert(response.msg)
              globalModal({
                title: '审批操作结果',
                text: response.msg,
                closeBtn: '知道了',
                closeStyle: 'info'
              })
              // 刷新页面
              commentSearch(pageNum)
            }
          }
        });
        break;
      case '拒绝':
        $.ajax({
          type: "post",
          url: bigNews.comment_reject,
          data: {
            id: id
          },
          dataType: "json",
          success: function (response) {
            console.log(response);
            if (response.code === 200) {
              // 弹框提示
              // alert(response.msg)
              globalModal({
                title: '审批操作结果',
                text: response.msg,
                closeBtn: '知道了',
                closeStyle: 'warning'
              })
              // 刷新页面
              commentSearch(pageNum)
            }
          }
        });
        break;
      case '删除':
        $.ajax({
          type: "post",
          url: bigNews.comment_delete,
          data: {
            id: id
          },
          dataType: "json",
          success: function (response) {
            console.log(response);
            if (response.code === 200) {
              if ($('tbody').children().length === 1) {
                pageNum -= 1
              }
              // 弹框提示
              // alert(response.msg)
              globalModal({
                title: '审批操作结果',
                text: response.msg,
                closeBtn: '知道了',
                closeStyle: 'danger'
              })
              // 刷新页面
              commentSearch(pageNum)
            }
          }
        });
        break;
      default:
        globalModal({
          title: '审批操作结果',
          text: '操作异常，请联系管理员进行查明原因！',
          closeBtn: '知道了',
          closeStyle: 'danger'
        })
        break;
    }
  })






})