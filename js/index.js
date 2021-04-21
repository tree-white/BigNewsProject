// 入口函数
$(function () {
  // 自动1 - 热点图
  $.ajax({
    type: "get",
    url: bigNews.hot_pic,
    dataType: "json",
    success: function (response) {
      // console.log(response);
      if (response.code === 200) {
        const htmlStr = template('hotPic', response)
        $('.focus_list').html(htmlStr)
      }
    }
  });

  // 自动2 - 最新资讯
  $.ajax({
    type: "get",
    url: bigNews.latest_new,
    dataType: 'json',
    success: function (response) {
      // console.log(response);
      if (response.code === 200) {
        const htmlStr = template('bestNews',response)
        $('.common_news').html(htmlStr)
      }
    }
  });

  // 自动3 - 文章热门排行
  $.ajax({
    type: "get",
    url: bigNews.article_hot_rank,
    dataType: "json",
    success: function (response) {
      // console.log(response);
      if (response.code === 200) {
        const htmlStr = template('weekHot', response)
        $('.hotrank_list').html(htmlStr);
      }
    }
  });

  // 自动4 - 最新评论
  $.ajax({
    type: "get",
    url: bigNews.latest_comment,
    dataType: "json",
    success: function (response) {
      // console.log(response);
      const newData = response.data.map(item => {
        // 获取评论大概时间
        let pastTime = +new Date() - +new Date(item.date)
        pastTime = Math.floor(Math.abs((pastTime / 1000 / 60 / 60 / 24)))
        pastTime = (pastTime < 30) ? pastTime + '天前' : Math.ceil(pastTime / 31) + '个月前'
        // 获取具体月日
        const arrDate = item.date.slice(5).split('-')
        arrDate[0] = arrDate[0] < 10 ? '0' + arrDate[0] : arrDate[0]
        // 返回
        return {
          first: item.author.charAt(0),
          author: item.author,
          intro: item.intro,
          pastTime: pastTime,
          date: arrDate.join('-'),
          id: item.articleId
        }
      })
      // console.log(newData);
      const htmlStr = template('commentList', newData)
      $('.comment_list').html(htmlStr)

    }
  });

  // 自动5 - 焦点关注
  $.ajax({
    type: "get",
    url: bigNews.focus_attention,
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response.code === 200) {
        const htmlStr = template('portNews', response)
        $('.guanzhu_list').html(htmlStr)
      }
    }
  });

  // 功能 - 点击热点图
  $('.focus_list').on('click','li',function (e) {
    // 取消 a 链接默认行为
    e.preventDefault();
    // 点击热点图获得ID，后面调整需要
    console.log('点击了：',$(this).attr('data-id'));
  })







})