document.addEventListener("DOMContentLoaded", function() {
    // 今日の日付の表示
    const today = new Date();
    const formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    document.getElementById('today').textContent = formattedDate;

    initializeChart();
});

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
    updateChart();
}

let myLineChart;
let weightData = {}; // 初期値は空のオブジェクト
 
// データベースから体重データを取得してオブジェクトに変換する
async function loadWeightData() {
    try {
        const response = await fetch('https://karadanipi-su-api.onrender.com/users'); // 適切なAPIエンドポイントに置き換える
        if (response.ok) {
            const data = await response.json();
 
            // データベースの結果をweightDataに変換
            weightData = data.reduce((acc, item) => {
                acc[item.date] = item.weight;
                return acc;
            }, {});
            console.log("体重データがロードされました:", weightData);
        } else {
            console.error("体重データの取得に失敗しました:", await response.text());
        }
    } catch (error) {
        console.error("エラーが発生しました:", error);
    }
}
 
// データベースに体重データを保存する関数
async function saveWeightData(date, weight) {
    try {
        const response = await fetch('https://karadanipi-su-api.onrender.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: 1, // ユーザーIDを適宜変更
                date: date,
                weight: weight,
            }),
        });
 
        if (response.ok) {
            console.log("体重データが保存されました");
 
            // ローカルのweightDataを更新
            weightData[date] = weight;
 
            // 最大7件に制限
            const dates = Object.keys(weightData).sort(); // 日付順にソート
            if (dates.length > 7) {
                delete weightData[dates[0]]; // 最も古いデータを削除
            }
        } else {
            console.error("体重データの保存に失敗しました:", await response.text());
        }
    } catch (error) {
        console.error("エラーが発生しました:", error);
    }
}
// ページロード時の処理
window.onload = async function () {
    await loadWeightData(); // データベースから体重データをロード
};
// let myLineChart;
// let weightData = JSON.parse(localStorage.getItem('weightData')) || {}; //weightDataはオブジェクト形式。日付としてdata、値として体重（wight）
// //ページ読み込み時にweightDataをlocalStorageから取得している
 
// // 体重データを7日分に制限して保存する関数
// function saveWeightData(date, weight) {
//     weightData[date] = weight;
 
//     // 7件を超えた場合は古いデータを削除
//     const dates = Object.keys(weightData);
//     if (dates.length > 7) {
//         delete weightData[dates[0]]; // 最も古いデータを削除
//     }
 
//     // 更新後のデータを保存
//     localStorage.setItem('weightData', JSON.stringify(weightData));
// }
 
// グラフの初期化関数
function initializeChart() {
    const ctx = document.getElementById('lineChart').getContext('2d');
    const recentData = getRecentWeightData(); //X軸（日付）とY軸（体重）のデータを取得
 
    myLineChart = new Chart(ctx, {   //new Chart(ctx, {　で取得したデータをもとに折れ線グラフを生成し、myLineChartに代入してる
        type: 'line',  //折れ線グラフにさせる
        data: {
            labels: recentData.dates,  // x軸に表示する日付
            datasets: [{
                label: '体重',
                data: recentData.weights,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,  // 線の太さ
                tension: 0.1  // 線の曲がり具合
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,  // y軸を0から始める
                    ticks: {
                        stepSize: 10  // y軸の目盛りの間隔を1に設定
                    }
                }
            }
        }
    });
}
 
// 最新の7日間の体重データを取得する関数
function getRecentWeightData() {  //getRecentWeightData関数を使って保存されたWightDataを表示させる
    const dates = Object.keys(weightData).slice(-7); // 最新の7件を取得
    const weights = dates.map(date => weightData[date]);  // その日付に対応する体重データを取得
 
    return { dates, weights };
}
 
// 日間グラフ表示関数
function showDailyChart() {
    const recentData = getRecentWeightData();
    myLineChart.data.labels = recentData.dates;
    myLineChart.data.datasets[0].data = recentData.weights;
    myLineChart.update(); //updateでグラフ更新
}
 
// 週間グラフ表示関数
function showWeeklyChart() {
    let dates = Object.keys(weightData).slice(-7); // 最新の7日分を取得
    let weights = dates.map(date => weightData[date]);
 
    // 7日間記録されていない場合、空のデータを表示
    if (dates.length < 7) {
        dates = Array(7).fill('');
        weights = Array(7).fill(null);  // nullにすることでグラフに空のデータを表示
    }
 
    // 7日間記録が完了した場合、最終日のデータを週間に反映
    if (dates.length === 7) {
        const latestWeight = weights[weights.length - 1];
        myLineChart.data.labels = dates;
        myLineChart.data.datasets[0].data = weights;
        myLineChart.update(); // 週間グラフを更新
    } 
}
 
// 最終日の体重を表示する関数
function showLatestWeight(weight) {
    const latestWeightElement = document.getElementById("latest-weight"); //最終日の記録を表示させるためにlatest-weightをHTMLにも組み込んでいる
    if (latestWeightElement) {
        latestWeightElement.textContent = `最終日の体重: ${weight} kg`;
    }
}
 

 
// グラフの更新関数
function updateChart() {
    showDailyChart(); // デフォルトは日間グラフで更新
}
 
// ボタンがクリックされた時の関数
function days_id() {
    showDailyChart(); // 日間ボタンをクリックしたら日間グラフを表示
}
 
function week_id() {
    showWeeklyChart(); // 週間ボタンをクリックしたら週間グラフを表示
}