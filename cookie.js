/* ═══════════════════════════════════════════════════
   SGM Network — cookie.js
   Cookie Consent Banner
═══════════════════════════════════════════════════ */
'use strict';

(function () {
  const KEY     = 'sgm_cookie_consent';
  const VERSION = '1'; // tăng số này để reset consent khi cập nhật chính sách

  /* Đã đồng ý rồi thì không hiện nữa */
  if (localStorage.getItem(KEY) === VERSION) return;

  /* ── Tạo HTML banner ── */
  const banner = document.createElement('div');
  banner.id        = 'cookieBanner';
  banner.innerHTML = `
    <div class="cookie-inner">
      <div class="cookie-text">
        <i class="ri-cookie-line"></i>
        <p>
          Chúng tôi sử dụng cookie để cải thiện trải nghiệm của bạn.
          Bằng cách tiếp tục sử dụng trang web, bạn đồng ý với
          <a href="privacy.html">Chính sách bảo mật</a> của chúng tôi.
        </p>
      </div>
      <div class="cookie-actions">
        <button id="cookieDecline" class="cookie-btn cookie-btn--outline">Từ chối</button>
        <button id="cookieAccept"  class="cookie-btn cookie-btn--primary">Chấp nhận</button>
      </div>
    </div>`;
  document.body.appendChild(banner);

  /* ── Inject CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    #cookieBanner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 99999;
      background: rgba(17,17,24,.97);
      border-top: 1px solid rgba(255,255,255,.1);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      padding: 18px 24px;
      transform: translateY(100%);
      transition: transform .4s cubic-bezier(.4,0,.2,1);
      box-shadow: 0 -8px 32px rgba(0,0,0,.5);
    }
    #cookieBanner.show { transform: translateY(0); }

    .cookie-inner {
      max-width: 1200px;
      margin-inline: auto;
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .cookie-text {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      flex: 1;
      min-width: 260px;
    }

    .cookie-text .ri-cookie-line {
      font-size: 1.5rem;
      color: #E8192C;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .cookie-text p {
      font-size: .88rem;
      color: #A8A8B8;
      line-height: 1.6;
      margin: 0;
    }

    .cookie-text a {
      color: #E8192C;
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    .cookie-text a:hover { color: #ff6b7a; }

    .cookie-actions {
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    }

    .cookie-btn {
      padding: 9px 22px;
      border-radius: 9999px;
      font-size: .85rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all .25s ease;
      font-family: inherit;
      white-space: nowrap;
      -webkit-tap-highlight-color: transparent;
    }

    .cookie-btn--primary {
      background: linear-gradient(135deg, #E8192C, #FF6B35);
      color: #fff;
      box-shadow: 0 4px 16px rgba(232,25,44,.35);
    }
    .cookie-btn--primary:hover { filter: brightness(1.1); transform: translateY(-1px); }

    .cookie-btn--outline {
      background: transparent;
      border: 1px solid rgba(255,255,255,.2);
      color: #A8A8B8;
    }
    .cookie-btn--outline:hover { border-color: rgba(255,255,255,.4); color: #fff; }

    @media (max-width: 600px) {
      #cookieBanner { padding: 16px; }
      .cookie-inner { gap: 14px; }
      .cookie-actions { width: 100%; }
      .cookie-btn { flex: 1; text-align: center; }
    }
  `;
  document.head.appendChild(style);

  /* ── Hiện banner sau 600ms ── */
  requestAnimationFrame(() => {
    setTimeout(() => banner.classList.add('show'), 600);
  });

  /* ── Xử lý nút ── */
  function hideBanner() {
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 450);
  }

  document.getElementById('cookieAccept').addEventListener('click', () => {
    localStorage.setItem(KEY, VERSION);
    hideBanner();
  });

  document.getElementById('cookieDecline').addEventListener('click', () => {
    /* Không lưu — banner sẽ hiện lại lần sau */
    hideBanner();
  });
})();
