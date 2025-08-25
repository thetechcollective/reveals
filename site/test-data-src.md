# Data-Src and Data-Background Test

Testing reveal.js lazy loading with data-src attributes and data-background features.

---
---

## Lazy Loading Images

This slide demonstrates data-src for lazy loading:

<img class="r-frame" width="300" height="200" data-src="./assets/t&do_wheel.png" alt="Lazy loaded image">

---

## Multiple Images

Testing multiple lazy-loaded images:

<img data-src="./assets/t&do_wheel.png" width="150" height="100" alt="Image 1">
<img data-src="/assets/t&do_wheel.png" width="150" height="100" alt="Image 2">

---

## Mixed Attributes

Testing both src and data-src:

<!-- Regular loading -->
<img src="./assets/t&do_wheel.png" width="100" height="100" alt="Immediate load">

<!-- Lazy loading -->
<img data-src="/assets/t&do_wheel.png" width="100" height="100" alt="Lazy load">


---

## Background Features

<!-- .slide: data-background="./assets/t&do_wheel.png" -->

Testing data-background with local image.

---

## Video Background

<!-- .slide: data-background-video="./assets/background-video.mp4" -->

Testing data-background-video with local video file.
