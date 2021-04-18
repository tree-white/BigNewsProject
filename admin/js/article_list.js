// 函数封装区域
// 1. 刷新文章所有分类
function updateType() {
  // 功能：文字列表下拉框渲染
  $.ajax({
    type: "get",
    url: bigNews.category_list,
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response.code == 200) {
        const htmlStr = template('cateOption', response)
        $('#selCategory').html(htmlStr)
      }
    }
  });
}

// 2. 刷新渲染list列表数据
function updateList(key = '', page = '', perpage = 10) {
  let type = $('#selCategory').val(); // 文章分类 id 值获取           空=所有类型文章
  let state = $('#selStatus').val(); // 文章的状态 “所有/草稿/已发布”  空=所有状态
  // key      文章搜索的 “关键字”   空=某类型的所有文章
  // page     当前页              空=第1页
  // perpage  每页显示的条数        空=6

  // 向服务器发起文章搜索
  $.ajax({
    type: "get",
    url: bigNews.article_query,
    data: {
      key: key,
      type: type,
      state: state,
      page: page,
      perpage: perpage
    },
    dataType: "json",
    success: function (response) {
      console.log(response);
      // 返回成功则渲染数据到页面中
      if (response.code == 200) {
        // 渲染列表
        const htmlStr = template('listTr', response.data)
        $('tbody').html(htmlStr)
        // 渲染分页
        // const pagingStr = template('paging',)
      }
    }
  });
}

// 3. 通用系统提示
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

  // 刷新文章分类
  updateType()
  // 刷新页面触发一次刷新
  updateList();



  // 功能：获取列表数据
  $('#btnSearch').click(function (e) {
    // 清除按钮在表单域内的默认行为
    e.preventDefault();
    updateList();
  });


  // 功能：发表文章-点击事件

  // 功能：删除提示
  $('tbody').on('click', '.delete', function () {
    // 获取当前的 data-id
    const id = $(this).attr('data-id')
    $('#articleListModal .modal-footer button').eq(1).attr('data-id',id)
    console.log(id);
    // 弹出提示 是否确定删除
    globalModal({
      title: '删除操作提示！',
      text: `您确定要删除当前文章吗？<br/>注意：一旦删除无法复原`,
      closeStyle: 'primary',
      sureBtn: '确定删除',
      sureStyle: 'danger',
      sureBtnState: 'inline-block',
    })
  });
  // 点击了确定删除
  $('#articleListModal .modal-footer button').eq(1).click(function () {
    console.log('点击了确定');
  })


})