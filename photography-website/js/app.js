/**
 * 主应用程序
 * 处理页面交互和数据展示
 */

// 当前筛选的分类
let currentCategory = 'all';

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initFilters();
});

/**
 * 初始化画廊
 */
async function initGallery() {
    const gallery = document.getElementById('gallery');
    const loading = document.getElementById('loading');
    const noPhotos = document.getElementById('no-photos');

    // 显示加载状态
    loading.classList.remove('hidden');

    try {
        // 加载示例数据（如果没有本地数据）
        await loadSampleDataIfEmpty();

        // 获取照片数据
        const result = await PhotoAPI.getPhotos({ category: currentCategory });
        const photos = result.photos;

        // 隐藏加载状态
        loading.classList.add('hidden');

        if (photos.length === 0) {
            noPhotos.classList.remove('hidden');
            gallery.innerHTML = '';
            return;
        }

        noPhotos.classList.add('hidden');

        // 渲染照片
        renderGallery(photos);

    } catch (error) {
        console.error('加载照片失败:', error);
        loading.classList.add('hidden');
        noPhotos.classList.remove('hidden');
    }
}

/**
 * 渲染画廊
 */
function renderGallery(photos) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    photos.forEach((photo, index) => {
        const item = createGalleryItem(photo, index);
        gallery.appendChild(item);
    });

    // 初始化瀑布流布局
    initMasonry();

    // 初始化 Lightbox
    initLightbox();
}

/**
 * 创建画廊项
 */
function createGalleryItem(photo, index) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.style.animationDelay = `${index * 0.05}s`;

    div.innerHTML = `
        <a href="${photo.imageUrl}" data-lightbox="gallery" data-title="${photo.title}">
            <img src="${photo.imageUrl}" alt="${photo.title}" loading="lazy">
        </a>
        <div class="gallery-overlay">
            <div class="gallery-info">
                <h3>${photo.title}</h3>
                <p>${photo.description || ''}</p>
            </div>
            <div class="gallery-meta">
                <span class="gallery-category">${getCategoryName(photo.category)}</span>
                <div class="gallery-likes">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                    <span>${photo.likes || 0}</span>
                </div>
            </div>
        </div>
    `;

    // 点击查看详情
    div.addEventListener('click', (e) => {
        // 如果不是点击图片链接，则跳转到详情页
        if (!e.target.closest('a[data-lightbox]')) {
            window.location.href = `detail.html?id=${photo.id}`;
        }
    });

    return div;
}

/**
 * 初始化瀑布流布局
 */
function initMasonry() {
    const gallery = document.getElementById('gallery');

    imagesLoaded(gallery, () => {
        new Masonry(gallery, {
            itemSelector: '.gallery-item',
            columnWidth: '.gallery-item',
            percentPosition: true,
            transitionDuration: '0.3s'
        });
    });
}

/**
 * 初始化 Lightbox
 */
function initLightbox() {
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'albumLabel': '图片 %1 / %2',
            'fadeDuration': 300,
            'imageFadeDuration': 300
        });
    }
}

/**
 * 初始化筛选器
 */
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            // 更新按钮状态
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 更新当前分类
            currentCategory = btn.dataset.category;

            // 重新加载照片
            await initGallery();
        });
    });
}

/**
 * 加载示例数据（如果本地没有数据）
 */
async function loadSampleDataIfEmpty() {
    const photos = PhotoData.getAllPhotos();

    if (photos.length === 0) {
        // 加载示例照片数据
        const samplePhotos = await loadSamplePhotos();
        PhotoData.savePhotos(samplePhotos);
    }
}

/**
 * 加载示例照片数据
 */
