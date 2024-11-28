function modoru() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = Number(urlParams.get('userId')); // userIdを数値として取得
    window.location.href = `../user/index.html?userId=${userId}`;
  }