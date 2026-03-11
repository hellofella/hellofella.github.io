/**
 * 数据管理模块
 * 处理本地数据和状态管理
 */

/**
 * 照片数据管理类
 */
class PhotoData {

    /**
     * 获取所有照片
     */
    static getAllPhotos() {
        const stored = localStorage.getItem('photos');
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * 保存照片数据
     */
    static savePhotos(photos) {
        localStorage.setItem('photos', JSON.stringify(photos));
    }

    /**
     * 添加新照片
     */
    static addPhoto(photo) {
        const photos = this.getAllPhotos();
        photos.unshift(photo);
        this.savePhotos(photos);
        return photo;
    }

    /**
     * 更新照片
     */
    static updatePhoto(photoId, updateData) {
        const photos = this.getAllPhotos();
        const index = photos.findIndex(p => p.id === photoId);

        if (index !== -1) {
            photos[index] = { ...photos[index], ...updateData };
            this.savePhotos(photos);
            return photos[index];
        }

        return null;
    }

    /**
     * 删除照片
     */
    static deletePhoto(photoId) {
        let photos = this.getAllPhotos();
        photos = photos.filter(p => p.id !== photoId);
        this.savePhotos(photos);
    }

    /**
     * 获取点赞数
     */
    static getLikes(photoId) {
        const photos = this.getAllPhotos();
        const photo = photos.find(p => p.id === photoId);
        return photo ? (photo.likes || 0) : 0;
    }

    /**
     * 切换点赞状态
     */
    static toggleLike(photoId) {
        const photos = this.getAllPhotos();
        const index = photos.findIndex(p => p.id === photoId);

        if (index !== -1) {
            // 检查是否已点赞
            const likedPhotos = JSON.parse(localStorage.getItem('likedPhotos') || '[]');
            const isLiked = likedPhotos.includes(photoId);

            if (isLiked) {
                // 取消点赞
                photos[index].likes = Math.max(0, (photos[index].likes || 0) - 1);
                const likedIndex = likedPhotos.indexOf(photoId);
                likedPhotos.splice(likedIndex, 1);
            } else {
                // 添加点赞
                photos[index].likes = (photos[index].likes || 0) + 1;
                likedPhotos.push(photoId);
            }

            localStorage.setItem('photos', JSON.stringify(photos));
            localStorage.setItem('likedPhotos', JSON.stringify(likedPhotos));

            return photos[index].likes;
        }

        return 0;
    }

    /**
     * 检查是否已点赞
     */
    static isLiked(photoId) {
        const likedPhotos = JSON.parse(localStorage.getItem('likedPhotos') || '[]');
        return likedPhotos.includes(photoId);
    }

    /**
     * 按分类筛选照片
     */
    static filterByCategory(category) {
        const photos = this.getAllPhotos();

        if (!category || category === 'all') {
            return photos;
        }

        return photos.filter(photo => photo.category === category);
    }

    /**
     * 搜索照片
     */
    static searchPhotos(query) {
        const photos = this.getAllPhotos();
        const lowerQuery = query.toLowerCase();

        return photos.filter(photo =>
            photo.title.toLowerCase().includes(lowerQuery) ||
            photo.description.toLowerCase().includes(lowerQuery) ||
            photo.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }

    /**
     * 导出数据为 JSON
     */
    static exportData() {
        const photos = this.getAllPhotos();
        const likedPhotos = JSON.parse(localStorage.getItem('likedPhotos') || '[]');

        return JSON.stringify({
            photos: photos,
            likedPhotos: likedPhotos,
            exportedAt: new Date().toISOString()
        }, null, 2);
    }

    /**
     * 导入数据
     */
    static importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            if (data.photos) {
                localStorage.setItem('photos', JSON.stringify(data.photos));
            }

            if (data.likedPhotos) {
                localStorage.setItem('likedPhotos', JSON.stringify(data.likedPhotos));
            }

            return true;
        } catch (error) {
            console.error('导入数据失败:', error);
            return false;
        }
    }

    /**
     * 清空所有数据
     */
    static clearAll() {
        localStorage.removeItem('photos');
        localStorage.removeItem('likedPhotos');
    }

    /**
     * 获取统计信息
     */
    static getStatistics() {
        const photos = this.getAllPhotos();
        const likedPhotos = JSON.parse(localStorage.getItem('likedPhotos') || '[]');

        const categoryCount = {};
        photos.forEach(photo => {
            categoryCount[photo.category] = (categoryCount[photo.category] || 0) + 1;
        });

        return {
            totalPhotos: photos.length,
            totalLikes: photos.reduce((sum, p) => sum + (p.likes || 0), 0),
            likedByUser: likedPhotos.length,
            categoryCount: categoryCount
        };
    }
}

/**
 * 分类映射
 */
const CATEGORY_MAP = {
    'landscape': '风景',
    'portrait': '人像',
    'street': '街拍',
    'architecture': '建筑',
    'macro': '微距',
    'other': '其他'
};

/**
 * 获取分类中文名称
 */
function getCategoryName(category) {
    return CATEGORY_MAP[category] || category;
}
