# Spec Delta

## Purpose

以可重現的旅行異常情境支援 Prototype 測試，記錄使用者的決策、可信度理解及二次查證行為，讓研究者據以評估核心假設並避免將模擬展示誤當成成效證據。

## ADDED Requirements

### Requirement: Reproducible labeled scenarios
Prototype SHALL 提供景點臨時休館、交通延誤及餐廳無法前往三類情境，涵蓋三種可信度狀態、資料衝突及時間不明；SHALL 明示資料與推薦為模擬，允許重設情境並從兩種入口進行測試。

#### Scenario: Start a simulated task
- **WHEN** 測試者啟動其中一個情境
- **THEN** 系統使用可重現的時間、行程及資料，清楚標示模擬而非真實即時查證

#### Scenario: Reset the scenario
- **WHEN** 測試者重設情境
- **THEN** 系統清除本次輸入與選擇，下一次任務使用獨立記錄，不混入前次結果

### Requirement: Observable task record
系統 SHALL 提供每次任務的匿名工作階段與情境識別、入口、開始／結束時間、呈現的可信度、選擇結果及來源連結開啟記錄；SHALL 允許測試者補記是否完成可執行決策、可信度理解、錯誤採信、額外查證與卡點。無觀察資料 SHALL 標為未評估。

#### Scenario: Select without proving completion
- **WHEN** 使用者點選方案但測試者尚未判定是否形成可執行決策
- **THEN** 記錄方案選擇，決策完成與錯誤採信仍為未評估，不自動視為成功或失誤

#### Scenario: Record outside-tool verification
- **WHEN** 測試者觀察到使用者另外開啟 Maps 或搜尋查證
- **THEN** 可在該任務補記額外查證與原因；未觀察時不推定沒有查證

### Requirement: Reviewable validation results
系統 SHALL 提供可查看及匯出的任務記錄，區分完整、放棄與未評估結果。研究說明 MUST 定義決策完成率、錯誤採信率的分子分母與工作階段期間，並保留主要指標暫定狀態，不建立無依據的量化達標門檻。

#### Scenario: Review a task set
- **WHEN** 測試者查看或匯出工作階段記錄
- **THEN** 能辨識全部啟動任務、可執行決策完成任務、呈現不確定資訊任務、錯誤採信與未評估任務，並看到耗時及二次查證觀察

#### Scenario: Insufficient observations
- **WHEN** 任務尚有未評估結果或分母為零
- **THEN** 結果明示資料不完整或不適用，不將缺漏結果算成零錯誤或宣稱驗證通過

### Requirement: Qualitative continuation decision
研究說明 SHALL 提供 GO、REVISE 與 STOP / REFRAME 判讀規則，由研究者依實際觀察作決定；MUST NOT 以完成 Prototype 或點擊方案自動宣稱核心假設成立。

#### Scenario: Decide next research step
- **WHEN** 研究者檢視真實測試記錄
- **THEN** 能依「完成應變且理解可信度」「反覆卡點或誤解」「流程可理解但仍無價值」分別考慮 GO、REVISE、STOP / REFRAME，且未執行測試時標記尚未驗證
