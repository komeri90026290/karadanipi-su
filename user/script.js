let myLineChart;
let userWeightData = [];


async function loadWeightHistory(userId) {
    console.log("ユーザーID:", userId);  // userIdが正しく取得されているか確認
    try {
        const response = await fetch(`https://karadanipi-su-api.onrender.com/vvv/getallweights/${userId}`);
        const text = await response.text(); // JSONの前に生のレスポンスを確認
        console.log("APIレスポンス:", text); 
        if (!response.ok) {
            throw new Error('データの取得に失敗しました');
        }

        const data = JSON.parse(text); // JSONとしてパース
        
        console.log("取得した体重データ:", data.weights);

        processWeightData(data.weights);
    } catch (error) {
        console.error('エラー:', error);
    }
}

//ログイン時にhistoryテーブルに追加するコード
async function addTodayHistory(userId) {
    try {
      // APIにリクエストを送信
      const response = await fetch(`https://karadanipi-su-api.onrender.com/histories/${userId}`, {
        method: 'POST', // POSTメソッドを指定
        headers: {
          'Content-Type': 'application/json',
        },
      });
     
 
      // サーバーからのレスポンスを処理
      if (response.ok) {
        const result = await response.json();
        console.log(`API成功: ${result.message}`);
      } else {
        const error = await response.json();
        console.error(`APIエラー: ${error.error}`);
        alert(`エラー: ${error.error}`);
      }
    } catch (error) {
      console.error('リクエスト中にエラーが発生しました:', error);
      alert('サーバーと通信中にエラーが発生しました');
    }
  }


function processWeightData(data) {
    userWeightData = data.map(item => ({
        date: item.created_at.split('T')[0],
        weight: item.weight
    }));

    console.log("処理後の体重データ:", userWeightData);

    showDailyChart();
}

function getRecentWeightData(days = 7) {
    const recentData = userWeightData.slice(-days);
    return {
        dates: recentData.map(item => item.date),
        weights: recentData.map(item => item.weight)
    };
}

function getWeeklyWeightData() {
    const weeklyData = [];
    let lastWeekDate = "";
    let lastWeight = null;

    userWeightData.forEach(item => {
        const date = new Date(item.date);
        const weekNumber = `${date.getFullYear()}-${Math.floor(date.getDate() / 7)}`;

        if (weekNumber !== lastWeekDate) {
            if (lastWeekDate) {
                weeklyData.push({ date: lastWeekDate, weight: lastWeight });
            }
            lastWeekDate = weekNumber;
        }
        lastWeight = item.weight;
    });

    if (lastWeekDate) {
        weeklyData.push({ date: lastWeekDate, weight: lastWeight });
    }

    return {
        dates: weeklyData.map(item => item.date),
        weights: weeklyData.map(item => item.weight)
    };
}

