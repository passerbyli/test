<template>
    <div id="app">
        <!-- 手动触发查看历史公告 -->
        <button @click="openPopupManually">查看历史公告</button>

        <!-- 弹窗内容 -->
        <div v-if="showPopup" class="popup">
            <h3>{{ currentAnnouncement.title }}</h3>
            <p>{{ currentAnnouncement.content }}</p>
            <label>
                <input type="checkbox" v-model="noShowForSevenDays" @change="toggleSevenDaysNoPopup" />
                7 天内不再弹窗
            </label>
            <div>
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
            currentAnnouncement: {}, // 当前弹出的公告
            showPopup: false, // 控制弹窗显示状态
            noShowForSevenDays: false, // 7 天内不再弹窗的复选框状态
            manualOpen: false, // 是否手动打开弹窗
        };
    },
    methods: {
        // 模拟 API 获取公告数据
        async fetchAnnouncements() {
            const data = await this.mockApiRequest();
            this.announcements = data.filter((item) => this.isValidAnnouncement(item));
            this.checkAndShowPopup();
        },

        // 模拟 API 返回
        mockApiRequest() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve([
                        {
                            title: "公告 1",
                            content: "这是今天的公告内容。",
                            startTime: "2024-12-10T00:00:00",
                            endTime: "2024-12-20T23:59:59",
                        },
                    ]);
                }, 1000);
            });
        },

        // 判断公告是否有效
        isValidAnnouncement(announcement) {
            const now = new Date().getTime();
            const startTime = new Date(announcement.startTime).getTime();
            const endTime = new Date(announcement.endTime).getTime();
            return now >= startTime && now <= endTime;
        },

        // 检查是否需要显示弹窗
        checkAndShowPopup() {
            if (!this.announcements.length) return;

            const closedUntil = localStorage.getItem("popupClosedUntil");
            const now = new Date().getTime();
            const lastPopupDate = localStorage.getItem("lastPopupDate");

            if (closedUntil && now < closedUntil) {
                console.log("跳过弹窗：7 天内不再弹窗");
                return;
            }

            if (lastPopupDate && this.isToday(new Date(Number(lastPopupDate)))) {
                console.log("跳过弹窗：今天已经弹过");
                return;
            }

            this.showPopupForAnnouncement(this.announcements[0]);
        },

        // 显示弹窗
        showPopupForAnnouncement(announcement) {
            this.currentAnnouncement = announcement;
            this.noShowForSevenDays = !!localStorage.getItem("popupClosedUntil");
            this.manualOpen = false; // 表示自动弹窗
            this.showPopup = true;
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

        // 关闭弹窗
        closePopup() {
            this.showPopup = false;

            const now = new Date().getTime();
            if (this.noShowForSevenDays && !this.manualOpen) {
                // 设置 7 天不弹窗
                localStorage.setItem("popupClosedUntil", now + 7 * 24 * 60 * 60 * 1000);
            } else if (!this.manualOpen) {
                // 记录今天弹窗的时间
                localStorage.setItem("lastPopupDate", now);
            }
        },

        // 切换复选框状态
        toggleSevenDaysNoPopup() {
            if (!this.noShowForSevenDays) {
                // 取消勾选时，清除 7 天内不再弹窗的限制
                localStorage.removeItem("popupClosedUntil");
            }
        },

        // 检查是否为同一天
        isToday(date) {
            const today = new Date();
            return (
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate()
            );
        },
    },
    mounted() {
        // 页面加载时获取公告数据并检查弹窗
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
    background: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
}

button {
    margin-top: 10px;
}
</style>