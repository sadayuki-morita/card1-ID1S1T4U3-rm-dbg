// HTMLのデザイン
//
window.addEventListener('resize', resizeCanvases);
window.addEventListener('load', () => {
    resizeCanvases();
});
//
function resizeCanvases() {
    const upperCanvas = document.getElementById('upperCanvas');     //画面上の上半分のcanvas　位置と背景色はCSSで指示
    const lowerCanvas = document.getElementById('lowerCanvas');     //画面上の下半分のcanvas　位置と背景色はCSSで指示
    const width = window.innerWidth;
    const height = window.innerHeight / 2; // 画面の半分

    upperCanvas.width = width;
    upperCanvas.height = height;
    lowerCanvas.width = width;
    lowerCanvas.height = height;

    drawInitCanvasColor(upperCanvas);
    drawInitCanvas(lowerCanvas);
}

function drawInitCanvas(canvas) {
    //const canvas = document.getElementById('upperCanvas');
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    const radiusOuter = Math.min(width, height) / 2;
    const radiusCenter = radiusOuter * 0.4;                 //リセット中心円は、外周円の半径 × 0.3 
    const radiusJudge = radiusOuter * 0.8;                   //アクション判定円は、外周円の半径 × 0.8 
    const centerX = width / 2;
    const centerY = height / 2;

    // キャンバスをクリア
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    // 最大の円を描画
    ctx.arc(centerX, centerY, radiusOuter, 0, Math.PI * 2);
    // 中心の円を描画
    ctx.arc(centerX, centerY, radiusCenter, 0, Math.PI * 2);
    // アクション判定の円を描画
    ctx.arc(centerX, centerY, radiusJudge, 0, Math.PI * 2);
    // 中心を通る縦線を描画
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    // 中心を通る横線を描画
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

}

function drawInitCanvasColor(canvas) {
    //const canvas = document.getElementById('upperCanvas');
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    const radiusOuter = Math.min(width, height) / 2;
    const radiusCenter = radiusOuter * 0.4;                 //リセット中心円は、外周円の半径 × 0.3 
    const radiusJudge = radiusOuter * 0.8;                   //アクション判定円は、外周円の半径 × 0.8 
    const centerX = width / 2;
    const centerY = height / 2;

    const areaAngle = (Math.PI / 180 ) * 45; //判定領域の角度
    const startAngle = (0 - areaAngle / 2); //判定領域の開始角度

    //const areaColor = ["white","red","orange","yellow","green","blue","indigo","violet"]; //判定領域の色
    const areaColor = ["white","violet","indigo","blue","green","yellow","orange","red"]; //判定領域の色

    // キャンバスをクリア
    ctx.clearRect(0, 0, width, height);

    // 判定領域の扇形を描画
    ctx.beginPath();        
    for (let i = 0; i < areaColor.length; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radiusJudge, startAngle+(i*areaAngle), startAngle + ((i+1)*areaAngle),false);

        ctx.closePath();
        //ctx.stroke();
        ctx.fillStyle = areaColor[i];
        ctx.fill();
    }

    ctx.beginPath();
    // 中心の円を描画
    ctx.arc(centerX, centerY, radiusCenter, 0, Math.PI * 2);
    ctx.fillStyle = areaColor[0];
    ctx.fill();
    ctx.closePath();    

    ctx.beginPath();
    // 最大の円を描画
    ctx.arc(centerX, centerY, radiusOuter, 0, Math.PI * 2);
    // 中心の円を描画
    ctx.arc(centerX, centerY, radiusCenter, 0, Math.PI * 2);
    // アクション判定の円を描画
    ctx.arc(centerX, centerY, radiusJudge, 0, Math.PI * 2);
    // 中心を通る縦線を描画
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    // 中心を通る横線を描画
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

}