function initializeChart() {
    const ctx = document.getElementById('lineChart').getContext('2d');

    // 既存のチャートを破棄する（これがエラー対策）
    if (myLineChart) {
        myLineChart.destroy();
    }

    myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '体重',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function showDailyChart() {
    const recentData = getRecentWeightData();
    myLineChart.data.labels = recentData.dates;
    myLineChart.data.datasets[0].data = recentData.weights;
    myLineChart.update();
}

function showWeeklyChart() {
    const weeklyData = getWeeklyWeightData();
    myLineChart.data.labels = weeklyData.dates;
    myLineChart.data.datasets[0].data = weeklyData.weights;
    myLineChart.update();
}

function initPage(userId) {
    if (userId) {
        initializeChart();
    }
}

// APIを呼び出してtorehisidをhistoryテーブルに転送する関数
async function transferTorehisIdToHistory(userId) {
    try {
      // APIにPOSTリクエストを送る
      const response = await fetch(`https://karadanipi-su-api.onrender.com/histories/gettore/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // レスポンスが正常の場合
      if (response.ok) {
        const data = await response.json();
        console.log('サーバーからの応答:', data);
      } else {
        const errorData = await response.json();
        alert('エラー: ' + errorData.error); // エラーメッセージを表示
        console.error('エラー:', errorData.error);
      }
    } catch (error) {
      // リクエストが失敗した場合
      console.error('リクエスト中にエラーが発生しました:', error);
      alert('サーバーと通信中にエラーが発生しました');
    }
  }


// APIを呼び出してfoodidをhistoryテーブルに転送する関数
async function transferFoodIdToHistory(userId) {
    try {
      // APIにPOSTリクエストを送る
      const response = await fetch(`https://karadanipi-su-api.onrender.com/histories/getfood/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // レスポンスが正常の場合
      if (response.ok) {
        const data = await response.json();
        console.log('サーバーからの応答:', data);
      } else {
        const errorData = await response.json();
        alert('エラー: ' + errorData.error); // エラーメッセージを表示
        console.error('エラー:', errorData.error);
      }
    } catch (error) {
      // リクエストが失敗した場合
      console.error('リクエスト中にエラーが発生しました:', error);
      alert('サーバーと通信中にエラーが発生しました');
    }
  }

//今日の日付
document.addEventListener("DOMContentLoaded", function() {
    // 今日の日付の表示
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}`;
    document.getElementById('today').textContent = formattedDate;

    initializeChart();
});

// テキストエリアの内容をローカルストレージに保存
function saveFoodData() {
        const breakfast = document.getElementById('text-breakfast').value;
        localStorage.setItem('text-breakfast', breakfast);
        const lunch = document.getElementById('text-lunch').value;
        localStorage.setItem('text-lunch', lunch);
        const dinner = document.getElementById('text-dinner').value;
        localStorage.setItem('text-dinner', dinner);

};

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


// データベースから目標データを取得してオブジェクトに変換する
// 目標データを取得して表示する関数
async function loadAndDisplayMokuhyou(userId) {
    try {
        // APIから目標データを取得
        const response = await fetch(`https://karadanipi-su-api.onrender.com/users/${userId}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log(data);

            // 目標データを表示する処理
            const mokuhyouElement = document.getElementById('mokuhyou'); // 目標を表示する要素
            if (data.mokuhyou) {
                mokuhyouElement.textContent = `${data.mokuhyou}`; // 目標を表示
                console.log(`ユーザーID ${userId} の目標が表示されました: ${data.mokuhyou}`);
            } else {
                mokuhyouElement.textContent = '目標が設定されていません';
                console.log(`ユーザーID ${userId} の目標は設定されていません`);
            }
        } else {
            console.error("目標データの取得に失敗しました:", await response.text());
        }
    } catch (error) {
        console.log("エラーが発生しました:", error);
    }
}


//データベースからご飯を取得
async function loadAndDisplayFood(userId) {
    console.log("ユーザーID:", userId);  // userIdが正しく取得されているか確認
    try {
        const response = await fetch(`https://karadanipi-su-api.onrender.com/foods/${userId}`); // APIエンドポイントにリクエスト

        if (response.ok) {
            const data = await response.json();
            console.log(data);

            // ご飯データを表示する処理
            const textElement = document.getElementById('text-breakfast'); // 朝ご飯を表示する要素
            const lunchElement = document.getElementById('text-lunch'); // 昼ご飯を表示する要素
            const dinnerElement = document.getElementById('text-dinner'); // 夜ご飯を表示する要素

        if (textElement) {
            if (data.breakfast) {
                textElement.value = `${data.breakfast}`; // ごはんを表示
                console.log(`ユーザーID ${userId} の朝ごはんが表示されました: ${data.breakfast}`);
            } else {
                console.log(`ユーザーID ${userId} の朝ごはんは設定されていません`);
            }
        }

        if (lunchElement) {
            if (data.lunch) {
                lunchElement.value = `${data.lunch}`; // ごはんを表示
                console.log(`ユーザーID ${userId} の昼ごはんが表示されました: ${data.lunch}`);
            } else {
                console.log(`ユーザーID ${userId} の昼ごはんは設定されていません`);
            }
        }
            
        if (dinnerElement) {
            if (data.dinner) {
                dinnerElement.value = `${data.dinner}`; // ごはんを表示
                console.log(`ユーザーID ${userId} の夜ごはんが表示されました: ${data.dinner}`);
            } else {
                console.log(`ユーザーID ${userId} の夜ごはんは設定されていません`);
            }
        }
        
        } else {
            console.error("ごはんの取得に失敗しました:", await response.text());
        }
    } catch (error) {
        console.log("エラーが発生しました:", error);
    }
}

        



// 身長と体重の入力制限
const heightkeep = document.getElementById('user_height');
const weightInput = document.getElementById('user_weight');

// 身長に小数点を使わせない
heightkeep.addEventListener('input', function() {
    // 身長が小数点を含んでいる場合は削除
    heightkeep.value = heightkeep.value.replace(/\..*$/, ''); // 小数点以降を削除

    // 身長が3桁を超えないように制限
    if (heightkeep.value.length > 3) {
        heightkeep.value = heightkeep.value.slice(0, 3); // 3桁に切り捨て
    }
    if (Number(heightkeep.value) > 999) {
        heightkeep.value = 999; // 最大値999
    }
});

