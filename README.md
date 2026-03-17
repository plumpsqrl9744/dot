# dot

React와 TypeScript를 활용하여 빠르게 구축된 Electron 데스크톱 애플리케이션입니다.

## 💻 추천 IDE 환경

- 최적의 개발 경험을 위해 [VSCode](https://code.visualstudio.com/) 사용을 권장합니다.
- 코드 품질 관리를 위해 [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)와 [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 확장을 설치해 주세요.

## 🚀 프로젝트 설정 및 실행 방법

### 패키지 설치

이 프로젝트는 패키지 매니저로 Yarn을 사용합니다. 아래 명령어로 필수 의존성을 설치해 주세요.

```bash
$ yarn
```

### 개발 모드 실행

개발 중에는 아래 명령어를 사용하여 Hot-Reload가 지원되는 환경을 켤 수 있습니다.

```bash
$ yarn dev
```

### 상용 빌드

각 운영체제에 맞는 실행 파일로 패키징할 수 있습니다.

```bash
# Windows 전용 빌드
$ yarn build:win

# macOS 전용 빌드
$ yarn build:mac

# Linux 전용 빌드
$ yarn build:linux
```

## 🛠 주요 기술 스택

- **데스크톱 환경**: [Electron](https://www.electronjs.org/)을 기반으로 운영체제 네이티브 기능을 활용합니다.
- **프론트엔드 프레임워크**: 최신 [React 19](https://react.dev/)를 사용하여 선언적이고 풍부한 사용자 경험(UX)을 제공합니다.
- **언어**: [TypeScript](https://www.typescriptlang.org/)를 도입하여 정적 타입 체크를 통한 안정성을 확보했습니다.
- **로컬 저장소**: SQLite를 이용한 서버리스 로컬 데이터베이스를 구축하여 클라우드 의존성 없이 오프라인에서도 데이터를 저장하고 유지할 수 있습니다.
- **번들링 및 빌드 도구**: [Electron Vite](https://electron-vite.org/)를 적용하여 빌드 시간을 단축하고 HMR(초고속 모듈 교체)을 지원합니다.

## 📝 애플리케이션 주요 특징

- **완벽한 데스크톱 통합**: 브라우저를 벗어나 **Electron.js** 기반의 독립된 데스크톱 애플리케이션 환경 내에서 **React.js**가 유려하게 동작합니다.
- **강력하고 빠른 오프라인 데이터베이스**: 사용자의 컴퓨터 로컬 디렉토리에 **SQLite**를 직접 연동하여 중요 정보를 안전하게 보관합니다. 외부 서버 의존성을 없애 완벽한 오프라인 환경을 구현하며 극도로 빠른 조회 성능을 자랑합니다.

---

## 💡 번외 기획: P2P 웹 Todo 앱을 구축하신다면?

만약 현재 프로젝트(Electron) 외에, **React나 Next.js 기반의 웹 환경**에서 회사 동료들과 Todo를 실시간으로 공유하는 **P2P 애플리케이션**을 새롭게 기획 중이시라면 다음의 기술 스택 도입을 강력히 추천해 드립니다.

서버를 통한 중앙 집중식 데이터 통신 없이, 브라우저끼리 직접 데이터를 동기화하는 데에 탁월함을 발휘합니다.

- **데이터 기반 및 상태 관리**: **Yjs**
  - 충돌 방지(CRDT) 알고리즘을 통한 완벽한 실시간 분산 데이터 동기화 라이브러리입니다.
- **네트워크 계층 연결**: **y-webrtc**
  - WebRTC 기술을 활용하여 사용자 브라우저 간의 직접적인 (Peer-to-Peer) 네트워크 경로를 연결해 주는 통신 모듈입니다.
