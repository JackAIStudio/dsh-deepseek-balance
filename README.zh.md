# dsh-deepseek-balance

DeepSeek Harness Web 上的克制余额芯片：在输入框右侧、模型选择左边显示官方账户剩余额度，点击即可刷新。密钥只在 Host 使用，不进浏览器。

## 做什么

- 打开会话后查询一次 `GET https://api.deepseek.com/user/balance`
- 优先显示 CNY，没有 CNY 再显示 USD
- 悬停可看充值 / 赠送拆分和更新时间
- **不**自动轮询、**不**弹窗、**不**低余额变色、**不**吉祥物

## 安装

源码在 `~/Documents/dshspace/plugins/dsh-deepseek-balance`。

```bash
# 开发机
dsh plugin --profile web add link:$HOME/Documents/dshspace/plugins/dsh-deepseek-balance

# 新电脑
dsh plugin --profile web add github:JackAIStudio/dsh-deepseek-balance
```

然后重启一次 `dsh web`。密钥沿用设置 → 模型里已保存的 `DEEPSEEK_API_KEY`。
