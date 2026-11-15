# Spec Delta

## Purpose

讓自行規劃海外自由行的旅客在遇到交通、景點或店家異常時，從問題回報或既有行程帶入脈絡，比較推薦地點與替代安排，並明確選擇下一步決策。

## ADDED Requirements

### Requirement: Two contingency entry points
系統 SHALL 提供主動回報問題及既有行程「需要調整」兩種入口，並允許查看及編輯問題描述、位置、目的地當地日期時間及原安排。

#### Scenario: Report an issue
- **WHEN** 使用者輸入問題並進入應變流程
- **THEN** 系統讓使用者補入位置、當地日期時間及相關原安排後查看結果

#### Scenario: Adjust an existing itinerary item
- **WHEN** 使用者在既有行程項目選擇「需要調整」
- **THEN** 系統帶入該項目的位置、時間與原安排，並允許補充問題及修正脈絡

### Requirement: Context completeness
系統 MUST 在缺少問題、位置或當地日期時間時指出缺漏並保留已填內容；無關聯原行程時 SHALL 允許明確選擇「沒有原安排」。Prototype SHALL 支援交通、景點及店家異常。

#### Scenario: Missing required context
- **WHEN** 使用者在必要脈絡不完整時要求產生選項
- **THEN** 系統指出缺少欄位，不顯示假定脈絡為使用者已提供的結果

#### Scenario: No original itinerary
- **WHEN** 使用者完成必要欄位並選擇「沒有原安排」
- **THEN** 系統允許繼續，並以使用者目前脈絡比較方案

### Requirement: Comparable strategy recommendations
系統 SHALL 以「最省時間／最少改動／其他推薦」呈現推薦地點或替代行程。每個可選方案 MUST 顯示具體下一步、推薦理由、預估耗時或未知狀態、對原安排的影響，以及相關可信度與待確認事項；無足夠內容的分類 SHALL 顯示原因。

#### Scenario: Compare alternatives
- **WHEN** 系統已有足夠脈絡與可用情境內容
- **THEN** 使用者能查看三類策略並比較具體方案，預估值標示為估計，不顯示為已查證事實

#### Scenario: Unavailable strategy
- **WHEN** 某策略缺少可提供的地點或安排
- **THEN** 該分類顯示缺乏內容的原因與可補充的資訊，不捏造方案

### Requirement: Recommendations remain available with unknown information
系統 SHALL 在關鍵資訊「無法確認」時仍提供已有候選的推薦地點或替代行程供選擇，並在方案旁顯示該狀態、未知條件及可查證來源；MUST NOT 以推薦本身暗示該地點營業或路線運行已確認。

#### Scenario: Select an alternative with unknown opening status
- **WHEN** 原景點狀態無法確認且存在替代候選地點
- **THEN** 系統仍顯示可選替代方案，逐項保留營業或交通的未知提示與查證下一步

### Requirement: Explicit next-step selection
系統 SHALL 允許使用者選擇一個方案並顯示選擇摘要及待確認事項；SHALL 允許返回比較或修改脈絡，且不自動覆寫原行程。

#### Scenario: Confirm a choice
- **WHEN** 使用者選定方案
- **THEN** 系統顯示所選下一步、相關不確定事項及返回比較入口

#### Scenario: Change context after selection
- **WHEN** 使用者修改位置、時間或問題
- **THEN** 舊選擇不再作為新結果的已選方案，系統依新脈絡更新結果並允許重新選擇
