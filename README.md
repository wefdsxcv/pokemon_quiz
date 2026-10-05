# ポケモンクイズWebサイト

Angularを使用して作成した、ポケモンクイズのWebアプリケーションです。

本アプリケーションは、**インターンシップで「クイズWebサイトを作成する」という題材に取り組んだ際に制作したもの**です。

クイズの題材としてポケモンを選択し、ポケモンの情報を利用した問題を出題するWebサイトを作成しました。

---

## 制作概要

### 制作目的

インターンシップでは、Angularを使用してクイズWebサイトを作成するという課題に取り組みました。

クイズの題材として複数のデータ例が提示されていましたが、その中から**ポケモン**を題材として選択しました。

ポケモンは子どもにも馴染みがある題材であるため、単にクイズを動作させるだけでなく、**小学生低学年などの子どもでも分かりやすく、操作しやすいUI**を意識して制作しました。

---

## 使用技術

* Angular 16
* Angular CLI 16
* TypeScript
* HTML
* SCSS
* Bootstrap 5.2.3
* ng-bootstrap 15
* Angular Material
* RxJS
* Firebase / Firestore
* Git / GitHub

### Angular関連パッケージ

Angular関連のライブラリは、Angular 16系に合わせて導入しています。

```text
@angular/cdk@16
@angular/animations@16
@angular/common@16
@angular/compiler@16
@angular/core@16
@angular/forms@16
@angular/router@16
@angular/material@16
```

---

## 主な機能

### クイズ機能

ポケモンのデータを利用してクイズを出題します。

* ポケモンデータから問題を生成
* 正解・不正解の判定
* 選択肢のシャッフル
* 次の問題への切り替え
* クイズ終了後の結果表示

---

### ログイン・ユーザー機能

* ユーザー登録
* ログイン
* ログアウト
* 認証状態の管理
* AuthGuardによる画面アクセス制御

---

### クイズ設定

クイズを開始する前に、出題条件を設定できるようにしています。

---

### 成績・結果表示

クイズ終了後に、

* 問題数
* 正解数
* 正答率
* 連続正解数

などの結果を確認できます。

また、過去のクイズ結果を利用して成長記録を表示する機能も実装しています。

---

## UIについて

今回のアプリでは、**子どもでも分かりやすく操作できるUI**を意識しました。

特に、小学生低学年でも利用することを想定し、

* 文字を大きくする
* ボタンを押しやすくする
* 画面の役割を分かりやすくする
* 難しい表現をできるだけ避ける
* クイズの問題と選択肢を分かりやすく配置する
* スマートフォンでも操作しやすいレイアウトにする

といった点を意識しています。

単に機能を実装するだけではなく、**実際に利用する人が迷わず操作できるか**という視点でUIを考えました。

---

## アプリケーションの構成

画面と処理の役割を分けることを意識して実装しています。

```text
Component
  ↓
画面表示・ユーザー操作

Service
  ↓
データ取得・処理・Firebaseとの通信

Interface
  ↓
データの型を定義

HTML
  ↓
画面の表示

SCSS
  ↓
画面のデザイン
```

例えば、ポケモンデータは以下のような流れで利用しています。

```text
pokemon.json
    ↓
HttpClient
    ↓
Observable
    ↓
subscribe
    ↓
QuizComponent
    ↓
HTML
    ↓
画面に表示
```

成績については、

```text
クイズ回答
    ↓
QuizResultService
    ↓
Firestore
    ↓
ResultsComponent
    ↓
成績画面
```

という流れで処理しています。

---

## ルーティング

Angular Routerを利用し、画面ごとにモジュールを分けています。

また、必要になった画面を読み込む**Lazy Loading（遅延読み込み）**も利用しています。

基本的な構成は以下のようになっています。

```text
AppComponent
    ↓
AppRoutingModule
    ↓
PagesModule
    ↓
PagesRoutingModule
    ↓
PagesComponent
    ↓
各ページModule
    ↓
各ページComponent
```

例えばHome画面の場合、

```text
/home
  ↓
AppComponent
  ↓
AppRoutingModule
  ↓
PagesModule
  ↓
PagesRoutingModule
  ↓
PagesComponent
  ↓
HomeModule
  ↓
HomeRoutingModule
  ↓
HomeComponent
``
```
