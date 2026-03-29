// ===== 作品数据 =====
const worksData = [
    {
        id: 1,
        title: "23-25年买量作品合集",
        bvid: "BV1S2X9BNEzB"
    },
    {
        id: 2,
        title: "向僵尸开炮-后退搜打撤",
        bvid: "BV1XzwFzCEaH"
    },
    {
        id: 3,
        title: "向僵尸开炮-AI滑板",
        bvid: "BV1GzwFzCEbH"
    },
    {
        id: 4,
        title: "向僵尸开炮-跑圈圈",
        bvid: "BV1GzwFzCEng"
    },
    {
        id: 5,
        title: "向僵尸开炮-捡子弹开头打不爆螺丝",
        bvid: "BV1GzwFzCE3V"
    },
    {
        id: 6,
        title: "向僵尸开炮-木桩胖虎",
        bvid: "BV1FWw3zWEa6"
    },
    {
        id: 7,
        title: "快来当领主-格子油桶",
        bvid: "BV13zwFzCEeh"
    },
    {
        id: 8,
        title: "快来当领主-圈树木",
        bvid: "BV1azwFzCEGy"
    },
    {
        id: 9,
        title: "冒险之星-新折射",
        bvid: "BV1GzwFzCEW6"
    },
    {
        id: 10,
        title: "冒险之星-宇智波格子",
        bvid: "BV1azwFzCE9s"
    },
    {
        id: 11,
        title: "行侠仗义五千年-气泡月牙",
        bvid: "BV1GzwFzCEbD"
    },
    {
        id: 12,
        title: "2020-2023年品宣作品集",
        bvid: "BV1PLw3zfE8w"
    }
];

const coverCache = new Map();

async function getBilibiliCover(bvid) {
    if (coverCache.has(bvid)) {
        return coverCache.get(bvid);
    }
    
    try {
        const apiUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
        
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data.contents) {
            const jsonData = JSON.parse(data.contents);
            if (jsonData.data && jsonData.data.pic) {
                let coverUrl = jsonData.data.pic;
                if (coverUrl.startsWith('http:')) {
                    coverUrl = coverUrl.replace('http:', 'https:');
                }
                coverCache.set(bvid, coverUrl);
                return coverUrl;
            }
        }
    } catch (error) {
        console.warn(`获取B站封面失败 (${bvid}):`, error);
    }
    
    return null;
}

// ===== DOM 元素 =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const worksGrid = document.getElementById('worksGrid');
const videoModal = document.getElementById('videoModal');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.querySelector('.modal-backdrop');
const videoContainer = document.getElementById('videoContainer');

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    renderWorks();
    initVideoModal();
});

// ===== 导航功能 =====
function initNavigation() {
    // 滚动时添加导航栏背景
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // 移动端菜单切换
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // 点击导航链接后关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== 滚动效果 =====
function initScrollEffects() {
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 更新活动导航链接
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => sectionObserver.observe(section));
    
    // 淡入动画
    const fadeElements = document.querySelectorAll('.work-card, .about-content, .section-header');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });
}

// ===== 渲染作品卡片 =====
function renderWorks() {
    worksGrid.innerHTML = worksData.map((work, index) => `
        <article class="work-card" data-bvid="${work.bvid}" data-index="${index}">
            <div class="work-thumbnail">
                <div class="video-preview">
                    <div class="play-button">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                    <span class="play-text">点击播放视频</span>
                </div>
            </div>
            <div class="work-info">
                <h3 class="work-title">${work.title}</h3>
            </div>
        </article>
    `).join('');
}

// ===== 懒加载 =====
// ===== 视频模态框 =====
function initVideoModal() {
    // 打开模态框
    worksGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.work-card');
        if (card) {
            const bvid = card.getAttribute('data-bvid');
            openVideoModal(bvid);
        }
    });
    
    // 关闭模态框
    modalClose.addEventListener('click', closeVideoModal);
    modalBackdrop.addEventListener('click', closeVideoModal);
    
    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
}

function openVideoModal(bvid) {
    // 嵌入B站视频
    const embedUrl = `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0&autoplay=1`;
    
    videoContainer.innerHTML = `
        <iframe 
            src="${embedUrl}" 
            scrolling="no" 
            border="0" 
            frameborder="no" 
            framespacing="0" 
            allowfullscreen="true"
            sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
        ></iframe>
    `;
    
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    videoModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // 延迟清空iframe以停止视频播放
    setTimeout(() => {
        videoContainer.innerHTML = '';
    }, 300);
}



// ===== 错误处理 =====
window.addEventListener('error', (e) => {
    console.warn('资源加载错误:', e.message);
});

// 图片加载失败处理
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 375"%3E%3Crect fill="%231A1A1A" width="600" height="375"/%3E%3Ctext fill="%2371717A" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="14"%3E图片加载失败%3C/text%3E%3C/svg%3E';
    }
}, true);
