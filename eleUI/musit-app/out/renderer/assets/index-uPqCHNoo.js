var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var amplitude_min = { exports: {} };
(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }(commonjsGlobal, function() {
    return function(e) {
      function t(l) {
        if (a[l]) return a[l].exports;
        var u = a[l] = { i: l, l: false, exports: {} };
        return e[l].call(u.exports, u, u.exports, t), u.l = true, u.exports;
      }
      var a = {};
      return t.m = e, t.c = a, t.i = function(e2) {
        return e2;
      }, t.d = function(e2, a2, l) {
        t.o(e2, a2) || Object.defineProperty(e2, a2, { configurable: false, enumerable: true, get: l });
      }, t.n = function(e2) {
        var a2 = e2 && e2.__esModule ? function() {
          return e2.default;
        } : function() {
          return e2;
        };
        return t.d(a2, "a", a2), a2;
      }, t.o = function(e2, t2) {
        return Object.prototype.hasOwnProperty.call(e2, t2);
      }, t.p = "", t(t.s = 47);
    }([function(e, t, a) {
      var l = a(59);
      e.exports = { version: l.version, audio: new Audio(), active_metadata: {}, active_album: "", active_index: 0, active_playlist: null, playback_speed: 1, callbacks: {}, songs: [], playlists: {}, start_song: "", starting_playlist: "", starting_playlist_song: "", repeat: false, repeat_song: false, shuffle_list: {}, shuffle_on: false, default_album_art: "", default_playlist_art: "", debug: false, volume: 0.5, pre_mute_volume: 0.5, volume_increment: 5, volume_decrement: 5, soundcloud_client: "", soundcloud_use_art: false, soundcloud_song_count: 0, soundcloud_songs_ready: 0, is_touch_moving: false, buffered: 0, bindings: {}, continue_next: true, delay: 0, player_state: "stopped", web_audio_api_available: false, context: null, source: null, analyser: null, visualizations: { available: [], active: [], backup: "" }, waveforms: { sample_rate: 100, built: [] } };
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(5), d = (l(i), a(3)), s = (l(d), a(2)), o = (l(s), a(7)), f = (l(o), a(9)), r = l(f), c = a(4), p2 = l(c), v = a(16), y = l(v), g = a(6), m = l(g), _ = /* @__PURE__ */ function() {
        function e2() {
          y.default.stop(), y.default.run(), n.default.active_metadata.live && s2(), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && !n.default.paused && s2();
          var e3 = n.default.audio.play();
          void 0 !== e3 && e3.then(function(e4) {
          }).catch(function(e4) {
          }), n.default.audio.play(), n.default.audio.playbackRate = n.default.playback_speed, m.default.setPlayerState();
        }
        function t2() {
          y.default.stop(), n.default.audio.pause(), n.default.paused = true, n.default.active_metadata.live && d2(), m.default.setPlayerState();
        }
        function a2() {
          y.default.stop(), 0 != n.default.audio.currentTime && (n.default.audio.currentTime = 0), n.default.audio.pause(), n.default.active_metadata.live && d2(), m.default.setPlayerState(), r.default.run("stop");
        }
        function l2(e3) {
          n.default.audio.muted = 0 == e3, n.default.volume = e3, n.default.audio.volume = e3 / 100;
        }
        function u2(e3) {
          n.default.active_metadata.live || (n.default.audio.currentTime = n.default.audio.duration * (e3 / 100));
        }
        function i2(e3) {
          n.default.audio.addEventListener("canplaythrough", function() {
            n.default.audio.duration >= e3 && e3 > 0 ? n.default.audio.currentTime = e3 : p2.default.writeMessage("Amplitude can't skip to a location greater than the duration of the audio or less than 0");
          }, { once: true });
        }
        function d2() {
          n.default.audio.src = "", n.default.audio.load();
        }
        function s2() {
          n.default.audio.src = n.default.active_metadata.url, n.default.audio.load();
        }
        function o2(e3) {
          n.default.playback_speed = e3, n.default.audio.playbackRate = n.default.playback_speed;
        }
        return { play: e2, pause: t2, stop: a2, setVolume: l2, setSongLocation: u2, skipToLocation: i2, disconnectStream: d2, reconnectStream: s2, setPlaybackSpeed: o2 };
      }();
      t.default = _, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2() {
          t2(), a2(), l2(), n2();
        }
        function t2() {
          for (var e3 = u.default.audio.paused ? "paused" : "playing", t3 = document.querySelectorAll(".amplitude-play-pause"), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist"), n3 = t3[a3].getAttribute("data-amplitude-song-index");
            if (null == l3 && null == n3) switch (e3) {
              case "playing":
                d(t3[a3]);
                break;
              case "paused":
                s(t3[a3]);
            }
          }
        }
        function a2() {
          for (var e3 = u.default.audio.paused ? "paused" : "playing", t3 = document.querySelectorAll('.amplitude-play-pause[data-amplitude-playlist="' + u.default.active_playlist + '"]'), a3 = 0; a3 < t3.length; a3++) {
            if (null == t3[a3].getAttribute("data-amplitude-song-index")) switch (e3) {
              case "playing":
                d(t3[a3]);
                break;
              case "paused":
                s(t3[a3]);
            }
          }
        }
        function l2() {
          for (var e3 = u.default.audio.paused ? "paused" : "playing", t3 = document.querySelectorAll('.amplitude-play-pause[data-amplitude-song-index="' + u.default.active_index + '"]'), a3 = 0; a3 < t3.length; a3++) {
            if (null == t3[a3].getAttribute("data-amplitude-playlist")) switch (e3) {
              case "playing":
                d(t3[a3]);
                break;
              case "paused":
                s(t3[a3]);
            }
          }
        }
        function n2() {
          for (var e3 = u.default.audio.paused ? "paused" : "playing", t3 = "" != u.default.active_playlist && null != u.default.active_playlist ? u.default.playlists[u.default.active_playlist].active_index : null, a3 = document.querySelectorAll('.amplitude-play-pause[data-amplitude-song-index="' + t3 + '"][data-amplitude-playlist="' + u.default.active_playlist + '"]'), l3 = 0; l3 < a3.length; l3++) switch (e3) {
            case "playing":
              d(a3[l3]);
              break;
            case "paused":
              s(a3[l3]);
          }
        }
        function i() {
          for (var e3 = document.querySelectorAll(".amplitude-play-pause"), t3 = 0; t3 < e3.length; t3++) s(e3[t3]);
        }
        function d(e3) {
          e3.classList.add("amplitude-playing"), e3.classList.remove("amplitude-paused");
        }
        function s(e3) {
          e3.classList.remove("amplitude-playing"), e3.classList.add("amplitude-paused");
        }
        return { sync: e2, syncGlobal: t2, syncPlaylist: a2, syncSong: l2, syncSongInPlaylist: n2, syncToPause: i };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(1), d = l(i), s = a(9), o = l(s), f = a(5), r = l(f), c = a(2), p2 = l(c), v = a(14), y = l(v), g = a(20), m = l(g), _ = a(15), h2 = l(_), b = a(7), A = l(b), x = a(49), M = l(x), P = /* @__PURE__ */ function() {
        function e2() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], t3 = null, a3 = {}, l3 = false;
          n.default.repeat_song ? n.default.shuffle_on ? (t3 = n.default.shuffle_list[n.default.active_index].index, a3 = n.default.shuffle_list[t3]) : (t3 = n.default.active_index, a3 = n.default.songs[t3]) : n.default.shuffle_on ? (parseInt(n.default.active_index) + 1 < n.default.shuffle_list.length ? t3 = parseInt(n.default.active_index) + 1 : (t3 = 0, l3 = true), a3 = n.default.shuffle_list[t3]) : (parseInt(n.default.active_index) + 1 < n.default.songs.length ? t3 = parseInt(n.default.active_index) + 1 : (t3 = 0, l3 = true), a3 = n.default.songs[t3]), u2(a3, t3), l3 && !n.default.repeat || e3 && !n.default.repeat && l3 || d.default.play(), p2.default.sync(), o.default.run("next"), n.default.repeat_song && o.default.run("song_repeated");
        }
        function t2(e3) {
          var t3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], a3 = null, l3 = {}, u3 = false;
          n.default.repeat_song ? n.default.playlists[e3].shuffle ? (a3 = n.default.playlists[e3].active_index, l3 = n.default.playlists[e3].shuffle_list[a3]) : (a3 = n.default.playlists[e3].active_index, l3 = n.default.playlists[e3].songs[a3]) : n.default.playlists[e3].shuffle ? (parseInt(n.default.playlists[e3].active_index) + 1 < n.default.playlists[e3].shuffle_list.length ? a3 = n.default.playlists[e3].active_index + 1 : (a3 = 0, u3 = true), l3 = n.default.playlists[e3].shuffle_list[a3]) : (parseInt(n.default.playlists[e3].active_index) + 1 < n.default.playlists[e3].songs.length ? a3 = parseInt(n.default.playlists[e3].active_index) + 1 : (a3 = 0, u3 = true), l3 = n.default.playlists[e3].songs[a3]), c2(e3), i2(e3, l3, a3), u3 && !n.default.repeat || t3 && !n.default.repeat && u3 || d.default.play(), p2.default.sync(), o.default.run("next"), n.default.repeat_song && o.default.run("song_repeated");
        }
        function a2() {
          var e3 = null, t3 = {};
          n.default.repeat_song ? n.default.shuffle_on ? (e3 = n.default.active_index, t3 = n.default.shuffle_list[e3]) : (e3 = n.default.active_index, t3 = n.default.songs[e3]) : (e3 = parseInt(n.default.active_index) - 1 >= 0 ? parseInt(n.default.active_index - 1) : parseInt(n.default.songs.length - 1), t3 = n.default.shuffle_on ? n.default.shuffle_list[e3] : n.default.songs[e3]), u2(t3, e3), d.default.play(), p2.default.sync(), o.default.run("prev"), n.default.repeat_song && o.default.run("song_repeated");
        }
        function l2(e3) {
          var t3 = null, a3 = {};
          n.default.repeat_song ? n.default.playlists[e3].shuffle ? (t3 = n.default.playlists[e3].active_index, a3 = n.default.playlists[e3].shuffle_list[t3]) : (t3 = n.default.playlists[e3].active_index, a3 = n.default.playlists[e3].songs[t3]) : (t3 = parseInt(n.default.playlists[e3].active_index) - 1 >= 0 ? parseInt(n.default.playlists[e3].active_index - 1) : parseInt(n.default.playlists[e3].songs.length - 1), a3 = n.default.playlists[e3].shuffle ? n.default.playlists[e3].shuffle_list[t3] : n.default.playlists[e3].songs[t3]), c2(e3), i2(e3, a3, t3), d.default.play(), p2.default.sync(), o.default.run("prev"), n.default.repeat_song && o.default.run("song_repeated");
        }
        function u2(e3, t3) {
          var a3 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
          s2(e3), n.default.audio.src = e3.url, n.default.active_metadata = e3, n.default.active_album = e3.album, n.default.active_index = parseInt(t3), f2(a3);
        }
        function i2(e3, t3, a3) {
          var l3 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
          s2(t3), n.default.audio.src = t3.url, n.default.active_metadata = t3, n.default.active_album = t3.album, n.default.active_index = null, n.default.playlists[e3].active_index = parseInt(a3), f2(l3);
        }
        function s2(e3) {
          d.default.stop(), p2.default.syncToPause(), y.default.resetElements(), m.default.resetElements(), h2.default.resetCurrentTimes(), r.default.newAlbum(e3) && o.default.run("album_change");
        }
        function f2(e3) {
          A.default.displayMetaData(), M.default.setActive(e3), h2.default.resetDurationTimes(), o.default.run("song_change");
        }
        function c2(e3) {
          n.default.active_playlist != e3 && (o.default.run("playlist_changed"), n.default.active_playlist = e3, null != e3 && (n.default.playlists[e3].active_index = 0));
        }
        return { setNext: e2, setNextPlaylist: t2, setPrevious: a2, setPreviousPlaylist: l2, changeSong: u2, changeSongPlaylist: i2, setActivePlaylist: c2 };
      }();
      t.default = P, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3) {
          u.default.debug && console.log(e3);
        }
        return { writeMessage: e2 };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3, t3) {
          return u.default.active_playlist != e3 || (null == u.default.active_playlist && null == e3 ? u.default.active_index != t3 : u.default.active_playlist == e3 && u.default.playlists[e3].active_index != t3);
        }
        function t2(e3) {
          return u.default.active_album != e3;
        }
        function a2(e3) {
          return u.default.active_playlist != e3;
        }
        function l2(e3) {
          return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(e3);
        }
        function n2(e3) {
          return !isNaN(e3) && parseInt(Number(e3)) == e3 && !isNaN(parseInt(e3, 10));
        }
        return { newSong: e2, newAlbum: t2, newPlaylist: a2, isURL: l2, isInt: n2 };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2() {
          u.default.audio = new Audio(), u.default.active_metadata = {}, u.default.active_album = "", u.default.active_index = 0, u.default.active_playlist = null, u.default.playback_speed = 1, u.default.callbacks = {}, u.default.songs = [], u.default.playlists = {}, u.default.start_song = "", u.default.starting_playlist = "", u.default.starting_playlist_song = "", u.default.repeat = false, u.default.shuffle_list = {}, u.default.shuffle_on = false, u.default.default_album_art = "", u.default.default_playlist_art = "", u.default.debug = false, u.default.volume = 0.5, u.default.pre_mute_volume = 0.5, u.default.volume_increment = 5, u.default.volume_decrement = 5, u.default.soundcloud_client = "", u.default.soundcloud_use_art = false, u.default.soundcloud_song_count = 0, u.default.soundcloud_songs_ready = 0, u.default.continue_next = true;
        }
        function t2() {
          u.default.audio.paused && 0 == u.default.audio.currentTime && (u.default.player_state = "stopped"), u.default.audio.paused && u.default.audio.currentTime > 0 && (u.default.player_state = "paused"), u.default.audio.paused || (u.default.player_state = "playing");
        }
        return { resetConfig: e2, setPlayerState: t2 };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2() {
          for (var e3 = ["cover_art_url", "station_art_url", "podcast_episode_cover_art_url"], t3 = document.querySelectorAll("[data-amplitude-song-info]"), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-song-info"), n2 = t3[a3].getAttribute("data-amplitude-playlist"), i = t3[a3].getAttribute("data-amplitude-song-index");
            if (null == i && (u.default.active_playlist == n2 || null == n2 && null == i)) {
              var d = void 0 != u.default.active_metadata[l3] ? u.default.active_metadata[l3] : null;
              e3.indexOf(l3) >= 0 ? (d = d || u.default.default_album_art, t3[a3].setAttribute("src", d)) : (d = d || "", t3[a3].innerHTML = d);
            }
          }
        }
        function t2() {
          for (var e3 = ["image_url"], t3 = document.querySelectorAll("[data-amplitude-playlist-info]"), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist-info"), n2 = t3[a3].getAttribute("data-amplitude-playlist");
            void 0 != u.default.playlists[n2][l3] ? e3.indexOf(l3) >= 0 ? t3[a3].setAttribute("src", u.default.playlists[n2][l3]) : t3[a3].innerHTML = u.default.playlists[n2][l3] : e3.indexOf(l3) >= 0 ? "" != u.default.default_playlist_art ? t3[a3].setAttribute("src", u.default.default_playlist_art) : t3[a3].setAttribute("src", "") : t3[a3].innerHTML = "";
          }
        }
        function a2(e3, t3) {
          for (var a3 = ["cover_art_url", "station_art_url", "podcast_episode_cover_art_url"], l3 = document.querySelectorAll('[data-amplitude-song-info][data-amplitude-playlist="' + t3 + '"]'), u2 = 0; u2 < l3.length; u2++) {
            var n2 = l3[u2].getAttribute("data-amplitude-song-info");
            l3[u2].getAttribute("data-amplitude-playlist") == t3 && (void 0 != e3[n2] ? a3.indexOf(n2) >= 0 ? l3[u2].setAttribute("src", e3[n2]) : l3[u2].innerHTML = e3[n2] : a3.indexOf(n2) >= 0 ? "" != e3.default_album_art ? l3[u2].setAttribute("src", e3.default_album_art) : l3[u2].setAttribute("src", "") : l3[u2].innerHTML = "");
          }
        }
        function l2() {
          for (var e3 = ["cover_art_url", "station_art_url", "podcast_episode_cover_art_url"], a3 = document.querySelectorAll("[data-amplitude-song-info]"), l3 = 0; l3 < a3.length; l3++) {
            var n2 = a3[l3].getAttribute("data-amplitude-song-index"), i = a3[l3].getAttribute("data-amplitude-playlist");
            if (null != n2 && null == i) {
              var d = a3[l3].getAttribute("data-amplitude-song-info"), s = void 0 != u.default.songs[n2][d] ? u.default.songs[n2][d] : null;
              e3.indexOf(d) >= 0 ? (s = s || u.default.default_album_art, a3[l3].setAttribute("src", s)) : a3[l3].innerHTML = s;
            }
            if (null != n2 && null != i) {
              var o = a3[l3].getAttribute("data-amplitude-song-info");
              void 0 != u.default.playlists[i].songs[n2][o] && (e3.indexOf(o) >= 0 ? a3[l3].setAttribute("src", u.default.playlists[i].songs[n2][o]) : a3[l3].innerHTML = u.default.playlists[i].songs[n2][o]);
            }
          }
          t2();
        }
        return { displayMetaData: e2, setFirstSongInPlaylist: a2, syncMetaData: l2, displayPlaylistMetaData: t2 };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2() {
          for (var e3 = document.getElementsByClassName("amplitude-repeat"), t3 = 0; t3 < e3.length; t3++) u.default.repeat ? (e3[t3].classList.add("amplitude-repeat-on"), e3[t3].classList.remove("amplitude-repeat-off")) : (e3[t3].classList.remove("amplitude-repeat-on"), e3[t3].classList.add("amplitude-repeat-off"));
        }
        function t2(e3) {
          for (var t3 = document.getElementsByClassName("amplitude-repeat"), a3 = 0; a3 < t3.length; a3++) t3[a3].getAttribute("data-amplitude-playlist") == e3 && (u.default.playlists[e3].repeat ? (t3[a3].classList.add("amplitude-repeat-on"), t3[a3].classList.remove("amplitude-repeat-off")) : (t3[a3].classList.add("amplitude-repeat-off"), t3[a3].classList.remove("amplitude-repeat-on")));
        }
        function a2() {
          for (var e3 = document.getElementsByClassName("amplitude-repeat-song"), t3 = 0; t3 < e3.length; t3++) u.default.repeat_song ? (e3[t3].classList.add("amplitude-repeat-song-on"), e3[t3].classList.remove("amplitude-repeat-song-off")) : (e3[t3].classList.remove("amplitude-repeat-song-on"), e3[t3].classList.add("amplitude-repeat-song-off"));
        }
        return { syncRepeat: e2, syncRepeatPlaylist: t2, syncRepeatSong: a2 };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(4), d = l(i), s = /* @__PURE__ */ function() {
        function e2() {
          n.default.audio.addEventListener("abort", function() {
            t2("abort");
          }), n.default.audio.addEventListener("error", function() {
            t2("error");
          }), n.default.audio.addEventListener("loadeddata", function() {
            t2("loadeddata");
          }), n.default.audio.addEventListener("loadedmetadata", function() {
            t2("loadedmetadata");
          }), n.default.audio.addEventListener("loadstart", function() {
            t2("loadstart");
          }), n.default.audio.addEventListener("pause", function() {
            t2("pause");
          }), n.default.audio.addEventListener("playing", function() {
            t2("playing");
          }), n.default.audio.addEventListener("play", function() {
            t2("play");
          }), n.default.audio.addEventListener("progress", function() {
            t2("progress");
          }), n.default.audio.addEventListener("ratechange", function() {
            t2("ratechange");
          }), n.default.audio.addEventListener("seeked", function() {
            t2("seeked");
          }), n.default.audio.addEventListener("seeking", function() {
            t2("seeking");
          }), n.default.audio.addEventListener("stalled", function() {
            t2("stalled");
          }), n.default.audio.addEventListener("suspend", function() {
            t2("suspend");
          }), n.default.audio.addEventListener("timeupdate", function() {
            t2("timeupdate");
          }), n.default.audio.addEventListener("volumechange", function() {
            t2("volumechange");
          }), n.default.audio.addEventListener("waiting", function() {
            t2("waiting");
          }), n.default.audio.addEventListener("canplay", function() {
            t2("canplay");
          }), n.default.audio.addEventListener("canplaythrough", function() {
            t2("canplaythrough");
          }), n.default.audio.addEventListener("durationchange", function() {
            t2("durationchange");
          }), n.default.audio.addEventListener("ended", function() {
            t2("ended");
          });
        }
        function t2(e3) {
          if (n.default.callbacks[e3]) {
            var t3 = n.default.callbacks[e3];
            d.default.writeMessage("Running Callback: " + e3);
            try {
              t3();
            } catch (e4) {
              if ("CANCEL EVENT" == e4.message) throw e4;
              d.default.writeMessage("Callback error: " + e4.message);
            }
          }
        }
        return { initialize: e2, run: t2 };
      }();
      t.default = s, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = /* @__PURE__ */ function() {
        function e2(e3) {
          for (var t2 = document.getElementsByClassName("amplitude-mute"), a2 = 0; a2 < t2.length; a2++) e3 ? (t2[a2].classList.remove("amplitude-not-muted"), t2[a2].classList.add("amplitude-muted")) : (t2[a2].classList.add("amplitude-not-muted"), t2[a2].classList.remove("amplitude-muted"));
        }
        return { setMuted: e2 };
      }();
      t.default = l, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2() {
          for (var e3 = document.getElementsByClassName("amplitude-volume-slider"), t2 = 0; t2 < e3.length; t2++) e3[t2].value = 100 * u.default.audio.volume;
        }
        return { sync: e2 };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3) {
          u.default.repeat = e3;
        }
        function t2(e3, t3) {
          u.default.playlists[t3].repeat = e3;
        }
        function a2(e3) {
          u.default.repeat_song = e3;
        }
        return { setRepeat: e2, setRepeatPlaylist: t2, setRepeatSong: a2 };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3) {
          u.default.shuffle_on = e3, e3 ? n2() : u.default.shuffle_list = [];
        }
        function t2() {
          u.default.shuffle_on ? (u.default.shuffle_on = false, u.default.shuffle_list = []) : (u.default.shuffle_on = true, n2());
        }
        function a2(e3, t3) {
          u.default.playlists[e3].shuffle = t3, u.default.playlists[e3].shuffle ? i(e3) : u.default.playlists[e3].shuffle_list = [];
        }
        function l2(e3) {
          u.default.playlists[e3].shuffle ? (u.default.playlists[e3].shuffle = false, u.default.playlists[e3].shuffle_list = []) : (u.default.playlists[e3].shuffle = true, i(e3));
        }
        function n2() {
          for (var e3 = new Array(u.default.songs.length), t3 = 0; t3 < u.default.songs.length; t3++) e3[t3] = u.default.songs[t3];
          for (var a3 = u.default.songs.length - 1; a3 > 0; a3--) {
            d(e3, a3, Math.floor(Math.random() * u.default.songs.length + 1) - 1);
          }
          u.default.shuffle_list = e3;
        }
        function i(e3) {
          for (var t3 = new Array(u.default.playlists[e3].songs.length), a3 = 0; a3 < u.default.playlists[e3].songs.length; a3++) t3[a3] = u.default.playlists[e3].songs[a3];
          for (var l3 = u.default.playlists[e3].songs.length - 1; l3 > 0; l3--) {
            d(t3, l3, Math.floor(Math.random() * u.default.playlists[e3].songs.length + 1) - 1);
          }
          u.default.playlists[e3].shuffle_list = t3;
        }
        function d(e3, t3, a3) {
          var l3 = e3[t3];
          e3[t3] = e3[a3], e3[a3] = l3;
        }
        return { setShuffle: e2, toggleShuffle: t2, setShufflePlaylist: a2, toggleShufflePlaylist: l2, shuffleSongs: n2, shufflePlaylistSongs: i };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3, u2, i2) {
          t2(e3), a2(e3, u2), l2(e3, i2), n2(e3, u2);
        }
        function t2(e3) {
          e3 = isNaN(e3) ? 0 : e3;
          for (var t3 = document.querySelectorAll(".amplitude-song-slider"), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist"), u2 = t3[a3].getAttribute("data-amplitude-song-index");
            null == l3 && null == u2 && (t3[a3].value = e3);
          }
        }
        function a2(e3, t3) {
          e3 = isNaN(e3) ? 0 : e3;
          for (var a3 = document.querySelectorAll('.amplitude-song-slider[data-amplitude-playlist="' + t3 + '"]'), l3 = 0; l3 < a3.length; l3++) {
            var u2 = a3[l3].getAttribute("data-amplitude-playlist"), n3 = a3[l3].getAttribute("data-amplitude-song-index");
            u2 == t3 && null == n3 && (a3[l3].value = e3);
          }
        }
        function l2(e3, t3) {
          if (null == u.default.active_playlist) {
            e3 = isNaN(e3) ? 0 : e3;
            for (var a3 = document.querySelectorAll('.amplitude-song-slider[data-amplitude-song-index="' + t3 + '"]'), l3 = 0; l3 < a3.length; l3++) {
              var n3 = a3[l3].getAttribute("data-amplitude-playlist"), i2 = a3[l3].getAttribute("data-amplitude-song-index");
              null == n3 && i2 == t3 && (a3[l3].value = e3);
            }
          }
        }
        function n2(e3, t3) {
          e3 = isNaN(e3) ? 0 : e3;
          for (var a3 = "" != u.default.active_playlist && null != u.default.active_playlist ? u.default.playlists[u.default.active_playlist].active_index : null, l3 = document.querySelectorAll('.amplitude-song-slider[data-amplitude-playlist="' + t3 + '"][data-amplitude-song-index="' + a3 + '"]'), n3 = 0; n3 < l3.length; n3++) l3[n3].value = e3;
        }
        function i() {
          for (var e3 = document.getElementsByClassName("amplitude-song-slider"), t3 = 0; t3 < e3.length; t3++) e3[t3].value = 0;
        }
        return { sync: e2, syncMain: t2, syncPlaylist: a2, syncSong: l2, syncSongInPlaylist: n2, resetElements: i };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(53), n = l(u), i = a(50), d = l(i), s = a(51), o = l(s), f = a(52), r = l(f), c = a(54), p2 = l(c), v = a(55), y = l(v), g = a(56), m = l(g), _ = a(57), h2 = l(_), b = a(58), A = l(b), x = /* @__PURE__ */ function() {
        function e2() {
          n.default.resetTimes(), d.default.resetTimes(), o.default.resetTimes(), r.default.resetTimes();
        }
        function t2(e3) {
          n.default.sync(e3), d.default.sync(e3.hours), o.default.sync(e3.minutes), r.default.sync(e3.seconds);
        }
        function a2() {
          p2.default.resetTimes(), y.default.resetTimes(), m.default.resetTimes(), h2.default.resetTimes(), A.default.resetTimes();
        }
        function l2(e3, t3) {
          p2.default.sync(e3, t3), A.default.sync(t3), y.default.sync(t3.hours), m.default.sync(t3.minutes), h2.default.sync(t3.seconds);
        }
        return { resetCurrentTimes: e2, syncCurrentTimes: t2, resetDurationTimes: a2, syncDurationTimes: l2 };
      }();
      t.default = x, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(4), d = (l(i), /* @__PURE__ */ function() {
        function e2() {
          var e3 = document.querySelectorAll(".amplitude-visualization");
          if (n.default.web_audio_api_available) {
            if (Object.keys(n.default.visualizations.available).length > 0 && e3.length > 0) for (var i3 = 0; i3 < e3.length; i3++) {
              var d3 = e3[i3].getAttribute("data-amplitude-playlist"), s2 = e3[i3].getAttribute("data-amplitude-song-index");
              null == d3 && null == s2 && t2(e3[i3]), null != d3 && null == s2 && a2(e3[i3], d3), null == d3 && null != s2 && l2(e3[i3], s2), null != d3 && null != s2 && u2(e3[i3], d3, s2);
            }
          } else o();
        }
        function t2(e3) {
          var t3 = n.default.visualization, a3 = null != n.default.active_index ? n.default.songs[n.default.active_index].visualization : n.default.playlists[n.default.active_playlist].songs[n.default.playlists[n.default.active_playlist].active_index].visualization;
          if (void 0 != a3 && void 0 != n.default.visualizations.available[a3]) i2(a3, e3);
          else if (void 0 != t3 && void 0 != n.default.visualizations.available[t3]) i2(t3, e3);
          else {
            var l3 = Object.keys(n.default.visualizations.available).length > 0 ? Object.keys(n.default.visualizations.available)[0] : null;
            null != l3 && i2(l3, e3);
          }
        }
        function a2(e3, t3) {
          if (t3 == n.default.active_playlist) {
            var a3 = n.default.playlists[n.default.active_playlist].songs[n.default.playlists[n.default.active_playlist].active_index].visualization, l3 = n.default.playlists[n.default.active_playlist].visualization, u3 = n.default.visualization;
            if (void 0 != a3 && void 0 != n.default.visualizations.available[a3]) i2(a3, e3);
            else if (void 0 != l3 && void 0 != n.default.visualizations.available[l3]) i2(l3, e3);
            else if (void 0 != u3 && void 0 != n.default.visualizations.available[u3]) i2(u3, e3);
            else {
              var d3 = Object.keys(n.default.visualizations.available).length > 0 ? Object.keys(n.default.visualizations.available)[0] : null;
              null != d3 && i2(d3, e3);
            }
          }
        }
        function l2(e3, t3) {
          if (t3 == n.default.active_index) {
            var a3 = n.default.songs[n.default.active_index].visualization, l3 = n.default.visualization;
            if (void 0 != a3 && void 0 != n.default.visualizations.available[a3]) i2(a3, e3);
            else if (void 0 != l3 && void 0 != n.default.visualizations.available[l3]) i2(l3, e3);
            else {
              var u3 = Object.keys(n.default.visualizations.available).length > 0 ? Object.keys(n.default.visualizations.available)[0] : null;
              null != u3 && i2(u3, e3);
            }
          }
        }
        function u2(e3, t3, a3) {
          if (t3 == n.default.active_playlist && n.default.playlists[t3].active_index == a3) {
            var l3 = n.default.playlists[n.default.active_playlist].songs[n.default.playlists[n.default.active_playlist].active_index].visualization, u3 = n.default.playlists[n.default.active_playlist].visualization, d3 = n.default.visualization;
            if (void 0 != l3 && void 0 != n.default.visualizations.available[l3]) i2(l3, e3);
            else if (void 0 != u3 && void 0 != n.default.visualizations.available[u3]) i2(u3, e3);
            else if (void 0 != d3 && void 0 != n.default.visualizations.available[d3]) i2(d3, e3);
            else {
              var s2 = Object.keys(n.default.visualizations.available).length > 0 ? Object.keys(n.default.visualizations.available)[0] : null;
              null != s2 && i2(s2, e3);
            }
          }
        }
        function i2(e3, t3) {
          var a3 = new n.default.visualizations.available[e3].object();
          a3.setPreferences(n.default.visualizations.available[e3].preferences), a3.startVisualization(t3), n.default.visualizations.active.push(a3);
        }
        function d2() {
          for (var e3 = 0; e3 < n.default.visualizations.active.length; e3++) n.default.visualizations.active[e3].stopVisualization();
          n.default.visualizations.active = [];
        }
        function s(e3, t3) {
          var a3 = new e3();
          n.default.visualizations.available[a3.getID()] = new Array(), n.default.visualizations.available[a3.getID()].object = e3, n.default.visualizations.available[a3.getID()].preferences = t3;
        }
        function o() {
          var e3 = document.querySelectorAll(".amplitude-visualization");
          if (e3.length > 0) for (var t3 = 0; t3 < e3.length; t3++) {
            var a3 = e3[t3].getAttribute("data-amplitude-playlist"), l3 = e3[t3].getAttribute("data-amplitude-song-index");
            null == a3 && null == l3 && f(e3[t3]), null != a3 && null == l3 && r(e3[t3], a3), null == a3 && null != l3 && c(e3[t3], l3), null != a3 && null != l3 && p2(e3[t3], a3, l3);
          }
        }
        function f(e3) {
          e3.style.backgroundImage = "url(" + n.default.active_metadata.cover_art_url + ")";
        }
        function r(e3, t3) {
          n.default.active_playlist == t3 && (e3.style.backgroundImage = "url(" + n.default.active_metadata.cover_art_url + ")");
        }
        function c(e3, t3) {
          n.default.active_index == t3 && (e3.style.backgroundImage = "url(" + n.default.active_metadata.cover_art_url + ")");
        }
        function p2(e3, t3, a3) {
          n.default.active_playlist == t3 && n.default.playlists[active_playlist].active_index == a3 && (e3.style.backgroundImage = "url(" + n.default.active_metadata.cover_art_url + ")");
        }
        return { run: e2, stop: d2, register: s };
      }());
      t.default = d, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(21), d = l(i), s = /* @__PURE__ */ function() {
        function e2(e3) {
          s2 = e3;
          var a3 = document.getElementsByTagName("head")[0], l3 = document.createElement("script");
          l3.type = "text/javascript", l3.src = "https://connect.soundcloud.com/sdk.js", l3.onreadystatechange = t2, l3.onload = t2, a3.appendChild(l3);
        }
        function t2() {
          SC.initialize({ client_id: n.default.soundcloud_client }), a2();
        }
        function a2() {
          for (var e3 = /^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/, t3 = 0; t3 < n.default.songs.length; t3++) n.default.songs[t3].url.match(e3) && (n.default.soundcloud_song_count++, u2(n.default.songs[t3].url, t3));
        }
        function l2(e3, t3, a3) {
          var l3 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
          SC.get("/resolve/?url=" + e3, function(e4) {
            e4.streamable ? null != t3 ? (n.default.playlists[t3].songs[a3].url = e4.stream_url + "?client_id=" + n.default.soundcloud_client, l3 && (n.default.playlists[t3].shuffle_list[a3].url = e4.stream_url + "?client_id=" + n.default.soundcloud_client), n.default.soundcloud_use_art && (n.default.playlists[t3].songs[a3].cover_art_url = e4.artwork_url, l3 && (n.default.playlists[t3].shuffle_list[a3].cover_art_url = e4.artwork_url)), n.default.playlists[t3].songs[a3].soundcloud_data = e4, l3 && (n.default.playlists[t3].shuffle_list[a3].soundcloud_data = e4)) : (n.default.songs[a3].url = e4.stream_url + "?client_id=" + n.default.soundcloud_client, l3 && (n.default.shuffle_list[a3].stream_url, n.default.soundcloud_client), n.default.soundcloud_use_art && (n.default.songs[a3].cover_art_url = e4.artwork_url, l3 && (n.default.shuffle_list[a3].cover_art_url = e4.artwork_url)), n.default.songs[a3].soundcloud_data = e4, l3 && (n.default.shuffle_list[a3].soundcloud_data = e4)) : null != t3 ? AmplitudeHelpers.writeDebugMessage(n.default.playlists[t3].songs[a3].name + " by " + n.default.playlists[t3].songs[a3].artist + " is not streamable by the Soundcloud API") : AmplitudeHelpers.writeDebugMessage(n.default.songs[a3].name + " by " + n.default.songs[a3].artist + " is not streamable by the Soundcloud API");
          });
        }
        function u2(e3, t3) {
          SC.get("/resolve/?url=" + e3, function(e4) {
            e4.streamable ? (n.default.songs[t3].url = e4.stream_url + "?client_id=" + n.default.soundcloud_client, n.default.soundcloud_use_art && (n.default.songs[t3].cover_art_url = e4.artwork_url), n.default.songs[t3].soundcloud_data = e4) : AmplitudeHelpers.writeDebugMessage(n.default.songs[t3].name + " by " + n.default.songs[t3].artist + " is not streamable by the Soundcloud API"), ++n.default.soundcloud_songs_ready == n.default.soundcloud_song_count && d.default.setConfig(s2);
          });
        }
        function i2(e3) {
          var t3 = /^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/;
          return e3.match(t3);
        }
        var s2 = {};
        return { loadSoundCloud: e2, resolveIndividualStreamableURL: l2, isSoundCloudURL: i2 };
      }();
      t.default = s, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2() {
          for (var e3 = document.getElementsByClassName("amplitude-playback-speed"), t2 = 0; t2 < e3.length; t2++) switch (e3[t2].classList.remove("amplitude-playback-speed-10"), e3[t2].classList.remove("amplitude-playback-speed-15"), e3[t2].classList.remove("amplitude-playback-speed-20"), u.default.playback_speed) {
            case 1:
              e3[t2].classList.add("amplitude-playback-speed-10");
              break;
            case 1.5:
              e3[t2].classList.add("amplitude-playback-speed-15");
              break;
            case 2:
              e3[t2].classList.add("amplitude-playback-speed-20");
          }
        }
        return { sync: e2 };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2() {
          for (var e3 = document.getElementsByClassName("amplitude-shuffle"), t3 = 0; t3 < e3.length; t3++) null == e3[t3].getAttribute("data-amplitude-playlist") && (u.default.shuffle_on ? (e3[t3].classList.add("amplitude-shuffle-on"), e3[t3].classList.remove("amplitude-shuffle-off")) : (e3[t3].classList.add("amplitude-shuffle-off"), e3[t3].classList.remove("amplitude-shuffle-on")));
        }
        function t2(e3) {
          for (var t3 = document.querySelectorAll('.amplitude-shuffle[data-amplitude-playlist="' + e3 + '"]'), a2 = 0; a2 < t3.length; a2++) u.default.playlists[e3].shuffle ? (t3[a2].classList.add("amplitude-shuffle-on"), t3[a2].classList.remove("amplitude-shuffle-off")) : (t3[a2].classList.add("amplitude-shuffle-off"), t3[a2].classList.remove("amplitude-shuffle-on"));
        }
        return { syncMain: e2, syncPlaylist: t2 };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3) {
          t2(e3), a2(e3), l2(e3), n2(e3);
        }
        function t2(e3) {
          if (!isNaN(e3)) for (var t3 = document.querySelectorAll(".amplitude-song-played-progress"), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist"), u2 = t3[a3].getAttribute("data-amplitude-song-index");
            if (null == l3 && null == u2) {
              var n3 = t3[a3].max;
              t3[a3].value = e3 / 100 * n3;
            }
          }
        }
        function a2(e3) {
          if (!isNaN(e3)) for (var t3 = document.querySelectorAll('.amplitude-song-played-progress[data-amplitude-playlist="' + u.default.active_playlist + '"]'), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-song-index");
            if (null == l3) {
              var n3 = t3[a3].max;
              t3[a3].value = e3 / 100 * n3;
            }
          }
        }
        function l2(e3) {
          if (null == u.default.active_playlist && !isNaN(e3)) for (var t3 = document.querySelectorAll('.amplitude-song-played-progress[data-amplitude-song-index="' + u.default.active_index + '"]'), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist");
            if (null == l3) {
              var n3 = t3[a3].max;
              t3[a3].value = e3 / 100 * n3;
            }
          }
        }
        function n2(e3) {
          if (!isNaN(e3)) for (var t3 = "" != u.default.active_playlist && null != u.default.active_playlist ? u.default.playlists[u.default.active_playlist].active_index : null, a3 = document.querySelectorAll('.amplitude-song-played-progress[data-amplitude-playlist="' + u.default.active_playlist + '"][data-amplitude-song-index="' + t3 + '"]'), l3 = 0; l3 < a3.length; l3++) {
            var n3 = a3[l3].getAttribute("data-amplitude-playlist"), i2 = a3[l3].getAttribute("data-amplitude-song-index");
            if (null != n3 && null != i2) {
              var d = a3[l3].max;
              a3[l3].value = e3 / 100 * d;
            }
          }
        }
        function i() {
          for (var e3 = document.getElementsByClassName("amplitude-song-played-progress"), t3 = 0; t3 < e3.length; t3++) e3[t3].value = 0;
        }
        return { sync: e2, resetElements: i };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e2) {
        return typeof e2;
      } : function(e2) {
        return e2 && "function" == typeof Symbol && e2.constructor === Symbol && e2 !== Symbol.prototype ? "symbol" : typeof e2;
      }, n = a(0), i = l(n), d = a(1), s = l(d), o = a(17), f = l(o), r = a(6), c = l(r), p2 = a(4), v = l(p2), y = a(5), g = l(y), m = a(13), _ = l(m), h2 = a(26), b = l(h2), A = a(46), x = l(A), M = a(16), P = l(M), S = a(22), L = l(S), w = a(3), E = l(w), k = a(9), T = l(k), O = a(48), C = l(O), N = a(19), j = l(N), I = a(10), q = l(I), z = a(11), H = l(z), B = a(15), D = l(B), R = a(2), V = l(R), U = a(7), F = l(U), W = a(18), G = l(W), Y = a(8), X = l(Y), J = /* @__PURE__ */ function() {
        function e2(e3) {
          var t3 = false;
          if (c.default.resetConfig(), b.default.initialize(), T.default.initialize(), i.default.debug = void 0 != e3.debug && e3.debug, l2(e3), e3.songs ? 0 != e3.songs.length ? (i.default.songs = e3.songs, t3 = true) : v.default.writeMessage("Please add some songs, to your songs object!") : v.default.writeMessage("Please provide a songs object for AmplitudeJS to run!"), x.default.webAudioAPIAvailable()) {
            if (x.default.determineUsingAnyFX() && (x.default.configureWebAudioAPI(), document.documentElement.addEventListener("mousedown", function() {
              "running" !== i.default.context.state && i.default.context.resume();
            }), document.documentElement.addEventListener("keydown", function() {
              "running" !== i.default.context.state && i.default.context.resume();
            }), document.documentElement.addEventListener("keyup", function() {
              "running" !== i.default.context.state && i.default.context.resume();
            }), void 0 != e3.waveforms && void 0 != e3.waveforms.sample_rate && (i.default.waveforms.sample_rate = e3.waveforms.sample_rate), L.default.init(), void 0 != e3.visualizations && e3.visualizations.length > 0)) for (var u2 = 0; u2 < e3.visualizations.length; u2++) P.default.register(e3.visualizations[u2].object, e3.visualizations[u2].params);
          } else v.default.writeMessage("The Web Audio API is not available on this platform. We are using your defined backups!");
          if (o2(), r2(), t3) {
            i.default.soundcloud_client = void 0 != e3.soundcloud_client ? e3.soundcloud_client : "", i.default.soundcloud_use_art = void 0 != e3.soundcloud_use_art ? e3.soundcloud_use_art : "";
            var n3 = {};
            "" != i.default.soundcloud_client ? (n3 = e3, f.default.loadSoundCloud(n3)) : a2(e3);
          }
          v.default.writeMessage("Initialized With: "), v.default.writeMessage(i.default);
        }
        function t2() {
          b.default.initialize(), F.default.displayMetaData();
        }
        function a2(e3) {
          e3.playlists && d2(e3.playlists) > 0 && C.default.initialize(e3.playlists), void 0 == e3.start_song || e3.starting_playlist ? E.default.changeSong(i.default.songs[0], 0) : g.default.isInt(e3.start_song) ? E.default.changeSong(i.default.songs[e3.start_song], e3.start_song) : v.default.writeMessage("You must enter an integer index for the start song."), void 0 != e3.shuffle_on && e3.shuffle_on && (i.default.shuffle_on = true, _.default.shuffleSongs(), E.default.changeSong(i.default.shuffle_list[0], 0)), i.default.continue_next = void 0 == e3.continue_next || e3.continue_next, i.default.playback_speed = void 0 != e3.playback_speed ? e3.playback_speed : 1, s.default.setPlaybackSpeed(i.default.playback_speed), i.default.audio.preload = void 0 != e3.preload ? e3.preload : "auto", i.default.callbacks = void 0 != e3.callbacks ? e3.callbacks : {}, i.default.bindings = void 0 != e3.bindings ? e3.bindings : {}, i.default.volume = void 0 != e3.volume ? e3.volume : 50, i.default.delay = void 0 != e3.delay ? e3.delay : 0, i.default.volume_increment = void 0 != e3.volume_increment ? e3.volume_increment : 5, i.default.volume_decrement = void 0 != e3.volume_decrement ? e3.volume_decrement : 5, s.default.setVolume(i.default.volume), l2(e3), n2(), void 0 != e3.starting_playlist && "" != e3.starting_playlist && (i.default.active_playlist = e3.starting_playlist, void 0 != e3.starting_playlist_song && "" != e3.starting_playlist_song ? void 0 != u(e3.playlists[e3.starting_playlist].songs[parseInt(e3.starting_playlist_song)]) ? E.default.changeSongPlaylist(i.default.active_playlist, e3.playlists[e3.starting_playlist].songs[parseInt(e3.starting_playlist_song)], parseInt(e3.starting_playlist_song)) : (E.default.changeSongPlaylist(i.default.active_playlist, e3.playlists[e3.starting_playlist].songs[0], 0), v.default.writeMessage("The index of " + e3.starting_playlist_song + " does not exist in the playlist " + e3.starting_playlist)) : E.default.changeSong(i.default.active_playlist, e3.playlists[e3.starting_playlist].songs[0], 0), V.default.sync()), T.default.run("initialized");
        }
        function l2(e3) {
          void 0 != e3.default_album_art ? i.default.default_album_art = e3.default_album_art : i.default.default_album_art = "", void 0 != e3.default_playlist_art ? i.default.default_playlist_art = e3.default_playlist_art : i.default.default_playlist_art = "";
        }
        function n2() {
          j.default.syncMain(), q.default.setMuted(0 == i.default.volume), H.default.sync(), G.default.sync(), D.default.resetCurrentTimes(), V.default.syncToPause(), F.default.syncMetaData(), X.default.syncRepeatSong();
        }
        function d2(e3) {
          var t3 = 0, a3 = void 0;
          for (a3 in e3) e3.hasOwnProperty(a3) && t3++;
          return v.default.writeMessage("You have " + t3 + " playlist(s) in your config"), t3;
        }
        function o2() {
          for (var e3 = 0; e3 < i.default.songs.length; e3++) void 0 == i.default.songs[e3].live && (i.default.songs[e3].live = false);
        }
        function r2() {
          for (var e3 = 0; e3 < i.default.songs.length; e3++) i.default.songs[e3].index = e3;
        }
        return { initialize: e2, setConfig: a2, rebindDisplay: t2 };
      }();
      t.default = J, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2() {
          c = u.default.waveforms.sample_rate;
          var e3 = document.querySelectorAll(".amplitude-wave-form");
          if (e3.length > 0) for (var t3 = 0; t3 < e3.length; t3++) {
            e3[t3].innerHTML = "";
            var a3 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            a3.setAttribute("viewBox", "0 -1 " + c + " 2"), a3.setAttribute("preserveAspectRatio", "none");
            var l3 = document.createElementNS("http://www.w3.org/2000/svg", "g");
            a3.appendChild(l3);
            var n3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            n3.setAttribute("d", ""), n3.setAttribute("id", "waveform"), l3.appendChild(n3), e3[t3].appendChild(a3);
          }
        }
        function t2() {
          if (u.default.web_audio_api_available) if (void 0 == u.default.waveforms.built[Math.abs(u.default.audio.src.split("").reduce(function(e4, t3) {
            return (e4 = (e4 << 5) - e4 + t3.charCodeAt(0)) & e4;
          }, 0))]) {
            var e3 = new XMLHttpRequest();
            e3.open("GET", u.default.audio.src, true), e3.responseType = "arraybuffer", e3.onreadystatechange = function(t3) {
              4 == e3.readyState && 200 == e3.status && u.default.context.decodeAudioData(e3.response, function(e4) {
                r = e4, p2 = l2(c, r), a2(c, r, p2);
              });
            }, e3.send();
          } else n2(u.default.waveforms.built[Math.abs(u.default.audio.src.split("").reduce(function(e4, t3) {
            return (e4 = (e4 << 5) - e4 + t3.charCodeAt(0)) & e4;
          }, 0))]);
        }
        function a2(e3, t3, a3) {
          if (t3) {
            for (var l3 = a3.length, i2 = "", d2 = 0; d2 < l3; d2++) i2 += d2 % 2 == 0 ? " M" + ~~(d2 / 2) + ", " + a3.shift() : " L" + ~~(d2 / 2) + ", " + a3.shift();
            u.default.waveforms.built[Math.abs(u.default.audio.src.split("").reduce(function(e4, t4) {
              return (e4 = (e4 << 5) - e4 + t4.charCodeAt(0)) & e4;
            }, 0))] = i2, n2(u.default.waveforms.built[Math.abs(u.default.audio.src.split("").reduce(function(e4, t4) {
              return (e4 = (e4 << 5) - e4 + t4.charCodeAt(0)) & e4;
            }, 0))]);
          }
        }
        function l2(e3, t3) {
          for (var a3 = t3.length / e3, l3 = ~~(a3 / 10) || 1, u2 = t3.numberOfChannels, n3 = [], i2 = 0; i2 < u2; i2++) for (var d2 = [], s2 = t3.getChannelData(i2), o2 = 0; o2 < e3; o2++) {
            for (var f2 = ~~(o2 * a3), r2 = ~~(f2 + a3), c2 = s2[0], p3 = s2[0], v = f2; v < r2; v += l3) {
              var y = s2[v];
              y > p3 && (p3 = y), y < c2 && (c2 = y);
            }
            d2[2 * o2] = p3, d2[2 * o2 + 1] = c2, (0 === i2 || p3 > n3[2 * o2]) && (n3[2 * o2] = p3), (0 === i2 || c2 < n3[2 * o2 + 1]) && (n3[2 * o2 + 1] = c2);
          }
          return n3;
        }
        function n2(e3) {
          for (var t3 = document.querySelectorAll(".amplitude-wave-form"), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist"), u2 = t3[a3].getAttribute("data-amplitude-song-index");
            null == l3 && null == u2 && i(t3[a3], e3), null != l3 && null == u2 && d(t3[a3], e3, l3), null == l3 && null != u2 && s(t3[a3], e3, u2), null != l3 && null != u2 && o(t3[a3], e3, l3, u2);
          }
        }
        function i(e3, t3) {
          e3.querySelector("svg g path").setAttribute("d", t3);
        }
        function d(e3, t3, a3) {
          if (u.default.active_playlist == a3) {
            e3.querySelector("svg g path").setAttribute("d", t3);
          }
        }
        function s(e3, t3, a3) {
          if (u.default.active_index == a3) {
            e3.querySelector("svg g path").setAttribute("d", t3);
          }
        }
        function o(e3, t3, a3, l3) {
          if (u.default.active_playlist == a3 && u.default.playlists[u.default.active_playlist].active_index == l3) {
            e3.querySelector("svg g path").setAttribute("d", t3);
          }
        }
        function f() {
          return document.querySelectorAll(".amplitude-wave-form").length > 0;
        }
        var r = "", c = "", p2 = "";
        return { init: e2, build: t2, determineIfUsingWaveforms: f };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2() {
          var e3 = {}, t3 = (Math.floor(u.default.audio.currentTime % 60) < 10 ? "0" : "") + Math.floor(u.default.audio.currentTime % 60), a3 = Math.floor(u.default.audio.currentTime / 60), l3 = "00";
          return a3 < 10 && (a3 = "0" + a3), a3 >= 60 && (l3 = Math.floor(a3 / 60), (a3 %= 60) < 10 && (a3 = "0" + a3)), e3.seconds = t3, e3.minutes = a3, e3.hours = l3, e3;
        }
        function t2() {
          var e3 = {}, t3 = (Math.floor(u.default.audio.duration % 60) < 10 ? "0" : "") + Math.floor(u.default.audio.duration % 60), a3 = Math.floor(u.default.audio.duration / 60), l3 = "00";
          return a3 < 10 && (a3 = "0" + a3), a3 >= 60 && (l3 = Math.floor(a3 / 60), (a3 %= 60) < 10 && (a3 = "0" + a3)), e3.seconds = isNaN(t3) ? "00" : t3, e3.minutes = isNaN(a3) ? "00" : a3, e3.hours = isNaN(l3) ? "00" : l3.toString(), e3;
        }
        function a2() {
          return u.default.audio.currentTime / u.default.audio.duration * 100;
        }
        function l2(e3) {
          u.default.active_metadata.live || isFinite(e3) && (u.default.audio.currentTime = e3);
        }
        return { computeCurrentTimes: e2, computeSongDuration: t2, computeSongCompletionPercentage: a2, setCurrentTime: l2 };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2() {
          t2(), a2(), l2(), n2();
        }
        function t2() {
          for (var e3 = document.getElementsByClassName("amplitude-buffered-progress"), t3 = 0; t3 < e3.length; t3++) {
            var a3 = e3[t3].getAttribute("data-amplitude-playlist"), l3 = e3[t3].getAttribute("data-amplitude-song-index");
            null != a3 || null != l3 || isNaN(u.default.buffered) || (e3[t3].value = parseFloat(parseFloat(u.default.buffered) / 100));
          }
        }
        function a2() {
          for (var e3 = document.querySelectorAll('.amplitude-buffered-progress[data-amplitude-playlist="' + u.default.active_playlist + '"]'), t3 = 0; t3 < e3.length; t3++) {
            null != e3[t3].getAttribute("data-amplitude-song-index") || isNaN(u.default.buffered) || (e3[t3].value = parseFloat(parseFloat(u.default.buffered) / 100));
          }
        }
        function l2() {
          for (var e3 = document.querySelectorAll('.amplitude-buffered-progress[data-amplitude-song-index="' + u.default.active_index + '"]'), t3 = 0; t3 < e3.length; t3++) {
            null != e3[t3].getAttribute("data-amplitude-playlist") || isNaN(u.default.buffered) || (e3[t3].value = parseFloat(parseFloat(u.default.buffered) / 100));
          }
        }
        function n2() {
          for (var e3 = null != u.default.active_playlist && "" != u.default.active_playlist ? u.default.playlists[u.default.active_playlist].active_index : null, t3 = document.querySelectorAll('.amplitude-buffered-progress[data-amplitude-song-index="' + e3 + '"][data-amplitude-playlist="' + u.default.active_playlist + '"]'), a3 = 0; a3 < t3.length; a3++) isNaN(u.default.buffered) || (t3[a3].value = parseFloat(parseFloat(u.default.buffered) / 100));
        }
        function i() {
          for (var e3 = document.getElementsByClassName("amplitude-buffered-progress"), t3 = 0; t3 < e3.length; t3++) e3[t3].value = 0;
        }
        return { sync: e2, reset: i };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(3), d = l(i), s = a(1), o = l(s), f = a(2), r = l(f), c = /* @__PURE__ */ function() {
        function e2() {
          setTimeout(function() {
            n.default.continue_next ? "" == n.default.active_playlist || null == n.default.active_playlist ? d.default.setNext(true) : d.default.setNextPlaylist(n.default.active_playlist, true) : n.default.is_touch_moving || (o.default.stop(), r.default.sync());
          }, n.default.delay);
        }
        return { handle: e2 };
      }();
      t.default = c, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(27), d = l(i), s = a(42), o = l(s), f = a(25), r = l(f), c = a(35), p2 = l(c), v = a(31), y = l(v), g = a(30), m = l(g), _ = a(32), h2 = l(_), b = a(41), A = l(b), x = a(28), M = l(x), P = a(45), S = l(P), L = a(43), w = l(L), E = a(40), k = l(E), T = a(44), O = l(T), C = a(29), N = l(C), j = a(34), I = l(j), q = a(36), z = l(q), H = a(37), B = l(H), D = a(33), R = l(D), V = a(38), U = l(V), F = a(39), W = l(F), G = a(22), Y = l(G), X = a(4), J = l(X), $ = /* @__PURE__ */ function() {
        function e2() {
          J.default.writeMessage("Beginning initialization of event handlers.."), document.addEventListener("touchmove", function() {
            n.default.is_touch_moving = true;
          }), document.addEventListener("touchend", function() {
            n.default.is_touch_moving && (n.default.is_touch_moving = false);
          }), t2(), a2(), l2(), u2(), i2(), s2(), f2(), c2(), v2(), g2(), _2(), b2(), x2(), P2(), L2(), E2(), T2(), C2(), j2(), q2(), H2();
        }
        function t2() {
          n.default.audio.removeEventListener("timeupdate", o.default.handle), n.default.audio.addEventListener("timeupdate", o.default.handle), n.default.audio.removeEventListener("durationchange", o.default.handle), n.default.audio.addEventListener("durationchange", o.default.handle);
        }
        function a2() {
          document.removeEventListener("keydown", d.default.handle), document.addEventListener("keydown", d.default.handle);
        }
        function l2() {
          n.default.audio.removeEventListener("ended", r.default.handle), n.default.audio.addEventListener("ended", r.default.handle);
        }
        function u2() {
          n.default.audio.removeEventListener("progress", p2.default.handle), n.default.audio.addEventListener("progress", p2.default.handle);
        }
        function i2() {
          for (var e3 = document.getElementsByClassName("amplitude-play"), t3 = 0; t3 < e3.length; t3++) /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (e3[t3].removeEventListener("touchend", y.default.handle), e3[t3].addEventListener("touchend", y.default.handle)) : (e3[t3].removeEventListener("click", y.default.handle), e3[t3].addEventListener("click", y.default.handle));
        }
        function s2() {
          for (var e3 = document.getElementsByClassName("amplitude-pause"), t3 = 0; t3 < e3.length; t3++) /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (e3[t3].removeEventListener("touchend", m.default.handle), e3[t3].addEventListener("touchend", m.default.handle)) : (e3[t3].removeEventListener("click", m.default.handle), e3[t3].addEventListener("click", m.default.handle));
        }
        function f2() {
          for (var e3 = document.getElementsByClassName("amplitude-play-pause"), t3 = 0; t3 < e3.length; t3++) /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (e3[t3].removeEventListener("touchend", h2.default.handle), e3[t3].addEventListener("touchend", h2.default.handle)) : (e3[t3].removeEventListener("click", h2.default.handle), e3[t3].addEventListener("click", h2.default.handle));
        }
        function c2() {
          for (var e3 = document.getElementsByClassName("amplitude-stop"), t3 = 0; t3 < e3.length; t3++) /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (e3[t3].removeEventListener("touchend", A.default.handle), e3[t3].addEventListener("touchend", A.default.handle)) : (e3[t3].removeEventListener("click", A.default.handle), e3[t3].addEventListener("click", A.default.handle));
        }
        function v2() {
          for (var e3 = document.getElementsByClassName("amplitude-mute"), t3 = 0; t3 < e3.length; t3++) /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? /iPhone|iPad|iPod/i.test(navigator.userAgent) ? J.default.writeMessage("iOS does NOT allow volume to be set through javascript: https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW4") : (e3[t3].removeEventListener("touchend", M.default.handle), e3[t3].addEventListener("touchend", M.default.handle)) : (e3[t3].removeEventListener("click", M.default.handle), e3[t3].addEventListener("click", M.default.handle));
        }
        function g2() {
          for (var e3 = document.getElementsByClassName("amplitude-volume-up"), t3 = 0; t3 < e3.length; t3++) /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? /iPhone|iPad|iPod/i.test(navigator.userAgent) ? J.default.writeMessage("iOS does NOT allow volume to be set through javascript: https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW4") : (e3[t3].removeEventListener("touchend", S.default.handle), e3[t3].addEventListener("touchend", S.default.handle)) : (e3[t3].removeEventListener("click", S.default.handle), e3[t3].addEventListener("click", S.default.handle));
        }
        function _2() {
          for (var e3 = document.getElementsByClassName("amplitude-volume-down"), t3 = 0; t3 < e3.length; t3++) /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? /iPhone|iPad|iPod/i.test(navigator.userAgent) ? J.default.writeMessage("iOS does NOT allow volume to be set through javascript: https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW4") : (e3[t3].removeEventListener("touchend", w.default.handle), e3[t3].addEventListener("touchend", w.default.handle)) : (e3[t3].removeEventListener("click", w.default.handle), e3[t3].addEventListener("click", w.default.handle));
        }
        function b2() {
          for (var e3 = window.navigator.userAgent, t3 = e3.indexOf("MSIE "), a3 = document.getElementsByClassName("amplitude-song-slider"), l3 = 0; l3 < a3.length; l3++) t3 > 0 || navigator.userAgent.match(/Trident.*rv\:11\./) ? (a3[l3].removeEventListener("change", k.default.handle), a3[l3].addEventListener("change", k.default.handle)) : (a3[l3].removeEventListener("input", k.default.handle), a3[l3].addEventListener("input", k.default.handle));
        }
        function x2() {
          for (var e3 = window.navigator.userAgent, t3 = e3.indexOf("MSIE "), a3 = document.getElementsByClassName("amplitude-volume-slider"), l3 = 0; l3 < a3.length; l3++) /iPhone|iPad|iPod/i.test(navigator.userAgent) ? J.default.writeMessage("iOS does NOT allow volume to be set through javascript: https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW4") : t3 > 0 || navigator.userAgent.match(/Trident.*rv\:11\./) ? (a3[l3].removeEventListener("change", O.default.handle), a3[l3].addEventListener("change", O.default.handle)) : (a3[l3].removeEventListener("input", O.default.handle), a3[l3].addEventListener("input", O.default.handle));
        }
        function P2() {
          for (var e3 = document.getElementsByClassName("amplitude-next"), t3 = 0; t3 < e3.length; t3++) /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (e3[t3].removeEventListener("touchend", N.default.handle), e3[t3].addEventListener("touchend", N.default.handle)) : (e3[t3].removeEventListener("click", N.default.handle), e3[t3].addEventListener("click", N.default.handle));
        }
        function L2() {
          for (var e3 = document.getElementsByClassName("amplitude-prev"), t3 = 0; t3 < e3.length; t3++) /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (e3[t3].removeEventListener("touchend", I.default.handle), e3[t3].addEventListener("touchend", I.default.handle)) : (e3[t3].removeEventListener("click", I.default.handle), e3[t3].addEventListener("click", I.default.handle));
        }
        function E2() {
          for (var e3 = document.getElementsByClassName("amplitude-shuffle"), t3 = 0; t3 < e3.length; t3++) e3[t3].classList.remove("amplitude-shuffle-on"), e3[t3].classList.add("amplitude-shuffle-off"), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (e3[t3].removeEventListener("touchend", U.default.handle), e3[t3].addEventListener("touchend", U.default.handle)) : (e3[t3].removeEventListener("click", U.default.handle), e3[t3].addEventListener("click", U.default.handle));
        }
        function T2() {
          for (var e3 = document.getElementsByClassName("amplitude-repeat"), t3 = 0; t3 < e3.length; t3++) e3[t3].classList.remove("amplitude-repeat-on"), e3[t3].classList.add("amplitude-repeat-off"), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (e3[t3].removeEventListener("touchend", z.default.handle), e3[t3].addEventListener("touchend", z.default.handle)) : (e3[t3].removeEventListener("click", z.default.handle), e3[t3].addEventListener("click", z.default.handle));
        }
        function C2() {
          for (var e3 = document.getElementsByClassName("amplitude-repeat-song"), t3 = 0; t3 < e3.length; t3++) e3[t3].classList.remove("amplitude-repeat-on"), e3[t3].classList.add("amplitude-repeat-off"), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (e3[t3].removeEventListener("touchend", B.default.handle), e3[t3].addEventListener("touchend", B.default.handle)) : (e3[t3].removeEventListener("click", B.default.handle), e3[t3].addEventListener("click", B.default.handle));
        }
        function j2() {
          for (var e3 = document.getElementsByClassName("amplitude-playback-speed"), t3 = 0; t3 < e3.length; t3++) /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (e3[t3].removeEventListener("touchend", R.default.handle), e3[t3].addEventListener("touchend", R.default.handle)) : (e3[t3].removeEventListener("click", R.default.handle), e3[t3].addEventListener("click", R.default.handle));
        }
        function q2() {
          for (var e3 = document.getElementsByClassName("amplitude-skip-to"), t3 = 0; t3 < e3.length; t3++) /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (e3[t3].removeEventListener("touchend", W.default.handle), e3[t3].addEventListener("touchend", W.default.handle)) : (e3[t3].removeEventListener("click", W.default.handle), e3[t3].addEventListener("click", W.default.handle));
        }
        function H2() {
          Y.default.determineIfUsingWaveforms() && (n.default.audio.removeEventListener("canplaythrough", Y.default.build), n.default.audio.addEventListener("canplaythrough", Y.default.build));
        }
        return { initialize: e2 };
      }();
      t.default = $, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(1), d = l(i), s = a(13), o = l(s), f = a(12), r = l(f), c = a(3), p2 = l(c), v = a(8), y = l(v), g = a(2), m = l(g), _ = /* @__PURE__ */ function() {
        function e2(e3) {
          t2(e3.which);
        }
        function t2(e3) {
          if (void 0 != n.default.bindings[e3]) switch (n.default.bindings[e3]) {
            case "play_pause":
              a2();
              break;
            case "next":
              l2();
              break;
            case "prev":
              u2();
              break;
            case "stop":
              i2();
              break;
            case "shuffle":
              s2();
              break;
            case "repeat":
              f2();
          }
        }
        function a2() {
          n.default.audio.paused ? d.default.play() : d.default.pause(), m.default.sync();
        }
        function l2() {
          "" == n.default.active_playlist || null == n.default.active_playlist ? p2.default.setNext() : p2.default.setNextPlaylist(n.default.active_playlist);
        }
        function u2() {
          "" == n.default.active_playlist || null == n.default.active_playlist ? p2.default.setPrevious() : p2.default.setPreviousPlaylist(n.default.active_playlist);
        }
        function i2() {
          m.default.syncToPause(), d.default.stop();
        }
        function s2() {
          "" == n.default.active_playlist || null == n.default.active_playlist ? o.default.toggleShuffle() : o.default.toggleShufflePlaylist(n.default.active_playlist);
        }
        function f2() {
          r.default.setRepeat(!n.default.repeat), y.default.syncRepeat();
        }
        return { handle: e2 };
      }();
      t.default = _, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(1), d = l(i), s = a(10), o = l(s), f = a(11), r = l(f), c = /* @__PURE__ */ function() {
        function e2() {
          n.default.is_touch_moving || (0 == n.default.volume ? d.default.setVolume(n.default.pre_mute_volume) : (n.default.pre_mute_volume = n.default.volume, d.default.setVolume(0)), o.default.setMuted(0 == n.default.volume), r.default.sync());
        }
        return { handle: e2 };
      }();
      t.default = c, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(1), d = (l(i), a(2)), s = (l(d), a(9)), o = (l(s), a(3)), f = l(o), r = a(4), c = l(r), p2 = /* @__PURE__ */ function() {
        function e2() {
          if (!n.default.is_touch_moving) {
            var e3 = this.getAttribute("data-amplitude-playlist");
            null == e3 && t2(), null != e3 && a2(e3);
          }
        }
        function t2() {
          "" == n.default.active_playlist || null == n.default.active_playlist ? f.default.setNext() : f.default.setNextPlaylist(n.default.active_playlist);
        }
        function a2(e3) {
          e3 == n.default.active_playlist ? f.default.setNextPlaylist(e3) : c.default.writeMessage("You can not go to the next song on a playlist that is not being played!");
        }
        return { handle: e2 };
      }();
      t.default = p2, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(6), d = (l(i), a(1)), s = l(d), o = a(2), f = l(o), r = /* @__PURE__ */ function() {
        function e2() {
          if (!n.default.is_touch_moving) {
            var e3 = this.getAttribute("data-amplitude-song-index"), i2 = this.getAttribute("data-amplitude-playlist");
            null == i2 && null == e3 && t2(), null != i2 && null == e3 && a2(i2), null == i2 && null != e3 && l2(e3), null != i2 && null != e3 && u2(i2, e3);
          }
        }
        function t2() {
          s.default.pause(), f.default.sync();
        }
        function a2(e3) {
          n.default.active_playlist == e3 && (s.default.pause(), f.default.sync());
        }
        function l2(e3) {
          "" != n.default.active_playlist && null != n.default.active_playlist || n.default.active_index != e3 || (s.default.pause(), f.default.sync());
        }
        function u2(e3, t3) {
          n.default.active_playlist == e3 && n.default.playlists[e3].active_index == t3 && (s.default.pause(), f.default.sync());
        }
        return { handle: e2 };
      }();
      t.default = r, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(6), d = (l(i), a(1)), s = l(d), o = a(5), f = l(o), r = a(3), c = l(r), p2 = a(2), v = l(p2), y = /* @__PURE__ */ function() {
        function e2() {
          if (!n.default.is_touch_moving) {
            var e3 = this.getAttribute("data-amplitude-song-index"), i2 = this.getAttribute("data-amplitude-playlist");
            null == i2 && null == e3 && t2(), null != i2 && null == e3 && a2(i2), null == i2 && null != e3 && l2(e3), null != i2 && null != e3 && u2(i2, e3);
          }
        }
        function t2() {
          s.default.play(), v.default.sync();
        }
        function a2(e3) {
          f.default.newPlaylist(e3) && (c.default.setActivePlaylist(e3), n.default.playlists[e3].shuffle ? c.default.changeSongPlaylist(e3, n.default.playlists[e3].shuffle_list[0], 0) : c.default.changeSongPlaylist(e3, n.default.playlists[e3].songs[0], 0)), s.default.play(), v.default.sync();
        }
        function l2(e3) {
          f.default.newPlaylist(null) && (c.default.setActivePlaylist(null), c.default.changeSong(n.default.songs[e3], e3)), f.default.newSong(null, e3) && c.default.changeSong(n.default.songs[e3], e3), s.default.play(), v.default.sync();
        }
        function u2(e3, t3) {
          f.default.newPlaylist(e3) && (c.default.setActivePlaylist(e3), c.default.changeSongPlaylist(e3, n.default.playlists[e3].songs[t3], t3)), f.default.newSong(e3, t3) && c.default.changeSongPlaylist(e3, n.default.playlists[e3].songs[t3], t3), s.default.play(), v.default.sync();
        }
        return { handle: e2 };
      }();
      t.default = y, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(6), d = (l(i), a(1)), s = l(d), o = a(5), f = l(o), r = a(3), c = l(r), p2 = a(2), v = l(p2), y = /* @__PURE__ */ function() {
        function e2() {
          if (!n.default.is_touch_moving) {
            var e3 = this.getAttribute("data-amplitude-playlist"), i2 = this.getAttribute("data-amplitude-song-index");
            null == e3 && null == i2 && t2(), null != e3 && null == i2 && a2(e3), null == e3 && null != i2 && l2(i2), null != e3 && null != i2 && u2(e3, i2);
          }
        }
        function t2() {
          n.default.audio.paused ? s.default.play() : s.default.pause(), v.default.sync();
        }
        function a2(e3) {
          f.default.newPlaylist(e3) && (c.default.setActivePlaylist(e3), n.default.playlists[e3].shuffle ? c.default.changeSongPlaylist(e3, n.default.playlists[e3].shuffle_list[0], 0, true) : c.default.changeSongPlaylist(e3, n.default.playlists[e3].songs[0], 0)), n.default.audio.paused ? s.default.play() : s.default.pause(), v.default.sync();
        }
        function l2(e3) {
          f.default.newPlaylist(null) && (c.default.setActivePlaylist(null), c.default.changeSong(n.default.songs[e3], e3, true)), f.default.newSong(null, e3) && c.default.changeSong(n.default.songs[e3], e3, true), n.default.audio.paused ? s.default.play() : s.default.pause(), v.default.sync();
        }
        function u2(e3, t3) {
          f.default.newPlaylist(e3) && (c.default.setActivePlaylist(e3), c.default.changeSongPlaylist(e3, n.default.playlists[e3].songs[t3], t3, true)), f.default.newSong(e3, t3) && c.default.changeSongPlaylist(e3, n.default.playlists[e3].songs[t3], t3, true), n.default.audio.paused ? s.default.play() : s.default.pause(), v.default.sync();
        }
        return { handle: e2 };
      }();
      t.default = y, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(1), d = l(i), s = a(18), o = l(s), f = /* @__PURE__ */ function() {
        function e2() {
          if (!n.default.is_touch_moving) {
            switch (n.default.playback_speed) {
              case 1:
                d.default.setPlaybackSpeed(1.5);
                break;
              case 1.5:
                d.default.setPlaybackSpeed(2);
                break;
              case 2:
                d.default.setPlaybackSpeed(1);
            }
            o.default.sync();
          }
        }
        return { handle: e2 };
      }();
      t.default = f, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(3), d = l(i), s = a(4), o = l(s), f = /* @__PURE__ */ function() {
        function e2() {
          if (!n.default.is_touch_moving) {
            var e3 = this.getAttribute("data-amplitude-playlist");
            null == e3 && t2(), null != e3 && a2(e3);
          }
        }
        function t2() {
          "" == n.default.active_playlist || null == n.default.active_playlist ? d.default.setPrevious() : d.default.setPreviousPlaylist(n.default.active_playlist);
        }
        function a2(e3) {
          e3 == n.default.active_playlist ? d.default.setPreviousPlaylist(n.default.active_playlist) : o.default.writeMessage("You can not go to the previous song on a playlist that is not being played!");
        }
        return { handle: e2 };
      }();
      t.default = f, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(24), d = l(i), s = /* @__PURE__ */ function() {
        function e2() {
          if (n.default.audio.buffered.length - 1 >= 0) {
            var e3 = n.default.audio.buffered.end(n.default.audio.buffered.length - 1), t2 = n.default.audio.duration;
            n.default.buffered = e3 / t2 * 100;
          }
          d.default.sync();
        }
        return { handle: e2 };
      }();
      t.default = s, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(12), d = l(i), s = a(8), o = l(s), f = /* @__PURE__ */ function() {
        function e2() {
          if (!n.default.is_touch_moving) {
            var e3 = this.getAttribute("data-amplitude-playlist");
            null == e3 && t2(), null != e3 && a2(e3);
          }
        }
        function t2() {
          d.default.setRepeat(!n.default.repeat), o.default.syncRepeat();
        }
        function a2(e3) {
          d.default.setRepeatPlaylist(!n.default.playlists[e3].repeat, e3), o.default.syncRepeatPlaylist(e3);
        }
        return { handle: e2 };
      }();
      t.default = f, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(12), d = l(i), s = a(8), o = l(s), f = /* @__PURE__ */ function() {
        function e2() {
          n.default.is_touch_moving || (d.default.setRepeatSong(!n.default.repeat_song), o.default.syncRepeatSong());
        }
        return { handle: e2 };
      }();
      t.default = f, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(13), d = l(i), s = a(19), o = l(s), f = /* @__PURE__ */ function() {
        function e2() {
          if (!n.default.is_touch_moving) {
            var e3 = this.getAttribute("data-amplitude-playlist");
            null == e3 ? t2() : a2(e3);
          }
        }
        function t2() {
          d.default.toggleShuffle(), o.default.syncMain(n.default.shuffle_on);
        }
        function a2(e3) {
          d.default.toggleShufflePlaylist(e3), o.default.syncPlaylist(e3);
        }
        return { handle: e2 };
      }();
      t.default = f, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(4), d = l(i), s = a(3), o = l(s), f = a(5), r = l(f), c = a(1), p2 = l(c), v = a(2), y = l(v), g = /* @__PURE__ */ function() {
        function e2() {
          if (!n.default.is_touch_moving) {
            var e3 = this.getAttribute("data-amplitude-playlist"), l2 = this.getAttribute("data-amplitude-song-index"), u2 = this.getAttribute("data-amplitude-location");
            null == u2 && d.default.writeMessage("You must add an 'data-amplitude-location' attribute in seconds to your 'amplitude-skip-to' element."), null == l2 && d.default.writeMessage("You must add an 'data-amplitude-song-index' attribute to your 'amplitude-skip-to' element."), null != u2 && null != l2 && (null == e3 ? t2(parseInt(l2), parseInt(u2)) : a2(e3, parseInt(l2), parseInt(u2)));
          }
        }
        function t2(e3, t3) {
          o.default.changeSong(n.default.songs[e3], e3), p2.default.play(), y.default.syncGlobal(), y.default.syncSong(), p2.default.skipToLocation(t3);
        }
        function a2(e3, t3, a3) {
          r.default.newPlaylist(e3) && o.default.setActivePlaylist(e3), o.default.changeSongPlaylist(e3, n.default.playlists[e3].songs[t3], t3), p2.default.play(), y.default.syncGlobal(), y.default.syncPlaylist(), y.default.syncSong(), p2.default.skipToLocation(a3);
        }
        return { handle: e2 };
      }();
      t.default = g, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(23), d = l(i), s = a(14), o = l(s), f = /* @__PURE__ */ function() {
        function e2() {
          var e3 = this.value, i2 = n.default.audio.duration * (e3 / 100), d2 = this.getAttribute("data-amplitude-playlist"), s2 = this.getAttribute("data-amplitude-song-index");
          null == d2 && null == s2 && t2(i2, e3), null != d2 && null == s2 && a2(i2, e3, d2), null == d2 && null != s2 && l2(i2, e3, s2), null != d2 && null != s2 && u2(i2, e3, d2, s2);
        }
        function t2(e3, t3) {
          n.default.active_metadata.live || (d.default.setCurrentTime(e3), o.default.sync(t3, n.default.active_playlist, n.default.active_index));
        }
        function a2(e3, t3, a3) {
          n.default.active_playlist == a3 && (n.default.active_metadata.live || (d.default.setCurrentTime(e3), o.default.sync(t3, a3, n.default.active_index)));
        }
        function l2(e3, t3, a3) {
          n.default.active_index == a3 && null == n.default.active_playlist && (n.default.active_metadata.live || (d.default.setCurrentTime(e3), o.default.sync(t3, n.default.active_playlist, a3)));
        }
        function u2(e3, t3, a3, l3) {
          n.default.playlists[a3].active_index == l3 && n.default.active_playlist == a3 && (n.default.active_metadata.live || (d.default.setCurrentTime(e3), o.default.sync(t3, a3, l3)));
        }
        return { handle: e2 };
      }();
      t.default = f, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(6), d = (l(i), a(2)), s = l(d), o = a(1), f = l(o), r = /* @__PURE__ */ function() {
        function e2() {
          n.default.is_touch_moving || (s.default.syncToPause(), f.default.stop());
        }
        return { handle: e2 };
      }();
      t.default = r, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(24), d = l(i), s = a(15), o = l(s), f = a(14), r = l(f), c = a(20), p2 = l(c), v = a(23), y = l(v), g = a(9), m = (l(g), /* @__PURE__ */ function() {
        function e2() {
          t2(), d.default.sync(), a2(), l2();
        }
        function t2() {
          if (n.default.audio.buffered.length - 1 >= 0) {
            var e3 = n.default.audio.buffered.end(n.default.audio.buffered.length - 1), t3 = n.default.audio.duration;
            n.default.buffered = e3 / t3 * 100;
          }
        }
        function a2() {
          if (!n.default.active_metadata.live) {
            var e3 = y.default.computeCurrentTimes(), t3 = y.default.computeSongCompletionPercentage(), a3 = y.default.computeSongDuration();
            o.default.syncCurrentTimes(e3), r.default.sync(t3, n.default.active_playlist, n.default.active_index), p2.default.sync(t3), o.default.syncDurationTimes(e3, a3);
          }
        }
        function l2() {
          var e3 = Math.floor(n.default.audio.currentTime);
          if (void 0 != n.default.active_metadata.time_callbacks && void 0 != n.default.active_metadata.time_callbacks[e3]) n.default.active_metadata.time_callbacks[e3].run || (n.default.active_metadata.time_callbacks[e3].run = true, n.default.active_metadata.time_callbacks[e3]());
          else for (var t3 in n.default.active_metadata.time_callbacks) n.default.active_metadata.time_callbacks.hasOwnProperty(t3) && (n.default.active_metadata.time_callbacks[t3].run = false);
        }
        return { handle: e2 };
      }());
      t.default = m, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(1), d = l(i), s = a(10), o = l(s), f = a(11), r = l(f), c = /* @__PURE__ */ function() {
        function e2() {
          if (!n.default.is_touch_moving) {
            var e3 = null;
            e3 = n.default.volume - n.default.volume_increment > 0 ? n.default.volume - n.default.volume_increment : 0, d.default.setVolume(e3), o.default.setMuted(0 == n.default.volume), r.default.sync();
          }
        }
        return { handle: e2 };
      }();
      t.default = c, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(1), d = l(i), s = a(10), o = l(s), f = a(11), r = l(f), c = /* @__PURE__ */ function() {
        function e2() {
          d.default.setVolume(this.value), o.default.setMuted(0 == n.default.volume), r.default.sync();
        }
        return { handle: e2 };
      }();
      t.default = c, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(1), d = l(i), s = a(10), o = l(s), f = a(11), r = l(f), c = /* @__PURE__ */ function() {
        function e2() {
          if (!n.default.is_touch_moving) {
            var e3 = null;
            e3 = n.default.volume + n.default.volume_increment <= 100 ? n.default.volume + n.default.volume_increment : 100, d.default.setVolume(e3), o.default.setMuted(0 == n.default.volume), r.default.sync();
          }
        }
        return { handle: e2 };
      }();
      t.default = c, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2() {
          var e3 = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext;
          e3 ? (u.default.context = new e3(), u.default.analyser = u.default.context.createAnalyser(), u.default.audio.crossOrigin = "anonymous", u.default.source = u.default.context.createMediaElementSource(u.default.audio), u.default.source.connect(u.default.analyser), u.default.analyser.connect(u.default.context.destination)) : AmplitudeHelpers.writeDebugMessage("Web Audio API is unavailable! We will set any of your visualizations with your back up definition!");
        }
        function t2() {
          var e3 = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext;
          return u.default.web_audio_api_available = false, e3 ? (u.default.web_audio_api_available = true, true) : (u.default.web_audio_api_available = false, false);
        }
        function a2() {
          var e3 = document.querySelectorAll(".amplitude-wave-form"), t3 = document.querySelectorAll(".amplitude-visualization");
          return e3.length > 0 || t3.length > 0;
        }
        return { configureWebAudioAPI: e2, webAudioAPIAvailable: t2, determineUsingAnyFX: a2 };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(21), n = l(u), i = a(0), d = l(i), s = a(1), o = l(s), f = a(13), r = l(f), c = a(6), p2 = (l(c), a(3)), v = l(p2), y = a(12), g = l(y), m = a(5), _ = l(m), h2 = a(16), b = l(h2), A = a(19), x = l(A), M = a(8), P = l(M), S = a(14), L = l(S), w = a(20), E = l(w), k = a(15), T = l(k), O = a(2), C = l(O), N = a(7), j = l(N), I = a(18), q = l(I), z = a(4), H = l(z), B = a(17), D = l(B), R = /* @__PURE__ */ function() {
        function e2(e3) {
          n.default.initialize(e3);
        }
        function t2() {
          return d.default;
        }
        function a2() {
          n.default.rebindDisplay();
        }
        function l2() {
          return d.default.active_playlist;
        }
        function u2() {
          return d.default.playback_speed;
        }
        function i2(e3) {
          o.default.setPlaybackSpeed(e3), q.default.sync();
        }
        function s2() {
          return d.default.repeat;
        }
        function f2(e3) {
          return d.default.playlists[e3].repeat;
        }
        function c2() {
          return d.default.shuffle_on;
        }
        function p3(e3) {
          return d.default.playlists[e3].shuffle;
        }
        function y2(e3) {
          r.default.setShuffle(e3), x.default.syncMain();
        }
        function m2(e3, t3) {
          r.default.setShufflePlaylist(e3, t3), x.default.syncMain(), x.default.syncPlaylist(e3);
        }
        function h3(e3) {
          g.default.setRepeat(e3), P.default.syncRepeat();
        }
        function A2(e3, t3) {
          g.default.setRepeatPlaylist(t3, e3), P.default.syncRepeatPlaylist(e3);
        }
        function M2(e3) {
          d.default.is_touch_moving || (g.default.setRepeatSong(!d.default.repeat_song), P.default.syncRepeatSong());
        }
        function S2() {
          return d.default.default_album_art;
        }
        function w2() {
          return d.default.default_playlist_art;
        }
        function k2(e3) {
          d.default.default_album_art = e3;
        }
        function O2(e3) {
          d.default.default_plalist_art = e3;
        }
        function N2() {
          return d.default.audio.currentTime / d.default.audio.duration * 100;
        }
        function I2() {
          return d.default.audio.currentTime;
        }
        function z2() {
          return d.default.audio.duration;
        }
        function B2(e3) {
          "number" == typeof e3 && e3 > 0 && e3 < 100 && (d.default.audio.currentTime = d.default.audio.duration * (e3 / 100));
        }
        function R2(e3) {
          d.default.debug = e3;
        }
        function V() {
          return d.default.active_metadata;
        }
        function U() {
          return d.default.playlists[d.default.active_playlist];
        }
        function F(e3) {
          return d.default.songs[e3];
        }
        function W(e3, t3) {
          return d.default.playlists[e3].songs[t3];
        }
        function G(e3) {
          return void 0 == d.default.songs && (d.default.songs = []), d.default.songs.push(e3), d.default.shuffle_on && d.default.shuffle_list.push(e3), D.default.isSoundCloudURL(e3.url) && D.default.resolveIndividualStreamableURL(e3.url, null, d.default.songs.length - 1, d.default.shuffle_on), d.default.songs.length - 1;
        }
        function Y(e3) {
          return void 0 == d.default.songs && (d.default.songs = []), d.default.songs.unshift(e3), d.default.shuffle_on && d.default.shuffle_list.unshift(e3), D.default.isSoundCloudURL(e3.url) && D.default.resolveIndividualStreamableURL(e3.url, null, d.default.songs.length - 1, d.default.shuffle_on), 0;
        }
        function X(e3, t3) {
          return void 0 != d.default.playlists[t3] ? (d.default.playlists[t3].songs.push(e3), d.default.playlists[t3].shuffle && d.default.playlists[t3].shuffle_list.push(e3), D.default.isSoundCloudURL(e3.url) && D.default.resolveIndividualStreamableURL(e3.url, t3, d.default.playlists[t3].songs.length - 1, d.default.playlists[t3].shuffle), d.default.playlists[t3].songs.length - 1) : (H.default.writeMessage("Playlist doesn't exist!"), null);
        }
        function J(e3, t3, a3) {
          if (void 0 == d.default.playlists[e3]) {
            d.default.playlists[e3] = {};
            var l3 = ["repeat", "shuffle", "shuffle_list", "songs", "src"];
            for (var u3 in t3) l3.indexOf(u3) < 0 && (d.default.playlists[e3][u3] = t3[u3]);
            return d.default.playlists[e3].songs = a3, d.default.playlists[e3].active_index = null, d.default.playlists[e3].repeat = false, d.default.playlists[e3].shuffle = false, d.default.playlists[e3].shuffle_list = [], d.default.playlists[e3];
          }
          return H.default.writeMessage("A playlist already exists with that key!"), null;
        }
        function $(e3) {
          d.default.songs.splice(e3, 1);
        }
        function Q(e3, t3) {
          void 0 != d.default.playlists[t3] && d.default.playlists[t3].songs.splice(e3, 1);
        }
        function K(e3) {
          e3.url ? (d.default.audio.src = e3.url, d.default.active_metadata = e3, d.default.active_album = e3.album) : H.default.writeMessage("The song needs to have a URL!"), o.default.play(), C.default.sync(), j.default.displayMetaData(), L.default.resetElements(), E.default.resetElements(), T.default.resetCurrentTimes(), T.default.resetDurationTimes();
        }
        function Z(e3) {
          o.default.stop(), _.default.newPlaylist(null) && (v.default.setActivePlaylist(null), v.default.changeSong(d.default.songs[e3], e3)), _.default.newSong(null, e3) && v.default.changeSong(d.default.songs[e3], e3), o.default.play(), C.default.sync();
        }
        function ee(e3, t3) {
          o.default.stop(), _.default.newPlaylist(t3) && (v.default.setActivePlaylist(t3), v.default.changeSongPlaylist(t3, d.default.playlists[t3].songs[e3], e3)), _.default.newSong(t3, e3) && v.default.changeSongPlaylist(t3, d.default.playlists[t3].songs[e3], e3), C.default.sync(), o.default.play();
        }
        function te() {
          o.default.play();
        }
        function ae() {
          o.default.pause();
        }
        function le() {
          o.default.stop();
        }
        function ue() {
          return d.default.audio;
        }
        function ne() {
          return d.default.analyser;
        }
        function ie() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
          "" == e3 || null == e3 ? null == d.default.active_playlist || "" == d.default.active_playlist ? v.default.setNext() : v.default.setNextPlaylist(d.default.active_playlist) : v.default.setNextPlaylist(e3);
        }
        function de() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
          "" == e3 || null == e3 ? null == d.default.active_playlist || "" == d.default.active_playlist ? v.default.setPrevious() : v.default.setPreviousPlaylist(d.default.active_playlist) : v.default.setPreviousPlaylist(e3);
        }
        function se() {
          return d.default.songs;
        }
        function oe(e3) {
          return d.default.playlists[e3].songs;
        }
        function fe() {
          return d.default.shuffle_on ? d.default.shuffle_list : d.default.songs;
        }
        function re(e3) {
          return d.default.playlists[e3].shuffle ? d.default.playlists[e3].shuffle_list : d.default.playlists[e3].songs;
        }
        function ce() {
          return parseInt(d.default.active_index);
        }
        function pe() {
          return d.default.version;
        }
        function ve() {
          return d.default.buffered;
        }
        function ye(e3, t3) {
          var a3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
          e3 = parseInt(e3), null != a3 ? (_.default.newPlaylist(a3) && v.default.setActivePlaylist(a3), v.default.changeSongPlaylist(a3, d.default.playlists[a3].songs[t3], t3), o.default.play(), C.default.syncGlobal(), C.default.syncPlaylist(), C.default.syncSong(), o.default.skipToLocation(e3)) : (v.default.changeSong(d.default.songs[t3], t3), o.default.play(), C.default.syncGlobal(), C.default.syncSong(), o.default.skipToLocation(e3));
        }
        function ge(e3, t3) {
          var a3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
          if ("" != a3 && null != a3 && void 0 != d.default.playlists[a3]) for (var l3 in t3) t3.hasOwnProperty(l3) && "url" != l3 && "URL" != l3 && "live" != l3 && "LIVE" != l3 && (d.default.playlists[a3].songs[e3][l3] = t3[l3]);
          else for (var l3 in t3) t3.hasOwnProperty(l3) && "url" != l3 && "URL" != l3 && "live" != l3 && "LIVE" != l3 && (d.default.songs[e3][l3] = t3[l3]);
          j.default.displayMetaData(), j.default.syncMetaData();
        }
        function me(e3, t3) {
          if (void 0 != d.default.playlists[e3]) {
            var a3 = ["repeat", "shuffle", "shuffle_list", "songs", "src"];
            for (var l3 in t3) t3.hasOwnProperty(l3) && a3.indexOf(l3) < 0 && (d.default.playlists[e3][l3] = t3[l3]);
            j.default.displayPlaylistMetaData();
          } else H.default.writeMessage("You must provide a valid playlist key!");
        }
        function _e(e3) {
          d.default.delay = e3;
        }
        function he() {
          return d.default.delay;
        }
        function be() {
          return d.default.player_state;
        }
        function Ae(e3, t3) {
          b.default.register(e3, t3);
        }
        function xe(e3, t3) {
          void 0 != d.default.playlists[e3] ? void 0 != d.default.visualizations.available[t3] ? d.default.playlists[e3].visualization = t3 : H.default.writeMessage("A visualization does not exist for the key provided.") : H.default.writeMessage("The playlist for the key provided does not exist");
        }
        function Me(e3, t3) {
          d.default.songs[e3] ? void 0 != d.default.visualizations.available[t3] ? d.default.songs[e3].visualization = t3 : H.default.writeMessage("A visualization does not exist for the key provided.") : H.default.writeMessage("A song at that index is undefined");
        }
        function Pe(e3, t3, a3) {
          void 0 != d.default.playlists[e3].songs[t3] ? void 0 != d.default.visualizations.available[a3] ? d.default.playlists[e3].songs[t3].visualization = a3 : H.default.writeMessage("A visualization does not exist for the key provided.") : H.default.writeMessage("The song in the playlist at that key is not defined");
        }
        function Se(e3) {
          void 0 != d.default.visualizations.available[e3] ? d.default.visualization = e3 : H.default.writeMessage("A visualization does not exist for the key provided.");
        }
        function Le(e3) {
          o.default.setVolume(e3);
        }
        function we() {
          return d.default.volume;
        }
        return { init: e2, getConfig: t2, bindNewElements: a2, getActivePlaylist: l2, getPlaybackSpeed: u2, setPlaybackSpeed: i2, getRepeat: s2, getRepeatPlaylist: f2, getShuffle: c2, getShufflePlaylist: p3, setShuffle: y2, setShufflePlaylist: m2, setRepeat: h3, setRepeatSong: M2, setRepeatPlaylist: A2, getDefaultAlbumArt: S2, setDefaultAlbumArt: k2, getDefaultPlaylistArt: w2, setDefaultPlaylistArt: O2, getSongPlayedPercentage: N2, setSongPlayedPercentage: B2, getSongPlayedSeconds: I2, getSongDuration: z2, setDebug: R2, getActiveSongMetadata: V, getActivePlaylistMetadata: U, getSongAtIndex: F, getSongAtPlaylistIndex: W, addSong: G, prependSong: Y, addSongToPlaylist: X, removeSong: $, removeSongFromPlaylist: Q, playNow: K, playSongAtIndex: Z, playPlaylistSongAtIndex: ee, play: te, pause: ae, stop: le, getAudio: ue, getAnalyser: ne, next: ie, prev: de, getSongs: se, getSongsInPlaylist: oe, getSongsState: fe, getSongsStatePlaylist: re, getActiveIndex: ce, getVersion: pe, getBuffered: ve, skipTo: ye, setSongMetaData: ge, setPlaylistMetaData: me, setDelay: _e, getDelay: he, getPlayerState: be, addPlaylist: J, registerVisualization: Ae, setPlaylistVisualization: xe, setSongVisualization: Me, setSongInPlaylistVisualization: Pe, setGlobalVisualization: Se, getVolume: we, setVolume: Le };
      }();
      t.default = R, e.exports = t.default;
    }, function(e, t, a) {
      function l(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var u = a(0), n = l(u), i = a(4), d = l(i), s = a(5), o = l(s), f = a(7), r = l(f), c = a(17), p2 = l(c), v = /* @__PURE__ */ function() {
        function e2(e3) {
          n.default.playlists = e3, a2(), l2(), t2(), u2(), i2(), s2(), f2();
        }
        function t2() {
          for (var e3 in n.default.playlists) n.default.playlists[e3].active_index = null;
        }
        function a2() {
          for (var e3 in n.default.playlists) if (n.default.playlists.hasOwnProperty(e3) && n.default.playlists[e3].songs) for (var t3 = 0; t3 < n.default.playlists[e3].songs.length; t3++) o.default.isInt(n.default.playlists[e3].songs[t3]) && (n.default.playlists[e3].songs[t3] = n.default.songs[n.default.playlists[e3].songs[t3]], n.default.playlists[e3].songs[t3].index = t3), o.default.isInt(n.default.playlists[e3].songs[t3]) && !n.default.songs[n.default.playlists[e3].songs[t3]] && d.default.writeMessage("The song index: " + n.default.playlists[e3].songs[t3] + " in playlist with key: " + e3 + " is not defined in your songs array!"), o.default.isInt(n.default.playlists[e3].songs[t3]) || (n.default.playlists[e3].songs[t3].index = t3);
        }
        function l2() {
          for (var e3 in n.default.playlists) if (n.default.playlists.hasOwnProperty(e3)) for (var t3 = 0; t3 < n.default.playlists[e3].songs.length; t3++) p2.default.isSoundCloudURL(n.default.playlists[e3].songs[t3].url) && void 0 == n.default.playlists[e3].songs[t3].soundcloud_data && p2.default.resolveIndividualStreamableURL(n.default.playlists[e3].songs[t3].url, e3, t3);
        }
        function u2() {
          for (var e3 in n.default.playlists) n.default.playlists[e3].shuffle = false;
        }
        function i2() {
          for (var e3 in n.default.playlists) n.default.playlists[e3].repeat = false;
        }
        function s2() {
          for (var e3 in n.default.playlists) n.default.playlists[e3].shuffle_list = [];
        }
        function f2() {
          for (var e3 in n.default.playlists) r.default.setFirstSongInPlaylist(n.default.playlists[e3].songs[0], e3);
        }
        return { initialize: e2 };
      }();
      t.default = v, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3) {
          for (var t2 = document.getElementsByClassName("amplitude-song-container"), a2 = 0; a2 < t2.length; a2++) t2[a2].classList.remove("amplitude-active-song-container");
          if ("" == u.default.active_playlist || null == u.default.active_playlist) {
            var l2 = "";
            if (l2 = e3 ? u.default.active_index : u.default.shuffle_on ? u.default.shuffle_list[u.default.active_index].index : u.default.active_index, document.querySelectorAll('.amplitude-song-container[data-amplitude-song-index="' + l2 + '"]')) for (var n2 = document.querySelectorAll('.amplitude-song-container[data-amplitude-song-index="' + l2 + '"]'), i = 0; i < n2.length; i++) n2[i].hasAttribute("data-amplitude-playlist") || n2[i].classList.add("amplitude-active-song-container");
          } else {
            if (null != u.default.active_playlist && "" != u.default.active_playlist || e3) var d = u.default.playlists[u.default.active_playlist].active_index;
            else {
              var d = "";
              d = u.default.playlists[u.default.active_playlist].shuffle ? u.default.playlists[u.default.active_playlist].shuffle_list[u.default.playlists[u.default.active_playlist].active_index].index : u.default.playlists[u.default.active_playlist].active_index;
            }
            if (document.querySelectorAll('.amplitude-song-container[data-amplitude-song-index="' + d + '"][data-amplitude-playlist="' + u.default.active_playlist + '"]')) for (var s = document.querySelectorAll('.amplitude-song-container[data-amplitude-song-index="' + d + '"][data-amplitude-playlist="' + u.default.active_playlist + '"]'), o = 0; o < s.length; o++) s[o].classList.add("amplitude-active-song-container");
          }
        }
        return { setActive: e2 };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3) {
          t2(e3), a2(e3), l2(e3), n2(e3);
        }
        function t2(e3) {
          for (var t3 = document.querySelectorAll(".amplitude-current-hours"), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist"), u2 = t3[a3].getAttribute("data-amplitude-song-index");
            null == l3 && null == u2 && (t3[a3].innerHTML = e3);
          }
        }
        function a2(e3) {
          for (var t3 = document.querySelectorAll('.amplitude-current-hours[data-amplitude-playlist="' + u.default.active_playlist + '"]'), a3 = 0; a3 < t3.length; a3++) {
            null == t3[a3].getAttribute("data-amplitude-song-index") && (t3[a3].innerHTML = e3);
          }
        }
        function l2(e3) {
          if (null == u.default.active_playlist) for (var t3 = document.querySelectorAll('.amplitude-current-hours[data-amplitude-song-index="' + u.default.active_index + '"]'), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist");
            null == l3 && (t3[a3].innerHTML = e3);
          }
        }
        function n2(e3) {
          for (var t3 = "" != u.default.active_playlist && null != u.default.active_playlist ? u.default.playlists[u.default.active_playlist].active_index : null, a3 = document.querySelectorAll('.amplitude-current-hours[data-amplitude-playlist="' + u.default.active_playlist + '"][data-amplitude-song-index="' + t3 + '"]'), l3 = 0; l3 < a3.length; l3++) a3[l3].innerHTML = e3;
        }
        function i() {
          for (var e3 = document.querySelectorAll(".amplitude-current-hours"), t3 = 0; t3 < e3.length; t3++) e3[t3].innerHTML = "00";
        }
        return { sync: e2, resetTimes: i };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3) {
          t2(e3), a2(e3), l2(e3), n2(e3);
        }
        function t2(e3) {
          for (var t3 = document.querySelectorAll(".amplitude-current-minutes"), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist"), u2 = t3[a3].getAttribute("data-amplitude-song-index");
            null == l3 && null == u2 && (t3[a3].innerHTML = e3);
          }
        }
        function a2(e3) {
          for (var t3 = document.querySelectorAll('.amplitude-current-minutes[data-amplitude-playlist="' + u.default.active_playlist + '"]'), a3 = 0; a3 < t3.length; a3++) {
            null == t3[a3].getAttribute("data-amplitude-song-index") && (t3[a3].innerHTML = e3);
          }
        }
        function l2(e3) {
          if (null == u.default.active_playlist) for (var t3 = document.querySelectorAll('.amplitude-current-minutes[data-amplitude-song-index="' + u.default.active_index + '"]'), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist");
            null == l3 && (t3[a3].innerHTML = e3);
          }
        }
        function n2(e3) {
          for (var t3 = "" != u.default.active_playlist && null != u.default.active_playlist ? u.default.playlists[u.default.active_playlist].active_index : null, a3 = document.querySelectorAll('.amplitude-current-minutes[data-amplitude-playlist="' + u.default.active_playlist + '"][data-amplitude-song-index="' + t3 + '"]'), l3 = 0; l3 < a3.length; l3++) a3[l3].innerHTML = e3;
        }
        function i() {
          for (var e3 = document.querySelectorAll(".amplitude-current-minutes"), t3 = 0; t3 < e3.length; t3++) e3[t3].innerHTML = "00";
        }
        return { sync: e2, resetTimes: i };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3) {
          t2(e3), a2(e3), l2(e3), n2(e3);
        }
        function t2(e3) {
          for (var t3 = document.querySelectorAll(".amplitude-current-seconds"), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist"), u2 = t3[a3].getAttribute("data-amplitude-song-index");
            null == l3 && null == u2 && (t3[a3].innerHTML = e3);
          }
        }
        function a2(e3) {
          for (var t3 = document.querySelectorAll('.amplitude-current-seconds[data-amplitude-playlist="' + u.default.active_playlist + '"]'), a3 = 0; a3 < t3.length; a3++) {
            null == t3[a3].getAttribute("data-amplitude-song-index") && (t3[a3].innerHTML = e3);
          }
        }
        function l2(e3) {
          if (null == u.default.active_playlist) for (var t3 = document.querySelectorAll('.amplitude-current-seconds[data-amplitude-song-index="' + u.default.active_index + '"]'), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist");
            null == l3 && (t3[a3].innerHTML = e3);
          }
        }
        function n2(e3) {
          for (var t3 = "" != u.default.active_playlist && null != u.default.active_playlist ? u.default.playlists[u.default.active_playlist].active_index : null, a3 = document.querySelectorAll('.amplitude-current-seconds[data-amplitude-playlist="' + u.default.active_playlist + '"][data-amplitude-song-index="' + t3 + '"]'), l3 = 0; l3 < a3.length; l3++) a3[l3].innerHTML = e3;
        }
        function i() {
          for (var e3 = document.querySelectorAll(".amplitude-current-seconds"), t3 = 0; t3 < e3.length; t3++) e3[t3].innerHTML = "00";
        }
        return { sync: e2, resetTimes: i };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3) {
          t2(e3), a2(e3), l2(e3), n2(e3);
        }
        function t2(e3) {
          var t3 = document.querySelectorAll(".amplitude-current-time"), a3 = e3.minutes + ":" + e3.seconds;
          e3.hours > 0 && (a3 = e3.hours + ":" + a3);
          for (var l3 = 0; l3 < t3.length; l3++) {
            var u2 = t3[l3].getAttribute("data-amplitude-playlist"), n3 = t3[l3].getAttribute("data-amplitude-song-index");
            null == u2 && null == n3 && (t3[l3].innerHTML = a3);
          }
        }
        function a2(e3) {
          var t3 = document.querySelectorAll('.amplitude-current-time[data-amplitude-playlist="' + u.default.active_playlist + '"]'), a3 = e3.minutes + ":" + e3.seconds;
          e3.hours > 0 && (a3 = e3.hours + ":" + a3);
          for (var l3 = 0; l3 < t3.length; l3++) {
            null == t3[l3].getAttribute("data-amplitude-song-index") && (t3[l3].innerHTML = a3);
          }
        }
        function l2(e3) {
          if (null == u.default.active_playlist) {
            var t3 = document.querySelectorAll('.amplitude-current-time[data-amplitude-song-index="' + u.default.active_index + '"]'), a3 = e3.minutes + ":" + e3.seconds;
            e3.hours > 0 && (a3 = e3.hours + ":" + a3);
            for (var l3 = 0; l3 < t3.length; l3++) {
              null == t3[l3].getAttribute("data-amplitude-playlist") && (t3[l3].innerHTML = a3);
            }
          }
        }
        function n2(e3) {
          var t3 = "" != u.default.active_playlist && null != u.default.active_playlist ? u.default.playlists[u.default.active_playlist].active_index : null, a3 = document.querySelectorAll('.amplitude-current-time[data-amplitude-playlist="' + u.default.active_playlist + '"][data-amplitude-song-index="' + t3 + '"]'), l3 = e3.minutes + ":" + e3.seconds;
          e3.hours > 0 && (l3 = e3.hours + ":" + l3);
          for (var n3 = 0; n3 < a3.length; n3++) a3[n3].innerHTML = l3;
        }
        function i() {
          for (var e3 = document.querySelectorAll(".amplitude-current-time"), t3 = 0; t3 < e3.length; t3++) e3[t3].innerHTML = "00:00";
        }
        return { sync: e2, resetTimes: i };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3, u2) {
          var i2 = d(e3, u2);
          t2(i2), a2(i2), l2(i2), n2(i2);
        }
        function t2(e3) {
          for (var t3 = document.querySelectorAll(".amplitude-time-remaining"), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist"), u2 = t3[a3].getAttribute("data-amplitude-song-index");
            null == l3 && null == u2 && (t3[a3].innerHTML = e3);
          }
        }
        function a2(e3) {
          for (var t3 = document.querySelectorAll('.amplitude-time-remaining[data-amplitude-playlist="' + u.default.active_playlist + '"]'), a3 = 0; a3 < t3.length; a3++) {
            null == t3[a3].getAttribute("data-amplitude-song-index") && (t3[a3].innerHTML = e3);
          }
        }
        function l2(e3) {
          if (null == u.default.active_playlist) for (var t3 = document.querySelectorAll('.amplitude-time-remaining[data-amplitude-song-index="' + u.default.active_index + '"]'), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist");
            null == l3 && (t3[a3].innerHTML = e3);
          }
        }
        function n2(e3) {
          for (var t3 = "" != u.default.active_playlist && null != u.default.active_playlist ? u.default.playlists[u.default.active_playlist].active_index : null, a3 = document.querySelectorAll('.amplitude-time-remaining[data-amplitude-playlist="' + u.default.active_playlist + '"][data-amplitude-song-index="' + t3 + '"]'), l3 = 0; l3 < a3.length; l3++) a3[l3].innerHTML = e3;
        }
        function i() {
          for (var e3 = document.querySelectorAll(".amplitude-time-remaining"), t3 = 0; t3 < e3.length; t3++) e3[t3].innerHTML = "00";
        }
        function d(e3, t3) {
          var a3 = "00:00", l3 = parseInt(e3.seconds) + 60 * parseInt(e3.minutes) + 60 * parseInt(e3.hours) * 60, u2 = parseInt(t3.seconds) + 60 * parseInt(t3.minutes) + 60 * parseInt(t3.hours) * 60;
          if (!isNaN(l3) && !isNaN(u2)) {
            var n3 = u2 - l3, i2 = Math.floor(n3 / 3600), d2 = Math.floor((n3 - 3600 * i2) / 60), s = n3 - 3600 * i2 - 60 * d2;
            a3 = (d2 < 10 ? "0" + d2 : d2) + ":" + (s < 10 ? "0" + s : s), i2 > 0 && (a3 = i2 + ":" + a3);
          }
          return a3;
        }
        return { sync: e2, resetTimes: i };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3) {
          t2(e3), a2(e3), l2(e3), n2(e3);
        }
        function t2(e3) {
          for (var t3 = document.querySelectorAll(".amplitude-duration-hours"), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist"), u2 = t3[a3].getAttribute("data-amplitude-song-index");
            null == l3 && null == u2 && (t3[a3].innerHTML = e3);
          }
        }
        function a2(e3) {
          for (var t3 = document.querySelectorAll('.amplitude-duration-hours[data-amplitude-playlist="' + u.default.active_playlist + '"]'), a3 = 0; a3 < t3.length; a3++) {
            null == t3[a3].getAttribute("data-amplitude-song-index") && (t3[a3].innerHTML = e3);
          }
        }
        function l2(e3) {
          if (null == u.default.active_playlist) for (var t3 = document.querySelectorAll('.amplitude-duration-hours[data-amplitude-song-index="' + u.default.active_index + '"]'), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist");
            null == l3 && (t3[a3].innerHTML = e3);
          }
        }
        function n2(e3) {
          for (var t3 = "" != u.default.active_playlist && null != u.default.active_playlist ? u.default.playlists[u.default.active_playlist].active_index : null, a3 = document.querySelectorAll('.amplitude-duration-hours[data-amplitude-playlist="' + u.default.active_playlist + '"][data-amplitude-song-index="' + t3 + '"]'), l3 = 0; l3 < a3.length; l3++) a3[l3].innerHTML = e3;
        }
        function i() {
          for (var e3 = document.querySelectorAll(".amplitude-duration-hours"), t3 = 0; t3 < e3.length; t3++) e3[t3].innerHTML = "00";
        }
        return { sync: e2, resetTimes: i };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3) {
          t2(e3), a2(e3), l2(e3), n2(e3);
        }
        function t2(e3) {
          for (var t3 = document.querySelectorAll(".amplitude-duration-minutes"), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist"), u2 = t3[a3].getAttribute("data-amplitude-song-index");
            null == l3 && null == u2 && (t3[a3].innerHTML = e3);
          }
        }
        function a2(e3) {
          for (var t3 = document.querySelectorAll('.amplitude-duration-minutes[data-amplitude-playlist="' + u.default.active_playlist + '"]'), a3 = 0; a3 < t3.length; a3++) {
            null == t3[a3].getAttribute("data-amplitude-song-index") && (t3[a3].innerHTML = e3);
          }
        }
        function l2(e3) {
          if (null == u.default.active_playlist) for (var t3 = document.querySelectorAll('.amplitude-duration-minutes[data-amplitude-song-index="' + u.default.active_index + '"]'), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist");
            null == l3 && (t3[a3].innerHTML = e3);
          }
        }
        function n2(e3) {
          for (var t3 = "" != u.default.active_playlist && null != u.default.active_playlist ? u.default.playlists[u.default.active_playlist].active_index : null, a3 = document.querySelectorAll('.amplitude-duration-minutes[data-amplitude-playlist="' + u.default.active_playlist + '"][data-amplitude-song-index="' + t3 + '"]'), l3 = 0; l3 < a3.length; l3++) a3[l3].innerHTML = e3;
        }
        function i() {
          for (var e3 = document.querySelectorAll(".amplitude-duration-minutes"), t3 = 0; t3 < e3.length; t3++) e3[t3].innerHTML = "00";
        }
        return { sync: e2, resetTimes: i };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3) {
          t2(e3), a2(e3), l2(e3), n2(e3);
        }
        function t2(e3) {
          for (var t3 = document.querySelectorAll(".amplitude-duration-seconds"), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist"), u2 = t3[a3].getAttribute("data-amplitude-song-index");
            null == l3 && null == u2 && (t3[a3].innerHTML = e3);
          }
        }
        function a2(e3) {
          for (var t3 = document.querySelectorAll('.amplitude-duration-seconds[data-amplitude-playlist="' + u.default.active_playlist + '"]'), a3 = 0; a3 < t3.length; a3++) {
            null == t3[a3].getAttribute("data-amplitude-song-index") && (t3[a3].innerHTML = e3);
          }
        }
        function l2(e3) {
          if (null == u.default.active_playlist) for (var t3 = document.querySelectorAll('.amplitude-duration-seconds[data-amplitude-song-index="' + u.default.active_index + '"]'), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data--amplitude-playlist");
            null == l3 && (t3[a3].innerHTML = e3);
          }
        }
        function n2(e3) {
          for (var t3 = "" != u.default.active_playlist && null != u.default.active_playlist ? u.default.playlists[u.default.active_playlist].active_index : null, a3 = document.querySelectorAll('.amplitude-duration-seconds[data-amplitude-playlist="' + u.default.active_playlist + '"][data-amplitude-song-index="' + t3 + '"]'), l3 = 0; l3 < a3.length; l3++) a3[l3].innerHTML = e3;
        }
        function i() {
          for (var e3 = document.querySelectorAll(".amplitude-duration-seconds"), t3 = 0; t3 < e3.length; t3++) e3[t3].innerHTML = "00";
        }
        return { sync: e2, resetTimes: i };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t, a) {
      Object.defineProperty(t, "__esModule", { value: true });
      var l = a(0), u = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }(l), n = /* @__PURE__ */ function() {
        function e2(e3) {
          var u2 = d(e3);
          t2(u2), a2(u2), l2(u2), n2(u2);
        }
        function t2(e3) {
          for (var t3 = document.querySelectorAll(".amplitude-duration-time"), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist"), u2 = t3[a3].getAttribute("data-amplitude-song-index");
            null == l3 && null == u2 && (t3[a3].innerHTML = e3);
          }
        }
        function a2(e3) {
          for (var t3 = document.querySelectorAll('.amplitude-duration-time[data-amplitude-playlist="' + u.default.active_playlist + '"]'), a3 = 0; a3 < t3.length; a3++) {
            null == t3[a3].getAttribute("data-amplitude-song-index") && (t3[a3].innerHTML = e3);
          }
        }
        function l2(e3) {
          if (null == u.default.active_playlist) for (var t3 = document.querySelectorAll('.amplitude-duration-time[data-amplitude-song-index="' + u.default.active_index + '"]'), a3 = 0; a3 < t3.length; a3++) {
            var l3 = t3[a3].getAttribute("data-amplitude-playlist");
            null == l3 && (t3[a3].innerHTML = e3);
          }
        }
        function n2(e3) {
          for (var t3 = "" != u.default.active_playlist && null != u.default.active_playlist ? u.default.playlists[u.default.active_playlist].active_index : null, a3 = document.querySelectorAll('.amplitude-duration-time[data-amplitude-playlist="' + u.default.active_playlist + '"][data-amplitude-song-index="' + t3 + '"]'), l3 = 0; l3 < a3.length; l3++) a3[l3].innerHTML = e3;
        }
        function i() {
          for (var e3 = document.querySelectorAll(".amplitude-duration-time"), t3 = 0; t3 < e3.length; t3++) e3[t3].innerHTML = "00:00";
        }
        function d(e3) {
          var t3 = "00:00";
          return isNaN(e3.minutes) || isNaN(e3.seconds) || (t3 = e3.minutes + ":" + e3.seconds, !isNaN(e3.hours) && e3.hours > 0 && (t3 = e3.hours + ":" + t3)), t3;
        }
        return { sync: e2, resetTimes: i };
      }();
      t.default = n, e.exports = t.default;
    }, function(e, t) {
      e.exports = { name: "amplitudejs", version: "5.3.2", description: "A JavaScript library that allows you to control the design of your media controls in your webpage -- not the browser. No dependencies (jQuery not required) https://521dimensions.com/open-source/amplitudejs", main: "dist/amplitude.js", devDependencies: { "babel-core": "^6.26.3", "babel-loader": "^7.1.5", "babel-plugin-add-module-exports": "0.2.1", "babel-polyfill": "^6.26.0", "babel-preset-es2015": "^6.18.0", husky: "^1.3.1", jest: "^23.6.0", prettier: "1.15.1", "pretty-quick": "^1.11.1", watch: "^1.0.2", webpack: "^2.7.0" }, directories: { doc: "docs" }, files: ["dist"], funding: { type: "opencollective", url: "https://opencollective.com/amplitudejs" }, scripts: { build: "node_modules/.bin/webpack", prettier: "npx pretty-quick", preversion: "npx pretty-quick && npm run test", postversion: "git push && git push --tags", test: "jest", version: "npm run build && git add -A dist" }, repository: { type: "git", url: "git+https://github.com/521dimensions/amplitudejs.git" }, keywords: ["webaudio", "html5", "javascript", "audio-player"], author: "521 Dimensions (https://521dimensions.com)", license: "MIT", bugs: { url: "https://github.com/521dimensions/amplitudejs/issues" }, homepage: "https://github.com/521dimensions/amplitudejs#readme" };
    }]);
  });
})(amplitude_min);
var amplitude_minExports = amplitude_min.exports;
const Amplitude = /* @__PURE__ */ getDefaultExportFromCjs(amplitude_minExports);
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
  const map = /* @__PURE__ */ Object.create(null);
  for (const key of str.split(",")) map[key] = 1;
  return (val) => val in map;
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction(
  (str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
  }
);
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction(
  (str) => {
    const s = str ? `on${capitalize(str)}` : ``;
    return s;
  }
);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, ...arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](...arg);
  }
};
const def = (obj, key, value, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
const toNumber = (val) => {
  const n = isString(val) ? Number(val) : NaN;
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const isRef$1 = (val) => {
  return !!(val && val["__v_isRef"] === true);
};
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray$1(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (isRef$1(val)) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject(val) && !isArray$1(val) && !isPlainObject$1(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
  );
};
/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this._isPaused = false;
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = true;
      let i, l;
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].pause();
        }
      }
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].pause();
      }
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active) {
      if (this._isPaused) {
        this._isPaused = false;
        let i, l;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].resume();
          }
        }
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].resume();
        }
      }
    }
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      this._active = false;
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      this.effects.length = 0;
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      this.cleanups.length = 0;
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn, failSilently = false) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  }
}
let activeSub;
const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 1 | 4;
    this.next = void 0;
    this.cleanup = void 0;
    this.scheduler = void 0;
    if (activeEffectScope && activeEffectScope.active) {
      activeEffectScope.effects.push(this);
    }
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    if (this.flags & 64) {
      this.flags &= -65;
      if (pausedQueueEffects.has(this)) {
        pausedQueueEffects.delete(this);
        this.trigger();
      }
    }
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags & 2 && !(this.flags & 32)) {
      return;
    }
    if (!(this.flags & 8)) {
      batch(this);
    }
  }
  run() {
    if (!(this.flags & 1)) {
      return this.fn();
    }
    this.flags |= 2;
    cleanupEffect(this);
    prepareDeps(this);
    const prevEffect = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = this;
    shouldTrack = true;
    try {
      return this.fn();
    } finally {
      cleanupDeps(this);
      activeSub = prevEffect;
      shouldTrack = prevShouldTrack;
      this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let link = this.deps; link; link = link.nextDep) {
        removeSub(link);
      }
      this.deps = this.depsTail = void 0;
      cleanupEffect(this);
      this.onStop && this.onStop();
      this.flags &= -2;
    }
  }
  trigger() {
    if (this.flags & 64) {
      pausedQueueEffects.add(this);
    } else if (this.scheduler) {
      this.scheduler();
    } else {
      this.runIfDirty();
    }
  }
  /**
   * @internal
   */
  runIfDirty() {
    if (isDirty(this)) {
      this.run();
    }
  }
  get dirty() {
    return isDirty(this);
  }
}
let batchDepth = 0;
let batchedSub;
let batchedComputed;
function batch(sub, isComputed2 = false) {
  sub.flags |= 8;
  if (isComputed2) {
    sub.next = batchedComputed;
    batchedComputed = sub;
    return;
  }
  sub.next = batchedSub;
  batchedSub = sub;
}
function startBatch() {
  batchDepth++;
}
function endBatch() {
  if (--batchDepth > 0) {
    return;
  }
  if (batchedComputed) {
    let e = batchedComputed;
    batchedComputed = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      e = next;
    }
  }
  let error;
  while (batchedSub) {
    let e = batchedSub;
    batchedSub = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      if (e.flags & 1) {
        try {
          ;
          e.trigger();
        } catch (err) {
          if (!error) error = err;
        }
      }
      e = next;
    }
  }
  if (error) throw error;
}
function prepareDeps(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    link.version = -1;
    link.prevActiveLink = link.dep.activeLink;
    link.dep.activeLink = link;
  }
}
function cleanupDeps(sub) {
  let head;
  let tail = sub.depsTail;
  let link = tail;
  while (link) {
    const prev = link.prevDep;
    if (link.version === -1) {
      if (link === tail) tail = prev;
      removeSub(link);
      removeDep(link);
    } else {
      head = link;
    }
    link.dep.activeLink = link.prevActiveLink;
    link.prevActiveLink = void 0;
    link = prev;
  }
  sub.deps = head;
  sub.depsTail = tail;
}
function isDirty(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
      return true;
    }
  }
  if (sub._dirty) {
    return true;
  }
  return false;
}
function refreshComputed(computed2) {
  if (computed2.flags & 4 && !(computed2.flags & 16)) {
    return;
  }
  computed2.flags &= -17;
  if (computed2.globalVersion === globalVersion) {
    return;
  }
  computed2.globalVersion = globalVersion;
  const dep = computed2.dep;
  computed2.flags |= 2;
  if (dep.version > 0 && !computed2.isSSR && computed2.deps && !isDirty(computed2)) {
    computed2.flags &= -3;
    return;
  }
  const prevSub = activeSub;
  const prevShouldTrack = shouldTrack;
  activeSub = computed2;
  shouldTrack = true;
  try {
    prepareDeps(computed2);
    const value = computed2.fn(computed2._value);
    if (dep.version === 0 || hasChanged(value, computed2._value)) {
      computed2._value = value;
      dep.version++;
    }
  } catch (err) {
    dep.version++;
    throw err;
  } finally {
    activeSub = prevSub;
    shouldTrack = prevShouldTrack;
    cleanupDeps(computed2);
    computed2.flags &= -3;
  }
}
function removeSub(link, soft = false) {
  const { dep, prevSub, nextSub } = link;
  if (prevSub) {
    prevSub.nextSub = nextSub;
    link.prevSub = void 0;
  }
  if (nextSub) {
    nextSub.prevSub = prevSub;
    link.nextSub = void 0;
  }
  if (dep.subs === link) {
    dep.subs = prevSub;
    if (!prevSub && dep.computed) {
      dep.computed.flags &= -5;
      for (let l = dep.computed.deps; l; l = l.nextDep) {
        removeSub(l, true);
      }
    }
  }
  if (!soft && !--dep.sc && dep.map) {
    dep.map.delete(dep.key);
  }
}
function removeDep(link) {
  const { prevDep, nextDep } = link;
  if (prevDep) {
    prevDep.nextDep = nextDep;
    link.prevDep = void 0;
  }
  if (nextDep) {
    nextDep.prevDep = prevDep;
    link.nextDep = void 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e) {
  const { cleanup } = e;
  e.cleanup = void 0;
  if (cleanup) {
    const prevSub = activeSub;
    activeSub = void 0;
    try {
      cleanup();
    } finally {
      activeSub = prevSub;
    }
  }
}
let globalVersion = 0;
class Link {
  constructor(sub, dep) {
    this.sub = sub;
    this.dep = dep;
    this.version = dep.version;
    this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Dep {
  constructor(computed2) {
    this.computed = computed2;
    this.version = 0;
    this.activeLink = void 0;
    this.subs = void 0;
    this.map = void 0;
    this.key = void 0;
    this.sc = 0;
  }
  track(debugInfo) {
    if (!activeSub || !shouldTrack || activeSub === this.computed) {
      return;
    }
    let link = this.activeLink;
    if (link === void 0 || link.sub !== activeSub) {
      link = this.activeLink = new Link(activeSub, this);
      if (!activeSub.deps) {
        activeSub.deps = activeSub.depsTail = link;
      } else {
        link.prevDep = activeSub.depsTail;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
      }
      addSub(link);
    } else if (link.version === -1) {
      link.version = this.version;
      if (link.nextDep) {
        const next = link.nextDep;
        next.prevDep = link.prevDep;
        if (link.prevDep) {
          link.prevDep.nextDep = next;
        }
        link.prevDep = activeSub.depsTail;
        link.nextDep = void 0;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
        if (activeSub.deps === link) {
          activeSub.deps = next;
        }
      }
    }
    return link;
  }
  trigger(debugInfo) {
    this.version++;
    globalVersion++;
    this.notify(debugInfo);
  }
  notify(debugInfo) {
    startBatch();
    try {
      if (false) ;
      for (let link = this.subs; link; link = link.prevSub) {
        if (link.sub.notify()) {
          ;
          link.sub.dep.notify();
        }
      }
    } finally {
      endBatch();
    }
  }
}
function addSub(link) {
  link.dep.sc++;
  if (link.sub.flags & 4) {
    const computed2 = link.dep.computed;
    if (computed2 && !link.dep.subs) {
      computed2.flags |= 4 | 16;
      for (let l = computed2.deps; l; l = l.nextDep) {
        addSub(l);
      }
    }
    const currentTail = link.dep.subs;
    if (currentTail !== link) {
      link.prevSub = currentTail;
      if (currentTail) currentTail.nextSub = link;
    }
    link.dep.subs = link;
  }
}
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol(
  ""
);
const MAP_KEY_ITERATE_KEY = Symbol(
  ""
);
const ARRAY_ITERATE_KEY = Symbol(
  ""
);
function track(target, type, key) {
  if (shouldTrack && activeSub) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = new Dep());
      dep.map = depsMap;
      dep.key = key;
    }
    {
      dep.track();
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    globalVersion++;
    return;
  }
  const run = (dep) => {
    if (dep) {
      {
        dep.trigger();
      }
    }
  };
  startBatch();
  if (type === "clear") {
    depsMap.forEach(run);
  } else {
    const targetIsArray = isArray$1(target);
    const isArrayIndex = targetIsArray && isIntegerKey(key);
    if (targetIsArray && key === "length") {
      const newLength = Number(newValue);
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
          run(dep);
        }
      });
    } else {
      if (key !== void 0 || depsMap.has(void 0)) {
        run(depsMap.get(key));
      }
      if (isArrayIndex) {
        run(depsMap.get(ARRAY_ITERATE_KEY));
      }
      switch (type) {
        case "add":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isArrayIndex) {
            run(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            run(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
  }
  endBatch();
}
function getDepFromReactive(object, key) {
  const depMap = targetMap.get(object);
  return depMap && depMap.get(key);
}
function reactiveReadArray(array) {
  const raw = toRaw(array);
  if (raw === array) return raw;
  track(raw, "iterate", ARRAY_ITERATE_KEY);
  return isShallow(array) ? raw : raw.map(toReactive);
}
function shallowReadArray(arr) {
  track(arr = toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
  return arr;
}
const arrayInstrumentations = {
  __proto__: null,
  [Symbol.iterator]() {
    return iterator(this, Symbol.iterator, toReactive);
  },
  concat(...args) {
    return reactiveReadArray(this).concat(
      ...args.map((x) => isArray$1(x) ? reactiveReadArray(x) : x)
    );
  },
  entries() {
    return iterator(this, "entries", (value) => {
      value[1] = toReactive(value[1]);
      return value;
    });
  },
  every(fn, thisArg) {
    return apply(this, "every", fn, thisArg, void 0, arguments);
  },
  filter(fn, thisArg) {
    return apply(this, "filter", fn, thisArg, (v) => v.map(toReactive), arguments);
  },
  find(fn, thisArg) {
    return apply(this, "find", fn, thisArg, toReactive, arguments);
  },
  findIndex(fn, thisArg) {
    return apply(this, "findIndex", fn, thisArg, void 0, arguments);
  },
  findLast(fn, thisArg) {
    return apply(this, "findLast", fn, thisArg, toReactive, arguments);
  },
  findLastIndex(fn, thisArg) {
    return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(fn, thisArg) {
    return apply(this, "forEach", fn, thisArg, void 0, arguments);
  },
  includes(...args) {
    return searchProxy(this, "includes", args);
  },
  indexOf(...args) {
    return searchProxy(this, "indexOf", args);
  },
  join(separator) {
    return reactiveReadArray(this).join(separator);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...args) {
    return searchProxy(this, "lastIndexOf", args);
  },
  map(fn, thisArg) {
    return apply(this, "map", fn, thisArg, void 0, arguments);
  },
  pop() {
    return noTracking(this, "pop");
  },
  push(...args) {
    return noTracking(this, "push", args);
  },
  reduce(fn, ...args) {
    return reduce(this, "reduce", fn, args);
  },
  reduceRight(fn, ...args) {
    return reduce(this, "reduceRight", fn, args);
  },
  shift() {
    return noTracking(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(fn, thisArg) {
    return apply(this, "some", fn, thisArg, void 0, arguments);
  },
  splice(...args) {
    return noTracking(this, "splice", args);
  },
  toReversed() {
    return reactiveReadArray(this).toReversed();
  },
  toSorted(comparer) {
    return reactiveReadArray(this).toSorted(comparer);
  },
  toSpliced(...args) {
    return reactiveReadArray(this).toSpliced(...args);
  },
  unshift(...args) {
    return noTracking(this, "unshift", args);
  },
  values() {
    return iterator(this, "values", toReactive);
  }
};
function iterator(self2, method, wrapValue) {
  const arr = shallowReadArray(self2);
  const iter = arr[method]();
  if (arr !== self2 && !isShallow(self2)) {
    iter._next = iter.next;
    iter.next = () => {
      const result = iter._next();
      if (result.value) {
        result.value = wrapValue(result.value);
      }
      return result;
    };
  }
  return iter;
}
const arrayProto = Array.prototype;
function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
  const arr = shallowReadArray(self2);
  const needsWrap = arr !== self2 && !isShallow(self2);
  const methodFn = arr[method];
  if (methodFn !== arrayProto[method]) {
    const result2 = methodFn.apply(self2, args);
    return needsWrap ? toReactive(result2) : result2;
  }
  let wrappedFn = fn;
  if (arr !== self2) {
    if (needsWrap) {
      wrappedFn = function(item, index) {
        return fn.call(this, toReactive(item), index, self2);
      };
    } else if (fn.length > 2) {
      wrappedFn = function(item, index) {
        return fn.call(this, item, index, self2);
      };
    }
  }
  const result = methodFn.call(arr, wrappedFn, thisArg);
  return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self2, method, fn, args) {
  const arr = shallowReadArray(self2);
  let wrappedFn = fn;
  if (arr !== self2) {
    if (!isShallow(self2)) {
      wrappedFn = function(acc, item, index) {
        return fn.call(this, acc, toReactive(item), index, self2);
      };
    } else if (fn.length > 3) {
      wrappedFn = function(acc, item, index) {
        return fn.call(this, acc, item, index, self2);
      };
    }
  }
  return arr[method](wrappedFn, ...args);
}
function searchProxy(self2, method, args) {
  const arr = toRaw(self2);
  track(arr, "iterate", ARRAY_ITERATE_KEY);
  const res = arr[method](...args);
  if ((res === -1 || res === false) && isProxy(args[0])) {
    args[0] = toRaw(args[0]);
    return arr[method](...args);
  }
  return res;
}
function noTracking(self2, method, args = []) {
  pauseTracking();
  startBatch();
  const res = toRaw(self2)[method].apply(self2, args);
  endBatch();
  resetTracking();
  return res;
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
function hasOwnProperty(key) {
  if (!isSymbol(key)) key = String(key);
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    if (key === "__v_skip") return target["__v_skip"];
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2) {
      let fn;
      if (targetIsArray && (fn = arrayInstrumentations[key])) {
        return fn;
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(
      target,
      key,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      isRef(target) ? target : receiver
    );
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(
      target,
      key,
      value,
      isRef(target) ? target : receiver
    );
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray$1(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    return true;
  }
  deleteProperty(target, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations(readonly2, shallow) {
  const instrumentations = {
    get(key) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "get", key);
        }
        track(rawTarget, "get", rawKey);
      }
      const { has } = getProto(rawTarget);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      if (has.call(rawTarget, key)) {
        return wrap(target.get(key));
      } else if (has.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
      } else if (target !== rawTarget) {
        target.get(key);
      }
    },
    get size() {
      const target = this["__v_raw"];
      !readonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
      return Reflect.get(target, "size", target);
    },
    has(key) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "has", key);
        }
        track(rawTarget, "has", rawKey);
      }
      return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
    },
    forEach(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = toRaw(target);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    }
  };
  extend(
    instrumentations,
    readonly2 ? {
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear")
    } : {
      add(value) {
        if (!shallow && !isShallow(value) && !isReadonly(value)) {
          value = toRaw(value);
        }
        const target = toRaw(this);
        const proto = getProto(target);
        const hadKey = proto.has.call(target, value);
        if (!hadKey) {
          target.add(value);
          trigger(target, "add", value, value);
        }
        return this;
      },
      set(key, value) {
        if (!shallow && !isShallow(value) && !isReadonly(value)) {
          value = toRaw(value);
        }
        const target = toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has.call(target, key);
        }
        const oldValue = get.call(target, key);
        target.set(key, value);
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
        return this;
      },
      delete(key) {
        const target = toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has.call(target, key);
        }
        get ? get.call(target, key) : void 0;
        const result = target.delete(key);
        if (hadKey) {
          trigger(target, "delete", key, void 0);
        }
        return result;
      },
      clear() {
        const target = toRaw(this);
        const hadItems = target.size !== 0;
        const result = target.clear();
        if (hadItems) {
          trigger(
            target,
            "clear",
            void 0,
            void 0
          );
        }
        return result;
      }
    }
  );
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    instrumentations[method] = createIterableMethod(method, readonly2, shallow);
  });
  return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = createInstrumentations(isReadonly2, shallow);
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return value ? !!value["__v_raw"] : false;
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
function isRef(r) {
  return r ? r["__v_isRef"] === true : false;
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, isShallow2) {
    this.dep = new Dep();
    this["__v_isRef"] = true;
    this["__v_isShallow"] = false;
    this._rawValue = isShallow2 ? value : toRaw(value);
    this._value = isShallow2 ? value : toReactive(value);
    this["__v_isShallow"] = isShallow2;
  }
  get value() {
    {
      this.dep.track();
    }
    return this._value;
  }
  set value(newValue) {
    const oldValue = this._rawValue;
    const useDirectValue = this["__v_isShallow"] || isShallow(newValue) || isReadonly(newValue);
    newValue = useDirectValue ? newValue : toRaw(newValue);
    if (hasChanged(newValue, oldValue)) {
      this._rawValue = newValue;
      this._value = useDirectValue ? newValue : toReactive(newValue);
      {
        this.dep.trigger();
      }
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
function toRefs(object) {
  const ret = isArray$1(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = propertyToRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this["__v_isRef"] = true;
    this._value = void 0;
  }
  get value() {
    const val = this._object[this._key];
    return this._value = val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
  get dep() {
    return getDepFromReactive(toRaw(this._object), this._key);
  }
}
function propertyToRef(source, key, defaultValue) {
  const val = source[key];
  return isRef(val) ? val : new ObjectRefImpl(source, key, defaultValue);
}
class ComputedRefImpl {
  constructor(fn, setter, isSSR) {
    this.fn = fn;
    this.setter = setter;
    this._value = void 0;
    this.dep = new Dep(this);
    this.__v_isRef = true;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 16;
    this.globalVersion = globalVersion - 1;
    this.next = void 0;
    this.effect = this;
    this["__v_isReadonly"] = !setter;
    this.isSSR = isSSR;
  }
  /**
   * @internal
   */
  notify() {
    this.flags |= 16;
    if (!(this.flags & 8) && // avoid infinite self recursion
    activeSub !== this) {
      batch(this, true);
      return true;
    }
  }
  get value() {
    const link = this.dep.track();
    refreshComputed(this);
    if (link) {
      link.version = this.dep.version;
    }
    return this._value;
  }
  set value(newValue) {
    if (this.setter) {
      this.setter(newValue);
    }
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, isSSR);
  return cRef;
}
const INITIAL_WATCHER_VALUE = {};
const cleanupMap = /* @__PURE__ */ new WeakMap();
let activeWatcher = void 0;
function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
  if (owner) {
    let cleanups = cleanupMap.get(owner);
    if (!cleanups) cleanupMap.set(owner, cleanups = []);
    cleanups.push(cleanupFn);
  }
}
function watch$1(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, once, scheduler, augmentJob, call } = options;
  const reactiveGetter = (source2) => {
    if (deep) return source2;
    if (isShallow(source2) || deep === false || deep === 0)
      return traverse(source2, 1);
    return traverse(source2);
  };
  let effect2;
  let getter;
  let cleanup;
  let boundCleanup;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction(s)) {
        return call ? call(s, 2) : s();
      } else ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = call ? () => call(source, 2) : source;
    } else {
      getter = () => {
        if (cleanup) {
          pauseTracking();
          try {
            cleanup();
          } finally {
            resetTracking();
          }
        }
        const currentEffect = activeWatcher;
        activeWatcher = effect2;
        try {
          return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
        } finally {
          activeWatcher = currentEffect;
        }
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    const depth = deep === true ? Infinity : deep;
    getter = () => traverse(baseGetter(), depth);
  }
  const scope = getCurrentScope();
  const watchHandle = () => {
    effect2.stop();
    if (scope && scope.active) {
      remove(scope.effects, effect2);
    }
  };
  if (once && cb) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      watchHandle();
    };
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = (immediateFirstRun) => {
    if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
        if (cleanup) {
          cleanup();
        }
        const currentWatcher = activeWatcher;
        activeWatcher = effect2;
        try {
          const args = [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            boundCleanup
          ];
          call ? call(cb, 3, args) : (
            // @ts-expect-error
            cb(...args)
          );
          oldValue = newValue;
        } finally {
          activeWatcher = currentWatcher;
        }
      }
    } else {
      effect2.run();
    }
  };
  if (augmentJob) {
    augmentJob(job);
  }
  effect2 = new ReactiveEffect(getter);
  effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
  boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
  cleanup = effect2.onStop = () => {
    const cleanups = cleanupMap.get(effect2);
    if (cleanups) {
      if (call) {
        call(cleanups, 4);
      } else {
        for (const cleanup2 of cleanups) cleanup2();
      }
      cleanupMap.delete(effect2);
    }
  };
  if (cb) {
    if (immediate) {
      job(true);
    } else {
      oldValue = effect2.run();
    }
  } else if (scheduler) {
    scheduler(job.bind(null, true), true);
  } else {
    effect2.run();
  }
  watchHandle.pause = effect2.pause.bind(effect2);
  watchHandle.resume = effect2.resume.bind(effect2);
  watchHandle.stop = watchHandle;
  return watchHandle;
}
function traverse(value, depth = Infinity, seen) {
  if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  depth--;
  if (isRef(value)) {
    traverse(value.value, depth, seen);
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, seen);
    });
  } else if (isPlainObject$1(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen);
    }
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key], depth, seen);
      }
    }
  }
  return value;
}
/**
* @vue/runtime-core v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const stack = [];
let isWarning = false;
function warn$1(msg, ...args) {
  if (isWarning) return;
  isWarning = true;
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
  isWarning = false;
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  if (isArray$1(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    if (errorHandler) {
      pauseTracking();
      callWithErrorHandling(errorHandler, null, 10, [
        err,
        exposedInstance,
        errorInfo
      ]);
      resetTracking();
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
  if (throwInProd) {
    throw err;
  } else {
    console.error(err);
  }
}
const queue = [];
let flushIndex = -1;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex$1(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!(job.flags & 1)) {
    const jobId = getId(job);
    const lastJob = queue[queue.length - 1];
    if (!lastJob || // fast path when the job id is larger than the tail
    !(job.flags & 2) && jobId >= getId(lastJob)) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex$1(jobId), 0, job);
    }
    job.flags |= 1;
    queueFlush();
  }
}
function queueFlush() {
  if (!currentFlushPromise) {
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray$1(cb)) {
    if (activePostFlushCbs && cb.id === -1) {
      activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
    } else if (!(cb.flags & 1)) {
      pendingPostFlushCbs.push(cb);
      cb.flags |= 1;
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.flags & 2) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      cb();
      if (!(cb.flags & 4)) {
        cb.flags &= -2;
      }
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      const cb = activePostFlushCbs[postFlushIndex];
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      if (!(cb.flags & 8)) cb();
      cb.flags &= -2;
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
function flushJobs(seen) {
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && !(job.flags & 8)) {
        if (false) ;
        if (job.flags & 4) {
          job.flags &= ~1;
        }
        callWithErrorHandling(
          job,
          job.i,
          job.i ? 15 : 14
        );
        if (!(job.flags & 4)) {
          job.flags &= ~1;
        }
      }
    }
  } finally {
    for (; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job) {
        job.flags &= -2;
      }
    }
    flushIndex = -1;
    queue.length = 0;
    flushPostFlushCbs();
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx) return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function withDirectives(vnode, directives) {
  if (currentRenderingInstance === null) {
    return vnode;
  }
  const instance = getComponentPublicInstance(currentRenderingInstance);
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const TeleportEndKey = Symbol("_vte");
const isTeleport = (type) => type.__isTeleport;
const leaveCbKey = Symbol("_leaveCb");
const enterCbKey = Symbol("_enterCb");
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionPropsValidators = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: TransitionHookValidator,
  onEnter: TransitionHookValidator,
  onAfterEnter: TransitionHookValidator,
  onEnterCancelled: TransitionHookValidator,
  // leave
  onBeforeLeave: TransitionHookValidator,
  onLeave: TransitionHookValidator,
  onAfterLeave: TransitionHookValidator,
  onLeaveCancelled: TransitionHookValidator,
  // appear
  onBeforeAppear: TransitionHookValidator,
  onAppear: TransitionHookValidator,
  onAfterAppear: TransitionHookValidator,
  onAppearCancelled: TransitionHookValidator
};
const recursiveGetSubtree = (instance) => {
  const subTree = instance.subTree;
  return subTree.component ? recursiveGetSubtree(subTree.component) : subTree;
};
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: BaseTransitionPropsValidators,
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      const child = findNonCommentChild(children);
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getInnerChild$1(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      let enterHooks = resolveTransitionHooks(
        innerChild,
        rawProps,
        state,
        instance,
        // #11061, ensure enterHooks is fresh after clone
        (hooks) => enterHooks = hooks
      );
      if (innerChild.type !== Comment) {
        setTransitionHooks(innerChild, enterHooks);
      }
      let oldInnerChild = instance.subTree && getInnerChild$1(instance.subTree);
      if (oldInnerChild && oldInnerChild.type !== Comment && !isSameVNodeType(innerChild, oldInnerChild) && recursiveGetSubtree(instance).type !== Comment) {
        let leavingHooks = resolveTransitionHooks(
          oldInnerChild,
          rawProps,
          state,
          instance
        );
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in" && innerChild.type !== Comment) {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            if (!(instance.job.flags & 8)) {
              instance.update();
            }
            delete leavingHooks.afterLeave;
            oldInnerChild = void 0;
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(
              state,
              oldInnerChild
            );
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el[leaveCbKey] = () => {
              earlyRemove();
              el[leaveCbKey] = void 0;
              delete enterHooks.delayedLeave;
              oldInnerChild = void 0;
            };
            enterHooks.delayedLeave = () => {
              delayedLeave();
              delete enterHooks.delayedLeave;
              oldInnerChild = void 0;
            };
          };
        } else {
          oldInnerChild = void 0;
        }
      } else if (oldInnerChild) {
        oldInnerChild = void 0;
      }
      return child;
    };
  }
};
function findNonCommentChild(children) {
  let child = children[0];
  if (children.length > 1) {
    for (const c of children) {
      if (c.type !== Comment) {
        child = c;
        break;
      }
    }
  }
  return child;
}
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance, postClone) {
  const {
    appear,
    mode,
    persisted = false,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    onLeaveCancelled,
    onBeforeAppear,
    onAppear,
    onAfterAppear,
    onAppearCancelled
  } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(
      hook,
      instance,
      9,
      args
    );
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray$1(hook)) {
      if (hook.every((hook2) => hook2.length <= 1)) done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el[leaveCbKey]) {
        el[leaveCbKey](
          true
          /* cancelled */
        );
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) {
        leavingVNode.el[leaveCbKey]();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el[enterCbKey] = (cancelled) => {
        if (called) return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el[enterCbKey] = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el[enterCbKey]) {
        el[enterCbKey](
          true
          /* cancelled */
        );
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el[leaveCbKey] = (cancelled) => {
        if (called) return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el[leaveCbKey] = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      const hooks2 = resolveTransitionHooks(
        vnode2,
        props,
        state,
        instance,
        postClone
      );
      if (postClone) postClone(hooks2);
      return hooks2;
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getInnerChild$1(vnode) {
  if (!isKeepAlive(vnode)) {
    if (isTeleport(vnode.type) && vnode.children) {
      return findNonCommentChild(vnode.children);
    }
    return vnode;
  }
  const { shapeFlag, children } = vnode;
  if (children) {
    if (shapeFlag & 16) {
      return children[0];
    }
    if (shapeFlag & 32 && isFunction(children.default)) {
      return children.default();
    }
  }
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    vnode.transition = hooks;
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128) keyedFragmentCount++;
      ret = ret.concat(
        getTransitionRawChildren(child.children, keepComment, key)
      );
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction(options) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
function markAsyncBoundary(instance) {
  instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray$1(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
      setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
    }
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref3 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  const rawSetupState = toRaw(setupState);
  const canSetSetupRef = setupState === EMPTY_OBJ ? () => false : (key) => {
    return hasOwn(rawSetupState, key);
  };
  if (oldRef != null && oldRef !== ref3) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (canSetSetupRef(oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref3)) {
    callWithErrorHandling(ref3, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref3);
    const _isRef = isRef(ref3);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
          if (isUnmount) {
            isArray$1(existing) && remove(existing, refValue);
          } else {
            if (!isArray$1(existing)) {
              if (_isString) {
                refs[ref3] = [refValue];
                if (canSetSetupRef(ref3)) {
                  setupState[ref3] = refs[ref3];
                }
              } else {
                ref3.value = [refValue];
                if (rawRef.k) refs[rawRef.k] = ref3.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref3] = value;
          if (canSetSetupRef(ref3)) {
            setupState[ref3] = value;
          }
        } else if (_isRef) {
          ref3.value = value;
          if (rawRef.k) refs[rawRef.k] = value;
        } else ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => {
  if (!isInSSRComponentSetup || lifecycle === "sp") {
    injectHook(lifecycle, (...args) => hook(...args), target);
  }
};
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook(
  "bu"
);
const onUpdated = createHook("u");
const onBeforeUnmount = createHook(
  "bum"
);
const onUnmounted = createHook("um");
const onServerPrefetch = createHook(
  "sp"
);
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveDynamicComponent(component) {
  if (isString(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    {
      const selfName = getComponentName(
        Component,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache;
  const sourceIsArray = isArray$1(source);
  if (sourceIsArray || isString(source)) {
    const sourceIsReactiveArray = sourceIsArray && isReactive(source);
    let needsWrap = false;
    if (sourceIsReactiveArray) {
      needsWrap = !isShallow(source);
      source = shallowReadArray(source);
    }
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(
        needsWrap ? toReactive(source[i]) : source[i],
        i,
        void 0,
        cached
      );
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached)
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
const getPublicInstance = (i) => {
  if (!i) return null;
  if (isStatefulComponent(i)) return getComponentPublicInstance(i);
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $host: (i) => i.ce,
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key === "__v_skip") {
      return true;
    }
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance.attrs, "get", "");
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray$1(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data)) ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get,
        set
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook$1(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components) instance.components = components;
  if (directives) instance.directives = directives;
  if (serverPrefetch) {
    markAsyncBoundary(instance);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      {
        watch(getter, handler);
      }
    }
  } else if (isFunction(raw)) {
    {
      watch(getter, raw.bind(publicThis));
    }
  } else if (isObject(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions$1(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions$1(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions$1(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions$1(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions$1(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray$1(to) && isArray$1(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to) return from;
  if (!from) return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const pluginCleanupFns = [];
    let isMounted = false;
    const app2 = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin)) ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app2, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app2, ...options);
        } else ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app2;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app2;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          const vnode = app2._ceVNode || createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          {
            render(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          return getComponentPublicInstance(vnode.component);
        }
      },
      onUnmount(cleanupFn) {
        pluginCleanupFns.push(cleanupFn);
      },
      unmount() {
        if (isMounted) {
          callWithAsyncErrorHandling(
            pluginCleanupFns,
            app2._instance,
            16
          );
          render(null, app2._container);
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app2;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app2;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app2;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance) ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else ;
  }
}
function hasInjectionContext() {
  return !!(currentInstance || currentRenderingInstance || currentApp);
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = createInternalObject();
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance.attrs, "set", "");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
      if (instance.ce) {
        instance.ce._setProp(key, value);
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
const mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinPropsCache : appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys) needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        const propType = prop.type;
        let shouldCast = false;
        let shouldCastTrue = true;
        if (isArray$1(propType)) {
          for (let index = 0; index < propType.length; ++index) {
            const type = propType[index];
            const typeName = isFunction(type) && type.name;
            if (typeName === "Boolean") {
              shouldCast = true;
              break;
            } else if (typeName === "String") {
              shouldCastTrue = false;
            }
          }
        } else {
          shouldCast = isFunction(propType) && propType.name === "Boolean";
        }
        prop[
          0
          /* shouldCast */
        ] = shouldCast;
        prop[
          1
          /* shouldCastTrue */
        ] = shouldCastTrue;
        if (shouldCast || hasOwn(prop, "default")) {
          needCastKeys.push(normalizedKey);
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  }
  return false;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot$1 = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false) ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key)) continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot$1(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const assignSlots = (slots, children, optimized) => {
  for (const key in children) {
    if (optimized || key !== "_") {
      slots[key] = children[key];
    }
  }
};
const initSlots = (instance, children, optimized) => {
  const slots = instance.slots = createInternalObject();
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      assignSlots(slots, children, optimized);
      if (optimized) {
        def(slots, "_", type, true);
      }
    } else {
      normalizeObjectSlots(children, slots);
    }
  } else if (children) {
    normalizeVNodeSlots(instance, children);
  }
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        assignSlots(slots, children, optimized);
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref3, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else ;
    }
    if (ref3 != null && parentComponent) {
      setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(el, key, null, props[key], namespace, parentComponent);
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
      hostSetElementText(el, "");
    }
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, namespace, parentComponent);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, oldProps, newProps, parentComponent, namespace);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              parentComponent
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key)) continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, namespace, parentComponent);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance, false, optimized);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent, root, type } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        {
          if (root.ce) {
            root.ce._injectChildStyle(type);
          }
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
          if (nonHydratedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            nonHydratedAsyncRoot.asyncDep.then(() => {
              if (!instance.isUnmounted) {
                componentUpdateFn();
              }
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    instance.scope.on();
    const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
    instance.scope.off();
    const update = instance.update = effect2.run.bind(effect2);
    const job = instance.job = effect2.runIfDirty.bind(effect2);
    job.i = instance;
    job.id = instance.uid;
    effect2.scheduler = () => queueJob(job);
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref3,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs,
      cacheIndex
    } = vnode;
    if (patchFlag === -2) {
      optimized = false;
    }
    if (ref3 != null) {
      setRef(ref3, null, parentSuspense, vnode, true);
    }
    if (cacheIndex != null) {
      parentComponent.renderCache[cacheIndex] = void 0;
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, job, subTree, um, m, a } = instance;
    invalidateMount(m);
    invalidateMount(a);
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (job) {
      job.flags |= 8;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    const el = hostNextSibling(vnode.anchor || vnode.el);
    const teleportEnd = el && el[TeleportEndKey];
    return teleportEnd ? hostNextSibling(teleportEnd) : el;
  };
  let isFlushing = false;
  const render = (vnode, container, namespace) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace
      );
    }
    container._vnode = vnode;
    if (!isFlushing) {
      isFlushing = true;
      flushPreFlushCbs();
      flushPostFlushCbs();
      isFlushing = false;
    }
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  return {
    render,
    hydrate,
    createApp: createAppAPI(render)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect: effect2, job }, allowed) {
  if (allowed) {
    effect2.flags |= 32;
    job.flags |= 4;
  } else {
    effect2.flags &= -33;
    job.flags &= -5;
  }
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray$1(ch1) && isArray$1(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow && c2.patchFlag !== -2)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function locateNonHydratedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateNonHydratedAsyncRoot(subComponent);
    }
  }
}
function invalidateMount(hooks) {
  if (hooks) {
    for (let i = 0; i < hooks.length; i++)
      hooks[i].flags |= 8;
  }
}
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, flush, once } = options;
  const baseWatchOptions = extend({}, options);
  const runsImmediately = cb && immediate || !cb && flush !== "post";
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else if (!runsImmediately) {
      const watchStopHandle = () => {
      };
      watchStopHandle.stop = NOOP;
      watchStopHandle.resume = NOOP;
      watchStopHandle.pause = NOOP;
      return watchStopHandle;
    }
  }
  const instance = currentInstance;
  baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
  let isPre = false;
  if (flush === "post") {
    baseWatchOptions.scheduler = (job) => {
      queuePostRenderEffect(job, instance && instance.suspense);
    };
  } else if (flush !== "sync") {
    isPre = true;
    baseWatchOptions.scheduler = (job, isFirstRun) => {
      if (isFirstRun) {
        job();
      } else {
        queueJob(job);
      }
    };
  }
  baseWatchOptions.augmentJob = (job) => {
    if (cb) {
      job.flags |= 4;
    }
    if (isPre) {
      job.flags |= 2;
      if (instance) {
        job.id = instance.uid;
        job.i = instance;
      }
    }
  };
  const watchHandle = watch$1(source, cb, baseWatchOptions);
  if (isInSSRComponentSetup) {
    if (ssrCleanup) {
      ssrCleanup.push(watchHandle);
    } else if (runsImmediately) {
      watchHandle();
    }
  }
  return watchHandle;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
