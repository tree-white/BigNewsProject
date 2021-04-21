(function (w) {

  // 1. 全局请求地址
  const baseUrl = 'http://localhost:8080/api/v1';
  const bigNews = {
    // 文章搜索
    article_search:   `${baseUrl}/index/search`,          // 1. 文章搜索
    article_category: `${baseUrl}/index/category`,        // 2. 文章类型
    hot_pic:          `${baseUrl}/index/hotpic`,          // 3 .热点图
    article_hot_rank: `${baseUrl}/index/rank`,            // 4. 文章热门排行
    latest_new:       `${baseUrl}/index/latest`,          // 5. 最新资讯
    latest_comment:   `${baseUrl}/index/latest_comment`,  // 6. 最新评论
    focus_attention:  `${baseUrl}/index/attention`,       // 7. 焦点关注
    detail_article:   `${baseUrl}/index/artitle`,         // 8. 文章详细内容
    post_comment:     `${baseUrl}/index/post_comment`,    // 9. 发表评论
    get_comment:      `${baseUrl}/index/get_comment`,     // 10.评论列表
  }
  // 设置为全局内容
  w.bigNews = bigNews;


  // 2. 通用系统提示
  function promptModal(modalState = {}) {
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
  // 设置为全局函数
  w.promptModal = promptModal




})(window)