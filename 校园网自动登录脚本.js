// ==UserScript==
// @name         校园网自动登录脚本
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  自动登录校园网并提供可视化设置界面
// @author       Hongtauo@https://github.com/Hongtauo
// @match        http://10.10.9.4/*
// ==/UserScript==

(function() {
    'use strict';
    
    const style = document.createElement('style');
    style.innerHTML = `
        .floating-panel {
            position: fixed; /* 固定定位 */
            top: 20px;       /* 距离顶部 20px */
            left: 20px;      /* 距离左边 20px */
            width: 260px;    /* 设置宽度 */
            padding: 15px;   /* 内边距 */
            background-color: #4CAF50; /* 背景色 */
            color: white;    /* 文字颜色 */
            border-radius: 10px;  /* 边角圆滑 */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
            z-index: 9999;   /* 确保它显示在其他内容上面 */
            transition: transform 0.3s ease, opacity 0.3s ease; /* 动画效果 */
        }

        .floating-panel h3 {
            margin: 0;
            font-size: 18px;
        }

        .floating-panel label {
            margin-top: 10px;
            font-size: 14px;
        }

        .floating-panel input,
        .floating-panel select {
            width: 95%;
            padding: 8px;
            margin-top: 5px;
            margin-bottom: 10px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }

        .close-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            transition: color 0.3s ease;
        }

        .close-btn:hover {
            color: #ff5555;
        }

        #saveBtn {
            width: 100%;
            padding: 10px;
            background-color: #ff9800;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            color: white;
            font-size: 16px;
        }

        .disclaimer {
            margin-top: 15px;
            font-size: 12px;
            color: #f1f1f1;
            text-align: center;
            background-color: #333;
            padding: 10px;
            border-radius: 5px;
        }
        .disclaimer {
            text-align: left; /* 左对齐 */
        }

        .disclaimer p {
            text-align: left; /* 确保所有段落左对齐 */
            margin-left: 10px; /* 设置一点左边距，让文本更易阅读 */
        }

        .disclaimer p strong {
            font-weight: bold; /* 标题加粗 */
        }

        .disclaimer p.user-agreement {
            color: red; /* 用户同意部分字体为红色 */
        }

    `;
    document.head.appendChild(style);

    // 创建并显示悬浮面板
    function createFloatingPanel() {
        const panelHTML = `
            <div id="floatingPanel" class="floating-panel">
                <button id="closeBtn" class="close-btn">X</button>
                <h3>自动登录设置</h3>
                
                <label for="usernameInput">用户名：</label>
                <input type="text" id="usernameInput" placeholder="输入用户名" />
                
                <label for="passwordInput">密码：</label>
                <input type="password" id="passwordInput" placeholder="输入密码" />
                
                <label for="serviceSelect">运营商：</label>
                <select id="serviceSelect">
                    <option value="0">移动</option>
                    <option value="1" selected>电信</option>
                    <option value="2">联通</option>
                    <option value="3">校内网</option>
                </select>
                
                <button id="saveBtn">保存设置</button>
                <!-- 免责声明部分 -->
                <div class="disclaimer">
                    <p><strong>使用前，请确保你清楚以下规则：</strong></p>
                    本工具/脚本（以下简称“工具”），仅用于个人学习、研究和非商业用途。用户在使用本工具时，须自行承担所有风险和责任。
            
                    <p><strong>工具使用目的：</strong></p>
                    本工具旨在为用户提供便捷的功能，并非针对任何第三方服务或平台（如校园网登录页面或平台）进行非法操作。用户应当遵守所在国家或地区的相关法律法规，确保工具的使用不违反任何法律规定。

                    <p><strong>责任限制：</strong></p>
                    本工具所提供的功能和服务仅供参考和使用，无法保证其完全无误或无故障。对于因使用本工具而导致的任何损失或损害，开发者不承担任何责任。用户在使用本工具时应自行评估风险。

                    <p><strong>知识产权：</strong></p>
                    本工具所涉及的所有内容，包括但不限于代码、设计、文档等，均为开发者所有或授权使用，未经许可不得复制、修改或以其他方式使用。

                    <p><strong>隐私保护：</strong></p>
                    本工具在运行过程中可能会访问用户输入的数据，例如用户名、密码等信息，但这些数据不会被保存或转交给第三方。开发者承诺不会收集用户的任何敏感信息，用户应当自行妥善管理和保护其个人数据。

                    <p><strong>免责声明更新：</strong></p>
                    本免责声明可能会根据法律法规或实际情况发生变动，开发者保留随时修改或更新免责声明的权利。修改后的免责声明将会发布在本工具的相关页面或文档中。

                    <p class="user-agreement"><strong>用户同意：</strong></p>
                    用户在使用本工具时，已阅读并同意本免责声明中的所有条款。

                    <p><strong>第三方服务免责声明：</strong></p>
                    本工具与第三方服务（例如校园网登录页面）没有直接关系，使用本工具时，用户应遵循相关第三方服务的使用条款。
                </div>


            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', panelHTML);

        // 设置按钮点击事件
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.addEventListener('click', saveSettings);

        // 关闭按钮点击事件
        const closeBtn = document.getElementById('closeBtn');
        closeBtn.addEventListener('click', function() {
            document.getElementById('floatingPanel').style.display = 'none';
        });
    }

    // 保存用户设置到 localStorage
    function saveSettings() {
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;
        const serviceProvider = document.getElementById('serviceSelect').value;

        // 保存设置到 localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        localStorage.setItem('serviceProvider', serviceProvider);

        alert('设置已保存!');
        autoLogin();  // 保存完设置后立即尝试自动登录
    }

    // 加载用户设置
    function loadSettings() {
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');
        const serviceProvider = localStorage.getItem('serviceProvider');

        if (username) {
            document.getElementById('usernameInput').value = username;
        }
        if (password) {
            document.getElementById('passwordInput').value = password;
        }
        if (serviceProvider) {
            document.getElementById('serviceSelect').value = serviceProvider;
        }
    }

    // 自动登录
    function autoLogin() {
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');
        const serviceProvider = localStorage.getItem('serviceProvider');

        if (username && password) {
            // 填充用户名和密码
            document.getElementById('username').value = username;
            document.getElementById('pwd').value = password;

            // 延迟选择运营商和点击登录按钮
            setTimeout(() => {
                // 选择运营商
                const serviceSelector = document.querySelector(`#bch_service_${serviceProvider}`);
                if (serviceSelector) {
                    serviceSelector.click();  // 选择运营商
                }
            }, 500);  // 延迟500ms

            setTimeout(() => {
                // 提交登录
                const loginButton = document.getElementById('loginLink_div');
                if (loginButton) {
                    loginButton.click();  // 点击登录按钮
                }
            }, 1000);  // 延迟1000ms
        }
    }


    // 初始化
    createFloatingPanel();
    loadSettings();

    // 当页面加载时自动尝试登录
    autoLogin();
})();
