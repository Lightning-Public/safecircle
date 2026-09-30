# SafeCircle Mobile PWA & Offline Emergency Spec v0.1

- 상태: Exploration / prototype implementation contract
- 상위 문서:
  - `product-thesis-v0.2.md`
  - `situational-context-graph-v0.1.md`
  - `prototype-interaction-spec-v0.1.md`
- 목적: SafeCircle 프로토타입을 모바일 우선·플랫폼 독립형으로 정의하고, 인터넷 단절 시에도 필요한 비상정보와 승인된 안전카드가 로컬에서 동작하도록 한다.

## 1. 기본 플랫폼 결정

SafeCircle 1차 프로토타입은 **모바일 우선 PWA**로 한다.

지원 우선순위:
1. iPhone Safari / 홈화면 설치
2. Android Chrome / PWA 설치
3. 데스크톱 Chrome/Safari/Edge

원칙:
- 앱스토어 설치가 없어도 링크/QR로 진입 가능
- 동일 코드베이스로 iOS/Android/PC 지원
- 핵심 기능은 작은 화면에서 먼저 설계
- 네이티브 전용 기능에 핵심 흐름을 의존하지 않음

## 2. 모바일 IA

하단 탭은 최대 4개로 제한한다.

1. **도움받기**
   - 이 말 어떻게 들릴까?
   - 받은 말 이해
   - 상황 중재

2. **정보**
   - 검증된 생활/노동/안전 정보
   - 공식기관 연결

3. **안전**
   - 내 사업장/그룹의 승인된 비상 행동카드
   - 오프라인 사용 가능 표시
   - 비상모드 진입

4. **내 정보**
   - 언어
   - 접근성
   - 오프라인 저장 상태
   - 개인정보/동의

## 3. 오프라인 설계 원칙

오프라인에서는 생성형 AI 중재를 핵심 기능으로 보장하지 않는다.

대신 반드시 동작해야 하는 것:
- 마지막으로 승인된 비상 행동카드
- 사업장/그룹의 집결지 정보
- 기본 행동요령
- 긴급 연락처
- 저장된 언어별 핵심 문구
- 최근 동기화 시각
- 오프라인 상태 표시
- 사용자 상태 회신의 로컬 큐 저장

온라인 복구 후:
- 로컬 큐를 서버로 재전송
- 중복 제거
- 원래 입력 시각 보존
- 서버 수신 시각과 구분
- 충돌 시 사용자/관리자에게 상태 표시

## 4. 오프라인 캐시 대상

### P0 필수 캐시

```
EmergencyBundle
├─ facility_id
├─ bundle_version
├─ approved_at
├─ expires_at
├─ language
├─ emergency_type
├─ action_cards[]
├─ assembly_point
├─ emergency_contacts[]
├─ official_sources[]
├─ pictograms[]
├─ audio_prompts[]
└─ checksum
```

### P1 캐시

- 자주 쓰는 공식 정보카드
- 언어별 쉬운 표현 사전
- 사용자 접근성 설정
- 최근 5~10개 비민감 도움말

### 캐시 금지/주의

- 민감한 개인 대화 전체
- 다른 사용자의 상태
- 관리자용 개인 식별 목록
- 장기 보관이 불필요한 위치정보

## 5. Emergency Bundle 계약

```json
{
  "facility_id": "factory_demo_01",
  "bundle_version": "2026-09-30T10:00:00Z",
  "approved_at": "2026-09-30T09:50:00Z",
  "expires_at": "2026-10-30T00:00:00Z",
  "language": "vi",
  "emergency_type": "fire",
  "action_cards": [
    {
      "step": 1,
      "text": "Máy dừng thì không chạm vào máy. Hãy sơ tán ngay.",
      "pictogram_id": "do_not_touch_machine"
    },
    {
      "step": 2,
      "text": "Đi theo lối thoát đã chỉ định.",
      "pictogram_id": "exit_route"
    }
  ],
  "assembly_point": {
    "name": "집결지 A",
    "description": "정문 맞은편 주차장"
  },
  "emergency_contacts": [
    {
      "label": "119",
      "phone": "119"
    },
    {
      "label": "현장 안전담당자",
      "phone": "local-config"
    }
  ],
  "official_sources": [],
  "checksum": "..."
}
```

## 6. 비상모드 UX

### 진입

안전 탭에서 항상 보이는 버튼:

> 비상 정보 보기

실제 비상상황에서는 상단 고정:

> **비상모드**

인터넷 연결 여부와 무관하게 진입 가능해야 한다.

### 화면 구성

1. 현재 재난 유형
2. 큰 행동카드
3. 집결지
4. 상태 버튼
5. 긴급 연락

상태 버튼은 최대 3개만 노출:
- 대피 중
- 도움 필요
- 집결 완료

상황에 따라 `이동 불가`를 도움 필요의 세부 사유로 받는다.

## 7. 오프라인 상태 회신

```json
{
  "event_id": "emg_evt_001",
  "user_local_id": "anonymous-device-token",
  "facility_id": "factory_demo_01",
  "status": "evacuating|need_help|assembled",
  "reason": "mobility|injury|blocked|unknown|null",
  "created_at_device": "2026-09-30T11:32:10+09:00",
  "queued_offline": true,
  "synced_at": null
}
```