async function loadSamplePhotos() {
    // 使用 Unsplash Source API 作为示例图片
    const sampleData = [
        {
            id: 'sample_1',
            title: '山间晨雾',
            description: '清晨的阳光穿透薄雾，照亮山谷。远处的山峰若隐若现，如同仙境一般。',
            category: 'landscape',
            tags: ['风景', '山脉', '日出'],
            imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            cameraInfo: {
                model: 'Canon EOS R5',
                lens: 'RF 24-70mm f/2.8L',
                aperture: 'f/8',
                shutter: '1/125s',
                iso: '100'
            },
            dateTaken: '2024-03-15',
            createdAt: '2024-03-15T06:30:00Z',
            likes: 42
        },
        {
            id: 'sample_2',
            title: '城市夜景',
            description: '城市的夜晚，霓虹闪烁。高楼林立间，车水马龙，展现都市的繁华与活力。',
            category: 'street',
            tags: ['城市', '夜景', '街道'],
            imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800',
            cameraInfo: {
                model: 'Sony A7IV',
                lens: 'FE 35mm f/1.4 GM',
                aperture: 'f/2.8',
                shutter: '1/60s',
                iso: '800'
            },
            dateTaken: '2024-02-28',
            createdAt: '2024-02-28T20:15:00Z',
            likes: 38
        },
        {
            id: 'sample_3',
            title: '古建筑',
            description: '古老建筑的精美细节，记录着岁月的痕迹和匠人的智慧。',
            category: 'architecture',
            tags: ['建筑', '古典', '细节'],
            imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
            cameraInfo: {
                model: 'Nikon Z8',
                lens: 'NIKKOR Z 14-24mm f/2.8 S',
                aperture: 'f/11',
                shutter: '1/250s',
                iso: '100'
            },
            dateTaken: '2024-01-20',
            createdAt: '2024-01-20T14:30:00Z',
            likes: 56
        },
        {
            id: 'sample_4',
            title: '人像摄影',
            description: '自然光下的人像，捕捉人物最真实的情感与神态。',
            category: 'portrait',
            tags: ['人像', '自然光', '情感'],
            imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
            cameraInfo: {
                model: 'Canon EOS R5',
                lens: 'RF 85mm f/1.2L',
                aperture: 'f/1.4',
                shutter: '1/500s',
                iso: '200'
            },
            dateTaken: '2024-03-01',
            createdAt: '2024-03-01T16:00:00Z',
            likes: 67
        },
        {
            id: 'sample_5',
            title: '花朵微距',
            description: '微距镜头下的花朵世界，展现肉眼难以察觉的细腻之美。',
            category: 'macro',
            tags: ['微距', '花卉', '自然'],
            imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
            cameraInfo: {
                model: 'Sony A7R V',
                lens: 'FE 90mm f/2.8 Macro G OSS',
                aperture: 'f/8',
                shutter: '1/200s',
                iso: '400'
            },
            dateTaken: '2024-02-14',
            createdAt: '2024-02-14T11:20:00Z',
            likes: 45
        },
        {
            id: 'sample_6',
            title: '海边日落',
            description: '夕阳西下，海天一色。金色的阳光洒在平静的海面上，温暖而宁静。',
            category: 'landscape',
            tags: ['风景', '日落', '大海'],
            imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
            cameraInfo: {
                model: 'Nikon Z7 II',
                lens: 'NIKKOR Z 70-200mm f/2.8 VR S',
                aperture: 'f/8',
                shutter: '1/320s',
                iso: '100'
            },
            dateTaken: '2024-01-10',
            createdAt: '2024-01-10T18:45:00Z',
            likes: 89
        },
        {
            id: 'sample_7',
            title: '街头光影',
            description: '光影交错的城市街头，行人匆匆，留下斑驳的影子。',
            category: 'street',
            tags: ['街拍', '光影', '城市'],
            imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
            cameraInfo: {
                model: 'Fujifilm X-T5',
                lens: 'XF 23mm f/1.4 R LM WR',
                aperture: 'f/5.6',
                shutter: '1/1000s',
                iso: '200'
            },
            dateTaken: '2024-02-05',
            createdAt: '2024-02-05T15:30:00Z',
            likes: 34
        },
        {
            id: 'sample_8',
            title: '现代建筑',
            description: '现代建筑的几何美感，简洁有力的线条与光影的对话。',
            category: 'architecture',
            tags: ['建筑', '现代', '几何'],
            imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
            cameraInfo: {
                model: 'Sony A1',
                lens: 'FE 16-35mm f/2.8 GM',
                aperture: 'f/11',
                shutter: '1/500s',
                iso: '100'
            },
            dateTaken: '2024-03-10',
            createdAt: '2024-03-10T10:00:00Z',
            likes: 52
        }
    ];

    return sampleData;
}

/**
 * 刷新画廊（用于上传后刷新）
 */
function refreshGallery() {
    currentCategory = 'all';
    initGallery();

    // 重置筛选按钮
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === 'all') {
            btn.classList.add('active');
        }
    });
}
