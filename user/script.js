//データ表示関数
// function renderFoodList(data) {
//     const FoodList = document.getElementById('FoodList');
//     FoodList.innerHTML = ''; // リストを初期化

//     data.forEach(Food => {
//       const listItem = document.createElement('li');
//       const username = UserData[Food.userid] || '不明なユーザー';
//       listItem.innerHTML = `ユーザー名: ${username}<br> | 朝食: ${Food.breakfast}<br> | 昼食: ${Food.lunch}<br> | 夕食: ${Food.dinner}`;
//       listItem.classList.add('Foodset');

//       listItem.style.textAlign = 'left';  // 左寄せ

     
//       FoodList.appendChild(listItem);
//     });
//   }

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
        alert(data.message); // 成功メッセージをアラートで表示
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
        alert(data.message); // 成功メッセージをアラートで表示
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
    const formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
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
        const bkcal = document.getElementById('kcal-breakfast').value;
        localStorage.setItem('kcal-breakfast', bkcal);
        const lkcal = document.getElementById('kcal-lunch').value;
        localStorage.setItem('kcal-lunch', lkcal);
        const dkcal = document.getElementById('kcal-dinner').value;
        localStorage.setItem('kcal-dinner', dkcal);
        //alert('食事のデータが保存されました!');  
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

        


// // ページ読み込み時に目標データをロード
// window.onload = function() {
//     loadmokuhyouData(); // 目標データをロード

//     // 必要に応じてユーザーIDを指定して目標を表示
//     const userId = 2; // ここに表示したいユーザーIDを指定
//     displayMokuhyou(userId); // 指定されたユーザーIDの目標を表示
// };


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
    updateChart();
}

//チャート系入れ物
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
        alert(result.message); // 結果をユーザーに通知
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


//チャート関数

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
 
// 日間週間の関数
function days_id() {
    showDailyChart(); // 日間ボタンをクリックしたら日間グラフを表示
}
 
function week_id() {
    showWeeklyChart(); // 週間ボタンをクリックしたら週間グラフを表示
}


function saveFood() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = Number(urlParams.get('userId')); // userIdを数値として取得
    const  savedData_breakfast = localStorage.getItem('text-breakfast');
    const  savedData_lunch = localStorage.getItem('text-lunch');
    const  savedData_dinner = localStorage.getItem('text-dinner');
    const  savebkcal = localStorage.getItem('kcal-breakfast');
    const  savelkcal = localStorage.getItem('kcal-lunch');
    const  savedkcal = localStorage.getItem('kcal-dinner');

    // リクエストの内容を設定
    const requestData = {
    userid: userId,
    breakfast: savedData_breakfast,
    lunch: savedData_lunch,
    dinner: savedData_dinner,
    bkcal: savebkcal,
    lkcal: savelkcal,
    dkcal: savedkcal,
    };

    console.log(requestData)

    fetch('https://karadanipi-su-api.onrender.com/foods', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(requestData)
})
.then(response => response.json())
.then(data => {
    alert('データが保存されました！'+requestData);
    console.log('サーバーからの応答:', data);
})
.catch(error => {
    console.error('エラー:', error);
    alert('データの保存に失敗しました:' + error.message);
});
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
        const savebkcal = data.bkcal;
        const savelkcal = data.lkcal;
        const savedkcal = data.dkcal;

 
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
        if (savebkcal) {
            document.getElementById('kcal-breakfast').value = savebkcal;
        }
        if (savelkcal) {
            document.getElementById('kcal-lunch').value = savelkcal;
        }
        if (savedkcal) {
            document.getElementById('kcal-dinner').value = savedkcal;
        }
    })
    .catch(error => {
        console.error('エラー:', error);
        alert('データの取得に失敗しました。');
    });
}

