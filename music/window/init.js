// 该文件负责做歌曲的初始化操作
// 主要是给 AmplitudeJS 设置一些配置项

Amplitude.init({
  // 配置歌曲
  songs: [
    {
      name: "Gotta Have You",
      url: "../music/Gotta Have You.mp3",
      album: "英文专辑",
      cover_art_url: "../assets/images/GottaHaveYou.jpeg",
      artist: "Stevie Wonder",
      source: "网络",
    },
    {
      name: "K歌之王",
      url: "../music/K歌之王 - 陈奕迅.mp3",
      album: "中文专辑",
      cover_art_url: "../assets/images/陈奕迅.jpeg",
      artist: "陈奕迅",
      source: "网络",
    },
    {
      name: "Give A Little Love",
      url: "../music/M2M - Give A Little Love.mp3",
      album: "英文专辑",
      cover_art_url: "../assets/images/m2m.jpeg",
      artist: "M2M",
      source: "网络",
    },
    {
      name: "Dream",
      url: "../music/Miley Cyrus - Dream.mp3",
      album: "英文专辑",
      cover_art_url: "../assets/images/dream.jpeg",
      artist: "Miley Cyrus",
      source: "网络",
    },
    {
      name: "聚集记忆的时间",
      url: "../music/Nell - 聚集记忆的时间.mp3",
      album: "韩文专辑",
      cover_art_url: "../assets/images/nell.jpg",
      artist: "Nell",
      source: "网络",
    },
    {
      name: "勇气100%",
      url: "../music/光GENJI - 勇气百分百.mp3",
      album: "日文专辑",
      cover_art_url: "../assets/images/勇气百分百.jpeg",
      artist: "光GENJI",
      source: "网络",
    },
    {
      name: "光と影のロマン",
      url: "../music/光と影のロマン - 宇德敬子.mp3",
      album: "日文专辑",
      cover_art_url: "../assets/images/宇德敬子.jpeg",
      artist: "宇德敬子",
      source: "网络",
    },
  ],
  // 配置音量
  volume: 50,
});
