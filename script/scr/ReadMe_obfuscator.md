# C-Card SDK用アナライザのJavaScriptソース難読化

## 概要
  - PKBから引継いだC-Card、C-StampのJavaScriptソースコードの難読化処理についてのみ直し
  - PKB引継ぎ内容
    - 難読化サイト：https://obfuscator.io/
    - このサイトのデフォルト設定で難読化することをPKBからT/T受けたが、20260106時点で難読化ページ自体、Windows11のセキュリティーの更新により、難読化後のソースファイルがウイルス判定されてしまう。
    - このため、このページでの難読化は、20260106以降のアナライザアップデートには用いず、npmで行う方針。

## 今後のSDKのJavaScriptファイルの難読化
  - npm版のjavascript-obfuscatorを採用
    - Node.js 環境で使える JavaScript 難読化ツール
    - obfuscator.io の 元エンジン
    - CLI / API 両対応
    - 商用利用可（MIT License）

## インストール方法（Git bash here 等でコンソール上で実行）
  ```
  $ npm install -g javascript-obfuscator
  ```
	
## 使用方法（Git bash here 等でコンソール上で実行）
  - /scrの下で行う。

    - 単独ファイルの場合のコマンド
        ```
        $ npx javascript-obfuscator input.js --output output.js --config obfuscator.config.json
        ```  

    - 複数ファイルの場合(PCで行う場合。Linuxでは出来ないので、単独ファイルで1ファイルづつ行う。)
        ```
        $npx javascript-obfuscator src/ --output dist/
        ```
	
    - jsonに設定パラーメータを記載して、それに従い難読化する場合(上手く行かない)
        ```
        $npx javascript-obfuscator src/ --output dist/ --config obfuscator.config.json
        ```

    - **実際のコマンド入力は、/scrの下で1ファイル毎に以下のコマンド入力で作成**
        ```
        $ npx javascript-obfuscator analyzerm-s1t4u3.js --output analyzerm-s1t4u3-ob.js --config obfuscator.config.json
        $ npx javascript-obfuscator cardrm-s1t4u3.js --output cardrm-s1t4u3-ob.js --config obfuscator.config.json
        ```        
  - 難読化前のソースファイルは、/before-scrに必ず保管すること。

## 設定jsonファイル内容
  - obfuscator.config.json
  ```
        {
            "compact": true,
            "renameGlobals": true,
            "stringArray": true,
            "stringArrayEncoding": ["base64"],
            "stringArrayThreshold": 0.5,
            "controlFlowFlattening": false,
            "deadCodeInjection": false,
            "selfDefending": false,
            "debugProtection": false,
            "reservedNames": ["^Analyze$","^cardConfMap$","^convertConf$","^analyzeCard$","^MTCardConfig$"]
        }
  ```
## SDK用ソース化
  - 3つあるアナライザ用ソースファイルは、夫々以下の処理を行う。
    + analyzerm-s1t4u3.js は、難読化後バージョンのコメントを追加して、analyzerm-s1t4u3-ob.jsを使用する。
    + cardrm-s1t4u3.js は、難読化後バージョンのコメントを追加して、さらに、雛形のphpコードを先頭行にコピペして、ファイル名をcardrm-s1t4u3-ob.phpに変更する。
    + ctrlrm.js は、難読化しないでそのまま使用する。（変更可能なパラメータや、関数が入っているため）

