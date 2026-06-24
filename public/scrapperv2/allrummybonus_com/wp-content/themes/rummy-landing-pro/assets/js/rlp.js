
(function(){
  // modal
  const overlay=document.querySelector('.modalOverlay');
  function openModal(id){
    const m=document.getElementById(id);
    if(!m) return;
    overlay && overlay.classList.add('open');
    m.classList.add('open');
    m.style.display='flex';
  }
  function closeAll(){
    document.querySelectorAll('.modal').forEach(m=>{m.classList.remove('open'); m.style.display='none';});
    overlay && overlay.classList.remove('open');
  }
  document.querySelectorAll('[data-modal]').forEach(el=>{
    el.addEventListener('click',()=>openModal(el.getAttribute('data-modal')));
  });
  document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeAll));
  overlay && overlay.addEventListener('click',closeAll);

  // categories + search (list pages)
  function setCat(cat){
    document.querySelectorAll('.cats button').forEach(b=>b.classList.toggle('active', b.dataset.cat===cat));
    document.querySelectorAll('[data-item]').forEach(it=>{
      const c=it.dataset.cat||'best';
      it.style.display = (cat===c) ? '' : 'none';
    });
  }
  window.rlpCat=setCat;

  const search=document.getElementById('rlp-search');
  window.rlpSearch=function(val){
    const q=(val||'').toLowerCase().trim();
    document.querySelectorAll('[data-item]').forEach(it=>{
      const t=(it.dataset.title||'').toLowerCase();
      it.style.display = t.includes(q) ? '' : 'none';
    });
  }
  if(search){ search.addEventListener('input', e=>window.rlpSearch(e.target.value)); }

  // default cat best
  const btn=document.querySelector('.cats button[data-cat="best"]');
  if(btn) setCat('best');
})();

(function () {
  function initDownloadTargets() {
    // 1) .claim 里的 button
    var claimBtn = document.querySelector('.claim button');
    if (claimBtn) {
      claimBtn.setAttribute('data-download', 'down-now');

      // 让原 onclick 失效
      claimBtn.removeAttribute('onclick');
      claimBtn.onclick = null;
    }

    // 2) 底部 sticky 的 a
    var stickyBtn = document.querySelector('.sticky-btn');
    if (stickyBtn) {
      stickyBtn.setAttribute('data-download', 'down-now');

      // 让原 href / target 失效，但保留点击本身
      stickyBtn.removeAttribute('href');
      stickyBtn.removeAttribute('target');
      stickyBtn.removeAttribute('rel');

      // 防止有原生 onclick
      stickyBtn.removeAttribute('onclick');
      stickyBtn.onclick = null;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDownloadTargets);
  } else {
    initDownloadTargets();
  }
})();