원칙:
- 회신은 즉시 로컬 저장
- 사용자는 “저장됨 / 아직 전송되지 않음”을 분명히 볼 수 있어야 함
- 연결 복구 시 자동 동기화
- 재전송 실패 시 수동 재시도 가능

## 8. Service Worker 전략

프로토타입 기준:
- App Shell 캐시
- Emergency Bundle cache-first
- 공식 정보카드 stale-while-revalidate
- 일반 중재 API network-first
- 피드백/상태 회신 background sync 또는 재접속 sync

주의:
- iOS PWA 제약을 고려해 Background Sync API에만 의존하지 않는다.
- 앱 재실행/온라인 복귀 시 명시적 sync 루틴도 둔다.

## 9. 로컬 저장소

권장:
- IndexedDB: Emergency Bundle, offline queue, version metadata
- Cache Storage: app shell, icons, pictograms, audio
- localStorage: 최소 UI preference만

민감정보는 장기 저장하지 않는다.

## 10. 버전/신선도 UX

오프라인 정보는 오래될 수 있으므로 반드시 표시한다.

예:

> 마지막 안전정보 업데이트: 2026-09-30 10:00  
> 현재 인터넷 연결 없음  
> 저장된 승인 버전을 표시하고 있습니다.

만료된 경우:

> 이 안전정보는 검토기한이 지났습니다. 연결이 복구되면 최신 정보를 확인하세요.

단, 오프라인에서 아무 정보도 안 보여주는 것보다 마지막 승인본을 표시하되 **만료/오래됨 상태를 명확히 표시**한다.

## 11. 설치/진입 전략

### 일반 사용자
- QR
- 문자 링크
- 메신저 링크
- 홈화면 추가

### 사업장
- 출입구/휴게실/안전게시판 QR
- 공용 태블릿/PC
- 개인폰

회원가입은 초기 프로토타입 필수조건으로 두지 않는다.

## 12. 접근성

모바일 긴급상황을 고려해:
- 최소 터치영역 44px 이상
- 색상만으로 상태 구분 금지
- 아이콘+텍스트 병기
- 큰 글씨 모드
- 음성 재생
- 저문해 사용자용 짧은 문장
- 다크모드보다 긴급상황 대비 명도/대비 우선

## 13. 네트워크 상태 UX

항상 사용자에게 상태를 숨기지 않는다.

표시 상태:
- 온라인
- 오프라인
- 동기화 중
- 전송 대기
- 최신 정보 확인 필요

## 14. 프로토타입 파일구조 확장

```
prototype/
├─ public/
│  ├─ manifest.webmanifest
│  ├─ icons/
│  └─ emergency-assets/
├─ fixtures/
│  ├─ mediation-cases.json
│  ├─ context-patterns.json
│  ├─ official-cards.json
│  └─ emergency-bundles/
├─ src/
│  ├─ screens/
│  ├─ mediation/
│  ├─ emergency/
│  ├─ offline/
│  └─ feedback/
├─ service-worker/
│  ├─ cache-policy.*
│  └─ sync.*
└─ tests/
   ├─ mediation-fixtures.test.*
   ├─ trust-boundary.test.*
   ├─ offline-emergency.test.*
   └─ bundle-versioning.test.*
```

## 15. 최소 오프라인 테스트

### O1 최초 온라인 설치 후 네트워크 차단
- 앱 재실행 가능
- 비상카드 조회 가능
- 집결지 표시 가능

### O2 오프라인 상태 회신
- “대피 중” 저장
- UI에 전송 대기 표시
- 연결 복구 후 sync

### O3 중복 전송
- 같은 event_id가 중복 처리되지 않음

### O4 오래된 Bundle
- 마지막 승인본 표시
- 만료 경고 노출

### O5 언어 자산
- 한국어/베트남어 카드와 핵심 오디오가 오프라인에서 모두 열림

### O6 민감정보
- 오프라인 캐시에서 일반 중재 대화 전체가 발견되지 않음

## 16. 구현 우선순위

### Phase 1
- 모바일 PWA shell
- 도움받기 사용자 흐름
- 언어 선택
- Emergency Bundle fixture
- 오프라인 비상정보 조회

### Phase 2
- 상태 회신 queue
- 재접속 sync
- 버전/만료 UX
- 홈화면 설치

### Phase 3
- 실제 LLM 중재
- Context Event feedback
- 조직 인사이트 mock

## 17. 완료 정의

프로토타입이 다음을 만족하면 모바일/오프라인 기준 완료로 본다.

- iPhone/Android 브라우저에서 동일 핵심 흐름 사용 가능
- 홈화면 설치 없이도 QR로 진입 가능
- 설치 후 인터넷 차단 상태에서도 비상정보 조회 가능
- 오프라인 상태 회신이 로컬에 보존됨
- 최신성/만료 상태가 사용자에게 보임
- 개인 민감 대화는 비상 오프라인 캐시에 포함되지 않음
- 일반 중재와 재난 안전모드가 동일 앱 안에서 연결됨

---

## 결정 기록

- 1차 프로토타입은 네이티브 앱이 아니라 모바일 우선 PWA로 진행한다.
- 플랫폼 독립성을 우선하고 핵심 기능을 네이티브 API에 종속시키지 않는다.
- 재난 중 생성형 AI가 없어도 승인된 안전정보는 동작해야 한다.
- 오프라인의 핵심은 “앱이 켜지는 것”이 아니라 **승인정보 조회 + 상태 회신 보존 + 재동기화**다.
