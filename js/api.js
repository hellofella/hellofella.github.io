/**
 * API 接口封装
 * 预留图片上传接口，可对接真实后端服务
 */

// API 配置
const API_CONFIG = {
    // 后端 API 基础地址（部署到真实后端时修改此处）
    baseUrl: '',

    // API 端点
    endpoints: {
        upload: '/api/photos/upload',
        getPhotos: '/api/photos',
        getPhotoById: '/api/photos/:id',
        updatePhoto: '/api/photos/:id',
        deletePhoto: '/api/photos/:id',
        likePhoto: '/api/photos/:id/like'
    },

    // 是否使用本地模式（true: 使用 localStorage，false: 调用真实 API）
    useLocalStorage: true
};

/**
 * 照片 API 类
 */
class PhotoAPI {

    /**
     * 上传照片
     * @param {Object} photoData - 照片数据
     * @returns {Promise<Object>} 上传结果
     */
    static async uploadPhoto(photoData) {
        if (API_CONFIG.useLocalStorage) {
            return this.uploadPhotoLocal(photoData);
        }

        // 真实 API 调用示例
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.upload}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // 如需认证
                },
                body: JSON.stringify(photoData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API upload error:', error);
            throw error;
        }
    }

    /**
     * 本地上传（使用 localStorage）
     */
    static async uploadPhotoLocal(photoData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const photos = JSON.parse(localStorage.getItem('photos') || '[]');

                const newPhoto = {
                    id: `photo_${Date.now()}`,
                    title: photoData.title,
                    description: photoData.description || '',
                    category: photoData.category,
                    tags: photoData.tags || [],
                    imageUrl: photoData.image, // base64 图片
                    cameraInfo: photoData.cameraInfo || {},
                    dateTaken: photoData.dateTaken || '',
                    createdAt: new Date().toISOString(),
                    likes: 0
                };

                photos.unshift(newPhoto);
                localStorage.setItem('photos', JSON.stringify(photos));

                resolve({
                    success: true,
                    photoId: newPhoto.id,
                    photo: newPhoto,
                    message: '上传成功'
                });
            }, 500);
        });
    }

    /**
     * 获取照片列表
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} 照片列表
     */
    static async getPhotos(params = {}) {
        if (API_CONFIG.useLocalStorage) {
            return this.getPhotosLocal(params);
        }

        // 真实 API 调用
        try {
            const queryParams = new URLSearchParams(params).toString();
            const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getPhotos}?${queryParams}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API getPhotos error:', error);
            throw error;
        }
    }

    /**
     * 本地获取照片列表
     */
    static async getPhotosLocal(params = {}) {
        return new Promise((resolve) => {
            const photos = JSON.parse(localStorage.getItem('photos') || '[]');

            // 按分类筛选
            let filteredPhotos = photos;
            if (params.category && params.category !== 'all') {
                filteredPhotos = photos.filter(p => p.category === params.category);
            }

            // 分页
            const page = params.page || 1;
            const limit = params.limit || 20;
            const start = (page - 1) * limit;
            const end = start + limit;
            const paginatedPhotos = filteredPhotos.slice(start, end);

            resolve({
                photos: paginatedPhotos,
                total: filteredPhotos.length,
                page: page,
                totalPages: Math.ceil(filteredPhotos.length / limit)
            });
        });
    }

    /**
     * 根据 ID 获取照片详情
     * @param {string} photoId - 照片 ID
     * @returns {Promise<Object>} 照片详情
     */
    static async getPhotoById(photoId) {
        if (API_CONFIG.useLocalStorage) {
            return this.getPhotoByIdLocal(photoId);
        }

        try {
            const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getPhotoById.replace(':id', photoId)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API getPhotoById error:', error);
            throw error;
        }
    }

    /**
     * 本地获取照片详情
     */
    static async getPhotoByIdLocal(photoId) {
        return new Promise((resolve) => {
            const photos = JSON.parse(localStorage.getItem('photos') || '[]');
            const photo = photos.find(p => p.id === photoId);
            resolve(photo || null);
        });
    }

    /**
     * 点赞照片
     * @param {string} photoId - 照片 ID
     * @returns {Promise<Object>} 点赞结果
     */
    static async likePhoto(photoId) {
        if (API_CONFIG.useLocalStorage) {
            return this.likePhotoLocal(photoId);
        }

        try {
            const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.likePhoto.replace(':id', photoId)}`;
            const response = await fetch(url, { method: 'POST' });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API likePhoto error:', error);
            throw error;
        }
    }

    /**
     * 本地点赞
     */
    static async likePhotoLocal(photoId) {
        return new Promise((resolve) => {
            const photos = JSON.parse(localStorage.getItem('photos') || '[]');
            const photoIndex = photos.findIndex(p => p.id === photoId);

            if (photoIndex !== -1) {
                photos[photoIndex].likes = (photos[photoIndex].likes || 0) + 1;
                localStorage.setItem('photos', JSON.stringify(photos));

                resolve({
                    success: true,
                    likes: photos[photoIndex].likes
                });
            } else {
                resolve({
                    success: false,
                    message: '照片不存在'
                });
            }
        });
    }

    /**
     * 删除照片
     * @param {string} photoId - 照片 ID
     * @returns {Promise<Object>} 删除结果
     */
    static async deletePhoto(photoId) {
        if (API_CONFIG.useLocalStorage) {
            return this.deletePhotoLocal(photoId);
        }

        try {
            const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.deletePhoto.replace(':id', photoId)}`;
            const response = await fetch(url, { method: 'DELETE' });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API deletePhoto error:', error);
            throw error;
        }
    }

    /**
     * 本地删除照片
     */
    static async deletePhotoLocal(photoId) {
        return new Promise((resolve) => {
            let photos = JSON.parse(localStorage.getItem('photos') || '[]');
            photos = photos.filter(p => p.id !== photoId);
            localStorage.setItem('photos', JSON.stringify(photos));

            resolve({
                success: true,
                message: '删除成功'
            });
        });
    }

    /**
     * 更新照片信息
     * @param {string} photoId - 照片 ID
     * @param {Object} updateData - 更新数据
     * @returns {Promise<Object>} 更新结果
     */
    static async updatePhoto(photoId, updateData) {
        if (API_CONFIG.useLocalStorage) {
            return this.updatePhotoLocal(photoId, updateData);
        }

        try {
            const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.updatePhoto.replace(':id', photoId)}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API updatePhoto error:', error);
            throw error;
        }
    }

    /**
     * 本地更新照片
     */
    static async updatePhotoLocal(photoId, updateData) {
        return new Promise((resolve) => {
            const photos = JSON.parse(localStorage.getItem('photos') || '[]');
            const photoIndex = photos.findIndex(p => p.id === photoId);

            if (photoIndex !== -1) {
                photos[photoIndex] = { ...photos[photoIndex], ...updateData };
                localStorage.setItem('photos', JSON.stringify(photos));

                resolve({
                    success: true,
                    photo: photos[photoIndex]
                });
            } else {
                resolve({
                    success: false,
                    message: '照片不存在'
                });
            }
        });
    }
}

/**
 * 配置 API（用于切换本地/远程模式）
 * @param {Object} config - 配置对象
 */
function configureAPI(config) {
    Object.assign(API_CONFIG, config);
}
