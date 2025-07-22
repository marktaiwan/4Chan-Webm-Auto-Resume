// ==UserScript==
// @name         4chan WebM Auto-Resume
// @description  Resumes playback of paused WebM videos when scrolled into view
// @namespace    https://github.com/marktaiwan/
// @homepageURL  https://github.com/marktaiwan/4chan-Webm-Auto-Resume
// @supportURL   https://github.com/marktaiwan/4chan-Webm-Auto-Resume/issues
// @license      MIT
// @version      0.4
// @author       Marker
// @include      *//boards.4chan.org/*
// @include      *//boards.4channel.org/*
// @require      https://raw.githubusercontent.com/soufianesakhi/node-creation-observer-js/master/release/node-creation-observer-latest.js
// @grant        none
// @noframe
// ==/UserScript==

/* global NodeCreationObserver */
(function () {
'use strict';
const SCRIPT_ID = 'webm-auto-resume';

function isVisible(ele) {
  return (ele.dataset.visibility === '1');
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

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const video = entry.target;
    video.dataset.visibility = entry.isIntersecting ? '1' : '0';
    if (video.paused && entry.isIntersecting && !pausedByUser(video)) {
      video.play().catch(() => { /* noop */ });
    }
  });
});

NodeCreationObserver.init(SCRIPT_ID);
NodeCreationObserver.onCreation('.expandedWebm', video => {
  video.dataset.userPauseState = video.paused ? '1' : '0';
  video.addEventListener('pause', pauseHandler);
  video.addEventListener('play', playHandler);
  observer.observe(video);
});
})();
