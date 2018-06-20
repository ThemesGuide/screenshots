# Tophat Screenshot Service

Free, open source Web screenshots and image duplication API.

Purpose
---

These are 2 of the most common image feature requirements across the Web:

1) - take a screenshot of a url, save the image on a CDN, and then return a url to image on CDN.

2) - provide an existing image url, duplicate the image, save it to CDN, and then return a url to image on CDN.

Implementation
---

This service use NodeJS, Phantom for the screenshots, and Firebase for image storage.

Usage
---

There are 2 endpoints.

1) /ss (Take a screenshot)

2) /img (Duplicate an image from url)


