// 沙箱模式
(function (global) {
    // 需求一：设置全局ajax
    // 1.1 每次发送 ajax 请求前，添加请求头
    $.ajaxSetup({
        // 加载前显示进度条
        beforeSend: function () {
            if (global.NProgress) {
                NProgress.start()
            }
        },
        // 每次都使用请求头
        // 注意点：如果局部也设置了请求头，不会覆盖，而是会在headers基础上再添加
        headers: {
            Authorization: localStorage.getItem('token')
        },
        // 获取失败，提示错误信息内容
        error: function (error) {
            // console.log(error);
            switch (error.status) {
                case 400:
                    // article_category 页面提示
                    warmPrompt && warmPrompt(error.responseJSON.msg, 'danger')
                    break;
                
                case 401:
                    break;
                
                case 403:
                    // index
                    global.callModal && global.callModal()
                    // 所有子级盒子iframe打开的页面
                    global.parent.callModal && global.parent.callModal()
                    break;
                
                case 404:
                    console.log(error);
                    break;
                    
                
                
            }
        },
        // 加载结束结束进度条
        complete: function () {
            if (global.NProgress) {
                NProgress.done();
            }
        }
    })

    
    // 需求二：把所有 ajax 请求的 url 地址封装到一个对象中管理
    // 2.1 设置 基地址
    const baseUrl = 'http://localhost:8080/api/v1';
    // 2.2 封装请求地址对象
    const bigNews = {
        // 用户信息接口
        user_login:         `${baseUrl}/admin/user/login`,      // 1. 用户登录
        user_info:          `${baseUrl}/admin/user/info`,       // 2. 获取用户信息
        user_detail:        `${baseUrl}/admin/user/detail`,     // 3. 获取用户详情
        user_edit:          `${baseUrl}/admin/user/edit`,       // 4. 编辑用户信息
        // 文章类别
        category_list:      `${baseUrl}/admin/category/list`,   // 5. 所有文章类别
        category_add:       `${baseUrl}/admin/category/add`,    // 6. 新增文章类别
        category_search:    `${baseUrl}/admin/category/search`, // 7. 根据id查询指定文章类别
        category_edit:      `${baseUrl}/admin/category/edit`,   // 8. 编辑文章类别
        category_delete:    `${baseUrl}/admin/category/delete`, // 9. 删除文章类别
        // 文章内容
        article_query:      `${baseUrl}/admin/article/query`,   // 10.文章搜索
        article_publish:    `${baseUrl}/admin/article/publish`, // 11.发布文章
        article_search:     `${baseUrl}/admin/article/search`,  // 12.根据id获取文章信息
        article_edit:       `${baseUrl}/admin/article/edit`,    // 13.文章编辑
        article_delete:     `${baseUrl}/admin/article/delete`,  // 14.删除文章
        // 数据内容
        data_info:          `${baseUrl}/admin/data/info`,       // 15.获取统计数据
        data_article:       `${baseUrl}/admin/data/article`,    // 16.日新增文章数量统计
        data_category:      `${baseUrl}/admin/data/category`,   // 17.各类型文章数量统计
        data_visit:         `${baseUrl}/admin/data/visit`,      // 18.日文章访问量
        // 评论内容
        comment_search:     `${baseUrl}/admin/comment/search`,  // 19.文章评论搜索
        comment_pass:       `${baseUrl}/admin/comment/pass`,    // 20.评论审核通过
        comment_reject:     `${baseUrl}/admin/comment/reject`,  // 21.评论审核不通过
        comment_delete:     `${baseUrl}/admin/comment/delete`,  // 22.删除评论

    }
    // 2.3 把 bigNews 改成全局对象
    global.bigNews = bigNews;

})(window)