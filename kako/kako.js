let currentOffset = 0; // 現在のオフセット

// ページロード時にuserIdを取得
window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = Number(urlParams.get('userId')); // URLパラメータからuserIdを取得
    console.log('取得したuserId:', userId); // userIdを確認
  
    // userIdを使用して過去記録を読み込む
    await loadRecord(userId, currentOffset); // 初期オフセットで過去記録を読み込む
  
    // ボタンのイベントリスナー
    document.getElementById('prev-button').addEventListener('click', () => {
      currentOffset++;  // 前の記録に移動
      loadRecord(userId, currentOffset); // userId と currentOffset を渡してロード
    });
  
    document.getElementById('next-button').addEventListener('click', () => {
      if (currentOffset > 0) {
        currentOffset--;  // 次の記録に移動
        loadRecord(userId, currentOffset); // userId と currentOffset を渡してロード
      }
    });
  }
// 過去記録をロードする関数
async function loadRecord(userId,offset) {
  try {
    const response = await fetch(`https://karadanipi-su-api.onrender.com/histories/${userId}/${offset}`);
    if (!response.ok) {
      throw new Error('データの取得に失敗しました');
    }

    const data = await response.json();
    displayRecord(data); // データを表示する
  } catch (error) {
    console.error('エラー:', error);
    alert('過去記録の読み込み中にエラーが発生しました');
  }
}

// データを表示する関数
function displayRecord(data) {
  const container = document.getElementById('history-details');
  container.innerHTML = `
    <p><strong>日付:</strong> ${data.history.created_at}</p>
    <p><strong>体重:</strong> ${data.history.weight || '記録なし'} kg</p>
    <p><strong>朝食:</strong> ${data.food.breakfast || '記録なし'}</p>
    <p><strong>昼食:</strong> ${data.food.lunch || '記録なし'}</p>
    <p><strong>夕食:</strong> ${data.food.dinner || '記録なし'}</p>
    <h3>トレーニング</h3>
    <ul>
      ${data.trainings.map(t => `
        <li>
          <strong>部位:</strong> ${t.part} |
          <strong>運動:</strong> ${t.exercise} |
          <strong>セット:</strong> ${t.sets} |
          <strong>回数:</strong> ${t.reps} |
          <strong>秒数:</strong> ${t.seconds}
        </li>
      `).join('')}
    </ul>
  `;
}

// // ボタンのイベントリスナー
// document.getElementById('prev-button').addEventListener('click', () => {
//   currentOffset++;
//   loadRecord(userId,currentOffset);
// });

// document.getElementById('next-button').addEventListener('click', () => {
//   if (currentOffset > 0) {
//     currentOffset--;
//     loadRecord(userId,currentOffset);
//   }
// });

// // 初期ロード
// loadRecord(currentOffset);


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

