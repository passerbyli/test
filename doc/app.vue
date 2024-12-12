<template>
    <div id="app">
        <button @click="fetchAnnouncements">刷新公告</button>
        <i class="history-icon" @click="openPopupManually">查看历史公告</i>

        <div v-if="showPopup" class="popup">
            <h3>{{ currentAnnouncement.title }}</h3>
            <p>{{ currentAnnouncement.content }}</p>
            <label>
                <input type="checkbox" v-model="noShowForSevenDays" @change="toggleSevenDaysNoPopup" />
                7 天内不再弹窗
            </label>
            <div class="popup-buttons">
                <button @click="closePopup">关闭</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            announcements: [], // 公告列表
            currentAnnouncement: {}, // 当前需要弹出的公告
            showPopup: false, // 弹窗显示状态
            noShowForSevenDays: false, // 是否选择7天内不再弹窗
            manualOpen: false, // 是否手动打开弹窗
        };
    },
    methods: {
        // 模拟 API 请求
        async fetchAnnouncements() {
            try {
                const data = await this.mockApiRequest();
                this.announcements = data.filter((item) => this.isValidAnnouncement(item));
                this.checkAndShowPopup();
            } catch (error) {
                console.error("获取公告失败：", error);
            }
        },

        // 模拟 API 方法
        mockApiRequest() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve([
                        {
                            title: "公告 1",
                            content: "这是一个每天弹一次的公告。",
                            dailyPopup: 1,
                            startTime: "2024-12-10T00:00:00",
                            endTime: "2024-12-15T23:59:59",
                        },
                        {
                            title: "公告 2",
                            content: "这是一个每次都弹的公告。",
                            dailyPopup: 0,
                            startTime: "2024-12-10T00:00:00",
                            endTime: "2024-12-16T23:59:59",
                        },
                    ]);
                }, 1000); // 模拟 1 秒的请求延迟
            });
        },

        // 判断公告是否有效
        isValidAnnouncement(announcement) {
            const now = new Date().getTime();
            const startTime = new Date(announcement.startTime).getTime();
            const endTime = new Date(announcement.endTime).getTime();
            return now >= startTime && now <= endTime;
        },

        // 检查并显示弹窗
        checkAndShowPopup() {
            if (!this.announcements.length) return;

            const closedUntil = localStorage.getItem("popupClosedUntil");//用于记录 7 天不再弹窗的截止时间。
            const now = new Date().getTime();
            const lastDailyPopupTime = localStorage.getItem("lastDailyPopupTime");//用于记录每日弹窗的最后弹窗时间。

            for (const announcement of this.announcements) {
                if (closedUntil && now < closedUntil) {
                    console.log("公告跳过：7 天内不再弹窗");
                    continue;
                }

                if (announcement.dailyPopup === 1) {
                    if (!lastDailyPopupTime || now - lastDailyPopupTime >= 24 * 60 * 60 * 1000) {
                        this.showPopupForAnnouncement(announcement);
                        return;
                    }
                } else {
                    this.showPopupForAnnouncement(announcement);
                    return;
                }
            }
        },

        // 显示指定公告的弹窗
        showPopupForAnnouncement(announcement) {
            this.currentAnnouncement = announcement;
            this.noShowForSevenDays = !!localStorage.getItem("popupClosedUntil");
            this.manualOpen = false; // 自动弹窗
            this.showPopup = true;
        },

        // 关闭弹窗
        closePopup() {
            this.showPopup = false;

            const now = new Date().getTime();
            if (this.noShowForSevenDays && !this.manualOpen) {
                localStorage.setItem("popupClosedUntil", now + 7 * 24 * 60 * 60 * 1000);
            } else if (!this.manualOpen && this.currentAnnouncement.dailyPopup === 1) {
                localStorage.setItem("lastDailyPopupTime", now);
            }
        },

        // 手动打开弹窗
        openPopupManually() {
            if (this.announcements.length) {
                this.currentAnnouncement = this.announcements[0];
                this.noShowForSevenDays = false; // 手动打开时复选框默认未勾选
                this.manualOpen = true;
                this.showPopup = true;
            }
        },

        // 切换复选框状态
        toggleSevenDaysNoPopup() {
            if (!this.noShowForSevenDays) {
                // 清除不再弹窗记录
                localStorage.removeItem("popupClosedUntil");
            }
        },
    },
    mounted() {
        // 页面加载时获取公告数据
        this.fetchAnnouncements();
    },
};
</script>

<style>
/* 弹窗样式 */
.popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    padding: 20px;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
}

.history-icon {
    font-size: 24px;
    cursor: pointer;
}
</style>