const getModelModifiers = (props, modelName) => {
  return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted) return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
  if (modifiers) {
    if (modifiers.trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (modifiers.number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    props,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  const prev = setCurrentRenderingInstance(instance);
  let result;
  let fallthroughAttrs;
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render.call(
          thisProxy,
          proxyToUse,
          renderCache,
          false ? shallowReadonly(props) : props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false) ;
      result = normalizeVNode(
        render2.length > 1 ? render2(
          false ? shallowReadonly(props) : props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return shallowReadonly(attrs);
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render2(
          false ? shallowReadonly(props) : props,
          null
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs, false, true);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root, null, false, true);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    setTransitionHooks(root, vnode.transition);
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent) {
    const root = parent.subTree;
    if (root.suspense && root.suspense.activeBranch === vnode) {
      root.el = vnode.el;
    }
    if (root === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    } else {
      break;
    }
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray$1(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value, inVOnce = false) {
  isBlockTreeEnabled += value;
  if (value < 0 && currentBlock && inVOnce) {
    currentBlock.hasOnce = true;
  }
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref3,
  ref_key,
  ref_for
}) => {
  if (typeof ref3 === "number") {
    ref3 = "" + ref3;
  }
  return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag = -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray$1(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props) return null;
  return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
  const { props, ref: ref3, patchFlag, children, transition } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref3 ? isArray$1(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref3,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetStart: vnode.targetStart,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  if (transition && cloneTransition) {
    setTransitionHooks(
      cloned,
      transition.clone(cloned)
    );
  }
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createStaticVNode(content, numberOfNodes) {
  const vnode = createVNode(Static, null, content);
  vnode.staticCount = numberOfNodes;
  return vnode;
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray$1(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (isVNode(child)) {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray$1(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !isInternalObject(children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    ids: parent ? parent.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g[key])) setters = g[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1) setters.forEach((set) => set(v));
      else setters[0](v);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => currentInstance = v
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => isInSSRComponentSetup = v
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children, optimized);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    pauseTracking();
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        instance.props,
        setupContext
      ]
    );
    const isAsyncSetup = isPromise(setupResult);
    resetTracking();
    reset();
    if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
      markAsyncBoundary(instance);
    }
    if (isAsyncSetup) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult);
    }
  } else {
    finishComponentSetup(instance);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else ;
  finishComponentSetup(instance);
}
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    instance.render = Component.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
}
const attrsProxyHandlers = {
  get(target, key) {
    track(target, "get", "");
    return target[key];
  }
};
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getComponentPublicInstance(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  } else {
    return instance.proxy;
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  return c;
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray$1(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const version = "3.5.13";
/**
* @vue/runtime-dom v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let policy = void 0;
const tt = typeof window !== "undefined" && window.trustedTypes;
if (tt) {
  try {
    policy = /* @__PURE__ */ tt.createPolicy("vue", {
      createHTML: (val) => val
    });
  } catch (e) {
  }
}
const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props) => {
    const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling)) break;
      }
    } else {
      templateContainer.innerHTML = unsafeToTrustedHTML(
        namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
      );
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const TRANSITION = "transition";
const ANIMATION = "animation";
const vtcKey = Symbol("_vtc");
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
const TransitionPropsValidators = /* @__PURE__ */ extend(
  {},
  BaseTransitionPropsValidators,
  DOMTransitionPropsValidators
);
const decorate$1 = (t) => {
  t.displayName = "Transition";
  t.props = TransitionPropsValidators;
  return t;
};
const Transition = /* @__PURE__ */ decorate$1(
  (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots)
);
const callHook = (hook, args = []) => {
  if (isArray$1(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray$1(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const {
    name = "v",
    type,
    duration,
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    appearFromClass = enterFromClass,
    appearActiveClass = enterActiveClass,
    appearToClass = enterToClass,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`
  } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const {
    onBeforeEnter,
    onEnter,
    onEnterCancelled,
    onLeave,
    onLeaveCancelled,
    onBeforeAppear = onBeforeEnter,
    onAppear = onEnter,
    onAppearCancelled = onEnterCancelled
  } = baseProps;
  const finishEnter = (el, isAppear, done, isCancelled) => {
    el._enterCancelled = isCancelled;
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el, done) => {
    el._isLeaving = false;
    removeTransitionClass(el, leaveFromClass);
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el, isAppear, done);
      callHook(hook, [el, resolve2]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve2);
        }
      });
    };
  };
  return extend(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el, done) {
      el._isLeaving = true;
      const resolve2 = () => finishLeave(el, done);
      addTransitionClass(el, leaveFromClass);
      if (!el._enterCancelled) {
        forceReflow();
        addTransitionClass(el, leaveActiveClass);
      } else {
        addTransitionClass(el, leaveActiveClass);
        forceReflow();
      }
      nextFrame(() => {
        if (!el._isLeaving) {
          return;
        }
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve2);
        }
      });
      callHook(onLeave, [el, resolve2]);
    },
    onEnterCancelled(el) {
      finishEnter(el, false, void 0, true);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true, void 0, true);
      callHook(onAppearCancelled, [el]);
    },
    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = toNumber(val);
  return res;
}
function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
  (el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
  const _vtc = el[vtcKey];
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el[vtcKey] = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve2) {
  const id = el._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve2();
    }
  };
  if (explicitTimeout != null) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
  if (!type) {
    return resolve2();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el && ++ended >= propCount) {
      end();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
  const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
  const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(
    getStyleProperties(`${TRANSITION}Property`).toString()
  );
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
  if (s === "auto") return 0;
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
function patchClass(el, value, isSVG) {
  const transitionClasses = el[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
const vShowOriginalDisplay = Symbol("_vod");
const vShowHidden = Symbol("_vsh");
const CSS_VAR_TEXT = Symbol("");
const displayRE = /(^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  let hasControlledDisplay = false;
  if (next && !isCssString) {
    if (prev) {
      if (!isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
    for (const key in next) {
      if (key === "display") {
        hasControlledDisplay = true;
      }
      setStyle(style, key, next[key]);
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
        hasControlledDisplay = displayRE.test(next);
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
  }
  if (vShowOriginalDisplay in el) {
    el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
    if (el[vShowHidden]) {
      style.display = "none";
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray$1(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null) val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(
        key,
        isBoolean ? "" : isSymbol(value) ? String(value) : value
      );
    }
  }
}
function patchDOMProp(el, key, value, parentComponent, attrName) {
  if (key === "innerHTML" || key === "textContent") {
    if (value != null) {
      el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
    }
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
    const newValue = value == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      el.type === "checkbox" ? "on" : ""
    ) : String(value);
    if (oldValue !== newValue || !("_value" in el)) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    el._value = value;
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(attrName || key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
const veiKey = Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el[veiKey] || (el[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(
        nextValue,
        instance
      );
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray$1(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map(
      (fn) => (e2) => !e2._stopped && fn && fn(e2)
    );
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
  const isSVG = namespace === "svg";
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue);
    if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
      patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
    }
  } else if (
    // #11081 force set props for possible async custom element
    el._isVueCE && (/[A-Z]/.test(key) || !isString(nextValue))
  ) {
    patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && isNativeOn(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray$1(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e) {
  e.target.composing = true;
}
function onCompositionEnd(e) {
  const target = e.target;
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
const assignKey = Symbol("_assign");
const vModelText = {
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    const castToNumber = number || vnode.props && vnode.props.type === "number";
    addEventListener(el, lazy ? "change" : "input", (e) => {
      if (e.target.composing) return;
      let domValue = el.value;
      if (trim) {
        domValue = domValue.trim();
      }
      if (castToNumber) {
        domValue = looseToNumber(domValue);
      }
      el[assignKey](domValue);
    });
    if (trim) {
      addEventListener(el, "change", () => {
        el.value = el.value.trim();
      });
    }
    if (!lazy) {
      addEventListener(el, "compositionstart", onCompositionStart);
      addEventListener(el, "compositionend", onCompositionEnd);
      addEventListener(el, "change", onCompositionEnd);
    }
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(el, { value }) {
    el.value = value == null ? "" : value;
  },
  beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    if (el.composing) return;
    const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
    const newValue = value == null ? "" : value;
    if (elValue === newValue) {
      return;
    }
    if (document.activeElement === el && el.type !== "range") {
      if (lazy && value === oldValue) {
        return;
      }
      if (trim && el.value.trim() === newValue) {
        return;
      }
    }
    el.value = newValue;
  }
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;
    const component = app2._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    if (container.nodeType === 1) {
      container.textContent = "";
    }
    const proxy = mount(container, false, resolveRootNamespace(container));
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
};
function resolveRootNamespace(container) {
  if (container instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
    return "mathml";
  }
}
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
/*!
 * pinia v2.3.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
let activePinia;
const setActivePinia = (pinia2) => activePinia = pinia2;
const piniaSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function isPlainObject(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia2 = markRaw({
    install(app2) {
      setActivePinia(pinia2);
      {
        pinia2._a = app2;
        app2.provide(piniaSymbol, pinia2);
        app2.config.globalProperties.$pinia = pinia2;
        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      }
    },
    use(plugin) {
      if (!this._a && true) {
        toBeInstalled.push(plugin);
      } else {
        _p.push(plugin);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia2;
}
const noop$1 = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
const ACTION_MARKER = Symbol();
const ACTION_NAME = Symbol();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  } else if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function shouldHydrate(obj) {
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign: assign$1 } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia2, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia2.state.value[id];
  let store;
  function setup() {
    if (!initialState && true) {
      {
        pinia2.state.value[id] = state ? state() : {};
      }
    }
    const localState = toRefs(pinia2.state.value[id]);
    return assign$1(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia2);
        const store2 = pinia2._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia2, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia2, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign$1({ actions: {} }, options);
  const $subscribeOptions = { deep: true };
  let isListening;
  let isSyncListening;
  let subscriptions = [];
  let actionSubscriptions = [];
  let debuggerEvents;
  const initialState = pinia2.state.value[$id];
  if (!isOptionsStore && !initialState && true) {
    {
      pinia2.state.value[$id] = {};
    }
  }
  ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia2.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia2.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia2.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign$1($state, newState);
    });
  } : (
    /* istanbul ignore next */
    noop$1
  );
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia2._s.delete($id);
  }
  const action = (fn, name = "") => {
    if (ACTION_MARKER in fn) {
      fn[ACTION_NAME] = name;
      return fn;
    }
    const wrappedAction = function() {
      setActivePinia(pinia2);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name: wrappedAction[ACTION_NAME],
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = fn.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
    wrappedAction[ACTION_MARKER] = true;
    wrappedAction[ACTION_NAME] = name;
    return wrappedAction;
  };
  const partialStore = {
    _p: pinia2,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia2.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign$1({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(partialStore);
  pinia2._s.set($id, store);
  const runWithContext = pinia2._a && pinia2._a.runWithContext || fallbackRunWithContext;
  const setupStore = runWithContext(() => pinia2._e.run(() => (scope = effectScope()).run(() => setup({ action }))));
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia2.state.value[$id][key] = prop;
        }
      }
    } else if (typeof prop === "function") {
      const actionValue = action(prop, key);
      {
        setupStore[key] = actionValue;
      }
      optionsForPlugin.actions[key] = prop;
    } else ;
  }
  {
    assign$1(store, setupStore);
    assign$1(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => pinia2.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign$1($state, state);
      });
    }
  });
  pinia2._p.forEach((extender) => {
    {
      assign$1(store, scope.run(() => extender({
        store,
        app: pinia2._a,
        pinia: pinia2,
        options: optionsForPlugin
      })));
    }
  });
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  }
  function useStore(pinia2, hot) {
    const hasContext = hasInjectionContext();
    pinia2 = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    pinia2 || (hasContext ? inject(piniaSymbol, null) : null);
    if (pinia2)
      setActivePinia(pinia2);
    pinia2 = activePinia;
    if (!pinia2._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia2);
      } else {
        createOptionsStore(id, options, pinia2);
      }
    }
    const store = pinia2._s.get(id);
    return store;
  }
  useStore.$id = id;
  return useStore;
}
const useMusicStore = /* @__PURE__ */ defineStore("music", {
  state: () => ({
    albumCover: "",
    albumTitle: "",
    albumArtist: ""
  }),
  actions: {
    updateCurrentSong() {
      const song = Amplitude.getActiveSongMetadata();
      this.albumCover = song.cover_art_url;
      this.albumTitle = song.name;
      this.albumArtist = song.artist;
    },
    // 添加一个action来更新导航方向
    setNavigationDirection(direction) {
      this.navigationDirection = direction;
    }
  }
});
Amplitude.init({
  songs: [
    {
      name: "Gotta Have You",
      url: "/src/assets/music/Gotta Have You.mp3",
      album: "英文专辑",
      cover_art_url: "/src/assets/images/GottaHaveYou.jpeg",
      artist: "Stevie Wonder",
      source: "网络"
    },
    {
      name: "K歌之王",
      url: "/src/assets/music/K歌之王 - 陈奕迅.mp3",
      album: "中文专辑",
      cover_art_url: "/src/assets/images/陈奕迅.jpeg",
      artist: "陈奕迅",
      source: "网络"
    },
    {
      name: "Give A Little Love",
      url: "/src/assets/music/M2M - Give A Little Love.mp3",
      album: "英文专辑",
      cover_art_url: "/src/assets/images/m2m.jpeg",
      artist: "M2M",
      source: "网络"
    },
    {
      name: "Dream",
      url: "/src//assets/music/Miley Cyrus - Dream.mp3",
      album: "英文专辑",
      cover_art_url: "/src/assets/images/dream.jpeg",
      artist: "Miley Cyrus",
      source: "网络"
    },
    {
      name: "聚集记忆的时间",
      url: "/src/assets/music/Nell - 聚集记忆的时间.mp3",
      album: "韩文专辑",
      cover_art_url: "/src/assets/images/nell.jpg",
      artist: "Nell",
      source: "网络"
    },
    {
      name: "勇气100%",
      url: "/src/assets/music/光GENJI - 勇气百分百.mp3",
      album: "日文专辑",
      cover_art_url: "/src/assets/images/勇气百分百.jpeg",
      artist: "光GENJI",
      source: "网络"
    },
    {
      name: "光と影のロマン",
      url: "/src/assets/music/光と影のロマン - 宇德敬子.mp3",
      album: "日文专辑",
      cover_art_url: "/src/assets/images/宇德敬子.jpeg",
      artist: "宇德敬子",
      source: "网络"
    }
  ],
  volume: 50,
  callbacks: {
    // 自动切换歌曲的时候触发
    song_change: () => {
      const musicStore = useMusicStore();
      musicStore.updateCurrentSong();
    }
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$7 = {
  __name: "ControlBtns",
  setup(__props) {
    let offset = null;
    let isDragging = false;
    function onMouseDown(e) {
      isDragging = true;
      offset = {
        x: e.screenX - window.screenX,
        y: e.screenY - window.screenY
      };
      document.onmousemove = (e2) => {
        if (isDragging) {
          const { screenX, screenY } = e2;
          window.moveTo(screenX - offset.x, screenY - offset.y);
        }
      };
      document.onmouseup = () => {
        isDragging = false;
        offset = null;
        document.onmouseup = null;
        document.onmousemove = null;
      };
    }
    function minimaizeWindow() {
      window.api.minimizeWindow();
    }
    function closeWindow() {
      window.api.closeWindow();
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "control-btns",
        onMousedown: onMouseDown
      }, [
        createBaseVNode("div", {
          class: "closeBtn fa-solid fa-close",
          onClick: closeWindow
        }),
        createBaseVNode("div", {
          class: "minimizeBtn fa-solid fa-angle-down",
          onClick: minimaizeWindow
        })
      ], 32);
    };
  }
};
const ControlBtns = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-a95f12c6"]]);
const _sfc_main$6 = {
  __name: "App",
  setup(__props) {
    const musicStore = useMusicStore();
    const transitionName = computed(() => {
      return musicStore.navigationDirection === "forward" ? "slide" : "slide-back";
    });
    return (_ctx, _cache) => {
      const _component_router_view = resolveComponent("router-view");
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(ControlBtns),
        createVNode(_component_router_view, null, {
          default: withCtx(({ Component }) => [
            createVNode(Transition, { name: transitionName.value }, {
              default: withCtx(() => [
                (openBlock(), createBlock(resolveDynamicComponent(Component)))
              ]),
              _: 2
            }, 1032, ["name"])
          ]),
          _: 1
        })
      ], 64);
    };
  }
};
/*!
  * vue-router v4.5.0
  * (c) 2024 Eduardo San Martin Morote
  * @license MIT
  */
const isBrowser = typeof document !== "undefined";
function isRouteComponent(component) {
  return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function isESModule(obj) {
  return obj.__esModule || obj[Symbol.toStringTag] === "Module" || // support CF with dynamic imports that do not
  // add the Module string tag
  obj.default && isRouteComponent(obj.default);
}
const assign = Object.assign;
function applyToParams(fn, params) {
  const newParams = {};
  for (const key in params) {
    const value = params[key];
    newParams[key] = isArray(value) ? value.map(fn) : fn(value);
  }
  return newParams;
}
const noop = () => {
};
const isArray = Array.isArray;
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/g;
const ENC_BRACKET_CLOSE_RE = /%5D/g;
const ENC_CARET_RE = /%5E/g;
const ENC_BACKTICK_RE = /%60/g;
const ENC_CURLY_OPEN_RE = /%7B/g;
const ENC_PIPE_RE = /%7C/g;
const ENC_CURLY_CLOSE_RE = /%7D/g;
const ENC_SPACE_RE = /%20/g;
function commonEncode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeHash(text) {
  return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryValue(text) {
  return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
function encodeParam(text) {
  return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text) {
  try {
    return decodeURIComponent("" + text);
  } catch (err) {
  }
  return "" + text;
}
const TRAILING_SLASH_RE = /\/$/;
const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
function parseURL(parseQuery2, location2, currentLocation = "/") {
  let path, query = {}, searchString = "", hash = "";
  const hashPos = location2.indexOf("#");
  let searchPos = location2.indexOf("?");
  if (hashPos < searchPos && hashPos >= 0) {
    searchPos = -1;
  }
  if (searchPos > -1) {
    path = location2.slice(0, searchPos);
    searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
    query = parseQuery2(searchString);
  }
  if (hashPos > -1) {
    path = path || location2.slice(0, hashPos);
    hash = location2.slice(hashPos, location2.length);
  }
  path = resolveRelativePath(path != null ? path : location2, currentLocation);
  return {
    fullPath: path + (searchString && "?") + searchString + hash,
    path,
    query,
    hash: decode(hash)
  };
}
function stringifyURL(stringifyQuery2, location2) {
  const query = location2.query ? stringifyQuery2(location2.query) : "";
  return location2.path + (query && "?") + query + (location2.hash || "");
}
function stripBase(pathname, base) {
  if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
    return pathname;
  return pathname.slice(base.length) || "/";
}
function isSameRouteLocation(stringifyQuery2, a, b) {
  const aLastIndex = a.matched.length - 1;
  const bLastIndex = b.matched.length - 1;
  return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
}
function isSameRouteRecord(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length)
    return false;
  for (const key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key]))
      return false;
  }
  return true;
}
function isSameRouteLocationParamsValue(a, b) {
  return isArray(a) ? isEquivalentArray(a, b) : isArray(b) ? isEquivalentArray(b, a) : a === b;
}
function isEquivalentArray(a, b) {
  return isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function resolveRelativePath(to, from) {
  if (to.startsWith("/"))
    return to;
  if (!to)
    return from;
  const fromSegments = from.split("/");
  const toSegments = to.split("/");
  const lastToSegment = toSegments[toSegments.length - 1];
  if (lastToSegment === ".." || lastToSegment === ".") {
    toSegments.push("");
  }
  let position = fromSegments.length - 1;
  let toPosition;
  let segment;
  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition];
    if (segment === ".")
      continue;
    if (segment === "..") {
      if (position > 1)
        position--;
    } else
      break;
  }
  return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition).join("/");
}
const START_LOCATION_NORMALIZED = {
  path: "/",
  // TODO: could we use a symbol in the future?
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
var NavigationType;
(function(NavigationType2) {
  NavigationType2["pop"] = "pop";
  NavigationType2["push"] = "push";
})(NavigationType || (NavigationType = {}));
var NavigationDirection;
(function(NavigationDirection2) {
  NavigationDirection2["back"] = "back";
  NavigationDirection2["forward"] = "forward";
  NavigationDirection2["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
function normalizeBase(base) {
  if (!base) {
    if (isBrowser) {
      const baseEl = document.querySelector("base");
      base = baseEl && baseEl.getAttribute("href") || "/";
      base = base.replace(/^\w+:\/\/[^\/]+/, "");
    } else {
      base = "/";
    }
  }
  if (base[0] !== "/" && base[0] !== "#")
    base = "/" + base;
  return removeTrailingSlash(base);
}
const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location2) {
  return base.replace(BEFORE_HASH_RE, "#") + location2;
}
function getElementPosition(el, offset) {
  const docRect = document.documentElement.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    behavior: offset.behavior,
    left: elRect.left - docRect.left - (offset.left || 0),
    top: elRect.top - docRect.top - (offset.top || 0)
  };
}
const computeScrollPosition = () => ({
  left: window.scrollX,
  top: window.scrollY
});
function scrollToPosition(position) {
  let scrollToOptions;
  if ("el" in position) {
    const positionEl = position.el;
    const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
    const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
    if (!el) {
      return;
    }
    scrollToOptions = getElementPosition(el, position);
  } else {
    scrollToOptions = position;
  }
  if ("scrollBehavior" in document.documentElement.style)
    window.scrollTo(scrollToOptions);
  else {
    window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.scrollX, scrollToOptions.top != null ? scrollToOptions.top : window.scrollY);
  }
}
function getScrollKey(path, delta) {
  const position = history.state ? history.state.position - delta : -1;
  return position + path;
}
const scrollPositions = /* @__PURE__ */ new Map();
function saveScrollPosition(key, scrollPosition) {
  scrollPositions.set(key, scrollPosition);
}
function getSavedScrollPosition(key) {
  const scroll = scrollPositions.get(key);
  scrollPositions.delete(key);
  return scroll;
}
let createBaseLocation = () => location.protocol + "//" + location.host;
function createCurrentLocation(base, location2) {
  const { pathname, search, hash } = location2;
  const hashPos = base.indexOf("#");
  if (hashPos > -1) {
    let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
    let pathFromHash = hash.slice(slicePos);
    if (pathFromHash[0] !== "/")
      pathFromHash = "/" + pathFromHash;
    return stripBase(pathFromHash, "");
  }
  const path = stripBase(pathname, base);
  return path + search + hash;
}
function useHistoryListeners(base, historyState, currentLocation, replace) {
  let listeners = [];
  let teardowns = [];
  let pauseState = null;
  const popStateHandler = ({ state }) => {
    const to = createCurrentLocation(base, location);
    const from = currentLocation.value;
    const fromState = historyState.value;
    let delta = 0;
    if (state) {
      currentLocation.value = to;
      historyState.value = state;
      if (pauseState && pauseState === from) {
        pauseState = null;
        return;
      }
      delta = fromState ? state.position - fromState.position : 0;
    } else {
      replace(to);
    }
    listeners.forEach((listener) => {
      listener(currentLocation.value, from, {
        delta,
        type: NavigationType.pop,
        direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
      });
    });
  };
  function pauseListeners() {
    pauseState = currentLocation.value;
  }
  function listen(callback) {
    listeners.push(callback);
    const teardown = () => {
      const index = listeners.indexOf(callback);
      if (index > -1)
        listeners.splice(index, 1);
    };
    teardowns.push(teardown);
    return teardown;
  }
  function beforeUnloadListener() {
    const { history: history2 } = window;
    if (!history2.state)
      return;
    history2.replaceState(assign({}, history2.state, { scroll: computeScrollPosition() }), "");
  }
  function destroy() {
    for (const teardown of teardowns)
      teardown();
    teardowns = [];
    window.removeEventListener("popstate", popStateHandler);
    window.removeEventListener("beforeunload", beforeUnloadListener);
  }
  window.addEventListener("popstate", popStateHandler);
  window.addEventListener("beforeunload", beforeUnloadListener, {
    passive: true
  });
  return {
    pauseListeners,
    listen,
    destroy
  };
}
function buildState(back, current, forward, replaced = false, computeScroll = false) {
  return {
    back,
    current,
    forward,
    replaced,
    position: window.history.length,
    scroll: computeScroll ? computeScrollPosition() : null
  };
}
function useHistoryStateNavigation(base) {
  const { history: history2, location: location2 } = window;
  const currentLocation = {
    value: createCurrentLocation(base, location2)
  };
  const historyState = { value: history2.state };
  if (!historyState.value) {
    changeLocation(currentLocation.value, {
      back: null,
      current: currentLocation.value,
      forward: null,
      // the length is off by one, we need to decrease it
      position: history2.length - 1,
      replaced: true,
      // don't add a scroll as the user may have an anchor, and we want
      // scrollBehavior to be triggered without a saved position
      scroll: null
    }, true);
  }
  function changeLocation(to, state, replace2) {
    const hashIndex = base.indexOf("#");
    const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
    try {
      history2[replace2 ? "replaceState" : "pushState"](state, "", url);
      historyState.value = state;
    } catch (err) {
      {
        console.error(err);
      }
      location2[replace2 ? "replace" : "assign"](url);
    }
  }
  function replace(to, data) {
    const state = assign({}, history2.state, buildState(
      historyState.value.back,
      // keep back and forward entries but override current position
      to,
      historyState.value.forward,
      true
    ), data, { position: historyState.value.position });
    changeLocation(to, state, true);
    currentLocation.value = to;
  }
  function push(to, data) {
    const currentState = assign(
      {},
      // use current history state to gracefully handle a wrong call to
      // history.replaceState
      // https://github.com/vuejs/router/issues/366
      historyState.value,
      history2.state,
      {
        forward: to,
        scroll: computeScrollPosition()
      }
    );
    changeLocation(currentState.current, currentState, true);
    const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
    changeLocation(to, state, false);
    currentLocation.value = to;
  }
  return {
    location: currentLocation,
    state: historyState,
    push,
    replace
  };
}
function createWebHistory(base) {
  base = normalizeBase(base);
  const historyNavigation = useHistoryStateNavigation(base);
  const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
  function go(delta, triggerListeners = true) {
    if (!triggerListeners)
      historyListeners.pauseListeners();
    history.go(delta);
  }
  const routerHistory = assign({
    // it's overridden right after
    location: "",
    base,
    go,
    createHref: createHref.bind(null, base)
  }, historyNavigation, historyListeners);
  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => historyNavigation.location.value
  });
  Object.defineProperty(routerHistory, "state", {
    enumerable: true,
    get: () => historyNavigation.state.value
  });
  return routerHistory;
}
function isRouteLocation(route) {
  return typeof route === "string" || route && typeof route === "object";
}
function isRouteName(name) {
  return typeof name === "string" || typeof name === "symbol";
}
const NavigationFailureSymbol = Symbol("");
var NavigationFailureType;
(function(NavigationFailureType2) {
  NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
  NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
  NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
function createRouterError(type, params) {
  {
    return assign(new Error(), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  }
}
function isNavigationFailure(error, type) {
  return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
const BASE_PARAM_PATTERN = "[^/]+?";
const BASE_PATH_PARSER_OPTIONS = {
  sensitive: false,
  strict: false,
  start: true,
  end: true
};
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
function tokensToParser(segments, extraOptions) {
  const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
  const score = [];
  let pattern = options.start ? "^" : "";
  const keys = [];
  for (const segment of segments) {
    const segmentScores = segment.length ? [] : [
      90
      /* PathScore.Root */
    ];
    if (options.strict && !segment.length)
      pattern += "/";
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex];
      let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
      if (token.type === 0) {
        if (!tokenIndex)
          pattern += "/";
        pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
        subSegmentScore += 40;
      } else if (token.type === 1) {
        const { value, repeatable, optional, regexp } = token;
        keys.push({
          name: value,
          repeatable,
          optional
        });
        const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
        if (re2 !== BASE_PARAM_PATTERN) {
          subSegmentScore += 10;
          try {
            new RegExp(`(${re2})`);
          } catch (err) {
            throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
          }
        }
        let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
        if (!tokenIndex)
          subPattern = // avoid an optional / if there are more segments e.g. /:p?-static
          // or /:p?-:p2
          optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
        if (optional)
          subPattern += "?";
        pattern += subPattern;
        subSegmentScore += 20;
        if (optional)
          subSegmentScore += -8;
        if (repeatable)
          subSegmentScore += -20;
        if (re2 === ".*")
          subSegmentScore += -50;
      }
      segmentScores.push(subSegmentScore);
    }
    score.push(segmentScores);
  }
  if (options.strict && options.end) {
    const i = score.length - 1;
    score[i][score[i].length - 1] += 0.7000000000000001;
  }
  if (!options.strict)
    pattern += "/?";
  if (options.end)
    pattern += "$";
  else if (options.strict && !pattern.endsWith("/"))
    pattern += "(?:/|$)";
  const re = new RegExp(pattern, options.sensitive ? "" : "i");
  function parse(path) {
    const match = path.match(re);
    const params = {};
    if (!match)
      return null;
    for (let i = 1; i < match.length; i++) {
      const value = match[i] || "";
      const key = keys[i - 1];
      params[key.name] = value && key.repeatable ? value.split("/") : value;
    }
    return params;
  }
  function stringify(params) {
    let path = "";
    let avoidDuplicatedSlash = false;
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith("/"))
        path += "/";
      avoidDuplicatedSlash = false;
      for (const token of segment) {
        if (token.type === 0) {
          path += token.value;
        } else if (token.type === 1) {
          const { value, repeatable, optional } = token;
          const param = value in params ? params[value] : "";
          if (isArray(param) && !repeatable) {
            throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
          }
          const text = isArray(param) ? param.join("/") : param;
          if (!text) {
            if (optional) {
              if (segment.length < 2) {
                if (path.endsWith("/"))
                  path = path.slice(0, -1);
                else
                  avoidDuplicatedSlash = true;
              }
            } else
              throw new Error(`Missing required param "${value}"`);
          }
          path += text;
        }
      }
    }
    return path || "/";
  }
  return {
    re,
    score,
    keys,
    parse,
    stringify
  };
}
function compareScoreArray(a, b) {
  let i = 0;
  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i];
    if (diff)
      return diff;
    i++;
  }
  if (a.length < b.length) {
    return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
  } else if (a.length > b.length) {
    return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
  }
  return 0;
}
function comparePathParserScore(a, b) {
  let i = 0;
  const aScore = a.score;
  const bScore = b.score;
  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i]);
    if (comp)
      return comp;
    i++;
  }
  if (Math.abs(bScore.length - aScore.length) === 1) {
    if (isLastScoreNegative(aScore))
      return 1;
    if (isLastScoreNegative(bScore))
      return -1;
  }
  return bScore.length - aScore.length;
}
function isLastScoreNegative(score) {
  const last = score[score.length - 1];
  return score.length > 0 && last[last.length - 1] < 0;
}
const ROOT_TOKEN = {
  type: 0,
  value: ""
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
  if (!path)
    return [[]];
  if (path === "/")
    return [[ROOT_TOKEN]];
  if (!path.startsWith("/")) {
    throw new Error(`Invalid path "${path}"`);
  }
  function crash(message) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`);
  }
  let state = 0;
  let previousState = state;
  const tokens = [];
  let segment;
  function finalizeSegment() {
    if (segment)
      tokens.push(segment);
    segment = [];
  }
  let i = 0;
  let char;
  let buffer = "";
  let customRe = "";
  function consumeBuffer() {
    if (!buffer)
      return;
    if (state === 0) {
      segment.push({
        type: 0,
        value: buffer
      });
    } else if (state === 1 || state === 2 || state === 3) {
      if (segment.length > 1 && (char === "*" || char === "+"))
        crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
      segment.push({
        type: 1,
        value: buffer,
        regexp: customRe,
        repeatable: char === "*" || char === "+",
        optional: char === "*" || char === "?"
      });
    } else {
      crash("Invalid state to consume buffer");
    }
    buffer = "";
  }
  function addCharToBuffer() {
    buffer += char;
  }
  while (i < path.length) {
    char = path[i++];
    if (char === "\\" && state !== 2) {
      previousState = state;
      state = 4;
      continue;
    }
    switch (state) {
      case 0:
        if (char === "/") {
          if (buffer) {
            consumeBuffer();
          }
          finalizeSegment();
        } else if (char === ":") {
          consumeBuffer();
          state = 1;
        } else {
          addCharToBuffer();
        }
        break;
      case 4:
        addCharToBuffer();
        state = previousState;
        break;
      case 1:
        if (char === "(") {
          state = 2;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
        }
        break;
      case 2:
        if (char === ")") {
          if (customRe[customRe.length - 1] == "\\")
            customRe = customRe.slice(0, -1) + char;
          else
            state = 3;
        } else {
          customRe += char;
        }
        break;
      case 3:
        consumeBuffer();
        state = 0;
        if (char !== "*" && char !== "?" && char !== "+")
          i--;
        customRe = "";
        break;
      default:
        crash("Unknown state");
        break;
    }
  }
  if (state === 2)
    crash(`Unfinished custom RegExp for param "${buffer}"`);
  consumeBuffer();
  finalizeSegment();
  return tokens;
}
function createRouteRecordMatcher(record, parent, options) {
  const parser = tokensToParser(tokenizePath(record.path), options);
  const matcher = assign(parser, {
    record,
    parent,
    // these needs to be populated by the parent
    children: [],
    alias: []
  });
  if (parent) {
    if (!matcher.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher);
  }
  return matcher;
}
function createRouterMatcher(routes2, globalOptions) {
  const matchers = [];
  const matcherMap = /* @__PURE__ */ new Map();
  globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
  function getRecordMatcher(name) {
    return matcherMap.get(name);
  }
  function addRoute(record, parent, originalRecord) {
    const isRootAdd = !originalRecord;
    const mainNormalizedRecord = normalizeRouteRecord(record);
    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
    const options = mergeOptions(globalOptions, record);
    const normalizedRecords = [mainNormalizedRecord];
    if ("alias" in record) {
      const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
      for (const alias of aliases) {
        normalizedRecords.push(
          // we need to normalize again to ensure the `mods` property
          // being non enumerable
          normalizeRouteRecord(assign({}, mainNormalizedRecord, {
            // this allows us to hold a copy of the `components` option
            // so that async components cache is hold on the original record
            components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
            path: alias,
            // we might be the child of an alias
            aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
            // the aliases are always of the same kind as the original since they
            // are defined on the same record
          }))
        );
      }
    }
    let matcher;
    let originalMatcher;
    for (const normalizedRecord of normalizedRecords) {
      const { path } = normalizedRecord;
      if (parent && path[0] !== "/") {
        const parentPath = parent.record.path;
        const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
        normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
      }
      matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
      if (originalRecord) {
        originalRecord.alias.push(matcher);
      } else {
        originalMatcher = originalMatcher || matcher;
        if (originalMatcher !== matcher)
          originalMatcher.alias.push(matcher);
        if (isRootAdd && record.name && !isAliasRecord(matcher)) {
          removeRoute(record.name);
        }
      }
      if (isMatchable(matcher)) {
        insertMatcher(matcher);
      }
      if (mainNormalizedRecord.children) {
        const children = mainNormalizedRecord.children;
        for (let i = 0; i < children.length; i++) {
          addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
        }
      }
      originalRecord = originalRecord || matcher;
    }
    return originalMatcher ? () => {
      removeRoute(originalMatcher);
    } : noop;
  }
  function removeRoute(matcherRef) {
    if (isRouteName(matcherRef)) {
      const matcher = matcherMap.get(matcherRef);
      if (matcher) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher), 1);
        matcher.children.forEach(removeRoute);
        matcher.alias.forEach(removeRoute);
      }
    } else {
      const index = matchers.indexOf(matcherRef);
      if (index > -1) {
        matchers.splice(index, 1);
        if (matcherRef.record.name)
          matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
        matcherRef.alias.forEach(removeRoute);
      }
    }
  }
  function getRoutes() {
    return matchers;
  }
  function insertMatcher(matcher) {
    const index = findInsertionIndex(matcher, matchers);
    matchers.splice(index, 0, matcher);
    if (matcher.record.name && !isAliasRecord(matcher))
      matcherMap.set(matcher.record.name, matcher);
  }
  function resolve2(location2, currentLocation) {
    let matcher;
    let params = {};
    let path;
    let name;
    if ("name" in location2 && location2.name) {
      matcher = matcherMap.get(location2.name);
      if (!matcher)
        throw createRouterError(1, {
          location: location2
        });
      name = matcher.record.name;
      params = assign(
        // paramsFromLocation is a new object
        paramsFromLocation(
          currentLocation.params,
          // only keep params that exist in the resolved location
          // only keep optional params coming from a parent record
          matcher.keys.filter((k) => !k.optional).concat(matcher.parent ? matcher.parent.keys.filter((k) => k.optional) : []).map((k) => k.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        location2.params && paramsFromLocation(location2.params, matcher.keys.map((k) => k.name))
      );
      path = matcher.stringify(params);
    } else if (location2.path != null) {
      path = location2.path;
      matcher = matchers.find((m) => m.re.test(path));
      if (matcher) {
        params = matcher.parse(path);
        name = matcher.record.name;
      }
    } else {
      matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
      if (!matcher)
        throw createRouterError(1, {
          location: location2,
          currentLocation
        });
      name = matcher.record.name;
      params = assign({}, currentLocation.params, location2.params);
      path = matcher.stringify(params);
    }
    const matched = [];
    let parentMatcher = matcher;
    while (parentMatcher) {
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher.parent;
    }
    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched)
    };
  }
  routes2.forEach((route) => addRoute(route));
  function clearRoutes() {
    matchers.length = 0;
    matcherMap.clear();
  }
  return {
    addRoute,
    resolve: resolve2,
    removeRoute,
    clearRoutes,
    getRoutes,
    getRecordMatcher
  };
}
function paramsFromLocation(params, keys) {
  const newParams = {};
  for (const key of keys) {
    if (key in params)
      newParams[key] = params[key];
  }
  return newParams;
}
function normalizeRouteRecord(record) {
  const normalized = {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    meta: record.meta || {},
    aliasOf: record.aliasOf,
    beforeEnter: record.beforeEnter,
    props: normalizeRecordProps(record),
    children: record.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    // must be declared afterwards
    // mods: {},
    components: "components" in record ? record.components || null : record.component && { default: record.component }
  };
  Object.defineProperty(normalized, "mods", {
    value: {}
  });
  return normalized;
}
function normalizeRecordProps(record) {
  const propsObject = {};
  const props = record.props || false;
  if ("component" in record) {
    propsObject.default = props;
  } else {
    for (const name in record.components)
      propsObject[name] = typeof props === "object" ? props[name] : props;
  }
  return propsObject;
}
function isAliasRecord(record) {
  while (record) {
    if (record.record.aliasOf)
      return true;
    record = record.parent;
  }
  return false;
}
function mergeMetaFields(matched) {
  return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
function mergeOptions(defaults, partialOptions) {
  const options = {};
  for (const key in defaults) {
    options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
  }
  return options;
}
function findInsertionIndex(matcher, matchers) {
  let lower = 0;
  let upper = matchers.length;
  while (lower !== upper) {
    const mid = lower + upper >> 1;
    const sortOrder = comparePathParserScore(matcher, matchers[mid]);
    if (sortOrder < 0) {
      upper = mid;
    } else {
      lower = mid + 1;
    }
  }
  const insertionAncestor = getInsertionAncestor(matcher);
  if (insertionAncestor) {
    upper = matchers.lastIndexOf(insertionAncestor, upper - 1);
  }
  return upper;
}
function getInsertionAncestor(matcher) {
  let ancestor = matcher;
  while (ancestor = ancestor.parent) {
    if (isMatchable(ancestor) && comparePathParserScore(matcher, ancestor) === 0) {
      return ancestor;
    }
  }
  return;
}
function isMatchable({ record }) {
  return !!(record.name || record.components && Object.keys(record.components).length || record.redirect);
}
function parseQuery(search) {
  const query = {};
  if (search === "" || search === "?")
    return query;
  const hasLeadingIM = search[0] === "?";
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
  for (let i = 0; i < searchParams.length; ++i) {
    const searchParam = searchParams[i].replace(PLUS_RE, " ");
    const eqPos = searchParam.indexOf("=");
    const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
    if (key in query) {
      let currentValue = query[key];
      if (!isArray(currentValue)) {
        currentValue = query[key] = [currentValue];
      }
      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }
  return query;
}
function stringifyQuery(query) {
  let search = "";
  for (let key in query) {
    const value = query[key];
    key = encodeQueryKey(key);
    if (value == null) {
      if (value !== void 0) {
        search += (search.length ? "&" : "") + key;
      }
      continue;
    }
    const values = isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
    values.forEach((value2) => {
      if (value2 !== void 0) {
        search += (search.length ? "&" : "") + key;
        if (value2 != null)
          search += "=" + value2;
      }
    });
  }
  return search;
}
function normalizeQuery(query) {
  const normalizedQuery = {};
  for (const key in query) {
    const value = query[key];
    if (value !== void 0) {
      normalizedQuery[key] = isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
    }
  }
  return normalizedQuery;
}
const matchedRouteKey = Symbol("");
const viewDepthKey = Symbol("");
const routerKey = Symbol("");
const routeLocationKey = Symbol("");
const routerViewLocationKey = Symbol("");
function useCallbacks() {
  let handlers = [];
  function add(handler) {
    handlers.push(handler);
    return () => {
      const i = handlers.indexOf(handler);
      if (i > -1)
        handlers.splice(i, 1);
    };
  }
  function reset() {
    handlers = [];
  }
  return {
    add,
    list: () => handlers.slice(),
    reset
  };
}
function guardToPromiseFn(guard, to, from, record, name, runWithContext = (fn) => fn()) {
  const enterCallbackArray = record && // name is defined if record is because of the function overload
  (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
  return () => new Promise((resolve2, reject) => {
    const next = (valid) => {
      if (valid === false) {
        reject(createRouterError(4, {
          from,
          to
        }));
      } else if (valid instanceof Error) {
        reject(valid);
      } else if (isRouteLocation(valid)) {
        reject(createRouterError(2, {
          from: to,
          to: valid
        }));
      } else {
        if (enterCallbackArray && // since enterCallbackArray is truthy, both record and name also are
        record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function") {
          enterCallbackArray.push(valid);
        }
        resolve2();
      }
    };
    const guardReturn = runWithContext(() => guard.call(record && record.instances[name], to, from, next));
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3)
      guardCall = guardCall.then(next);
    guardCall.catch((err) => reject(err));
  });
}
function extractComponentsGuards(matched, guardType, to, from, runWithContext = (fn) => fn()) {
  const guards = [];
  for (const record of matched) {
    for (const name in record.components) {
      let rawComponent = record.components[name];
      if (guardType !== "beforeRouteEnter" && !record.instances[name])
        continue;
      if (isRouteComponent(rawComponent)) {
        const options = rawComponent.__vccOpts || rawComponent;
        const guard = options[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name, runWithContext));
      } else {
        let componentPromise = rawComponent();
        guards.push(() => componentPromise.then((resolved) => {
          if (!resolved)
            throw new Error(`Couldn't resolve component "${name}" at "${record.path}"`);
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
          record.mods[name] = resolved;
          record.components[name] = resolvedComponent;
          const options = resolvedComponent.__vccOpts || resolvedComponent;
          const guard = options[guardType];
          return guard && guardToPromiseFn(guard, to, from, record, name, runWithContext)();
        }));
      }
    }
  }
  return guards;
}
function useLink(props) {
  const router2 = inject(routerKey);
  const currentRoute = inject(routeLocationKey);
  const route = computed(() => {
    const to = unref(props.to);
    return router2.resolve(to);
  });
  const activeRecordIndex = computed(() => {
    const { matched } = route.value;
    const { length } = matched;
    const routeMatched = matched[length - 1];
    const currentMatched = currentRoute.matched;
    if (!routeMatched || !currentMatched.length)
      return -1;
    const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index > -1)
      return index;
    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return (
      // we are dealing with nested routes
      length > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      getOriginalPath(routeMatched) === parentRecordPath && // avoid comparing the child with its parent
      currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index
    );
  });
  const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
  const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
  function navigate(e = {}) {
    if (guardEvent(e)) {
      const p2 = router2[unref(props.replace) ? "replace" : "push"](
        unref(props.to)
        // avoid uncaught errors are they are logged anyway
      ).catch(noop);
      if (props.viewTransition && typeof document !== "undefined" && "startViewTransition" in document) {
        document.startViewTransition(() => p2);
      }
      return p2;
    }
    return Promise.resolve();
  }
  return {
    route,
    href: computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate
  };
}
function preferSingleVNode(vnodes) {
  return vnodes.length === 1 ? vnodes[0] : vnodes;
}
const RouterLinkImpl = /* @__PURE__ */ defineComponent({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    replace: Boolean,
    activeClass: String,
    // inactiveClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    }
  },
  useLink,
  setup(props, { slots }) {
    const link = reactive(useLink(props));
    const { options } = inject(routerKey);
    const elClass = computed(() => ({
      [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
    }));
    return () => {
      const children = slots.default && preferSingleVNode(slots.default(link));
      return props.custom ? children : h("a", {
        "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
        href: link.href,
        // this would override user added attrs but Vue will still add
        // the listener, so we end up triggering both
        onClick: link.navigate,
        class: elClass.value
      }, children);
    };
  }
});
const RouterLink = RouterLinkImpl;
function guardEvent(e) {
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
    return;
  if (e.defaultPrevented)
    return;
  if (e.button !== void 0 && e.button !== 0)
    return;
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target))
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
  return true;
}
function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key];
    const outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue)
        return false;
    } else {
      if (!isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
        return false;
    }
  }
  return true;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
