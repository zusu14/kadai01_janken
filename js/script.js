$(document).ready(function () {
  // 画像とタイトルの対応表（ここでタイトルを指定）
  const images = [
    { src: "img/album01.jpg", title: "エヴリシング" },
    { src: "img/album02.jpg", title: "Kind of Love" },
    { src: "img/album03.jpg", title: "Versus" },
    { src: "img/album04.jpg", title: "Atomic Heart" },
    { src: "img/album05.jpg", title: "深海" },
    { src: "img/album06.jpg", title: "BOLORO" },
    { src: "img/album07.jpg", title: "DISCOVERY" },
    { src: "img/album08.jpg", title: "1/42" },
    { src: "img/album09.jpg", title: "Q" },
    { src: "img/album10.jpg", title: "Mr.Children 1992-1995" },
    { src: "img/album11.jpg", title: "Mr.Children 1996-2000" },
    { src: "img/album12.jpg", title: "IT'S A WONDERFUL WORLD" },
    { src: "img/album13.jpg", title: "シフクノオト" },
    { src: "img/album14.jpg", title: "I ♥ U" },
    { src: "img/album15.jpg", title: "HOME" },
    { src: "img/album16.jpg", title: "B-SIDE" },
    { src: "img/album17.jpg", title: "SUPERMARKET FANTASY" },
    { src: "img/album18.jpg", title: "SENSE" },
    { src: "img/album19.jpg", title: "Mr.Children 2001-2005 &lt;micro&gt;" },
    { src: "img/album20.jpg", title: "Mr.Children 2005-2010 &lt;macro&gt;" },
    { src: "img/album21.jpg", title: "［(an imitation) blood orange］" },
    { src: "img/album22.jpg", title: "REFLECTION｛Naked｝" },
    { src: "img/album23.jpg", title: "REFLECTION｛Drip｝" },
    { src: "img/album24.jpg", title: "重力と呼吸" },
    { src: "img/album25.jpg", title: "SOUNDTRACKS" },
    { src: "img/album26.jpg", title: "Mr.Children 2011 - 2015" },
    { src: "img/album27.jpg", title: "Mr.Children 2015 - 2021 &amp; NOW" },
    { src: "img/album28.jpg", title: "miss you" },
    { src: "img/album29.jpg", title: "miss you" },
  ];

  let flashingInterval;
  let currentRandomIndex;

  // 画像をコンテナに追加
  images.forEach((image, index) => {
    $("#image-container").append(
      `<img src="${image.src}" alt="CDジャケット" class="cd-image" style="display:none;">`
    );
    // console.log("index : " + index);
  });

  // Enterキーで回答をチェック
  $("#title-input").on("keydown", function (e) {
    if (e.key === "Enter") {
      $("#answer-btn").click(); // 回答ボタンのクリックイベントを発火
    }
  });

  // 難易度切り替え
  let isEasyMode = false;

  // EASYボタンのクリックイベント
  $("#easy-btn").click(function () {
    isEasyMode = true;
    $("#easy-btn").addClass("selected-mode");
    $("#hard-btn").removeClass("selected-mode");
    $("#title-input").hide();
    $("#choice-container").show();
  });

  // HARDボタンのクリックイベント
  $("#hard-btn").click(function () {
    isEasyMode = false;
    $("#easy-btn").removeClass("selected-mode");
    $("#hard-btn").addClass("selected-mode");
    $("#title-input").show();
    $("#choice-container").hide();
  });

  // EASYモードの選択肢生成フラグ
  let choicesGenerated = false;

  // フラッシュ表示停止後の処理修正
  $("#stop-btn").click(function () {
    clearInterval(flashingInterval);
    flashingInterval = null;

    if (isEasyMode && !choicesGenerated) {
      generateChoices();
      choicesGenerated = true; // 選択肢が生成されたことを記録
    }
  });

  // フラッシュ表示を開始
  $("#start-btn").click(function () {
    if (flashingInterval) return; // 二重実行防止

    // 回答入力欄をクリア
    $("#title-input").val("");
    $("#result").html(""); // 結果表示もクリア
    choicesGenerated = false; // 新たにスタートしたらリセット

    flashingInterval = setInterval(() => {
      // すべての画像を非表示に
      $(".cd-image").hide();

      // ランダムなインデックスを選択
      currentRandomIndex = Math.floor(Math.random() * images.length);
      console.log("random index : " + currentRandomIndex);

      // ランダムに選ばれた画像を表示
      $(".cd-image").eq(currentRandomIndex).show();
    }, 100);
  });

  // EASYモードの選択肢生成関数
  function generateChoices() {
    const correctTitle = images[currentRandomIndex].title;
    const choices = [correctTitle];

    // 他のランダムタイトルを追加
    while (choices.length < 4) {
      const randomChoice =
        images[Math.floor(Math.random() * images.length)].title;
      if (!choices.includes(randomChoice)) choices.push(randomChoice);
    }

    // 選択肢をランダムにシャッフル
    choices.sort(() => Math.random() - 0.5);

    // 選択肢を表示
    $("#choice-container").html(
      choices
        .map((choice) => `<button class="choice-btn">${choice}</button>`)
        .join("")
    );

    // 選択肢ボタンのクリックイベント
    $(".choice-btn").click(function () {
      $(".choice-btn").removeClass("selected");
      $(this).addClass("selected");
    });
  }
  // HTMLエンティティをデコード（エスケープを元に戻す）
  const decodeHtml = (html) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = html;
    return textArea.value;
  };

  // 結果表示関数（共通化）
  function showResult(text) {
    $("#result-text").html(text);
    $("#result, #result-overlay").fadeIn();
  }

  // 結果非表示関数
  function hideResult() {
    $("#result, #result-overlay").fadeOut();
  }

  // 回答をチェック（EASYモード対応）
  $("#answer-btn").click(function () {
    let userAnswer;

    if (isEasyMode) {
      userAnswer = $(".choice-btn.selected").text();
      console.log("EASYモード - ユーザー回答:", userAnswer);
    } else {
      userAnswer = $("#title-input").val().trim();
      console.log("HARDモード - ユーザー回答:", userAnswer);
    }

    const correctTitle = decodeHtml(images[currentRandomIndex].title);
    console.log("正解タイトル:", correctTitle);

    const resultText =
      userAnswer.toLowerCase() === correctTitle.toLowerCase()
        ? "正解！！ 🎸"
        : `不正解<br>正解は「${correctTitle}」です。`;

    $("#result").html(resultText).fadeIn(); // 結果表示をフェードインで表示
  });
});
