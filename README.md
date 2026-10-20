# MERN Estate Web

项目 Git 地址：https://github.com/rick-peng-li/mern-estate-web

前后端分离的房产租售平台（MERN 全栈项目），已完成整体升级改造，全部使用最新技术版本与最新写法。

## 技术栈

### 前端（client/）
- React 19 + Vite 8（构建工具，`@` 路径别名指向 `src/`）
- Ant Design 6（UI 组件库）
- Redux Toolkit 2（`createAsyncThunk` 异步流）+ redux-persist（状态持久化）
- React Router 7（`createBrowserRouter` 数据路由，路由集中在 `src/router/`）
- Tailwind CSS 4（原子化布局样式，配合 antd 使用）
- Firebase 13（Google 登录 + 图片上传）
- Swiper 14（首页轮播、房源详情图集）

### 后端（server/）
- Node.js 20+（ES Modules）
- Express 5（异步错误自动转发）
- Mongoose 9（MongoDB ODM）
- bcryptjs 3 / jsonwebtoken / cookie-parser（JWT 鉴权，HttpOnly Cookie）
- dotenv 18（环境变量）

## 目录结构

```
mern-estate-web/
├── client/                  # 前端
│   ├── src/
│   │   ├── api/             # 接口层（http 封装 + auth/user/listing 模块）
│   │   ├── components/      # 组件（layout/、listing/、auth/、route/ 子目录）
│   │   ├── pages/           # 页面（home/、about/、auth/、user/、listing/ 子目录）
│   │   ├── redux/           # 状态管理（store + userSlice）
│   │   ├── router/          # 路由（createBrowserRouter 集中配置）
│   │   ├── utils/           # 工具（firebase 初始化、图片上传、价格格式化）
│   │   ├── App.jsx          # ConfigProvider + AntApp + RouterProvider
│   │   └── main.jsx         # 入口（Redux Provider + PersistGate）
│   └── vite.config.js       # @ 别名 + /api 代理到后端 3001 端口
├── server/                  # 后端
│   ├── controllers/         # 控制器（auth/user/listing）
│   ├── models/              # 数据模型（User/Listing）
│   ├── routes/              # 路由
│   ├── utils/               # errorHandler / verifyToken 中间件
│   └── index.js             # Express 入口（静态托管 client/dist）
└── README.md
```

## 页面功能

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` | 轮播图（特价房源）+ 特价/出租/出售房源区块 |
| 关于 | `/about` | 平台介绍 |
| 登录 / 注册 | `/sign-in` `/sign-up` | 邮箱密码 + Google 登录，antd Form 校验 |
| 搜索 | `/search` | 侧栏筛选（关键词/类型/优惠/车位/家具/排序），URL 参数驱动，Show more 分页 |
| 房源详情 | `/listing/:listingId` | 图片轮播、分享复制链接、收藏、预约看房、联系房东、评价 |
| 个人中心 | `/profile` | 头像上传（Firebase）、资料修改、删除账号、我的房源管理（登录后） |
| 数据仪表盘 | `/dashboard` | 房源/收藏/预约/通知统计卡片 + 最近收到的预约列表（登录后） |
| 收藏夹 | `/favorites` | 收藏的房源卡片，支持移除（登录后） |
| 预约管理 | `/bookings` | 我的预约 / 收到的预约双 Tab，房东可确认/拒绝（登录后） |
| 房产博客 | `/blog` `/blog/:postId` | 资讯列表（分类标签）、文章详情 + 相关文章推荐 |
| 发布房源 | `/create-listing` | 表单 + 图片上传（登录后） |
| 编辑房源 | `/update-listing/:listingId` | 复用 ListingForm 组件（登录后） |

各模块业务联动：详情页收藏 → 收藏夹；详情页预约看房 → 房东收到通知并可在预约管理中确认/拒绝 → 状态变化再次通知租客；评价显示平均分与个人评分记录；仪表盘汇总所有模块数据；博客区块嵌入首页。

## 接口设计

### Auth `/api/auth`
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/signup` | 注册 |
| POST | `/signin` | 登录（返回 HttpOnly Cookie） |
| POST | `/google` | Google 登录 |
| GET | `/signout` | 登出 |

### User `/api/user`（需登录）
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/test` | 连通性测试 |
| POST | `/update/:id` | 更新用户资料 |
| DELETE | `/delete/:id` | 删除账号 |
| GET | `/listings/:id` | 获取用户的房源列表 |
| GET | `/:id` | 获取用户公开信息（联系房东用） |

### Listing `/api/listing`
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/create` | 发布房源（需登录） |
| POST | `/update/:id` | 编辑房源（需登录，仅本人） |
| DELETE | `/delete/:id` | 删除房源（需登录，仅本人） |
| GET | `/get/:id` | 房源详情 |
| GET | `/get` | 房源列表（支持 searchTerm/type/offer/parking/furnished/sort/order/limit/startIndex） |

### Favorite `/api/favorite`（需登录）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/toggle` | 收藏/取消收藏 |
| GET | `/mine` | 我的收藏列表（返回完整房源） |
| GET | `/check/:listingId` | 检查是否已收藏 |

### Booking `/api/booking`（需登录）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/create` | 预约看房（触发房东通知） |
| GET | `/mine` | 我发起的预约（含房源信息） |
| GET | `/received` | 我收到的预约（房东视角） |
| POST | `/status/:id` | 房东确认/拒绝（触发租客通知） |
| POST | `/cancel/:id` | 取消预约（通知对方） |

### Review `/api/review`
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/create` | 新增/更新评价（需登录，每用户每房源一条） |
| GET | `/listing/:listingId` | 房源评价列表 + 平均分 |
| DELETE | `/:id` | 删除自己的评价（需登录） |

### Post `/api/post`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/all` | 文章列表（可选 limit） |
| GET | `/:id` | 文章详情 |
| POST | `/create` | 发布文章（需登录） |
| DELETE | `/:id` | 删除自己的文章（需登录） |

### Notification `/api/notification`（需登录）
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/mine` | 最近 20 条通知 + 未读数 |
| POST | `/read-all` | 全部标记已读 |

## 快速开始

```bash
# 1. 后端
cd server
cp .env.example .env        # 配置 MONGO（MongoDB 连接串）与 JWT_SECRET
npm install
npm run dev                 # 默认 3001 端口

# 2. 前端
cd client
npm install
npm run dev                 # 5173 端口，/api 代理到 localhost:3001
```

### Google 登录与图片上传（可选）

需要在 `client/.env` 中配置自己的 Firebase 项目：

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

未配置时应用可正常浏览、注册、登录、搜索房源，仅 Google 登录与图片上传不可用。

### 生产部署

```bash
cd client && npm run build   # 产物在 client/dist
cd ../server && npm start    # Express 自动托管 client/dist
```
