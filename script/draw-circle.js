
// タッチイベントを取得する要素を取得

// Canvas要素を取得する
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Canvasの背景色を設定する
//context.fillStyle = 'white';
//context.fillRect(0, 0, canvas.width, canvas.height);
context.clearRect(0, 0, canvas.width, canvas.height);           //20251222

// Canvasに円を描く関数(スタンプと重ならない様に、x,y座標を1/2にして、中央に寄せる)
function drawCircle(x, y, index, color) {
    // 円を描画する座標を決定
    const circleX = (x / 2) + (canvas.width / 4); // x座標を1/2にし、canvas.width/4だけ中央に寄せる
    const circleY = (y / 2) - (canvas.height / 8) ; // y座標を1/2にし、canvas.height/8だけ上げる
    const radius = 10; // 円の半径
    //const circleColor = color;  //円の色を指定

    // 円を描画
    context.fillStyle = color; // 塗りつぶし色を設定する
    context.beginPath(); // 新しいパスを開始
    context.arc(circleX, circleY, radius, 0, Math.PI * 2, true); // 円を描画するパスを追加
    context.fill(); // 円を塗りつぶす
    context.closePath();

    // 中心にindexを描画
    context.fillStyle = "white"; // 文字色を設定する
    context.font = 'bold 20px serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    lastChar =  Math.abs(index % 10);                     //Indexの10で割った余りで、indexの１桁目を取ってくる（iPhoneの対応）
    context.fillText(lastChar, circleX, circleY);


    //console.log("circles: " + circles);
}

// touchmoveイベントが発生したときに呼び出される関数
function handleTouchs(event) {
    // タッチポイント表示を消去、canvasをクリア    
    context.clearRect(0, 0, canvas.width, canvas.height);

    // タッチされたすべての座標情報を含むTouchListオブジェクトを取得する
    const touches = event.touches;

    if (touches.length > 0 ) {

        // タッチ情報を1つずつ処理する
        let totalX = 0;
        let totalY = 0;
        for (let i = 0; i < touches.length; i++) {
            // 青い円を描画する
            drawCircle(touches[i].clientX,touches[i].clientY,touches[i].identifier,'blue');
            // 重心の座標を計算するために、タッチ座標を合計する
            totalX += touches[i].clientX;
            totalY += touches[i].clientY;
        }
        let centroidX=totalX/touches.length;
        let centroidY=totalY/touches.length;
        // 重心の赤い円を描画する        
        drawCircle(centroidX,centroidY,touches.length,'red');

    } 
    return ;
}

// タッチイベントを取得する要素を取得
function bindTouchListeners() {
    const touch = document.getElementById('touch');
    if (!touch) return false;

    touch.addEventListener('touchstart', handleTouchs, { passive: true });
    touch.addEventListener('touchmove', handleTouchs, { passive: true });
    touch.addEventListener('touchend', handleTouchs, { passive: true });
    touch.addEventListener('touchcancel', handleTouchs, { passive: true });
    return true;
}

// カード認識ライブラリが #touch を追加するまで待つ
if (!bindTouchListeners()) {
    const observer = new MutationObserver(() => {
        if (bindTouchListeners()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true });
}
