# dsh-deepseek-balance

DeepSeek Harness Web 上的克制余额显示：在输入卡片下方（和会话 stats 同一条带）显示官方账户剩余额度，并在设置侧边栏提供「DeepSeek 余额」页。密钥只在 Host 使用，不进浏览器。

## 做什么

- 打开会话后查询一次 `GET https://api.deepseek.com/user/balance`
- 优先显示 CNY，没有 CNY 再显示 USD；低于 ¥5 / $1 时金额用警告色
- 输入卡片下方与会话 stats 同一行显示 DeepSeek 鲸标 + 金额（可改成仅金额，或完全隐藏）
- 点击芯片刷新；悬停可看充值 / 赠送拆分和更新时间
- 默认跟随对话刷新（一轮结束后再查），切回窗口会去抖补一次；可选每 5 分钟
- 设置 → DeepSeek 余额：看拆分、改位置 / 刷新 / 图标
- **不**弹窗、**不**漂浮挂件、**不**吉祥物 PNG

## 安装

源码在 `~/Documents/dshspace/plugins/dsh-deepseek-balance`。

```bash
# 开发机
dsh plugin --profile web add link:$HOME/Documents/dshspace/plugins/dsh-deepseek-balance

# 新电脑
dsh plugin --profile web add github:JackAIStudio/dsh-deepseek-balance
```

然后重启一次 `dsh web`。密钥沿用设置 → 模型里已保存的 `DEEPSEEK_API_KEY`。偏好写在 `$DSH_HOME/dsh-deepseek-balance.json`。
