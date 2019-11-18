window.onload = () => {
  const video  = document.querySelector("#camera");
  const canvas = document.querySelector("#picture");
  const se     = document.querySelector('#se');

  /** カメラ設定 */
  video.width=300; video.height=200;
  canvas.width=300; canvas.height=200;
  const constraints = {
    audio: false,
    video: {
      // width: 300,
      // height: 200,
      facingMode: "user"   // フロントカメラを利用する
      // facingMode: { exact: "environment" }  // リアカメラを利用する場合
    }
  };

  /**
   * カメラを<video>と同期
   */
  navigator.mediaDevices.getUserMedia(constraints)
  .then( (stream) => {
    video.srcObject = stream;
    video.onloadedmetadata = (e) => {
      video.play();
    };
  })
  .catch( (err) => {
    console.log(err.name + ": " + err.message);
  });

  /**
   * シャッターボタン押下時のオールバックメソッド設定
   */
  document.querySelector("#shutter").addEventListener("click", () => {
    const ctx = canvas.getContext("2d");

    // 演出的な目的で一度映像を止めてSEを再生する
    video.pause();  // 映像を停止
    se.play();      // シャッター音
    setTimeout( () => {
      video.play();    // 0.5秒後にカメラ再開
    }, 500);

    // canvasに画像を貼り付ける
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    //アンカータグを作成
    let anchor = document.createElement('a');
    //canvasをJPEG変換し、そのBase64文字列をhrefへセット
    anchor.href = canvas.toDataURL('image/jpeg', 0.85);

    // 画像ファイルダウンロードしたい場合、処理を呼び出し
    // downloadPicture(anchor);

    // 画像ファイル保存処理したい場合、処理を呼び出し
    savePicture(anchor.href);

  });
};
/**
 * ファイルダインロード処理
 */
function downloadPicture(anchor){
  //ダウンロード時のファイル名を指定
  anchor.download = 'download.jpg';
  //クリックイベントを発生させる
  anchor.click();
}
/**
 * ファイル保存処理
 */
function savePicture(data){
    console.log(data);
    // Base64のデータのみが入っている。
    let b64 = data.split( ',' )
    let b64img = b64[ 1 ];
    // npm i urlsafe-base64 でインストールしたモジュール。
    let base64 = require('urlsafe-base64');
//    base64 = b64.replace(/ /g, '+');
    // これでBase64デコードするとimgにバイナリデータが格納される。
//    let img = base64.decode( b64img );

    // npm i fs でインストールしたモジュール。
    let fs = require('fs');
    // 試しにファイルをsample.jpgにして保存。Canvasではjpeg指定でBase64エンコードしている。
    fs.writeFile('sample.jpg', b64img, "base64", function (err) {
        console.log(err);
    });
}