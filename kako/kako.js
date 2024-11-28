// データベースからユーザーネームを取得してオブジェクトに変換する
// ユーザーネームを取得して表示する関数
async function loadAndDisplayuserName(userId) {
    try {
        // APIから目標データを取得
        const response = await fetch(`https://karadanipi-su-api.onrender.com/users/${userId}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log(data);

            // 目標データを表示する処理
            const mokuhyouElement = document.getElementById('username'); // 目標を表示する要素
            if (data.username) {
                mokuhyouElement.textContent = `${data.username}`; // 目標を表示
                console.log(`ユーザーID ${userId} のユーザーネームが表示されました: ${data.username}`);
            } else {
                mokuhyouElement.textContent = '目標が設定されていません';
                console.log(`ユーザーID ${userId} のユーザーネームは設定されていません`);
            }
        } else {
            console.error("ユーザーネームデータの取得に失敗しました:", await response.text());
        }
    } catch (error) {
        console.log("エラーが発生しました:", error);
    }
}