const RouterViewImpl = /* @__PURE__ */ defineComponent({
  name: "RouterView",
  // #674 we manually inherit them
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  // Better compat for @vue/compat users
  // https://github.com/vuejs/router/issues/1315
  compatConfig: { MODE: 3 },
  setup(props, { attrs, slots }) {
    const injectedRoute = inject(routerViewLocationKey);
    const routeToDisplay = computed(() => props.route || injectedRoute.value);
    const injectedDepth = inject(viewDepthKey, 0);
    const depth = computed(() => {
      let initialDepth = unref(injectedDepth);
      const { matched } = routeToDisplay.value;
      let matchedRoute;
      while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
        initialDepth++;
      }
      return initialDepth;
    });
    const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth.value]);
    provide(viewDepthKey, computed(() => depth.value + 1));
    provide(matchedRouteKey, matchedRouteRef);
    provide(routerViewLocationKey, routeToDisplay);
    const viewRef = ref();
    watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
      if (to) {
        to.instances[name] = instance;
        if (from && from !== to && instance && instance === oldInstance) {
          if (!to.leaveGuards.size) {
            to.leaveGuards = from.leaveGuards;
          }
          if (!to.updateGuards.size) {
            to.updateGuards = from.updateGuards;
          }
        }
      }
      if (instance && to && // if there is no instance but to and from are the same this might be
      // the first visit
      (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
        (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
      }
    }, { flush: "post" });
    return () => {
      const route = routeToDisplay.value;
      const currentName = props.name;
      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components[currentName];
      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route });
      }
      const routePropsOption = matchedRoute.props[currentName];
      const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
      const onVnodeUnmounted = (vnode) => {
        if (vnode.component.isUnmounted) {
          matchedRoute.instances[currentName] = null;
        }
      };
      const component = h(ViewComponent, assign({}, routeProps, attrs, {
        onVnodeUnmounted,
        ref: viewRef
      }));
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        normalizeSlot(slots.default, { Component: component, route }) || component
      );
    };
  }
});
function normalizeSlot(slot, data) {
  if (!slot)
    return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
const RouterView = RouterViewImpl;
function createRouter(options) {
  const matcher = createRouterMatcher(options.routes, options);
  const parseQuery$1 = options.parseQuery || parseQuery;
  const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
  const routerHistory = options.history;
  const beforeGuards = useCallbacks();
  const beforeResolveGuards = useCallbacks();
  const afterGuards = useCallbacks();
  const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
  let pendingLocation = START_LOCATION_NORMALIZED;
  if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
  const encodeParams = applyToParams.bind(null, encodeParam);
  const decodeParams = (
    // @ts-expect-error: intentionally avoid the type check
    applyToParams.bind(null, decode)
  );
  function addRoute(parentOrRoute, route) {
    let parent;
    let record;
    if (isRouteName(parentOrRoute)) {
      parent = matcher.getRecordMatcher(parentOrRoute);
      record = route;
    } else {
      record = parentOrRoute;
    }
    return matcher.addRoute(record, parent);
  }
  function removeRoute(name) {
    const recordMatcher = matcher.getRecordMatcher(name);
    if (recordMatcher) {
      matcher.removeRoute(recordMatcher);
    }
  }
  function getRoutes() {
    return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
  }
  function hasRoute(name) {
    return !!matcher.getRecordMatcher(name);
  }
  function resolve2(rawLocation, currentLocation) {
    currentLocation = assign({}, currentLocation || currentRoute.value);
    if (typeof rawLocation === "string") {
      const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
      const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
      const href2 = routerHistory.createHref(locationNormalized.fullPath);
      return assign(locationNormalized, matchedRoute2, {
        params: decodeParams(matchedRoute2.params),
        hash: decode(locationNormalized.hash),
        redirectedFrom: void 0,
        href: href2
      });
    }
    let matcherLocation;
    if (rawLocation.path != null) {
      matcherLocation = assign({}, rawLocation, {
        path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
      });
    } else {
      const targetParams = assign({}, rawLocation.params);
      for (const key in targetParams) {
        if (targetParams[key] == null) {
          delete targetParams[key];
        }
      }
      matcherLocation = assign({}, rawLocation, {
        params: encodeParams(targetParams)
      });
      currentLocation.params = encodeParams(currentLocation.params);
    }
    const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
    const hash = rawLocation.hash || "";
    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
      hash: encodeHash(hash),
      path: matchedRoute.path
    }));
    const href = routerHistory.createHref(fullPath);
    return assign({
      fullPath,
      // keep the hash encoded so fullPath is effectively path + encodedQuery +
      // hash
      hash,
      query: (
        // if the user is using a custom query lib like qs, we might have
        // nested objects, so we keep the query as is, meaning it can contain
        // numbers at `$route.query`, but at the point, the user will have to
        // use their own type anyway.
        // https://github.com/vuejs/router/issues/328#issuecomment-649481567
        stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
      )
    }, matchedRoute, {
      redirectedFrom: void 0,
      href
    });
  }
  function locationAsObject(to) {
    return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
  }
  function checkCanceledNavigation(to, from) {
    if (pendingLocation !== to) {
      return createRouterError(8, {
        from,
        to
      });
    }
  }
  function push(to) {
    return pushWithRedirect(to);
  }
  function replace(to) {
    return push(assign(locationAsObject(to), { replace: true }));
  }
  function handleRedirectRecord(to) {
    const lastMatched = to.matched[to.matched.length - 1];
    if (lastMatched && lastMatched.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
      if (typeof newTargetLocation === "string") {
        newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : (
          // force empty params
          { path: newTargetLocation }
        );
        newTargetLocation.params = {};
      }
      return assign({
        query: to.query,
        hash: to.hash,
        // avoid transferring params if the redirect has a path
        params: newTargetLocation.path != null ? {} : to.params
      }, newTargetLocation);
    }
  }
  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve2(to);
    const from = currentRoute.value;
    const data = to.state;
    const force = to.force;
    const replace2 = to.replace === true;
    const shouldRedirect = handleRedirectRecord(targetLocation);
    if (shouldRedirect)
      return pushWithRedirect(
        assign(locationAsObject(shouldRedirect), {
          state: typeof shouldRedirect === "object" ? assign({}, data, shouldRedirect.state) : data,
          force,
          replace: replace2
        }),
        // keep original redirectedFrom if it exists
        redirectedFrom || targetLocation
      );
    const toLocation = targetLocation;
    toLocation.redirectedFrom = redirectedFrom;
    let failure;
    if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
      failure = createRouterError(16, { to: toLocation, from });
      handleScroll(
        from,
        from,
        // this is a push, the only way for it to be triggered from a
        // history.listen is with a redirect, which makes it become a push
        true,
        // This cannot be the first navigation because the initial location
        // cannot be manually navigated to
        false
      );
    }
    return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? (
      // navigation redirects still mark the router as ready
      isNavigationFailure(
        error,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? error : markAsReady(error)
    ) : (
      // reject any unknown error
      triggerError(error, toLocation, from)
    )).then((failure2) => {
      if (failure2) {
        if (isNavigationFailure(
          failure2,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        )) {
          return pushWithRedirect(
            // keep options
            assign({
              // preserve an existing replacement but allow the redirect to override it
              replace: replace2
            }, locationAsObject(failure2.to), {
              state: typeof failure2.to === "object" ? assign({}, data, failure2.to.state) : data,
              force
            }),
            // preserve the original redirectedFrom if any
            redirectedFrom || toLocation
          );
        }
      } else {
        failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
      }
      triggerAfterEach(toLocation, from, failure2);
      return failure2;
    });
  }
  function checkCanceledNavigationAndReject(to, from) {
    const error = checkCanceledNavigation(to, from);
    return error ? Promise.reject(error) : Promise.resolve();
  }
  function runWithContext(fn) {
    const app2 = installedApps.values().next().value;
    return app2 && typeof app2.runWithContext === "function" ? app2.runWithContext(fn) : fn();
  }
  function navigate(to, from) {
    let guards;
    const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
    guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
    for (const record of leavingRecords) {
      record.leaveGuards.forEach((guard) => {
        guards.push(guardToPromiseFn(guard, to, from));
      });
    }
    const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
    guards.push(canceledNavigationCheck);
    return runGuardQueue(guards).then(() => {
      guards = [];
      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
      for (const record of updatingRecords) {
        record.updateGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const record of enteringRecords) {
        if (record.beforeEnter) {
          if (isArray(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter)
              guards.push(guardToPromiseFn(beforeEnter, to, from));
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from));
          }
        }
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      to.matched.forEach((record) => record.enterCallbacks = {});
      guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from, runWithContext);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).catch((err) => isNavigationFailure(
      err,
      8
      /* ErrorTypes.NAVIGATION_CANCELLED */
    ) ? err : Promise.reject(err));
  }
  function triggerAfterEach(to, from, failure) {
    afterGuards.list().forEach((guard) => runWithContext(() => guard(to, from, failure)));
  }
  function finalizeNavigation(toLocation, from, isPush, replace2, data) {
    const error = checkCanceledNavigation(toLocation, from);
    if (error)
      return error;
    const isFirstNavigation = from === START_LOCATION_NORMALIZED;
    const state = !isBrowser ? {} : history.state;
    if (isPush) {
      if (replace2 || isFirstNavigation)
        routerHistory.replace(toLocation.fullPath, assign({
          scroll: isFirstNavigation && state && state.scroll
        }, data));
      else
        routerHistory.push(toLocation.fullPath, data);
    }
    currentRoute.value = toLocation;
    handleScroll(toLocation, from, isPush, isFirstNavigation);
    markAsReady();
  }
  let removeHistoryListener;
  function setupListeners() {
    if (removeHistoryListener)
      return;
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      if (!router2.listening)
        return;
      const toLocation = resolve2(to);
      const shouldRedirect = handleRedirectRecord(toLocation);
      if (shouldRedirect) {
        pushWithRedirect(assign(shouldRedirect, { replace: true, force: true }), toLocation).catch(noop);
        return;
      }
      pendingLocation = toLocation;
      const from = currentRoute.value;
      if (isBrowser) {
        saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
      }
      navigate(toLocation, from).catch((error) => {
        if (isNavigationFailure(
          error,
          4 | 8
          /* ErrorTypes.NAVIGATION_CANCELLED */
        )) {
          return error;
        }
        if (isNavigationFailure(
          error,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        )) {
          pushWithRedirect(
            assign(locationAsObject(error.to), {
              force: true
            }),
            toLocation
            // avoid an uncaught rejection, let push call triggerError
          ).then((failure) => {
            if (isNavigationFailure(
              failure,
              4 | 16
              /* ErrorTypes.NAVIGATION_DUPLICATED */
            ) && !info.delta && info.type === NavigationType.pop) {
              routerHistory.go(-1, false);
            }
          }).catch(noop);
          return Promise.reject();
        }
        if (info.delta) {
          routerHistory.go(-info.delta, false);
        }
        return triggerError(error, toLocation, from);
      }).then((failure) => {
        failure = failure || finalizeNavigation(
          // after navigation, all matched components are resolved
          toLocation,
          from,
          false
        );
        if (failure) {
          if (info.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
          // entry while a different route is displayed
          !isNavigationFailure(
            failure,
            8
            /* ErrorTypes.NAVIGATION_CANCELLED */
          )) {
            routerHistory.go(-info.delta, false);
          } else if (info.type === NavigationType.pop && isNavigationFailure(
            failure,
            4 | 16
            /* ErrorTypes.NAVIGATION_DUPLICATED */
          )) {
            routerHistory.go(-1, false);
          }
        }
        triggerAfterEach(toLocation, from, failure);
      }).catch(noop);
    });
  }
  let readyHandlers = useCallbacks();
  let errorListeners = useCallbacks();
  let ready;
  function triggerError(error, to, from) {
    markAsReady(error);
    const list = errorListeners.list();
    if (list.length) {
      list.forEach((handler) => handler(error, to, from));
    } else {
      console.error(error);
    }
    return Promise.reject(error);
  }
  function isReady() {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve();
    return new Promise((resolve22, reject) => {
      readyHandlers.add([resolve22, reject]);
    });
  }
  function markAsReady(err) {
    if (!ready) {
      ready = !err;
      setupListeners();
      readyHandlers.list().forEach(([resolve22, reject]) => err ? reject(err) : resolve22());
      readyHandlers.reset();
    }
    return err;
  }
  function handleScroll(to, from, isPush, isFirstNavigation) {
    const { scrollBehavior } = options;
    if (!isBrowser || !scrollBehavior)
      return Promise.resolve();
    const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
    return nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
  }
  const go = (delta) => routerHistory.go(delta);
  let started;
  const installedApps = /* @__PURE__ */ new Set();
  const router2 = {
    currentRoute,
    listening: true,
    addRoute,
    removeRoute,
    clearRoutes: matcher.clearRoutes,
    hasRoute,
    getRoutes,
    resolve: resolve2,
    options,
    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,
    onError: errorListeners.add,
    isReady,
    install(app2) {
      const router22 = this;
      app2.component("RouterLink", RouterLink);
      app2.component("RouterView", RouterView);
      app2.config.globalProperties.$router = router22;
      Object.defineProperty(app2.config.globalProperties, "$route", {
        enumerable: true,
        get: () => unref(currentRoute)
      });
      if (isBrowser && // used for the initial navigation client side to avoid pushing
      // multiple times when the router is used in multiple apps
      !started && currentRoute.value === START_LOCATION_NORMALIZED) {
        started = true;
        push(routerHistory.location).catch((err) => {
        });
      }
      const reactiveRoute = {};
      for (const key in START_LOCATION_NORMALIZED) {
        Object.defineProperty(reactiveRoute, key, {
          get: () => currentRoute.value[key],
          enumerable: true
        });
      }
      app2.provide(routerKey, router22);
      app2.provide(routeLocationKey, shallowReactive(reactiveRoute));
      app2.provide(routerViewLocationKey, currentRoute);
      const unmountApp = app2.unmount;
      installedApps.add(app2);
      app2.unmount = function() {
        installedApps.delete(app2);
        if (installedApps.size < 1) {
          pendingLocation = START_LOCATION_NORMALIZED;
          removeHistoryListener && removeHistoryListener();
          removeHistoryListener = null;
          currentRoute.value = START_LOCATION_NORMALIZED;
          started = false;
          ready = false;
        }
        unmountApp();
      };
    }
  };
  function runGuardQueue(guards) {
    return guards.reduce((promise, guard) => promise.then(() => runWithContext(guard)), Promise.resolve());
  }
  return router2;
}
function extractChangingRecords(to, from) {
  const leavingRecords = [];
  const updatingRecords = [];
  const enteringRecords = [];
  const len = Math.max(from.matched.length, to.matched.length);
  for (let i = 0; i < len; i++) {
    const recordFrom = from.matched[i];
    if (recordFrom) {
      if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
        updatingRecords.push(recordFrom);
      else
        leavingRecords.push(recordFrom);
    }
    const recordTo = to.matched[i];
    if (recordTo) {
      if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
        enteringRecords.push(recordTo);
      }
    }
  }
  return [leavingRecords, updatingRecords, enteringRecords];
}
function useRouter() {
  return inject(routerKey);
}
const _imports_0 = "" + new URL("logo-DdkTonDQ.png", import.meta.url).href;
const _hoisted_1$5 = { class: "main-header" };
const _sfc_main$5 = {
  __name: "Header",
  setup(__props) {
    const router2 = useRouter();
    function goToAlbum() {
      router2.push("/album");
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$5, [
        _cache[1] || (_cache[1] = createBaseVNode("img", {
          class: "logo_img",
          src: _imports_0,
          alt: "logo"
        }, null, -1)),
        _cache[2] || (_cache[2] = createBaseVNode("div", { class: "header-cont" }, [
          createBaseVNode("h2", { class: "header-title" }, "Music Player"),
          createBaseVNode("h5", { class: "sub-header-title" }, "Your Melodic Companion")
        ], -1)),
        createBaseVNode("button", {
          class: "menu-btn",
          onClick: goToAlbum
        }, _cache[0] || (_cache[0] = [
          createBaseVNode("i", { class: "fa-solid fa-bars" }, null, -1)
        ]))
      ]);
    };
  }
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-3433b9e6"]]);
const _hoisted_1$4 = { class: "album-details-container" };
const _hoisted_2$3 = { class: "image" };
const _hoisted_3$2 = ["src"];
const _hoisted_4$2 = { class: "title-and-author" };
const _hoisted_5$2 = { class: "album_title" };
const _hoisted_6$2 = { class: "artist" };
const _hoisted_7$1 = { class: "running-song-title" };
const _sfc_main$4 = {
  __name: "AlbumDetails",
  setup(__props) {
    const musicStore = useMusicStore();
    onMounted(() => {
      musicStore.updateCurrentSong();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", _hoisted_1$4, [
          createBaseVNode("div", _hoisted_2$3, [
            createBaseVNode("img", {
              class: "album_img",
              src: unref(musicStore).albumCover,
              alt: "Default Album Image",
              loading: "eager"
            }, null, 8, _hoisted_3$2)
          ]),
          createBaseVNode("div", _hoisted_4$2, [
            createBaseVNode("p", _hoisted_5$2, toDisplayString(unref(musicStore).albumTitle), 1),
            createBaseVNode("p", _hoisted_6$2, toDisplayString(unref(musicStore).albumArtist), 1)
          ])
        ]),
        createBaseVNode("div", _hoisted_7$1, toDisplayString(unref(musicStore).albumTitle), 1)
      ], 64);
    };
  }
};
const AlbumDetails = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-39f16ac6"]]);
const _hoisted_1$3 = { class: "player_controls" };
const _hoisted_2$2 = { class: "audio" };
const _hoisted_3$1 = { class: "play-container" };
const _hoisted_4$1 = { class: "playBtnContainer" };
const _hoisted_5$1 = { class: "progress-volume-container" };
const _hoisted_6$1 = { class: "addl-controls" };
const _sfc_main$3 = {
  __name: "PlayerControls",
  setup(__props) {
    const musicStore = useMusicStore();
    const isPlaying = ref(false);
    const isMuted = ref(false);
    const isShuffle = ref(false);
    let volume = 0;
    function togglePlay() {
      const playState = Amplitude.getPlayerState();
      if (playState === "playing") {
        Amplitude.pause();
        isPlaying.value = false;
      } else if (playState === "paused" || playState === "stopped") {
        Amplitude.play();
        isPlaying.value = true;
      }
    }
    function toggleMute() {
      if (isMuted.value) {
        Amplitude.setVolume(volume);
        isMuted.value = false;
      } else {
        volume = Amplitude.getVolume();
        Amplitude.setVolume(0);
        isMuted.value = true;
      }
    }
    function nextSong() {
      Amplitude.next();
      musicStore.updateCurrentSong();
    }
    function prevSong() {
      Amplitude.prev();
      musicStore.updateCurrentSong();
    }
    function toggleShuffle() {
      const shuffleState = Amplitude.getShuffle();
      if (shuffleState) {
        Amplitude.setShuffle(false);
        isShuffle.value = false;
      } else {
        Amplitude.setShuffle(true);
        isShuffle.value = true;
      }
    }
    const progressContainerWidth = ref("100%");
    const volumeContainerWidth = ref("0%");
    const volumeContainerDisplay = ref("none");
    const showVolumeControl = () => {
      progressContainerWidth.value = "60%";
      volumeContainerWidth.value = "35%";
      volumeContainerDisplay.value = "block";
    };
    const hideVolumeControl = () => {
      progressContainerWidth.value = "100%";
      volumeContainerWidth.value = "0%";
      volumeContainerDisplay.value = "none";
    };
    onMounted(() => {
      document.addEventListener("click", hideVolumeControl);
      document.querySelector(".volume-container").addEventListener("click", (event) => event.stopPropagation());
    });
    onBeforeUnmount(() => {
      document.removeEventListener("click", hideVolumeControl);
    });
    const currentSongProgress = ref(0);
    function updateSongProgress() {
      const songProgress = currentSongProgress.value / 100 * Amplitude.getSongDuration();
      Amplitude.setSongPlayedPercentage(songProgress / Amplitude.getSongDuration() * 100);
    }
    const currentVolume = ref(Amplitude.getVolume());
    function updateVolume() {
      Amplitude.setVolume(currentVolume.value);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$3, [
        createBaseVNode("div", _hoisted_2$2, [
          createBaseVNode("div", _hoisted_3$1, [
            createBaseVNode("div", _hoisted_4$1, [
              createBaseVNode("div", {
                class: normalizeClass(["playBtn amplitude-play-pause", {
                  "amplitude-playing": isPlaying.value,
                  "amplitude-paused": !isPlaying.value
                }]),
                onClick: togglePlay
              }, null, 2)
            ]),
            _cache[2] || (_cache[2] = createStaticVNode('<div class="time-container" data-v-72566271><span class="current-time" data-v-72566271><span class="amplitude-current-minutes" data-v-72566271></span>:<span class="amplitude-current-seconds" data-v-72566271></span></span><span class="separator" data-v-72566271>/</span><span class="duration" data-v-72566271><span class="amplitude-duration-minutes" data-v-72566271></span>:<span class="amplitude-duration-seconds" data-v-72566271></span></span></div>', 1)),
            createBaseVNode("div", _hoisted_5$1, [
              createBaseVNode("div", {
                class: "progress-container",
                style: normalizeStyle({ width: progressContainerWidth.value })
              }, [
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => currentSongProgress.value = $event),
                  type: "range",
                  class: "amplitude-song-slider",
                  onInput: updateSongProgress
                }, null, 544), [
                  [vModelText, currentSongProgress.value]
                ])
              ], 4),
              createBaseVNode("div", {
                class: "volume-container",
                style: normalizeStyle({
                  width: volumeContainerWidth.value,
                  display: volumeContainerDisplay.value
                })
              }, [
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => currentVolume.value = $event),
                  type: "range",
                  class: "volume-slider amplitude-volume-slider",
                  onInput: updateVolume
                }, null, 544), [
                  [vModelText, currentVolume.value]
                ])
              ], 4)
            ]),
            createBaseVNode("div", {
              class: normalizeClass(["mute-button amplitude-mute", {
                "amplitude-not-muted": !isMuted.value,
                "amplitude-muted": isMuted.value
              }]),
              onClick: toggleMute,
              onMouseenter: showVolumeControl
            }, null, 34)
          ])
        ]),
        createBaseVNode("div", _hoisted_6$1, [
          createBaseVNode("button", { class: "prev btn" }, [
            createBaseVNode("i", {
              class: "fa-solid fa-backward",
              onClick: prevSong
            })
          ]),
          createBaseVNode("button", {
            class: normalizeClass(["shuffle btn", { "shuffle-active": isShuffle.value }])
          }, [
            createBaseVNode("i", {
              class: "fa-solid fa-shuffle",
              onClick: toggleShuffle
            })
          ], 2),
          createBaseVNode("button", { class: "next btn" }, [
            createBaseVNode("i", {
              class: "fa-solid fa-forward",
              onClick: nextSong
            })
          ])
        ])
      ]);
    };
  }
};
const PlayerControls = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-72566271"]]);
const _sfc_main$2 = {};
const _hoisted_1$2 = { class: "footer" };
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1$2, _cache[0] || (_cache[0] = [
    createBaseVNode("p", { class: "source_name" }, "Source: 渡一教育音乐库", -1),
    createBaseVNode("p", { class: "license_number" }, "License: MIT", -1)
  ]));
}
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render], ["__scopeId", "data-v-8e844611"]]);
const _hoisted_1$1 = {
  id: "music",
  class: "music"
};
const _hoisted_2$1 = {
  id: "music-player",
  class: "music-player"
};
const _sfc_main$1 = {
  __name: "Home",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("div", _hoisted_2$1, [
          createVNode(Header),
          createVNode(AlbumDetails)
        ]),
        createBaseVNode("div", null, [
          createVNode(PlayerControls),
          createVNode(Footer)
        ])
      ]);
    };
  }
};
const HomePage = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-632c4270"]]);
const _hoisted_1 = { class: "album-container" };
const _hoisted_2 = { class: "album-list" };
const _hoisted_3 = ["data-album", "onClick"];
const _hoisted_4 = ["data-album"];
const _hoisted_5 = ["src", "alt"];
const _hoisted_6 = ["data-album"];
const _hoisted_7 = { class: "song-list" };
const _hoisted_8 = ["onClick"];
const _sfc_main = {
  __name: "Album",
  setup(__props) {
    const router2 = useRouter();
    function backHomePage() {
      router2.back();
    }
    const albumsInfo = ref([]);
    const selectedAlbum = ref(null);
    const albumSongs = ref([]);
    onMounted(() => {
      const songs = Amplitude.getConfig().songs;
      let uniqueAlbums = /* @__PURE__ */ new Map();
      songs.forEach((song) => {
        if (!uniqueAlbums.has(song.album)) {
          uniqueAlbums.set(song.album, {
            name: song.album,
            cover: song.cover_art_url,
            source: song.source
          });
        }
      });
      albumsInfo.value = Array.from(uniqueAlbums.values());
    });
    function selectAlbum(albumName) {
      const songs = Amplitude.getConfig().songs;
      selectedAlbum.value = albumName;
      albumSongs.value = songs.filter((song) => song.album === albumName).map((song) => {
        return {
          ...song,
          globalIndex: songs.indexOf(song)
          // 保存全局索引
        };
      });
    }
    const playSong = (index) => {
      Amplitude.playSongAtIndex(index);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("header", { class: "album-header" }, [
          _cache[1] || (_cache[1] = createBaseVNode("div", { class: "title" }, "专辑列表", -1)),
          createBaseVNode("div", {
            class: "closeAlbumBtn fa-solid fa-close",
            onClick: backHomePage
          })
        ]),
        createBaseVNode("ul", _hoisted_2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(albumsInfo.value, (album) => {
            return openBlock(), createElementBlock("li", {
              key: album.name,
              class: "album-item",
              "data-album": album.name,
              onClick: ($event) => selectAlbum(album.name)
            }, [
              createBaseVNode("div", {
                class: "item-left",
                "data-album": album.name
              }, [
                createBaseVNode("img", {
                  src: album.cover,
                  alt: album.name
                }, null, 8, _hoisted_5)
              ], 8, _hoisted_4),
              createBaseVNode("div", {
                class: "item-right",
                "data-album": album.name
              }, [
                createBaseVNode("div", null, "专辑：" + toDisplayString(album.name), 1),
                _cache[2] || (_cache[2] = createBaseVNode("div", null, "歌手：网络歌手", -1)),
                createBaseVNode("div", null, "来源：" + toDisplayString(album.source), 1)
              ], 8, _hoisted_6)
            ], 8, _hoisted_3);
          }), 128))
        ]),
        createBaseVNode("div", {
          class: normalizeClass(["song-container", { "show-song-list": selectedAlbum.value }])
        }, [
          createBaseVNode("dl", _hoisted_7, [
            _cache[3] || (_cache[3] = createBaseVNode("dt", { class: "title-container flex" }, [
              createBaseVNode("div", null, "音乐标题"),
              createBaseVNode("div", null, [
                createBaseVNode("div", null, "歌手"),
                createBaseVNode("div", null, "专辑")
              ])
            ], -1)),
            (openBlock(true), createElementBlock(Fragment, null, renderList(albumSongs.value, (song) => {
              return openBlock(), createElementBlock("dd", {
                key: song.globalIndex,
                class: "song-item flex amplitude-song-container amplitude-play-pause",
                onClick: ($event) => playSong(song.globalIndex)
              }, [
                createBaseVNode("div", null, toDisplayString(song.name), 1),
                createBaseVNode("div", null, [
                  createBaseVNode("div", null, toDisplayString(song.artist), 1),
                  createBaseVNode("div", null, toDisplayString(song.album), 1)
                ])
              ], 8, _hoisted_8);
            }), 128))
          ]),
          createBaseVNode("div", {
            class: "arrow-down fa-solid fa-angle-double-down",
            onClick: _cache[0] || (_cache[0] = ($event) => selectedAlbum.value = null)
          })
        ], 2)
      ]);
    };
  }
};
const AlbumPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8c56c679"]]);
const routes = [
  { path: "/", component: HomePage },
  { path: "/album", component: AlbumPage }
];
const router = createRouter({
  history: createWebHistory(),
  // 使用 HTML5 History 模式
  routes
  // 简写，相当于 routes: routes
});
router.beforeEach((to, from, next) => {
  const musicStore = useMusicStore();
  if (to.fullPath === "/") {
    musicStore.setNavigationDirection("backward");
  } else if (from.fullPath === "/" && to.fullPath === "/album") {
    musicStore.setNavigationDirection("forward");
  }
  next();
});
const app = createApp(_sfc_main$6);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount("#app");
