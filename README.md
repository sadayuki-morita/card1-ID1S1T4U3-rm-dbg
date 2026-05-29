# card1-ID1S1T4U3-rm-dbg

- タッチ方向判定×動作判定可能なアナライザのデバッグ用ディレクトリ
- デバッグのため、アナライザのパラメータ設定を変えた組み合わせで期待値通りに動作するかを検証する設定一式のHTML
- デバッグ後にソースファイルの難読化を/scrの下で行う。

## ディレクトリ構造

    card1-ID1S1T4U3-rm-dbg  
      - /css
      - /img  ：画像をデモ仕様毎に格納、Git管理しない  
      - /res/beeps  :反応音、Git管理しない
      - /script  ：ID認証アナライザ、IDコードリストのソース、完成したアナライザソースファイルはこの直下に置く
          - /before-scr  : 難読化前のソースファイルを格納 
          - /scr  : 難読化実施ディレクトリ
          　　- obfuscator.config.json  : 難読化設定ファイル（変更不可変数を記載）
          - /c  : IDコードリスト 
      - 判定仕様検証HTML群 index.html等
      − confv8_IDselect_gen_20260528.html  : IDコードリストファイル作成用HTML
      - .gitignore
      - README.md
  


## タッチ方向判定、動作判定仕様

- 動作モード変更パラメータ
    1. callbacksのreturn : 同一ページ内での書替表示とURL遷移の選択  
        + false : 別のURLにページ遷移するときに設定する。現状のページを書替えない。アナライザのタッチ解析を止める。  
        + true  : divのidに対応するposition、classにvariable_contentsが指定されたブロックがある場合、当該ページのままそのブロックのコンテンツに画面を書換える。  
                タッチ方向判定、動作判定を行う場合、  
                    cardConf.cardIdNumにIDを設定した場合、  divのid : 'cardId + "_" + _cardConf.elemIdPrefix + position'    (例："S1-234_i10"、fixPosition=trueなら、"S1-234_i1")  
                    cardConf.cardIdNumにIDを設定しない場合、divのid : '_cardConf.elemIdPrefix + position'   (例："i10"、fixPosition=trueなら、"i1")  
                タッチ方向判定、動作判定を行わない場合、  
                    cardConf.cardIdNumにIDを設定した場合、  divのid : 'cardId + "_" + _cardConf.elemIdPrefix + "1"'     (例："S1-234_i1")  
                    cardConf.cardIdNumにIDを設定しない場合、divのid : '_cardConf.elemIdPrefix + "1"'    (例："i1")  
                variable_contentsが指定されたブロックが無い場合、callbacks[position]のfunctionを実行、その中で、個別にtext,file等を書換える。  
                アナライザのタッチ解析を継続。  

    2. cardConf.fixPosition : callbacksの認証結果オブジェクトキー制御
        + false : タッチ方向判定、動作判定を有効にした場合、アナライザ解析後、判定結果に対応したcallbacks[position]のコールバック関数を実行する。
        + true  : タッチ方向判定、動作判定を有効にした場合でも、アナライザ解析後、いつでもcallbacks['1']のコールバック関数を実行する。
                この場合、タッチ方向、動作判定結果は、cardId = ID番号-position (例：S1-1306-24) としてコールバックされる。  
        ＊タッチ方向判定、動作判定を行わない場合、fixPositionがtrue/falseに関わらず、callbacks['1']で、cardId = ID番号となる。  

    3. cardConf.rotationDetect : カードのタッチ方向判定有無変数
        + 0 : タッチ方向判定を行わない。
        + 1 : タッチ方向判定を行う。タッチパネルX座標に対して、IDパタン座標系を  
              0度(±cardConf.rotationThresholdAngle=30)にした場合、position = 10  
              90度(±cardConf.rotationThresholdAngle=30)にした場合、position = 20  
              180度(±cardConf.rotationThresholdAngle=30)にした場合、position = 30  
              -90度(±cardConf.rotationThresholdAngle=30)にした場合、position = 40    

    4. cardConf.motionDetectNum[0,0,0,0,0,0,0,0] : カードの閾値動作判定および疑似アナログ動作判定有無変数配列
        - 閾値動作判定は、最初のID認証5ポイントの重心座標が、ID認証状態で規定の閾値幅動いた場合に指定のcallbacks[position]のコールバック関数を実行する。  
        - 閾値幅は、タッチパネル座標のX方向：cardConf.motionThresholdGridX 、Y方向：cardConf.motionThresholdGridY 、回転角度：cardConf.motionThresholdAngle で変更可能。初期値は、カード1Grid=6.7mm、および15度  
        - 疑似アナログ動作判定は、閾値動作判定の閾値幅を1/20に縮め、判定OKでコールバック関数実行後も連続して判定を行う。  
            motionDetectNum[0] = 動作判定有無変数　0 : 動作判定無し / 1 : 閾値動作判定有 / 2 : 疑似アナログ動作判定有、以降の要素も同一  
            motionDetectNum[1] = 未使用 −1(動作判定有り) or 0 (動作判定なし)  
            motionDetectNum[2] = 下側(+Y座標方向)動作判定、判定OKの場合、position = 2  
            motionDetectNum[3] = 上側(-Y座標方向)動作判定、判定OKの場合、position = 3  
            motionDetectNum[4] = 左側(-X座標方向)動作判定、判定OKの場合、position = 4  
            motionDetectNum[5] = 右側(+X座標方向)動作判定、判定OKの場合、position = 5  
            motionDetectNum[6] = 右回転(時計回り)動作判定、判定OKの場合、position = 6  
            motionDetectNum[7] = 左回転(半時計回り)動作判定、判定OKの場合、position = 7  
        ＊例えば、上下を閾値制御、左右回転をアナログ制御したい場合は、motionDetectNum = [2,-1,1,1,0,0,2,2] と指定する。  
        　また、motionDetectNum[0]=0 の場合、以降の要素に"1"または"2"としても実行されない。motionDetectNum[0]=1 or 2 とした場合、以降の要素に少なくとも1つは"1"または"2"がなければならない。  

    ＊タッチ方向判定と動作判定を同時に有効化した場合、判定OKの場合、position にはタッチ方向判定結果のposition値と動作判定結果のosition値を足した値となる。  
    　例えば、90度の横向きで右側に動かし判定OKとなった場合、position = 25 となる。  


