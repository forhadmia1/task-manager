# Task Manager - React Native Assessment

Hey there! 👋 This is my submission for the React Native Task Manager assessment. I've built a clean, offline-first app using React Native and Redux Toolkit. It handles all the core requirements: sensible caching, separated derived state for filtering/sorting, some solid unit tests, and properly preserving local-only fields (like the "starred" status) when syncing with the remote backend.

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js & pnpm
- Android Emulator

**NB:** In office I use a Mac, but personally I don't own one right now, so I couldn't test the iOS build locally. I've thoroughly tested this on Android and it works perfectly, but just a heads up that there might be some minor iOS-specific quirks I wasn't able to catch.

### Installation
1. Clone the repository and install dependencies:
   ```bash
   pnpm install
   ```

2. Setup Environment Variables:
   Create a `.env` file in the root directory and drop in your Supabase credentials. (You can check `.env.example` for the format)
   ```env
   PUBLIC_SUPABASE_URL=https://noahidotzvvmcpxveles.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=sb_publishable_fHBBjwp6rZIFbn8_NAqG1w_l3hjep4I
   ```

3. Run the App:
   ```bash
   # For Android (Recommended)
   pnpm android
   
   # For iOS (If you have a Mac)
   pnpm ios
   ```

4. Run Tests:
   ```bash
   pnpm test
   ```

---

## 🗄️ Backend Schema & Seed Data

I went with **Supabase** for the backend because it's super fast to set up and works great for this kind of project.

### Schema
**Table: `categories`**
- `id` (uuid, primary key)
- `created_at` (timestamptz)
- `name` (text)

**Table: `tasks`**
- `id` (uuid, primary key)
- `created_at` (timestamptz)
- `title` (text)
- `description` (text, nullable)
- `status` (text) - check constraint: `open`, `inprogress`, `complete`
- `due_date` (date, nullable)
- `category_id` (uuid, foreign key to categories.id, nullable)

## 🏗️ Architectural Decisions

### State Management: Redux Toolkit (RTK)
I decided to go with Redux Toolkit for managing the app's state. 
**Why?** Honestly, I have a lot of experience with Redux and I love how it handles state in a centralized, predictable way. For an app like this, having a single source of truth makes debugging and adding new features much easier. Plus, RTK's async thunks are great for handling the Supabase API calls.

### Local Storage: MMKV (via Redux Persist)
**Why?** I chose MMKV to back up our Redux cache. Since this is a relatively small project, we really don't need complex queries or a heavy database like SQLite. MMKV is incredibly fast, lightweight, and does exactly what we need: instantly rehydrating the Redux store from disk when the app boots up offline so the user never sees a blank screen.

### Filter & Sort Logic Separated from Render
I made sure to keep all the heavy lifting out of the React components. All filtering (by category/status) and sorting (by due date/creation time) happens strictly inside `src/store/selectors/taskSelectors.ts`. The UI components just grab the final list using `useSelector`. This stops nasty `.filter().sort()` chains from running on every single render cycle, keeping the UI snappy.

### Preserving Local-Only Fields (Starred)
The `starred` flag is specific to the user's device and shouldn't be wiped out by the backend. When the app pulls fresh data from Supabase, it passes both the new remote tasks and the existing local tasks through a utility function called `mergeTasksWithLocal()`. 
This function simply loops through the incoming remote tasks, checks if we already have it locally, and if we do, it **copies the `starred` status from the local task over to the remote one**. This makes sure background refreshes are totally seamless and the user never loses their starred tasks.

---

## 🧪 Testing Approach

I didn't want to write tests just for the sake of having tests. I focused on the parts of the app that actually matter:
1. **`mergeTasksWithLocal.test.ts`**: This tests the cache-merge logic. It's super important to guarantee that the `starred` flag isn't accidentally overwritten when remote data comes in.
2. **`taskSelectors.test.ts`**: Tests the derived state (the complex filtering and sorting logic). It makes sure the lists are ordered correctly without having to mount the entire React UI to find out.
3. **`TaskCard.test.tsx`**: A simple but effective UI component test that verifies the status badges ("Completed" vs "Pending") render exactly as expected based on the task props.

---

## ⚠️ Known Limitations
- **No Offline Write Queue:** Right now, if a user tries to create or edit a task while they have absolutely no internet, the API call will fail and the cache won't update. Building a full offline queuing system felt a bit out of scope for the time frame.
- **Conflict Resolution:** I kept it simple with a "last write wins" approach. If a task is edited on two devices at the same time, the last one to successfully hit Supabase wins.

---

## 🔮 What I'd do with another day
1. **Robust Offline Write Queue:** I'd definitely spend time integrating something like `redux-offline` to capture user actions (like adding or deleting tasks) while offline, save them in a queue, and automatically push them to the backend once the internet comes back.
2. **Real-time Sync:** It would be awesome to wire up Supabase Realtime. That way, if a task is updated on the web or another device, the app would instantly catch the payload and update the Redux store without the user needing to manually pull-to-refresh.

---

## 🤖 AI Usage
I used AI (Gemini) as a pair-programming assistant to help scaffold some of the initial boilerplate (like setting up the Redux slices and getting Jest to play nicely with React Native ES modules). It also helped speed up writing some of the basic UI components. However, the core architectural decisions, the cache-merging strategy, the selector separation, and the debugging were all driven by me to make sure the app actually meets the specific requirements of the assessment.
