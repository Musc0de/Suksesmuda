# main.js

================

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Usage](#usage)
- [Requirements](#requirements)

## Overview

a.js is a JavaScript script designed to simulate realistic browser behavior. It provides a range of features to mimic human-like interactions, including URL reading from files, tab management, cache and cookie management, and more.

## Features

- **Pembacaan URL dari File**: Reads URLs from a file (url.txt) and supports hundreds of URLs.
- **Progress Tracking**: Tracks progress and provides updates on the simulation.
- **Sistem Tab Browser**: Simulates multiple tabs, allowing for switching between them and tracking history per tab.
- **Cache & Cookie Management**: Manages cookies and cache for each session, including conditional requests and random cache headers.
- **Perilaku Realistik**: Simulates realistic behavior, including:
  - Scroll dengan pola acak (random scrolling)
  - Klik random element (random clicks)
  - Viewport acak (random viewport)
  - Device metrics bervariasi (varied device metrics)
  - Jeda untuk melihat gambar/konten (pauses to view images/content)
- **Fingerprint Rotation**: Rotates user-agent, viewport, device memory, and timezone to simulate different devices.
- **Network Simulation**: Simulates network behavior, including cache control headers, conditional requests, and random referers.

## Usage

1. npm install axios https-proxy-agent cheerio @faker-js/faker tough-cookie dotenv

2. Create a file named `url.txt` containing the URLs to simulate.
3. Run the script using Node.js: `node a.js`

## Requirements

- Node.js (version 14 or higher)
- A file named `url.txt` containing the URLs to simulate