- 動作モード変更パラメータ、コード記述と動作モード対応および検証したHTMLページ  
　　　　　　　　     パラメータ  
  |No.|HTML名称|callbacksのreturn|fixPosition|rotationDetect|motionDetectNum[0]|cardIdNum|`<div class="">`|URL遷移|動作モード|position数|表示|  
  |---|---|---|---|---|---|---|---|---|---|---|---|  
  |a |index|true|false|0|0|[]|variable_contents|無|ID判定|1|認識ID出力|  
  |b |index0|true|false|1|1|[]|無|無|IDxタッチ方向x動作判定|24|認識ID、タッチ方向、動作判定値出力|  
  |c |index1|true|false|1|1|[Id1,Id2,Id3]|variable_contents|無|IDxタッチ方向x動作判定|72|認識ID、タッチ方向、動作判定値出力|  
  |f |indexTR|true|true|1|0|[]|variable_contents|無|タッチ方向判定|1|認識ID、タッチ方向出力|    
  |1 |indexFF00|false|false|0|0|[]|無|有|ID判定|1|URLページ|  
  |2 |indexFF01|false|false|0|1|[]|無|有|IDx動作判定|6|URLページ|  
  |3 |indexFF10|false|false|1|0|[]|無|有|IDxタッチ方向判定|4|URLページ|  
  |4 |indexFF11|false|false|1|1|[]|無|有|IDxタッチ方向x動作判定|24|URLページ|  
  |5 |indexFT00|false|true |0|0|[]|無|有|ID判定|1|URLページ No.1同一|
  |6 |indexFT01|false|true |0|1|[]|無|有|IDx動作判定 |6|URLページ|  
  |7 |indexFT10|false|true |1|0|[]|無|有|IDxタッチ方向判定 | 4|URLページ|  
  |8 |indexFT11|false|true |1|1|[]|無|有|IDxタッチ方向x動作判定 |24|URLページ|  
  |9 |indexTF00|true |false|0|0|[]|variable_contents or 無|無|ID判定|1|判定毎contents切替 or text,file書換  非推奨|
  |10|indexTF01|true |false|0|1|[]|variable_contents or 無|無|IDx動作判定 |6|判定毎contents切替 or text,file書換  非推奨|
  |11|indexTF10|true |false|1|0|[]|variable_contents or 無|無|IDxタッチ方向判定|4|判定毎contents切替 or text,file書換  非推奨|
  |12|indexTF11|true |false|1|1|[]|variable_contents or 無|無|IDxタッチ方向x動作判定|24|判定毎contents切替 or text,file書換  非推奨|
  |13|indexTT00|true |true |0|0|[]|variable_contents or 無|無|ID判定|1|1種類contents切替 or text,file書換|
  |14|indexTT01|true |true |0|1|[]|variable_contents or 無|無|IDx動作判定 |6|1種類contents切替 or text,file書換|
  |15|indexTT10|true |true |1|0|[]|variable_contents or 無|無|IDxタッチ方向判定 |4|1種類contents切替 or text,file書換|
  |16|indexTT11|true |true |1|1|[]|variable_contents or 無|無|IDxタッチ方向x動作判定|24|1種類contents切替 or text,file書換|
  |17|indexNFF00|false|false|0|0|[Id1,Id2,..]|無|有|ID判定|1|URLページ|  
  |18|indexNFF01|false|false|0|1|[Id1,Id2,..]|無|有|IDx動作判定|6|URLページ|  
  |19|indexNFF10|false|false|1|0|[Id1,Id2,..]|無|有|IDxタッチ方向判定|4|URLページ|  
  |20|indexNFF11|false|false|1|1|[Id1,Id2,..]|無|有|IDxタッチ方向x動作判定|24|URLページ|  
  |21|indexNFT00|false|true |0|0|[Id1,Id2,..]|無|有|ID判定|1|URLページ No.17同一|
  |22|indexNFT01|false|true |0|1|[Id1,Id2,..]|無|有|IDx動作判定|6|URLページ|  
  |23|indexNFT10|false|true |1|0|[Id1,Id2,..]|無|有|IDxタッチ方向判定|4|URLページ|  
  |24|indexNFT11|false|true |1|1|[Id1,Id2,..]|無|有|IDxタッチ方向x動作判定|24|URLページ|  
  |25|indexNTF00|true |false|0|0|[Id1,Id2,..]|variable_contents or 無|無|ID判定|1|判定毎contents切替 or text,file書換|
  |26|indexNTF01|true |false|0|1|[Id1,Id2,..]|variable_contents or 無|無|IDx動作判定 |6|判定毎contents切替 or text,file書換|
  |27|indexNTF10|true |false|1|0|[Id1,Id2,..]|variable_contents or 無|無|IDxタッチ方向判定|4|判定毎contents切替 or text,file書換|
  |28|indexNTF11|true |false|1|1|[Id1,Id2,..]|variable_contents or 無|無|IDxタッチ方向x動作判定 |24|判定毎contents切替 or text,file書換|
  |29|indexNTT00|true |true |0|0|[Id1,Id2,..]|variable_contents or 無|無|ID判定|1|1種類contents切替 or text,file書換|
  |30|indexNTT01|true |true |0|1|[Id1,Id2,..]|variable_contents or 無|無|IDx動作判定|6|1種類contents切替 or text,file書換|
  |31|indexNTT10|true |true |1|0|[Id1,Id2,..]|variable_contents or 無|無|IDxタッチ方向判定|4|1種類contents切替 or text,file書換|
  |32|indexNTT11|true |true |1|1|[Id1,Id2,..]|variable_contents or 無|無|IDxタッチ方向x動作判定|24|1種類contents切替 or text,file書換|

## 使い方

- 上記パラメータを変更したhtmlで、(1)ID認証、(2)タッチ方向判定、(3)動作判定（疑似アナログ動作込）、(4)タッチ方向×動作判定のデバッグ可能


## アナライザバージョン

- analyzerm-s1t4u3-ob.js  Rev.3.2.6 20260529
- cardrm-s1t4u3-ob.js  Rev.3.0.4 20260204
- ctrlmr.js Rev.3.2.1 20260204
                  

## デモページURL

- https://multi-touchcard.com/card1-ID1S1T4U3-rm-dbg/index.html

## 来歴

- 作成　20250630
- 1次デバッグ完　20250701
- SDKデバッグ用 20251014
- SDKデバッグ用 20251024
- SDKデバッグ用 20251104
- SDKデバッグ用 20251110
- touchendバグ対策アナライザ適用 20260108
- アクスタ、プレート型2次試作IDパターンの180度回転対応  20260226
- デモページ群のディレクトリ構造とSDK他のディレクトリ構造の共用化　20260529
