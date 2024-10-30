document.addEventListener("DOMContentLoaded", function() {
    // 今日の日付の表示
    const today = new Date();
    const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}/${today.getDate()}`;
    document.getElementById('today').textContent = formattedDate;

    initializeChart();
});

let myLineChart;
const weightData = JSON.parse(localStorage.getItem('weightData')) || {};

// グラフの初期化関数
function initializeChart() {
    const ctx = document.getElementById('lineChart').getContext('2d');
    myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(weightData),
            datasets: [{
                label: '体重',
                data: Object.values(weightData),
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: false, // レスポンシブを無効にする
            maintainAspectRatio: false, // アスペクト比を維持しない
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 10
                    }
                }
            }
        }
    });
}

// BMI計算関数
function calculateBMI() {
    const userHeight = parseFloat(document.getElementById("user_height").value) / 100;
    const userWeight = parseFloat(document.getElementById("user_weight").value);

    let bmi = 0, idealWeight = 0;

    if (userHeight > 0) { 
        bmi = (userWeight / (userHeight * userHeight)).toFixed(2);
        document.getElementById("result").textContent = bmi;

        idealWeight = (userHeight * userHeight * 22).toFixed(1);
        document.getElementById("heitai").textContent = idealWeight;

        document.getElementById("heibmi").textContent = "22.0";
    } else {
        document.getElementById("result").textContent = "身長は0以外の数値を入力してください。";
    }

    const date = new Date().toISOString().split('T')[0];
    weightData[date] = userWeight;
    localStorage.setItem('weightData', JSON.stringify(weightData));
    updateChart();
    updateWeightChange();
}

// 体重調整関数
function adjustWeight(change) {
    const date = document.getElementById("adjustment_date").value;
    const weightInput = document.getElementById("adjustment_weight");
    let weight = parseFloat(weightInput.value) || 0;

    weight += change;
    weightInput.value = weight.toFixed(1);

    weightData[date] = weight;
    localStorage.setItem('weightData', JSON.stringify(weightData));
    updateChart();
    updateWeightChange();
    displayWeightChange();
}

// グラフの更新
function updateChart() {
    myLineChart.data.labels = Object.keys(weightData);
    myLineChart.data.datasets[0].data = Object.values(weightData);
    myLineChart.update();
}

// 前日比を計算
function updateWeightChange() {
    const weightChangeContainer = document.getElementById("weight_change_container");
    weightChangeContainer.innerHTML = "";

    Object.keys(weightData).forEach(date => {
        const currentWeight = weightData[date];
        const previousDate = new Date(date);
        previousDate.setDate(previousDate.getDate() - 1);
        const previousDateString = previousDate.toISOString().split('T')[0];
        const previousWeight = weightData[previousDateString] || 0;

        const change = currentWeight - previousWeight;
        const changeText = `${date}: ${change >= 0 ? `+${change.toFixed(1)} kg` : `${change.toFixed(1)} kg`}`;
        const changeElement = document.createElement("p");
        changeElement.textContent = changeText;
        weightChangeContainer.appendChild(changeElement);
    });
}
