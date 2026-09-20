/* ── SGM Network — Source Protection ── */
(function(){
  'use strict';

  // 1. Chặn chuột phải
  document.addEventListener('contextmenu', function(e){
    e.preventDefault();
    return false;
  });

  // 2. Chặn các phím tắt DevTools & View Source
  document.addEventListener('keydown', function(e){
    // F12
    if(e.keyCode === 123){ e.preventDefault(); return false; }
    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools)
    if(e.ctrlKey && e.shiftKey && [73,74,67].indexOf(e.keyCode) !== -1){
      e.preventDefault(); return false;
    }
    // Ctrl+U (View Source)
    if(e.ctrlKey && e.keyCode === 85){ e.preventDefault(); return false; }
    // Ctrl+S (Save page)
    if(e.ctrlKey && e.keyCode === 83){ e.preventDefault(); return false; }
  });

  // 3. Phát hiện DevTools đang mở — làm chậm / redirect
  var _threshold = 160;
  var _devOpen = false;
  setInterval(function(){
    var start = performance.now();
    // Trick: debugger statement tốn thời gian khi DevTools mở
    (function(){ /* no-op */ })();
    var w = window.outerWidth - window.innerWidth;
    var h = window.outerHeight - window.innerHeight;
    if(w > _threshold || h > _threshold){
      if(!_devOpen){
        _devOpen = true;
        document.body.innerHTML = '<div style="display:grid;place-items:center;height:100vh;background:#0A0A0F;color:#fff;font-family:sans-serif;font-size:1.2rem;gap:12px"><span style="font-size:2.5rem">🔒</span><p>Không được phép truy cập công cụ phát triển.</p><a href="index.html" style="color:#E8192C;margin-top:8px">← Quay lại trang chủ</a></div>';
      }
    } else {
      _devOpen = false;
    }
  }, 1000);

  // 4. Xóa console
  try {
    Object.defineProperty(window, 'console', {
      get: function(){ return { log:function(){}, warn:function(){}, error:function(){}, info:function(){}, table:function(){}, dir:function(){} }; },
      set: function(){}
    });
  } catch(e){}

})();
