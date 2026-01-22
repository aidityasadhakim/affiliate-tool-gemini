Project ini ditujukan untuk di run di Gemini Canvas
Maka dari itu apiKey di file App.jsx dibuat kosong karena akan diinject ke dalam file App.jsx oleh Gemini Canvas

Untuk menggunakan API Key, silakan kunjungi https://gemini.ai/api

Jika ingin menggunakan API Key yang sudah ada, silakan edit file App.jsx dengan mengganti kode berikut:

```jsx
const apiKey = "";
```

Dan silakan edit file App.jsx dengan mengganti kode berikut:

```jsx
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

Jika ingin menggunakan API Key yang baru, silakan buat akun di https://gemini.ai/register dan mendapatkan API Key tersebut.