function downloadPNG(imageUrl, fileName) {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

//================================================================================================================//
// タッチイベントを取得する要素を取得

// Canvas要素を取得する
var canvasFull = document.getElementById('canvasFull');
var context = canvasFull.getContext('2d');

canvasFull.width = window.innerWidth;
canvasFull.height = window.innerHeight;

// Canvasの背景色を設定する
//context.fillStyle = 'white';
//context.fillRect(0, 0, canvas.width, canvas.height);
context.clearRect(0, 0, canvasFull.width, canvasFull.height);           //20251222

// Canvasに円を描く関数(スタンプと重ならない様に、y座標を画面半分上にシフト)
function drawCircleHalf(x, y, index, color) {
    // 円を描画する座標を決定
    const circleX = x;                                  // x座標はそのまま
    //const circleY = y - (canvasFull.height / 2);        // y座標をcanvasFull.height/2だけ上げる
    const circleY = y ;        // y座標もそのまま、オフセットは、handleTouchsSift()で行う
    const radius = 15; // 円の半径
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
}

// touchmoveイベントが発生したときに呼び出される関数
function handleTouchs(event) {
    // タッチポイント表示を消去、canvasをクリア    
    context.clearRect(0, 0, canvasFull.width, canvasFull.height);

    // タッチされたすべての座標情報を含むTouchListオブジェクトを取得する
    const touches = event.touches;

    if (touches.length > 0 ) {

        // タッチ情報を1つずつ処理する
        let totalX = 0;
        let totalY = 0;
        for (let i = 0; i < touches.length; i++) {
            // 青い円を描画する
            drawCircleHalf(touches[i].clientX,touches[i].clientY,touches[i].identifier,'blue');
            // 重心の座標を計算するために、タッチ座標を合計する
            totalX += touches[i].clientX;
            totalY += touches[i].clientY;
        }
        let centroidX=totalX/touches.length;
        let centroidY=totalY/touches.length;
        // 重心の赤い円を描画する        
        if( touches.length > 4 ) {
            drawCircleHalf(centroidX,centroidY,touches.length,'red');
        }
    } 
    return ;
}
var startFlg = 0, derutaX = 0, derutaY =0 ;
// touchmoveイベントが発生したときに呼び出される関数、最初の5点タッチ時に、重心をupperCanvasの中心にシフトさせて、円を描画する関数
function handleTouchsSift(event) {
    // タッチポイント表示を消去、canvasをクリア    
    context.clearRect(0, 0, canvasFull.width, canvasFull.height);

    // タッチされたすべての座標情報を含むTouchListオブジェクトを取得する
    const touches = event.touches;

    //let startFlg = 0, derutaX = 0, derutaY =0 ;

    if (touches.length > 0 ) {
        // タッチ情報を1つずつ処理する
        let totalX = 0;
        let totalY = 0;
        for (let i = 0; i < touches.length; i++) {
            totalX += touches[i].clientX;
            totalY += touches[i].clientY;
        }
        let centroidX=totalX/touches.length;
        let centroidY=totalY/touches.length;
   
        if (startFlg === 0 && touches.length === 5 ) {
            startFlg = 1;
            derutaX = centroidX - canvasFull.width/2;
            derutaY = centroidY - canvasFull.height/4;
        /*
            for (let i = 0; i < touches.length; i++) {
                // 青い円を描画する
                drawCircleHalf(touches[i].clientX-derutaX,touches[i].clientY-derutaY,touches[i].identifier,'blue');
            }
        */
            drawCircleHalf(centroidX-derutaX,centroidY-derutaY,touches.length,'red');
        } else if (startFlg === 1 && touches.length === 5 ) {
        /*
            for (let i = 0; i < touches.length; i++) {
                // 青い円を描画する
                drawCircleHalf(touches[i].clientX-derutaX,touches[i].clientY-derutaY,touches[i].identifier,'blue');
            }
        */
            drawCircleHalf(centroidX-derutaX,centroidY-derutaY,touches.length,'red');
        }
    } else {
        startFlg = 0;
    }
    return ;
}

// タッチイベントを取得する要素を取得
function bindTouchListeners() {
    const touch = document.getElementById('touch');
    if (!touch) return false;

    touch.addEventListener('touchstart', handleTouchsSift, { passive: true });
    touch.addEventListener('touchmove', handleTouchsSift, { passive: true });
    touch.addEventListener('touchend', handleTouchsSift, { passive: true });
    touch.addEventListener('touchcancel', handleTouchsSift, { passive: true });
    return true;
}

// カード認識ライブラリが #touch を追加するまで待つ
if (!bindTouchListeners()) {
    const observer = new MutationObserver(() => {
        if (bindTouchListeners()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true });
}