//ここ二つロード時やらせる
// function fetchUsers() {
//     return fetch('https://karadanipi-su-api.onrender.com/users')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('ネットワークのエラーが発生しました');
//         }
//         return response.json();
//       })
//       .then(data => {
//         data.forEach(user => {
//           UserData[user.userid] = user.username, user.mokuhyou, user.height, user.weight; // ユーザーIDをキーにusernameを保存
//         });
//       })
//       .catch(error => {
//         console.error('ユーザーデータ取得エラー:', error);
//         alert('ユーザーデータの取得に失敗しました');
//       });
//   }


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

  
// function fetchFoods() {
//     return fetch('https://karadanipi-su-api.onrender.com/foods')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('ネットワークのエラーが発生しました');
//         }
//         return response.json();
//       })
//       .then(data => {
//         // 各ユーザーの最新の食事データを取得
//         data.forEach(food => {
//           // ユーザーのIDを使ってFoodDataを更新
//           // もしFoodDataにそのユーザーのデータがない、または新しい食事データがある場合に更新
//           if (!FoodData[food.userid] || new Date(FoodData[food.userid].created_at) < new Date(food.created_at)) {
//             FoodData[food.userid] = {
//               breakfast: food.breakfast,
//               lunch: food.lunch,
//               dinner: food.dinner,
//               created_at: food.created_at  // 最新のcreated_atも保存
//             };
//           }
//         });
//       })
//       .catch(error => {
//         console.error('食事データ取得エラー:', error);
//         alert('データの取得に失敗しました');
//       });
//   }

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

    // リクエストの内容を設定（空のプロパティは含めない）
    const requestData = {
        userId: userId,
        height: numberheight || null, // 数値がない場合はnull
        weight: numberweight || null // 数値がない場合はnull
    };

    // 1. `users`テーブルに目標を保存するリクエスト
    if (textmoku) {
        const userUpdateData = { mokuhyou: textmoku };
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
    
                // 保存成功後に目標を表示
                const mokuhyouDiv = document.getElementById('mokuhyou');
                mokuhyouDiv.textContent = `${textmoku}`;
            })
            .catch(error => {
                console.error('ユーザー目標の保存エラー:', error);
                alert('ユーザー目標の保存に失敗しました: ' + error.message);
            });
        }
    
        // 2. `history`テーブルに身長と体重を保存するリクエスト
        if (numberheight || numberweight) { // 身長か体重のどちらかが入力されている場合に送信
            const historyData = {
                userId: userId,
                height: numberheight || null, // 数値がない場合はnull
                weight: numberweight || null // 数値がない場合はnull
            };
    
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
                alert('身長と体重が履歴に保存されました！');
            })
            .catch(error => {
                console.error('履歴の保存エラー:', error);
                alert('身長と体重の履歴保存に失敗しました: ' + error.message);
            });
        }
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

    try {
        const response = await fetch(`https://karadanipi-su-api.onrender.com/traininghistories/recent/${userId}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            console.log(response.status)
            todayTrainingHistory = await response.json();
        }else{
            console.log('response.status')
            console.log(response.status)
            console.log('トレーニングヒストリーデータなし')
            todayTrainingHistory = createFirstTrainingHistories(userId);              
        }

    } catch(error){
        console.error('Error init traininghistories data:', error);
    }

    console.log(todayFood)
    console.log(todayTrainingHistory)

    for (i=0 ;i < todayTrainingHistory.trainingidlist.length; i ++) {
       const training = await fetchTrainig(todayTrainingHistory.trainingidlist[i]);
       todayTrainingList.push(training);
    }
    const exerciseList = document.getElementById('exerciseList'); // トレーニングデータを表示する要素

    console.log(todayTrainingList.length);
    if (exerciseList) {
        exerciseList.innerHTML = ''; // 既存の内容をクリア

        todayTrainingList.forEach(training => {
            
            const item = document.createElement('div');
                    
                    // reps または seconds のどちらが入っているか確認
            const detail = training.reps ? `${training.reps} 回` : `${training.seconds} 秒`;

            item.textContent = `${training.part}: ${training.exercise} - ${detail} × ${training.sets} セット`;

                    // リストの末尾に追加
            exerciseList.appendChild(item);
        });

        console.log(`ユーザーID ${userId} のトレーニングデータが表示されました。`);
    } else {
        console.error("exerciseList 要素が見つかりません。");
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
        bkcal: '',
        lkcal: '',
        dkcal: '',
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
