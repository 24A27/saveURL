document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const urlInput = document.getElementById('urlInput');
    const addUrlButton = document.getElementById('addUrlButton');
    const urlList = document.getElementById('urlList');

    // PWAインストール機能
    let deferredPrompt;
    let installButton;

    // PWAインストールボタンを作成
    function createInstallButton() {
        installButton = document.createElement('button');
        installButton.textContent = 'アプリをインストール';
        installButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #28a745;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
            font-size: 14px;
        `;
        installButton.style.display = 'none';
        document.body.appendChild(installButton);

        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`ユーザーの選択: ${outcome}`);
                deferredPrompt = null;
                installButton.style.display = 'none';
            }
        });
    }

    // PWAインストール可能イベント
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installButton) {
            installButton.style.display = 'block';
        }
    });

    // PWAインストール後イベント
    window.addEventListener('appinstalled', () => {
        console.log('PWAがインストールされました');
        if (installButton) {
            installButton.style.display = 'none';
        }
    });

    // インストールボタンを作成
    createInstallButton();

    // ローカルストレージからURLを読み込む
    let urls = JSON.parse(localStorage.getItem('urls')) || [];

    // URLリストを表示する関数
    function renderUrls() {
        urlList.innerHTML = ''; // 一度リストをクリア
        urls.forEach((item, index) => {
            const listItem = document.createElement('li');

            // 名前を表示する要素
            const nameSpan = document.createElement('span');
            nameSpan.classList.add('url-name');
            nameSpan.textContent = item.name || 'No Name';

            const urlLink = document.createElement('a');
            urlLink.href = item.url;
            urlLink.textContent = item.url;
            urlLink.target = "_blank"; // 新しいタブで開く

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '削除';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => {
                deleteUrl(index);
            });

            listItem.appendChild(nameSpan);
            listItem.appendChild(urlLink);
            listItem.appendChild(deleteButton);
            urlList.appendChild(listItem);
        });
    }

    // URLを追加する関数
    function addUrl() {
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();
        if (url) {
            // URLの形式を簡易的にチェック
            const isValidUrl = url.startsWith('http://') || url.startsWith('https://');
            if (!isValidUrl) {
                alert('有効なURLを入力してください (http:// または https:// で始まる必要があります)。');
                return;
            }

            urls.push({ name: name, url: url });
            localStorage.setItem('urls', JSON.stringify(urls)); // ローカルストレージに保存
            nameInput.value = ''; // 入力欄をクリア
            urlInput.value = ''; // 入力欄をクリア
            renderUrls(); // リストを再描画
        } else {
            alert('URLを入力してください。');
        }
    }

    // URLを削除する関数
    function deleteUrl(index) {
        urls.splice(index, 1); // 指定されたインデックスのURLを削除
        localStorage.setItem('urls', JSON.stringify(urls)); // ローカルストレージを更新
        renderUrls(); // リストを再描画
    }

    // イベントリスナーの設定
    addUrlButton.addEventListener('click', addUrl);

    // EnterキーでもURLを追加できるようにする
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addUrl();
        }
    });

    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addUrl();
        }
    });

    // 初期表示
    renderUrls();
});