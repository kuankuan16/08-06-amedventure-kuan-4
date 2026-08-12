# AMED Ventures — Version C Design Direction

## 核心定位

Version C 的視覺語言是「人文機構感 × 前瞻醫療科技」。人文感來自自然光人物影像、可閱讀的襯線大標與有節制的暖度；機構感來自穩定的內容邊界、規則線、資訊索引與一致字階；科技感則由 AMED 淺藍、玻璃材質的醫療影像，以及精準但不躁動的互動負責。

## 1. 轉場機制方案

### 頁內捲動
- 首頁維持自然縱向流動，不使用強制 scroll snap。
- 標題以遮罩內上升、模糊消散與短 stagger 形成連續節奏。
- 線條與虛線從左／上方生長，作為段落進場的視覺接力。
- 卡片 hover 只使用單一主動作：展開、wipe 或小幅位移，避免同時縮放與旋轉。

### 頁面間過渡
- Header 固定保留，作為首頁、Companies、Team、Contact 之間不變的視覺錨點。
- 進入獨立頁面時，內容由下方淡入，標題沿用首頁相同的遮罩揭示，讓路由切換感覺像同一段故事延續。
- 返回首頁時保留 hash 定位與 smooth scroll，直接回到對應敘事節點。
- 本階段不引入全頁 WebGL 畫布；其效益低於影像、字體與資訊架構，且會增加行動裝置負擔。若未來加入，僅建議用於低對比的背景光場，不承載關鍵內容。

### 動態節奏
- 主要 reveal：800–1100ms，`cubic-bezier(.16,1,.3,1)` 或 `cubic-bezier(.22,1,.36,1)`。
- Hover：300–600ms。
- 自動影像輪播：6.5 秒，交叉淡化而非硬切。
- 全部動態遵守 `prefers-reduced-motion`。

## 2. 視覺概念板（Moodboard）

### 色彩
- **Institutional ink** `#1B1916`：大標、正文與索引，建立可信度。
- **AMED cyan** `#00A8D0`：連結、線條、箭頭與關鍵互動。
- **Light cyan** `#7FD6EA`：柔和回饋、進度與科技細節。
- **Cool grey** `#D8DBDA`：About 背景，降低紫色的視覺重量。
- **Clinical grey** `#F1F3F3`：Investment Focus 背景，承接高明度醫療影像。
- **Deep navy** `#03111F`：Pitch Us，形成結尾的機構權威感。
- **White** `#FFFFFF`：Header、Footer、Story hover wipe，提供呼吸與清晰層級。

### 光影與材質
- Hero：明亮自然窗光、人物互動、低飽和膚色與實際工作情境。
- Investment Focus：冷灰攝影棚、玻璃醫療物件、少量植物綠，傳達精密科技與生命性。
- Team：統一背景、自然膚色、下巴線與頭部尺度一致，避免 AI 合成感。
- 深色段落不使用漸層；科技感由淺藍線條、文字動態與 hover 填色建立。

### 排版與空間
- 所有英文大標使用同一襯線家族與舒適的 `1.04` 行高、約 `-.012em` 字距。
- 主要內容統一在 `78rem` 邊界，桌機採 12 欄邏輯。
- 內文使用無襯線，行高約 `1.6`；標題與內文間距依同一 spacing scale。
- 按鈕採薄長比例：較小的上下空間、充足左右留白、固定文字與箭頭間距。

## 3. 故事流向圖（User Journey）

```text
首頁 Hero
  ├─ 建立第一印象：人、資本與醫療使命
  ├─ CTA → Companies
  └─ 兩個概念 → US · Asia / Early–Growth
          ↓
About
  ├─ 說明長期合作與創辦人關係
  └─ 四個原則建立投資人格
          ↓
Investment Focus
  ├─ 四個互動醫療領域卡片
  ├─ 展示投資專業與臨床方向
  └─ CTA／Header → Companies
          ↓
Story
  ├─ 用真實里程碑驗證投資成果
  └─ 外連公司新聞，建立可信度
          ↓
Pitch Us
  ├─ 給創辦人清楚的下一步
  └─ CTA → Contact
```

### 獨立頁面的角色

```text
Companies → 驗證投資組合、領域與階段 → 開啟公司詳情
Team      → 認識決策者與專業背景     → 開啟人物介紹
Contact   → 提交公司資訊與募資脈絡   → 完成轉換
```

### 導覽原則
- Hero 的主要 CTA 導向 Companies，對應多數訪客的第一個驗證需求。
- Header 中 Companies 與 Team 保持常駐，任何段落都能直接進入。
- Story 提供證據後緊接 Pitch Us，讓「可信度 → 行動」不被其他內容打斷。
- Footer 再次提供 Companies、Team、Contact 與臺北優先的辦公室資訊，收束整段旅程。
