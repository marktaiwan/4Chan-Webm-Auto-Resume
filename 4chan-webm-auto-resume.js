// ==UserScript==
// @name         4chan WebM Auto-Resume
// @description  Resumes playback of paused WebM videos when scrolled into view
// @namespace    https://github.com/marktaiwan/
// @homepageURL  https://github.com/marktaiwan/4chan-Webm-Auto-Resume
// @supportURL   https://github.com/marktaiwan/4chan-Webm-Auto-Resume/issues
// @license      MIT
// @version      0.1
// @author       Marker
// @include      *//boards.4chan.org/*
// @grant        none
// @noframe
// ==/UserScript==

(function() {
  'use strict';
  let ticking = false;

  function isVisible(ele) {
    const {top, bottom} = ele.getBoundingClientRect();
    return (top > 0 || bottom > 0) && (top < document.documentElement.clientHeight);
  }

  function pausedByUser(video) {
    return (video.dataset.userPauseState === '1');
  }

  function pauseHandler(event) {
    const video = event.target;
    // Video is still in view when paused, therefore it's triggered by the user
    if (isVisible(video)) video.dataset.userPauseState = '1';
  }

  function playHandler(event) {
    const video = event.target;
    if (pausedByUser(video)) video.dataset.userPauseState = '0';
  }

  function initVideoElement(video) {
    if (video.dataset.userPauseState === undefined) {
      video.dataset.userPauseState = '0';
      video.addEventListener('pause', pauseHandler);
      video.addEventListener('play', playHandler);
    }
  }

  document.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {

        const expandedVideos = document.querySelectorAll('.expandedWebm');
        for (const video of expandedVideos) {
          initVideoElement(video);
          if (video.paused && isVisible(video) && !pausedByUser(video)) {
            video.play();
          }
        }
        ticking = false;

      });
      ticking = true;
    }
  });
})();
