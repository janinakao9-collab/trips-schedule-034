# Spec Delta

## Purpose

讓旅客了解每項重要旅遊資訊的來源與時間適用性，區分可確認、仍待確認及無法確認的內容，並在查看推薦或選擇替代行程時持續看見相關限制。

## ADDED Requirements

### Requirement: Traceable information cards
系統 SHALL 對影響決策的重要事實顯示資訊內容、來源名稱及可用連結、來源更新時間、適用日期時段、可信度狀態及原因。來源更新時間與系統取得時間 MUST 分開呈現；缺少資料 MUST 明示未知。

#### Scenario: Missing source timestamp
- **WHEN** 來源沒有更新時間
- **THEN** 卡片顯示「更新時間不明」，不得以系統取得時間代替來源更新時間，且不標為已確認

#### Scenario: Inspect recommendation evidence
- **WHEN** 使用者查看推薦方案所依據的重要事實
- **THEN** 能查看其來源、時間、狀態及判定原因；無來源連結時明示未提供

### Requirement: Three confidence states
系統 MUST 使用「已確認／仍需確認／無法確認」三段狀態，並以文字與原因區分；不得只使用顏色、以 AI 生成結果作為證據，或僅因來源官方就標記已確認。

#### Scenario: Official static hours
- **WHEN** 景點或店家只有官方固定營業時間，沒有適用今日的營業異動或狀態資料
- **THEN** 系統標記「仍需確認」並說明固定時間不能證明今日實際狀態

#### Scenario: Non-official information
- **WHEN** 只有非官方資訊且內容仍可供參考、時間資訊可辨識、沒有無法解決的矛盾
- **THEN** 系統標記「仍需確認」，不呈現為已確認

### Requirement: Time-valid first-party evidence
系統 SHALL 僅在來源更新時間可辨識且證據涵蓋目的地當地日期時段時標示已確認：交通需官方目前運行狀態，或有效時段涵蓋該時刻的官方事件公告；景點／店家需官方今日營業、休館或異動資訊。

#### Scenario: Current transport disruption
- **WHEN** 官方目前狀態顯示交通延誤且明確適用查詢當下
- **THEN** 系統將「該服務延誤」標為已確認，而非把正常運行或推薦替代路線一併標為已確認

#### Scenario: Scheduled event outside current interval
- **WHEN** 官方停駛公告有明確更新時間，但事件有效區間未涵蓋查詢當地時間
- **THEN** 系統不以該公告確認目前停駛；若只剩固定時刻表則標記仍需確認

#### Scenario: Today-specific closure
- **WHEN** 官方今日休館資訊有可辨識更新時間且涵蓋查詢日期時段
- **THEN** 系統將今日休館事實標為已確認，推薦方案仍依自身證據各別判定

### Requirement: Conflicting or insufficient evidence
系統 MUST 優先採用時間有效的官方即時／事件資訊，而非官方固定資料；若仍有無法解決的矛盾、來源更新時間不明或資料不足以判讀，SHALL 標為「無法確認」，並顯示具體差異或缺漏。

#### Scenario: Event notice overrides regular hours
- **WHEN** 固定營業時間顯示開放，但官方今日臨時休館公告具可辨識更新時間且涵蓋查詢時段
- **THEN** 系統依今日公告確認休館，同時呈現固定資料差異與採用原因

#### Scenario: Conflicting current announcements
- **WHEN** 兩個適用同時段的官方事件來源互相衝突且無法釐清
- **THEN** 系統標記無法確認並呈現衝突，不任選一筆標為已確認

#### Scenario: No usable evidence
- **WHEN** 找不到足夠資訊或更新時間無法辨識
- **THEN** 系統標記無法確認，顯示缺漏與可查證下一步

### Requirement: Uncertainty follows recommendations
系統 MUST 在推薦卡片與選擇摘要中保留影響該方案的重要未知條件，不得把多項事實合併為全面已確認的推薦保證。無法確認狀態 SHALL 不阻止顯示或選擇已有候選的推薦方案。

#### Scenario: Mixed evidence in a recommended itinerary
- **WHEN** 替代路線的運行已確認，但目的地今日營業無法確認
- **THEN** 推薦及選擇摘要分別顯示兩項狀態，使用者仍可選擇方案，但不能看到「整段行程已確認」的宣稱