//体重4桁超えないように
weightInput.addEventListener('input', function() {
    // 体重が4桁を超えないように制限
    if (weightInput.value.length > 4) {
        weightInput.value = weightInput.value.slice(0, 4); // 4桁に切り捨て
    }
    if (Number(weightInput.value) > 1000) {
        weightInput.value = 1000; // 最大値1000
    }
});

// BMI計算関数
function calculateBMI() {
    const userHeight = parseFloat(document.getElementById("user_height").value) / 100;
    const userWeight = parseFloat(document.getElementById("user_weight").value);

    let bmi = 0, heitai = 0, heibmi = 0;

    if (userHeight > 0 && userWeight > 0) { 
        // BMI計算
        bmi = (userWeight / (userHeight * userHeight)).toFixed(2);
        document.getElementById("result").textContent = bmi;

        // 標準体重計算 (BMI 22に基づく計算)
        heitai = (userHeight * userHeight * 22).toFixed(1);
        document.getElementById("heitai").textContent = heitai;

        // 理想的なBMI (BMI 22を基準にした体重)
        heibmi = (heitai / (userHeight * userHeight)).toFixed(2);
        document.getElementById("heibmi").textContent = heibmi;
    }

    // ローカルストレージに体重データを保存
    const date = new Date().toISOString().split('T')[0];
    let weightData = JSON.parse(localStorage.getItem('weightData')) || {};
    weightData[date] = userWeight;
    localStorage.setItem('weightData', JSON.stringify(weightData));

    // グラフの更新 (updateChartとupdateWeightChange関数を使っている場合)
}

