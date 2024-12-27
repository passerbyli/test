const { ipcRenderer } = require("electron");

// 拖拽逻辑
let offset = null; // 记录用户拖动的偏移值
let isDragging = false; // 记录用户是否正在拖动

document.onmousedown = (e) => {
  if (e.target.matches(".controlBtns")) {
    // 进入此分支，说明用户是在最上方按下的鼠标
    // 可以进行拖拽操作
    isDragging = true;
    // 记录当前用户按下鼠标这一刻的 offset 的值
    offset = {
      x: e.screenX - window.screenX,
      y: e.screenY - window.screenY,
    };
    document.onmousemove = (e) => {
      if (isDragging) {
        // 计算窗口新的位置
        const x = e.screenX - offset.x;
        const y = e.screenY - offset.y;
        // 更新窗口位置
        window.moveTo(x, y);
      }
    };
    document.onmouseup = () => {
      // 鼠标抬起的时候，拖拽结束
      isDragging = false;
      offset = null;
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }
};

// 无论是关闭应用还是最小化应用，渲染进程都是发送消息给主进程
// 让主进程来完成相应的工作
minimizeBtn.onclick = () => {
  ipcRenderer.send("minimizeWindow");
};

closeBtn.onclick = () => {
  ipcRenderer.send("closeWindow");
};

// 切换专辑列表页
menuBtn.onclick = () => {
  albumContainer.classList.add("album-show");
};

closeAlbumBtn.onclick = () => {
  albumContainer.classList.remove("album-show");
  songContainer.classList.remove("show-song-list");
};

// 首先我们有一个工作，需要根据歌曲来组装专辑信息
// 并且属于相同专辑的歌曲，我们取第一首歌的图片作为该专辑的封面
let albumInfo = []; // 用于存储专辑信息
// 获取到所有的歌曲信息
const songs = Amplitude.getConfig().songs;
// 遍历歌曲信息，组装有多少个专辑
for (let i = 0; i < songs.length; i++) {
  if (!albumInfo.includes(songs[i].album)) {
    albumInfo.push(songs[i].album);
  }
}
// 接下来我们还需要取对应专辑的第一首歌的封面图片
// 作为该专辑的封面
albumInfo = albumInfo.map((item) => {
  for (let i = 0; i < songs.length; i++) {
    if (songs[i].album === item) {
      // 当前这首歌和我们的专辑名称是一样的
      // 那么我们就取这首歌的一些信息来作为整个专辑的信息
      return {
        name: item,
        cover: songs[i].cover_art_url,
        source: songs[i].source,
      };
    }
  }
});

// 接下来我们就可以拼接 list 了
for (let i = 0; i < albumInfo.length; i++) {
  albumList.innerHTML += `
    <li class="album-item" data-album="${albumInfo[i].name}">
      <!-- 专辑图片 -->
      <div class="item-left" data-album="${albumInfo[i].name}">
        <img src="${albumInfo[i].cover}" data-album="${albumInfo[i].name}">
      </div>
      <!-- 专辑信息 -->
      <div class="item-right" data-album="${albumInfo[i].name}">
        <div data-album="${albumInfo[i].name}">专辑：${albumInfo[i].name}</div>
        <div data-album="${albumInfo[i].name}">歌手：网络歌手</div>
        <div data-album="${albumInfo[i].name}">专辑：${albumInfo[i].source}</div>
      </div>
    </li>
  `;
}

// 处理歌曲列表
const albumSongs = []; // 存储当前所点击的专辑，里面所对应的歌曲
albumList.onclick = (e) => {
  if (e.target.matches(".album-item, .album-item *")) {
    // 进入此分支说明用户点击了专辑具体的项目

    // 我们需要根据当前用户点击的专辑，往歌曲列表里面填充对应的歌曲
    albumSongs.length = 0; // 清空之前的歌曲列表
    // 拼接头部
    songList.innerHTML = `
      <dt class="title-container flex">
        <div>音乐标题</div>
        <div>
          <div>歌手</div>
          <div>专辑</div>
        </div>
      </dt>
    `;
    // 拼接歌曲列表
    // 获取专辑的名称，我们从自定义属性上面去拿专辑名称
    const albumName = e.target.dataset.album;
    // 将该专辑的歌曲放入到 albumSongs 里面
    for (let i = 0; i < songs.length; i++) {
      if (songs[i].album === albumName) {
        albumSongs.push({
          song: songs[i],
          index: i,
        });
      }
    }
    // 将歌曲信息放入到歌曲列表里面
    for (let i = 0; i < albumSongs.length; i++) {
      songList.innerHTML += `
        <dd class="song-item flex amplitude-song-container amplitude-play-pause" data-amplitude-song-index="${albumSongs[i].index}">
          <div>${albumSongs[i].song.name}</div>
          <div>
            <div>${albumSongs[i].song.artist}</div>
            <div>${albumSongs[i].song.album}</div>
          </div>
        </dd>
      `;
    }

    // 显示歌曲列表
    songContainer.classList.add("show-song-list");

    // 动态的使用 Amplitude 去绑定新的元素，使其可以播放
    Amplitude.bindNewElements();
  }
};

// 关闭歌曲列表
arrowDownBtn.onclick = () => {
  songContainer.classList.remove("show-song-list");
};

// 音量调节
// 核心的逻辑，就是调整滑块儿的宽度的百分比
muteButton.onmouseenter = () => {
  progressContainer.style.width = "60%";
  volumeContainer.style.width = "35%";
  volumeContainer.style.display = "block";
};

document.onclick = () => {
  progressContainer.style.width = "100%";
  volumeContainer.style.width = "0%";
  volumeContainer.style.display = "none";
};

// 打开随机播放
shuffleBtn.onclick = () => {
  // 1. 切换 shuffle-active 样式类
  shuffleBtn.classList.toggle("shuffle-active");
  // 2. 根据是否挂有 shuffle-active 样式类，来决定是否开启随机播放
  if (shuffleBtn.classList.contains("shuffle-active")) {
    Amplitude.setShuffle(true);
  } else {
    Amplitude.setShuffle(false);
  }
};
