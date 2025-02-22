# main.js README

## Overview

main.js is a Node.js script designed to simulate realistic browser behavior for web scraping and automation purposes. It features advanced functionality, including URL reading from files, progress tracking, tab browser simulation, cache and cookie management, and realistic behavior simulation.

## Features

### Fitur Tambahan

- **Pembacaan URL dari File**: Reads URLs from a file named `url.txt` and supports up to hundreds of URLs.
- **Progress Tracking**: Tracks progress and displays it in the console.
- **Sistem Tab Browser**: Simulates multiple tabs, allowing for switching between them and tracking history per tab.
- **Cache & Cookie Management**: Utilizes a cookie jar for each session, makes conditional requests for cache, and generates random cache headers.
- **Perilaku Realistik**: Simulates realistic behavior, including:
  - Scroll dengan pola acak (random scrolling)
  - Klik random element (random element clicking)
  - Viewport acak (random viewport)
  - Device metrics bervariasi (varied device metrics)
  - Jeda untuk melihat gambar/konten (pauses to view images/content)
- **Fingerprint Rotation**: Rotates fingerprints, including:
  - User-Agent unik tiap request (unique User-Agent per request)
  - Viewport berbeda (different viewport)
  - Device memory berbeda (different device memory)
  - Timezone acak (random timezone)
- **Network Simulation**: Simulates network behavior, including:
  - Cache control headers
  - Conditional requests
  - Referer acak (random referer)

## Environment Variables

The script uses environment variables stored in a `.env` file. The following variables are required:

- `URL_FILE`: Path to the `url.txt` file containing URLs to read.
- `TAB_COUNT`: Number of tabs to simulate.
- `CACHE_DIR`: Directory to store cache files.
- `COOKIE_JAR`: Path to the cookie jar file.
- `USER_AGENT`: Default User-Agent string.
- `DEVICE_MEMORY`: Default device memory value.
- `TIMEZONE`: Default timezone value.

Example `.env` file:

```makefile
PROXY_HOST=example.com
PROXY_PORT=8080
PROXY_USERNAME=username
PROXY_PASSWORD=password
PROXY_LIFETIME=5
```

## Usage

To run the script, execute the following command:
First install this 
```bash
npm install axios https-proxy-agent cheerio @faker-js/faker tough-cookie dotenv
```

```bash
node main.js
```

Make sure to replace `main.js` with the actual script file name.

Note: This README is a general description of the script's features and functionality. For more detailed information, please refer to the script's code and documentation.