function saveFood() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = Number(urlParams.get('userId')); // userIdを数値として取得

    const savedData_breakfast = localStorage.getItem('text-breakfast');
    const savedData_lunch = localStorage.getItem('text-lunch');
    const savedData_dinner = localStorage.getItem('text-dinner');

    // リクエストの内容を設定
    const requestData = {
        userid: userId,
        breakfast: savedData_breakfast,
        lunch: savedData_lunch,
        dinner: savedData_dinner,

    };

    console.log(requestData);

    // アラート用のメッセージを作成
    const messages = [];
    if (savedData_breakfast) messages.push("朝ごはん");
    if (savedData_lunch) messages.push("昼ごはん");
    if (savedData_dinner) messages.push("晩ごはん");

    const alertMessage = messages.length > 0 
        ? `${messages.join("、")}が入力されました！` 
        : "何も入力されていませんでした。";

    fetch(`https://karadanipi-su-api.onrender.com/foods/tuika/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        alert(alertMessage); // アラートをわかりやすく表示
        console.log('サーバーからの応答:', data);
    })
    .catch(error => {
        console.error('エラー:', error);
        alert('データの保存に失敗しました: ' + error.message);
    });
}

function carepage() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = Number(urlParams.get('userId')); // userIdを数値として取得
    window.location.href = `../sample/after_care.html?userId=${userId}`;
  }


function breakfastpage() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = Number(urlParams.get('userId')); // userIdを数値として取得
    window.location.href = `../sample/user_breakfast.html?userId=${userId}`;
  }

  function lunchpage() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = Number(urlParams.get('userId')); // userIdを数値として取得
    window.location.href = `../sample/user_lunch.html?userId=${userId}`;
  }

  function dinnerpage() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = Number(urlParams.get('userId')); // userIdを数値として取得
    window.location.href = `../sample/user_dinner.html?userId=${userId}`;
  }



function torepage() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = Number(urlParams.get('userId')); // userIdを数値として取得
    window.location.href = `../tore/tore.html?userId=${userId}`;
  }

  function kakopage() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = Number(urlParams.get('userId')); // userIdを数値として取得
    window.location.href = `../kako/kako.html?userId=${userId}`;
  }
//なんだこれ
function GetFood() {
    // APIからデータを取得する
    
    const urlParams = new URLSearchParams(window.location.search);
    const userId = Number(urlParams.get('userId')); // userIdを数値として取得

    if (!userId) {
        alert('無効なユーザーIDです');
        return;
    }

    fetch('https://karadanipi-su-api.onrender.com/foods', { // エンドポイントURLを適切に変更
        method: 'GET', // GETリクエストを使用してデータを取得
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('データの取得に失敗しました');
        }
        return response.json(); // JSON形式でデータをパース
    })
     .then(data => {
        // サーバーから取得したデータを利用する
        
        const savedData_breakfast = data.breakfast; // データ構造に合わせて取得
        const savedData_lunch = data.lunch;
        const savedData_dinner = data.dinner;


 
        // 取得したデータを適切な要素に表示
        if (savedData_breakfast) {
            document.getElementById('text-breakfast').value = savedData_breakfast;
        }
        if (savedData_lunch) {
            document.getElementById('text-lunch').value = savedData_lunch;
        }
        if (savedData_dinner) {
            document.getElementById('text-dinner').value = savedData_dinner;
        }

    })
    .catch(error => {
        console.error('エラー:', error);
        alert('データの取得に失敗しました。');
    });
}

  async function foodonedayData(userid) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid }), // ユーザーIDをサーバーに送信
      });
 
      const result = await response.json();
 
      if (response.ok) {
        console.log('Empty data added successfully:', result.data);
      } else {
        console.error('Failed to add empty data:', result.message);
      }
    } catch (error) {
      console.error('Error adding empty data:', error);
    }
  }


  function saveData() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = Number(urlParams.get('userId')); // userIdを数値として取得
    const numberheight = Number(document.getElementById('user_height').value.trim()); // 入力値を取得して余分な空白を除去
    const numberweight = Number(document.getElementById('user_weight').value.trim()); // 入力値を取得して余分な空白を除去
    const textmoku = document.getElementById('moku').value.trim(); // 入力値を取得して余分な空白を除去

    // ローカルストレージに保存（目標のみ）
    if (textmoku) {
        localStorage.setItem('moku', textmoku);
    }

    // 1. `users`テーブルに目標を保存するリクエスト
    const requests = []; // 並列処理のためのリクエスト配列
    if (textmoku) {
        const userUpdateData = { mokuhyou: textmoku };
        requests.push(
            fetch(`https://karadanipi-su-api.onrender.com/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(userUpdateData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('ユーザーの目標が保存されました:', data);
                const mokuhyouDiv = document.getElementById('mokuhyou');
                mokuhyouDiv.textContent = `${textmoku}`;
            })
            .catch(error => {
                console.error('ユーザー目標の保存エラー:', error);
                alert('ユーザー目標の保存に失敗しました: ' + error.message);
            })
        );
    }

    // 2. `history`テーブルに身長と体重を保存するリクエスト
    if (numberheight || numberweight) { // 身長か体重のどちらかが入力されている場合に送信
        const historyData = {
            userId: userId,
            height: numberheight || null, // 数値がない場合はnull
            weight: numberweight || null // 数値がない場合はnull
        };

        requests.push(
            fetch(`https://karadanipi-su-api.onrender.com/histories/updateheight/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(historyData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('履歴が保存されました:', data);
            })
            .catch(error => {
                console.error('履歴の保存エラー:', error);
                alert('身長と体重の履歴保存に失敗しました: ' + error.message);
            })
        );
    }

        // 全てのリクエストが完了したらページをリロード
        Promise.all(requests).then(() => {
            location.reload();
        });
}


async function initCreateData(userId) {
    let todayFood = {};
    let todayTrainingHistory = {};
    let todayTrainingList = [];
    try {
        const response = await fetch(`https://karadanipi-su-api.onrender.com/foods/recent/${userId}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.status == '200') {
            console.log(response.status)
            todayFood = await response.json();
        } else{
            console.log('フードデータなし')
            todayFood = createFirstFoodDate(userId);              
        }
    } catch (error) {
        console.error('Error init Food data:', error);
    }
    
// 部位ごとの合計値を保持するオブジェクト
const partTotals = {};

// 最新のトレーニング履歴をAPIから取得
try {
    const response = await fetch(`https://karadanipi-su-api.onrender.com/traininghistories/recent/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (response.ok) {
        console.log(response.status); // レスポンスステータスをログに出力
        todayTrainingHistory = await response.json(); // トレーニング履歴データを取得
    } else {
        console.log('response.status');
        console.log(response.status); // エラー時のステータスをログに出力
        console.log('トレーニングヒストリーデータなし');
        todayTrainingHistory = createFirstTrainingHistories(userId); // 初回データを作成
    }
} catch (error) {
    console.error('Error init traininghistories data:', error); // エラーをキャッチしてログ出力
}

console.log(todayTrainingHistory); // トレーニング履歴の中身を確認

// トレーニングIDリストを基にトレーニングデータを取得
for (let i = 0; i < todayTrainingHistory.trainingidlist.length; i++) {
    const training = await fetchTrainig(todayTrainingHistory.trainingidlist[i]);
    todayTrainingList.push(training); // 取得したトレーニングデータをリストに追加
}

// 各トレーニングの `totaltimeorreps` を計算し、部位ごとに合算
todayTrainingList.forEach(training => {
    // secondsが存在する場合は秒数に基づいた計算、存在しない場合はrepsを基に計算
    const totaltimeorreps = training.seconds
        ? (training.seconds * training.sets) / 2
        : training.reps * training.sets;

    // 部位ごとに合算
    if (partTotals[training.part]) {
        partTotals[training.part] += totaltimeorreps; // 既存値に加算
    } else {
        partTotals[training.part] = totaltimeorreps; // 初回値を設定
    }
});

// 合算後の各部位に対して色を適用
Object.keys(partTotals).forEach(part => {
    const totalForPart = partTotals[part]; // 合算された値
    changeColorForPart(part, totalForPart); // 色付け
});

const exerciseList = document.getElementById('exerciseList'); // トレーニングデータを表示する要素を取得

if (exerciseList) {
    exerciseList.innerHTML = ''; // 既存の表示内容をクリア

    todayTrainingList.forEach(training => {
        // 表示用のトレーニング情報を生成
        const item = document.createElement('div');
        const detail = training.reps ? `${training.reps} 回` : `${training.seconds} 秒`; // 表示内容をセット
        item.textContent = `${training.part}: ${training.exercise} - ${detail} × ${training.sets} セット`;

        // トレーニングデータをリストに追加
        exerciseList.insertBefore(item, exerciseList.firstChild);

        // トレーニング部位に応じた色付けを実施
        // ここでも合算された色を更新するために`partTotals`を使って色を適用
        const totalForPart = partTotals[training.part];
        changeColorForPart(training.part, totalForPart);
    });

    console.log(`ユーザーID ${userId} のトレーニングデータが表示されました。`);
} else {
    console.error("exerciseList 要素が見つかりません。"); // エラー時のログ出力
}

// 部位に色を付ける関数
function changeColorForPart(part, totaltimeorreps) {
    let color;

    // トレーニング量に基づいて色の濃さを決定 (4段階)
    if (totaltimeorreps < 30) {
        color = 'rgba(255, 0, 0, 0.2)'; // 薄い赤
    } else if (totaltimeorreps >= 30 && totaltimeorreps < 60) {
        color = 'rgba(255, 0, 0, 0.4)'; // 少し濃い赤
    } else if (totaltimeorreps >= 60 && totaltimeorreps < 90) {
        color = 'rgba(255, 0, 0, 0.6)'; // 中間の赤
    } else if (totaltimeorreps >= 90) {
        color = 'rgba(255, 0, 0, 0.8)'; // 濃い赤
    }

    // 部位ごとのSVG要素に色を適用
    switch (part) {
        case '右腕':
            document.getElementById('rightarms').style.fill = color; // 右腕
            break;
        case '左腕':
            document.getElementById('leftArm').style.fill = color; // 左腕
            break;
        case '胸筋':
            document.getElementById('chest').style.fill = color; // 胸筋
            break;
        case '腹筋':
            document.getElementById('abs').style.fill = color; // 腹筋
            break;
        case '右脚':
            document.getElementById('rightlegs').style.fill = color; // 右脚
            break;
        case '左脚':
            document.getElementById('leftlegs').style.fill = color; // 左脚
            break;
        case '頭':
            document.getElementById('head').style.fill = color; // 頭
            break;
        default:
            console.log('Unknown part: ' + part); // 想定外の部位をログ出力
            break;
    }
}   
}
async function fetchTrainig(trainingId){
    const response =   await fetch(`https://karadanipi-su-api.onrender.com/trainings/${trainingId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    if(response.ok){
       
        const data = response.json();
        return data;
    }else{
        
        return null;
    }
}



async function createFirstFoodDate(userId){
    const requestData = {
        userid: userId,
        breakfast: '',
        lunch: '',
        dinner: '',
    };
    const response =  await fetch(`https://karadanipi-su-api.onrender.com/foods`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    });
    if (response.ok) {
        const data =  response.json();
        return data;
    } else {
        console.error('Failed to create data:', response.status);
        return null;
    }
}

async function createFirstTrainingHistories(userId){
    const requestData = {
        userid: userId,
        trainingidlist:[],
    };
    const response =  await fetch(`https://karadanipi-su-api.onrender.com/traininghistories`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    });
    if (response.ok) {
        const data =  response.json();
        return data;
    } else {
        console.error('Failed to create data:', response.status);
        return null;
    }
}