(function () {
  function markDownloadImages() {
    document.querySelectorAll('img[src*="all-rummy-bonus-banner"]').forEach(function (img) {
      img.setAttribute('data-download', 'down-now');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markDownloadImages);
  } else {
    markDownloadImages();
  }

  var observer = new MutationObserver(function () {
    markDownloadImages();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  setTimeout(markDownloadImages, 500);
  setTimeout(markDownloadImages, 1500);
  setTimeout(markDownloadImages, 3000);
})();


document.addEventListener('DOMContentLoaded', function () {
  const slider =
    document.querySelector('.home-hero-slider') ||
    document.querySelector('.heroWrap.slider');

  if (!slider) return;

  const imgs = slider.querySelectorAll('img');
  if (!imgs.length) return;

  let index = 0;

  imgs.forEach(function (img, i) {
    img.classList.toggle('active', i === 0);
  });

  setInterval(function () {
    const oldIndex = index;
    const newIndex = (index + 1) % imgs.length;

    // 重点：先让新图出现
    imgs[newIndex].classList.add('active');

    // 等新图淡入后，再隐藏旧图
    setTimeout(function () {
      imgs[oldIndex].classList.remove('active');
    }, 450);

    index = newIndex;
  }, 3000);
});


// // ads-insert.js
// document.addEventListener("DOMContentLoaded", function () {

//   // 当前页面 slug（去掉首尾 /）
//   const currentSlug = window.location.pathname.replace(/^\/|\/$/g, '');

//   // 页面广告配置
//   const adConfig = {
//     "rummy-wealth": [
//       { afterRank: 2, image: "https://allrummybonus.com/wp-content/uploads/2026/05/best-rummy-app.webp", link: "https://allrummybonus.com" }
//     ]
//     // 其他页面可继续添加
//     // "rummy-noble": [
//     //   { afterRank: 3, image: "https://你的域名.com/noble-ad.webp", link: "https://xxx.com" }
//     // ]
//   };

//   // 如果当前页面没有配置广告，直接退出
//   if (!adConfig[currentSlug]) return;

//   // 获取所有 row
//   const rows = document.querySelectorAll('.list .row');

//   // 插入广告
//   adConfig[currentSlug].forEach(ad => {
//     rows.forEach(row => {
//       const rankEl = row.querySelector('.rank');
//       if (!rankEl) return;
//       const rank = parseInt(rankEl.textContent.trim());
//       if (rank === ad.afterRank) {
//         const adBox = document.createElement('div');
//         adBox.className = 'custom-inline-ad';
//         adBox.innerHTML = `
//           <a href="${ad.link}" target="_blank" rel="nofollow noopener noreferrer">
//             <img src="${ad.image}" alt="Advertisement">
//           </a>
//         `;
//         // 插入到 hr 后面
//         const hr = row.nextElementSibling;
//         if (hr && hr.classList.contains('hr')) {
//           hr.insertAdjacentElement('afterend', adBox);
//         }
//       }
//     });
//   });

// });


//document.addEventListener("DOMContentLoaded", function () {

  /* 当前页面 slug，例如 /rummy-wealth/ => rummy-wealth */
//   const currentSlug = window.location.pathname.replace(/^\/|\/$/g, "");

//   /* 配置：指定页面 + 指定插入位置 */
//   const insertConfig = {
//     "rummy-wealth": [
//       {
//         afterRank: 2, // 插入到第2个下面

//         rank: 99,
//         name: "Jaiho 91",
//         icon: "https://allrummybonus.com/wp-content/uploads/2026/05/Jaiho-91.webp",
//         url: "https://www.rummyskill.com/gourl/?p=jiaho91",
//         installs: "320K+",
//         bonus: "Rs.51",
//         min: "₹50"
//       }
//     ]

    /*
    后面换页面这样加：

    "rummy-noble": [
      {
        afterRank: 3,
        rank: 88,
        name: "Dash Rummy",
        icon: "https://allrummybonus.com/wp-content/uploads/2025/12/Dash-Rummy-150x150.webp",
        url: "https://allrummybonus.com/dash-rummy/",
        installs: "410K+",
        bonus: "Rs.75",
        min: "₹100"
      }
    ]
    */
 // };

//   if (!insertConfig[currentSlug]) return;

//   const rows = document.querySelectorAll(".list .row");

//   insertConfig[currentSlug].forEach(function (item) {

//     rows.forEach(function (row) {

//       const rankEl = row.querySelector(".rank");
//       if (!rankEl) return;

//       const rankNum = parseInt(rankEl.textContent.trim(), 10);
//       if (rankNum !== item.afterRank) return;

//       /* 防止重复插入 */
//       const insertId = "insert-row-" + currentSlug + "-" + item.afterRank + "-" + item.name.toLowerCase().replace(/\s+/g, "-");
//       if (document.getElementById(insertId)) return;

//       const newHr = document.createElement("div");
//       newHr.className = "hr";

//       const newRow = document.createElement("div");
//       newRow.className = "row inserted-app-row";
//       newRow.id = insertId;

//       newRow.innerHTML = `
// <div class="rank">*</div>

//         <img
//           class="icon"
//           src="${item.icon}"
//           alt="${item.name}"
//           loading="lazy"
//         >

//         <div class="meta">
//           <h3 class="name">${item.name}</h3>

//           <h4 class="sub">
//             ⬇ ${item.installs} | Bonus ${item.bonus}
//           </h4>

//           <h5 class="min">
//             Min. Withdrawal ${item.min}
//           </h5>
//         </div>

//         <a class="dlBtn" href="${item.url}" target="_blank" rel="nofollow noopener noreferrer">
//           Download
//         </a>
//       `;

//       const hr = row.nextElementSibling;

//       if (hr && hr.classList.contains("hr")) {
//         hr.insertAdjacentElement("afterend", newRow);
//         newRow.insertAdjacentElement("afterend", newHr);
//       } else {
//         row.insertAdjacentElement("afterend", newRow);
//         newRow.insertAdjacentElement("afterend", newHr);
//       }

//     });

//   });

// });


document.addEventListener("DOMContentLoaded", function () {

  const currentSlug = window.location.pathname.replace(/^\/|\/$/g, "");

  /*
    default = 全部页面都显示这一组
    如果某个页面想单独设置，就再写它自己的 slug
  */
  const downloadRowConfig = {
    "rummy-wealth": [
      {
        apps: [
          {
            icon: "https://allrummybonus.com/wp-content/uploads/2025/12/Rummy-Wealth-2-150x150.webp",
            url: "https://allrummybonus.com/rummy-wealth/"
          },
          {
            icon: "https://allrummybonus.com/wp-content/uploads/2025/12/yono-rummy-150x150.webp",
            url: "https://allrummybonus.com/yono-rummy/"
          },
          {
            icon: "https://allrummybonus.com/wp-content/uploads/2025/12/Rummy-Noble-app-150x150.webp",
            url: "https://allrummybonus.com/rummy-noble/"
          },
          {
            icon: "https://allrummybonus.com/wp-content/uploads/2025/12/rummy-leader-apk-150x150.webp",
            url: "https://allrummybonus.com/rummy-leader/"
          }
        ]
      }
    ],

    /*
    某个页面想单独不同，就这样写，会覆盖 default：

    "rummy-wealth": [
      {
        apps: [
          {
            icon: "https://allrummybonus.com/wp-content/uploads/2025/12/Rummy-Wealth-150x150.webp",
            url: "https://allrummybonus.com/rummy-wealth/"
          },
          {
            icon: "https://allrummybonus.com/wp-content/uploads/2025/12/yono-rummy-150x150.webp",
            url: "https://allrummybonus.com/yono-rummy/"
          },
          {
            icon: "https://allrummybonus.com/wp-content/uploads/2025/12/Rummy-Noble-app-150x150.webp",
            url: "https://allrummybonus.com/rummy-noble/"
          },
          {
            icon: "https://allrummybonus.com/wp-content/uploads/2025/12/rummy-leader-apk-150x150.webp",
            url: "https://allrummybonus.com/rummy-leader/"
          }
        ]
      }
    ]
    */
  };

  const rowsToInsert = downloadRowConfig[currentSlug] || downloadRowConfig["default"];

  if (!rowsToInsert) return;

  const claimEl = document.querySelector(".claim");
  if (!claimEl) return;

  if (document.querySelector(".custom-download-row")) return;

  rowsToInsert.forEach(function (row) {

    const rowDiv = document.createElement("div");
    rowDiv.className = "custom-download-row";

    row.apps.forEach(function (app) {

      const item = document.createElement("a");
      item.className = "custom-download-item";
      item.href = app.url;
      item.target = "_blank";
      item.rel = "nofollow noopener noreferrer";

      item.innerHTML = `
        <img class="custom-download-icon" src="${app.icon}" alt="Download" loading="lazy">
        <div class="custom-download-btn">👉 Download</div>
      `;

      rowDiv.appendChild(item);

    });

    claimEl.insertAdjacentElement("afterend", rowDiv);

  });

});