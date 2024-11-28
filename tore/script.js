async function createTraining(trainingData) {
    try {
        const response = await fetch('https://karadanipi-su-api.onrender.com/trainings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trainingData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('トレーニングデータ作成成功:', data);
            return data;
        } else {
            console.error('トレーニングデータ作成失敗:', response.status);
            return null;
        }
    } catch (error) {
        console.error('トレーニングデータ作成中にエラー:', error);
        return null;
    }
}


async function getTrainingHistory(userId) {
    try {
        const response = await fetch(`https://karadanipi-su-api.onrender.com/traininghistories/recent/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('トレーニング履歴取得成功:', data);
            return data;
        } else {
            // 履歴がない場合、新規作成
            console.warn('トレーニング履歴が見つかりません。新規作成します。');
            const newHistory = await createFirstTrainingHistories(userId);
            return newHistory;
        }
    } catch (error) {
        console.error('トレーニング履歴取得中にエラー:', error);
        return null;
    }
}

async function updateTrainingHistories(userId, trainingData) {
    try {
        // 今日の履歴取得
        const todayTrainingHistory = await getTrainingHistory(userId);

        // トレーニングデータ作成
        const newTraining = await createTraining(trainingData);
        if (!newTraining) {
            alert('トレーニングデータの作成に失敗しました。');
            return;
        }

        // 新しいトレーニングIDを履歴に追加
        const trainingId = newTraining.trainingid;
        const trainingIdList = todayTrainingHistory.trainingidlist || [];
        const trainingHistoryId = todayTrainingHistory.traininghistoryid;

        const newTrainingIdList = [...trainingIdList, trainingId];

        // 更新データの送信
        const updateData = {
            trainingidlist: newTrainingIdList,
            trainingHistoryId: trainingHistoryId,
        };

        const response = await fetch(`https://karadanipi-su-api.onrender.com/traininghistories/${trainingHistoryId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        });

        if (response.ok) {
            console.log('トレーニング履歴更新成功');
            alert('トレーニング履歴が更新されました。');
        } else {
            console.error('トレーニング履歴更新失敗:', response.status);
            alert('トレーニング履歴の更新に失敗しました。');
        }
    } catch (error) {
        console.error('トレーニング履歴更新中にエラー:', error);
        alert('エラーが発生しました。');
    }
}