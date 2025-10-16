import React, { useEffect, useMemo, useState } from "react";

/**
 * SafeSpace — MVP single‑file React app (VN)
 * Notes:
 * - No backend. All data lives in localStorage => demo/prototype only.
 * - Includes: Ẩn danh tâm sự, Nhật ký, Bảng tâm trạng, Diễn đàn nghề nghiệp,
 *   Trắc nghiệm định hướng (RIASEC mini), Hồ sơ/Portfolio, Danh bạ cố vấn,
 *   Nhóm thảo luận, Sự kiện trực tuyến, Gamification, Thông báo/Nhắc nhở,
 *   Bộ lọc an toàn (phát hiện từ khoá tiêu cực) & quy tắc cộng đồng.
 * - Design: Tailwind utility classes (no import required in Canvas).
 */

// ---------- Utilities ----------
const KEY = {
  diary: "ss_diary",
  feed: "ss_feed",
  mood: "ss_mood",
  forum: "ss_forum",
  profile: "ss_profile",
  groups: "ss_groups",
  events: "ss_events",
  badges: "ss_badges",
  reminders: "ss_reminders",
};

const defaultProfile = {
  name: "Học sinh ẩn danh",
  grade: "Lớp 12",
  interests: ["Toán", "Lập trình"],
  bio: "Mình thích chia sẻ tips học và dự án nhỏ.",
  projects: [
    { title: "Web flashcard Hóa 11", link: "", desc: "Ôn tập phản ứng" },
  ],
  achievements: ["Giải Nhì HSG Tin tỉnh"],
  avatar: "https://avatars.githubusercontent.com/u/9919?s=200&v=4",
};

const crisisKeywords = [
  "tự tử", "tự làm đau", "chán sống", "trầm cảm nặng", "hủy hoại bản thân",
  "suicide", "kill myself", "end my life",
];

function useLocal(key, init) {
  const [state, set] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, set];
}

function Section({ title, desc, right, children }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 border border-slate-100">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
          {desc && <p className="text-slate-500 text-sm mt-1">{desc}</p>}
        </div>
        <div className="shrink-0">{right}</div>
      </div>
      {children}
    </div>
  );
}

function Pill({ children }) {
  return <span className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700">{children}</span>;
}

function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea
      className="w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 p-3 outline-none"
      rows={4}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 p-3 outline-none"
    />
  );
}

function Button({ children, className = "", onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-xl px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white shadow ${className}`}
    >
      {children}
    </button>
  );
}

// ---------- Simple Router ----------
const tabs = [
  { id: "feed", label: "Tâm sự ẩn danh" },
  { id: "diary", label: "Nhật ký" },
  { id: "mood", label: "Bảng tâm trạng" },
  { id: "career", label: "Diễn đàn nghề nghiệp" },
  { id: "tests", label: "Trắc nghiệm" },
  { id: "profile", label: "Hồ sơ học tập" },
  { id: "mentors", label: "Danh bạ cố vấn" },
  { id: "groups", label: "Nhóm thảo luận" },
  { id: "events", label: "Sự kiện" },
  { id: "rewards", label: "Huy hiệu" },
  { id: "reminders", label: "Nhắc nhở" },
  { id: "rules", label: "Quy tắc an toàn" },
];

// ---------- Safety Banner ----------
function SafetyBanner() {
  return (
    <div className="rounded-2xl p-4 bg-gradient-to-r from-sky-50 to-emerald-50 border border-slate-200">
      <p className="text-sm text-slate-700">
        <strong>Không gian an toàn:</strong> Tôn trọng – Không phán xét – Ẩn danh tuỳ chọn. Nội dung vi phạm sẽ bị ẩn.
        Nếu bạn đang gặp khủng hoảng, hãy liên hệ ngay người thân, giáo viên, hoặc đường dây hỗ trợ tâm lý tại địa phương.
      </p>
    </div>
  );
}

// ---------- Crisis Detector ----------
function useCrisis(text) {
  return useMemo(() => {
    if (!text) return null;
    const t = text.toLowerCase();
    const hit = crisisKeywords.find(k => t.includes(k));
    return hit || null;
  }, [text]);
}

function CrisisModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-rose-700">Dấu hiệu khủng hoảng được phát hiện</h3>
        <p className="text-slate-700 mt-2 text-sm leading-relaxed">
          Mình rất tiếc vì bạn đang trải qua cảm xúc nặng nề. Hãy nói chuyện với người tin cậy
          (gia đình, giáo viên, bạn thân). Nếu thấy nguy cấp, gọi <strong>115</strong> hoặc liên hệ trung tâm tư vấn tâm lý tại địa phương.
        </p>
        <ul className="mt-3 text-sm text-slate-700 list-disc pl-5">
          <li>Giáo viên chủ nhiệm / Tổ tư vấn tâm lý trường.</li>
          <li>Đường dây nóng Bệnh viện Tâm thần địa phương.</li>
          <li>Bạn có thể chuyển bài viết sang <em>riêng tư</em> trong Nhật ký.</li>
        </ul>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100">Đã hiểu</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Anonymous Feed ----------
function Feed() {
  const [feed, setFeed] = useLocal(KEY.feed, []);
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [showCrisis, setShowCrisis] = useState(false);
  const crisis = useCrisis(text);

  function post() {
    if (!text.trim()) return;
    if (crisis) setShowCrisis(true);
    const item = {
      id: crypto.randomUUID(),
      text: text.trim(),
      tags: tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean),
      time: new Date().toISOString(),
      likes: 0,
      replies: [],
    };
    setFeed([item, ...feed]);
    setText("");
    setTags("");
  }

  function like(id) {
    setFeed(feed.map(x => (x.id === id ? { ...x, likes: x.likes + 1 } : x)));
  }

  function reply(id, content) {
    setFeed(
      feed.map(x =>
        x.id === id ? { ...x, replies: [...x.replies, { id: crypto.randomUUID(), content, time: new Date().toISOString() }] } : x
      )
    );
  }

  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return feed.filter(x =>
      !q ? true : x.text.toLowerCase().includes(q) || x.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [feed, query]);

  return (
    <div className="grid gap-5">
      <CrisisModal open={showCrisis} onClose={() => setShowCrisis(false)} />
      <Section
        title="Chia sẻ ẩn danh"
        desc="Viết điều bạn muốn nói. Tôn trọng – Không phán xét."
        right={<Pill>Ẩn danh</Pill>}
      >
        <Textarea value={text} onChange={setText} placeholder="Mình đang thấy…" />
        <div className="mt-2 grid sm:grid-cols-3 gap-2">
          <Input value={tags} onChange={setTags} placeholder="Hashtag, cách nhau bằng dấu phẩy (vd: #căng_thẳng_thi_cử, #đam_mê_lập_trình)" />
          <Input value={query} onChange={setQuery} placeholder="Tìm theo từ khoá/hashtag" />
          <Button onClick={post}>Đăng</Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">Lưu ý: Nội dung nhạy cảm sẽ hiện cảnh báo hỗ trợ.</p>
      </Section>

      <Section title="Dòng chảy tâm sự" desc="Bài viết mới nhất ở trên cùng.">
        <div className="grid gap-4">
          {filtered.length === 0 && <p className="text-slate-500 text-sm">Chưa có bài viết phù hợp.</p>}
          {filtered.map(item => (
            <article key={item.id} className="border border-slate-200 rounded-2xl p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img alt="avatar" src="https://i.pravatar.cc/40?img=12" className="w-9 h-9 rounded-full" />
                  <div>
                    <div className="font-medium text-slate-800">Bạn ẩn danh</div>
                    <div className="text-xs text-slate-500">{new Date(item.time).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex gap-1 flex-wrap justify-end">
                  {item.tags.map((t, i) => (
                    <Pill key={i}>#{t.replace(/^#/, "")}</Pill>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-slate-800 whitespace-pre-wrap">{item.text}</p>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => like(item.id)} className="px-3 py-1.5 rounded-lg bg-slate-100">❤️ {item.likes}</button>
              </div>
              <div className="mt-3">
                <ReplyBox onSend={c => reply(item.id, c)} />
                <div className="mt-2 grid gap-2">
                  {item.replies.map(r => (
                    <div key={r.id} className="text-sm bg-slate-50 rounded-xl p-2">
                      <span className="font-medium">Bạn bè:</span> {r.content}
                      <div className="text-xs text-slate-500">{new Date(r.time).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}

function ReplyBox({ onSend }) {
  const [v, setV] = useState("");
  return (
    <div className="flex items-center gap-2">
      <Input value={v} onChange={setV} placeholder="Viết lời động viên tích cực…" />
      <Button onClick={() => { if (v.trim()) { onSend(v.trim()); setV(""); } }} className="bg-emerald-600 hover:bg-emerald-700">Gửi</Button>
    </div>
  );
}

// ---------- Diary ----------
function Diary() {
  const [entries, setEntries] = useLocal(KEY.diary, []);
  const [text, setText] = useState("");
  const [mood, setMood] = useState("🙂");

  function addEntry() {
    if (!text.trim()) return;
    setEntries([{ id: crypto.randomUUID(), text: text.trim(), mood, time: new Date().toISOString() }, ...entries]);
    setText("");
  }

  return (
    <div className="grid gap-5">
      <Section title="Nhật ký riêng tư" desc="Chỉ mình bạn thấy (lưu cục bộ trên máy).">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm">Tâm trạng hôm nay:</label>
          <select value={mood} onChange={e => setMood(e.target.value)} className="rounded-xl border p-2">
            {["😄","🙂","😐","😕","😢","😤","😴"].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <Textarea value={text} onChange={setText} placeholder="Hôm nay mình…" />
        <Button onClick={addEntry}>Lưu</Button>
        <p className="text-xs text-slate-500 mt-2">Mẹo: Viết ngắn gọn theo cấu trúc Sự kiện → Cảm xúc → Bài học nhỏ.</p>
      </Section>

      <Section title="Bài đã lưu">
        <div className="grid gap-3">
          {entries.length === 0 && <p className="text-slate-500 text-sm">Chưa có nhật ký.</p>}
          {entries.map(e => (
            <div key={e.id} className="p-4 rounded-2xl border">
              <div className="text-sm text-slate-500">{new Date(e.time).toLocaleString()} · {e.mood}</div>
              <p className="mt-1 text-slate-800 whitespace-pre-wrap">{e.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ---------- Mood Board ----------
function MoodBoard() {
  const [moods, setMoods] = useLocal(KEY.mood, []);
  const palette = ["😄","🙂","😐","😕","😢","😤","😴"];
  function add(m) { setMoods([{ id: crypto.randomUUID(), m, t: new Date().toISOString() }, ...moods]); }
  return (
    <div className="grid gap-5">
      <Section title="Bảng tâm trạng" desc="Theo dõi sự thay đổi theo thời gian.">
        <div className="flex flex-wrap gap-2">
          {palette.map(x => <button key={x} onClick={() => add(x)} className="text-2xl hover:scale-110 transition">{x}</button>)}
        </div>
        <div className="mt-4 grid gap-2">
          {moods.length === 0 && <p className="text-sm text-slate-500">Chưa ghi nhận tâm trạng.</p>}
          {moods.map(x => (
            <div key={x.id} className="flex items-center gap-2 text-slate-700">
              <span className="text-xl">{x.m}</span>
              <span className="text-xs">{new Date(x.t).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ---------- Career Forum ----------
function CareerForum() {
  const [topics, setTopics] = useLocal(KEY.forum, [
    { id: crypto.randomUUID(), title: "Học ngành CNTT cần những gì?", author: "Cựu học sinh", body: "Lộ trình, dự án, thực tập…", replies: [] },
  ]);
  const [t, setT] = useState("");
  const [b, setB] = useState("");

  function add() {
    if (!t.trim() || !b.trim()) return;
    setTopics([{ id: crypto.randomUUID(), title: t.trim(), author: "Bạn ẩn danh", body: b.trim(), replies: [] }, ...topics]);
    setT(""); setB("");
  }

  function reply(id, content) {
    setTopics(topics.map(x => x.id === id ? { ...x, replies: [...x.replies, { id: crypto.randomUUID(), content }] } : x));
  }

  return (
    <div className="grid gap-5">
      <Section title="Diễn đàn nghề nghiệp" desc="Hỏi – Đáp với cựu HS, người đi làm.">
        <Input value={t} onChange={setT} placeholder="Tiêu đề câu hỏi" />
        <Textarea value={b} onChange={setB} placeholder="Nội dung / bối cảnh / mục tiêu" />
        <Button onClick={add}>Đăng câu hỏi</Button>
      </Section>
      <Section title="Chủ đề gần đây">
        <div className="grid gap-3">
          {topics.map(x => (
            <div key={x.id} className="p-4 rounded-2xl border">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-slate-800">{x.title}</h3>
                <Pill>{x.author}</Pill>
              </div>
              <p className="text-slate-700 mt-1 whitespace-pre-wrap">{x.body}</p>
              <div className="mt-3">
                <ReplyBox onSend={c => reply(x.id, c)} />
                <div className="mt-2 grid gap-2">
                  {x.replies.map(r => (
                    <div key={r.id} className="text-sm bg-slate-50 rounded-xl p-2">
                      <span className="font-medium">Trả lời:</span> {r.content}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ---------- Tests (mini RIASEC) ----------
const RIASEC_QUESTIONS = [
  { k: "R", q: "Mình thích lắp ráp, sửa chữa thiết bị." },
  { k: "I", q: "Mình thích giải bài toán, phân tích dữ liệu." },
  { k: "A", q: "Mình thích vẽ, viết, làm nhạc hay thiết kế." },
  { k: "S", q: "Mình thích giúp đỡ, lắng nghe người khác." },
  { k: "E", q: "Mình thích lãnh đạo, thuyết phục, tổ chức nhóm." },
  { k: "C", q: "Mình thích sắp xếp, làm việc với bảng biểu, hồ sơ." },
];

function Tests() {
  const [ans, setAns] = useState({});
  const [result, setResult] = useState(null);

  function submit() {
    const score = { R:0, I:0, A:0, S:0, E:0, C:0 };
    Object.entries(ans).forEach(([i, v]) => { if (v) score[RIASEC_QUESTIONS[i].k] += 1; });
    const sorted = Object.entries(score).sort((a,b) => b[1]-a[1]).map(([k]) => k).slice(0,3).join("");
    setResult({ code: sorted, score });
  }

  return (
    <div className="grid gap-5">
      <Section title="Trắc nghiệm tính cách – nghề (mini)" desc="Phiên bản rút gọn RIASEC (chỉ tham khảo).">
        <div className="grid gap-3">
          {RIASEC_QUESTIONS.map((it, i) => (
            <label key={i} className="flex items-center gap-3 p-3 rounded-xl border">
              <input type="checkbox" checked={!!ans[i]} onChange={e => setAns({ ...ans, [i]: e.target.checked })} />
              <span>{it.q}</span>
            </label>
          ))}
        </div>
        <Button onClick={submit} className="mt-3">Xem gợi ý</Button>
        {result && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-50">
            <div className="font-semibold">Mã nổi trội: {result.code}</div>
            <p className="text-sm text-slate-600 mt-1">
              Gợi ý (tham khảo):
              {" "}
              {result.code.includes("I") && "Khoa học dữ liệu, CNTT, nghiên cứu."}
              {result.code.includes("A") && " Thiết kế đồ hoạ, truyền thông, UI/UX."}
              {result.code.includes("S") && " Tâm lý học đường, giáo dục, y tế cộng đồng."}
              {result.code.includes("E") && " Quản trị kinh doanh, khởi nghiệp, marketing."}
              {result.code.includes("R") && " Kỹ thuật, cơ khí, điện tử, kiến trúc."}
              {result.code.includes("C") && " Kế toán, hành chính, phân tích nghiệp vụ."}
            </p>
          </div>
        )}
      </Section>
    </div>
  );
}

// ---------- Profile ----------
function Profile() {
  const [profile, setProfile] = useLocal(KEY.profile, defaultProfile);
  const [edit, setEdit] = useState(profile);

  function save() { setProfile(edit); }

  return (
    <div className="grid gap-5">
      <Section title="Hồ sơ học tập (Portfolio)" desc="Giới thiệu ngắn, dự án, thành tích.">
        <div className="grid md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-1">
            <img src={edit.avatar} alt="avatar" className="w-full rounded-2xl border" />
            <Input value={edit.avatar} onChange={v => setEdit({ ...edit, avatar: v })} placeholder="Link ảnh đại diện" />
          </div>
          <div className="md:col-span-2 grid gap-3">
            <Input value={edit.name} onChange={v => setEdit({ ...edit, name: v })} placeholder="Họ tên" />
            <Input value={edit.grade} onChange={v => setEdit({ ...edit, grade: v })} placeholder="Khối/Lớp" />
            <Textarea value={edit.bio} onChange={v => setEdit({ ...edit, bio: v })} placeholder="Giới thiệu ngắn" />
            <div>
              <div className="font-medium mb-1">Sở thích</div>
              <TagEditor value={edit.interests} onChange={v => setEdit({ ...edit, interests: v })} />
            </div>
            <div>
              <div className="font-medium mb-1">Dự án</div>
              <ArrayEditor value={edit.projects} onChange={v => setEdit({ ...edit, projects: v })} schema={["title","link","desc"]} />
            </div>
            <div>
              <div className="font-medium mb-1">Thành tích</div>
              <ListEditor value={edit.achievements} onChange={v => setEdit({ ...edit, achievements: v })} />
            </div>
            <Button onClick={save}>Lưu hồ sơ</Button>
          </div>
        </div>
      </Section>

      <Section title="Xem nhanh">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <img src={profile.avatar} alt="avatar" className="w-full rounded-2xl border" />
            <div className="mt-2 text-slate-700">{profile.name} · {profile.grade}</div>
            <div className="flex gap-2 mt-2 flex-wrap">{profile.interests.map((x,i)=><Pill key={i}>{x}</Pill>)}</div>
          </div>
          <div className="md:col-span-2">
            <p className="text-slate-700 whitespace-pre-wrap">{profile.bio}</p>
            <div className="mt-3">
              <h4 className="font-semibold">Dự án</h4>
              <ul className="list-disc pl-5 text-slate-700">
                {profile.projects.map((p,i)=> (
                  <li key={i}><span className="font-medium">{p.title}</span>{p.link && <> — <a className="text-sky-700 underline" href={p.link} target="_blank">Link</a></>}<div className="text-sm">{p.desc}</div></li>
                ))}
              </ul>
            </div>
            <div className="mt-3">
              <h4 className="font-semibold">Thành tích</h4>
              <ul className="list-disc pl-5 text-slate-700">
                {profile.achievements.map((a,i)=>(<li key={i}>{a}</li>))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

function TagEditor({ value, onChange }) {
  const [v, setV] = useState("");
  return (
    <div>
      <div className="flex gap-2">
        <Input value={v} onChange={setV} placeholder="Thêm thẻ" />
        <Button onClick={()=>{ if(!v.trim())return; onChange([...value, v.trim()]); setV(""); }}>Thêm</Button>
      </div>
      <div className="mt-2 flex gap-2 flex-wrap">
        {value.map((x,i)=> (
          <button key={i} onClick={()=> onChange(value.filter((_,j)=> j!==i))} className="px-2.5 py-1 rounded-full bg-slate-100 text-sm">{x} ×</button>
        ))}
      </div>
    </div>
  );
}

function ListEditor({ value, onChange }) {
  const [v, setV] = useState("");
  return (
    <div>
      <div className="flex gap-2">
        <Input value={v} onChange={setV} placeholder="Mục mới" />
        <Button onClick={()=>{ if(!v.trim())return; onChange([...value, v.trim()]); setV(""); }}>Thêm</Button>
      </div>
      <ul className="list-disc pl-5 mt-2 text-slate-700">
        {value.map((x,i)=> (
          <li key={i} className="flex items-center justify-between gap-2">
            <span>{x}</span>
            <button onClick={()=> onChange(value.filter((_,j)=> j!==i))} className="text-sm text-rose-600">Xoá</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArrayEditor({ value, onChange, schema }) {
  const [draft, setDraft] = useState(Object.fromEntries(schema.map(k=>[k,""])));
  function add() {
    const clean = Object.fromEntries(Object.entries(draft).map(([k,v])=>[k, v.trim()]));
    if (!clean[schema[0]]) return; // require first field
    onChange([ clean, ...value ]);
    setDraft(Object.fromEntries(schema.map(k=>[k,""])));
  }
  return (
    <div className="grid gap-2">
      {schema.map(k => (
        <Input key={k} value={draft[k]} onChange={v => setDraft({ ...draft, [k]: v })} placeholder={k} />
      ))}
      <Button onClick={add}>Thêm</Button>
      <div className="grid gap-2">
        {value.map((row, i) => (
          <div key={i} className="p-3 rounded-xl border">
            {schema.map(k => (
              <div key={k} className="text-sm"><span className="font-medium">{k}:</span> {row[k]}</div>
            ))}
            <button onClick={()=> onChange(value.filter((_,j)=> j!==i))} className="mt-2 text-sm text-rose-600">Xoá</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Mentors ----------
function Mentors() {
  const mentors = [
    { name: "Cô H., Tâm lý học đường", contact: "co.h@example.edu", topics: ["Căng thẳng thi cử","Kỹ năng học"], office: "Phòng Tư vấn" },
    { name: "Anh T., Kỹ sư phần mềm", contact: "anh.t@company.com", topics: ["CNTT","Dự án sinh viên"], office: "Online" },
  ];
  return (
    <Section title="Danh bạ cố vấn" desc="Liên hệ khi cần hỗ trợ.">
      <div className="grid md:grid-cols-2 gap-3">
        {mentors.map((m,i)=> (
          <div key={i} className="p-4 rounded-2xl border">
            <div className="font-semibold">{m.name}</div>
            <div className="text-sm text-slate-700">Chủ đề: {m.topics.join(", ")}</div>
            <div className="text-sm">Liên hệ: <a className="text-sky-700" href={`mailto:${m.contact}`}>{m.contact}</a></div>
            <div className="text-sm">Hình thức: {m.office}</div>
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-slate-100">Hẹn lịch</button>
              <button className="px-3 py-1.5 rounded-lg bg-slate-100">Gửi email</button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ---------- Groups ----------
function Groups() {
  const [groups, setGroups] = useLocal(KEY.groups, [
    { id: crypto.randomUUID(), name: "Nhóm học Toán 12", desc: "Chia sẻ đề và lời giải.", members: 12 },
  ]);
  const [n, setN] = useState("");
  const [d, setD] = useState("");
  function add() {
    if (!n.trim()) return;
    setGroups([{ id: crypto.randomUUID(), name: n.trim(), desc: d.trim(), members: 1 }, ...groups]);
    setN(""); setD("");
  }
  return (
    <div className="grid gap-5">
      <Section title="Tạo nhóm thảo luận">
        <Input value={n} onChange={setN} placeholder="Tên nhóm" />
        <Textarea value={d} onChange={setD} placeholder="Mô tả" />
        <Button onClick={add}>Tạo nhóm</Button>
      </Section>
      <Section title="Nhóm hiện có">
        <div className="grid md:grid-cols-2 gap-3">
          {groups.map(g => (
            <div key={g.id} className="p-4 rounded-2xl border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{g.name}</h3>
                <Pill>{g.members} thành viên</Pill>
              </div>
              <p className="text-slate-700 mt-1">{g.desc}</p>
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-slate-100">Tham gia</button>
                <button className="px-3 py-1.5 rounded-lg bg-slate-100">Mời bạn</button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ---------- Events ----------
function Events() {
  const [events, setEvents] = useLocal(KEY.events, [
    { id: crypto.randomUUID(), title: "Talkshow: Chọn ngành CNTT", time: new Date().toISOString(), host: "Cựu HS", link: "" },
  ]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [host, setHost] = useState("");
  const [link, setLink] = useState("");

  function add() {
    if (!title.trim()) return;
    setEvents([{ id: crypto.randomUUID(), title, time: time || new Date().toISOString(), host, link }, ...events]);
    setTitle(""); setTime(""); setHost(""); setLink("");
  }

  return (
    <div className="grid gap-5">
      <Section title="Tạo sự kiện trực tuyến">
        <div className="grid md:grid-cols-2 gap-2">
          <Input value={title} onChange={setTitle} placeholder="Tiêu đề" />
          <Input value={time} onChange={setTime} placeholder="Thời gian (ISO hoặc để trống = now)" />
          <Input value={host} onChange={setHost} placeholder="Diễn giả / Đơn vị tổ chức" />
          <Input value={link} onChange={setLink} placeholder="Link meeting (Google Meet/Zoom)" />
        </div>
        <Button onClick={add} className="mt-3">Tạo</Button>
      </Section>
      <Section title="Sự kiện sắp tới">
        <div className="grid gap-3">
          {events.map(e => (
            <div key={e.id} className="p-4 rounded-2xl border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{e.title}</h3>
                <Pill>{new Date(e.time).toLocaleString()}</Pill>
              </div>
              <div className="text-sm text-slate-700">Diễn giả: {e.host || "—"}</div>
              {e.link && <a className="text-sky-700 underline" href={e.link} target="_blank">Tham gia</a>}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ---------- Rewards (Gamification) ----------
function Rewards() {
  const [badges, setBadges] = useLocal(KEY.badges, [
    { id: "starter", name: "Người mở đường", desc: "Đăng bài đầu tiên" },
  ]);
  function grant() {
    setBadges(b => [...b, { id: crypto.randomUUID(), name: "Bạn tốt bụng", desc: "Gửi 5 lời động viên" }]);
  }
  return (
    <Section title="Huy hiệu – Điểm thưởng" desc="Khuyến khích tham gia tích cực.">
      <div className="grid md:grid-cols-3 gap-3">
        {badges.map(b => (
          <div key={b.id} className="p-4 rounded-2xl border bg-gradient-to-b from-white to-sky-50">
            <div className="text-3xl">🏅</div>
            <div className="font-semibold">{b.name}</div>
            <div className="text-sm text-slate-700">{b.desc}</div>
          </div>
        ))}
      </div>
      <button onClick={grant} className="mt-3 px-4 py-2 rounded-xl bg-slate-100">Giả lập: nhận huy hiệu</button>
    </Section>
  );
}

// ---------- Reminders ----------
function Reminders() {
  const [items, setItems] = useLocal(KEY.reminders, []);
  const [t, setT] = useState("");
  function add() { if(!t.trim())return; setItems([{ id: crypto.randomUUID(), t, done:false }, ...items]); setT(""); }
  function toggle(id) { setItems(items.map(x => x.id===id? { ...x, done: !x.done }: x)); }
  return (
    <div className="grid gap-5">
      <Section title="Thông báo & Nhắc nhở thân thiện">
        <div className="flex gap-2">
          <Input value={t} onChange={setT} placeholder="VD: Ôn Toán 30’ lúc 20:00" />
          <Button onClick={add}>Thêm</Button>
        </div>
        <ul className="mt-3 grid gap-2">
          {items.map(x => (
            <li key={x.id} className="p-3 rounded-xl border flex items-center justify-between">
              <span className={x.done? "line-through text-slate-400":""}>{x.t}</span>
              <button onClick={()=>toggle(x.id)} className="px-3 py-1.5 rounded-lg bg-slate-100">{x.done? "Hoàn tác":"Xong"}</button>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

// ---------- Rules ----------
function Rules() {
  return (
    <Section title="Quy tắc cộng đồng & An toàn">
      <ol className="list-decimal pl-6 text-slate-700 space-y-2 text-sm">
        <li>Tôn trọng – Không kỳ thị – Không công kích cá nhân.</li>
        <li>Đăng ẩn danh tuỳ chọn; không tiết lộ thông tin riêng tư của người khác.</li>
        <li>Nội dung nhạy cảm (bạo lực, tự hại…) sẽ hiển thị cảnh báo; BQT có quyền ẩn bài.</li>
        <li>Không spam, không quảng cáo. Tranh luận lịch sự, dựa trên dữ kiện.</li>
        <li>Hãy tìm trợ giúp chuyên môn khi cần. Diễn đàn chỉ mang tính hỗ trợ cộng đồng.</li>
      </ol>
    </Section>
  );
}

// ---------- App Shell ----------
export default function App() {
  const [tab, setTab] = useState("feed");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl grid place-items-center bg-sky-600 text-white text-lg shadow">☺</div>
            <div>
              <div className="font-bold text-slate-800">SafeSpace</div>
              <div className="text-xs text-slate-500">Không gian an toàn cho học sinh</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            {tabs.map(t => (
              <button key={t.id} onClick={()=>setTab(t.id)}
                className={`px-3 py-1.5 rounded-xl text-sm ${tab===t.id? 'bg-sky-600 text-white':'bg-slate-100 text-slate-700'}`}>{t.label}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid gap-6">
        <SafetyBanner />
        <div className="md:hidden">
          <select value={tab} onChange={e=>setTab(e.target.value)} className="w-full rounded-xl border p-2">
            {tabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
        {tab === "feed" && <Feed />}
        {tab === "diary" && <Diary />}
        {tab === "mood" && <MoodBoard />}
        {tab === "career" && <CareerForum />}
        {tab === "tests" && <Tests />}
        {tab === "profile" && <Profile />}
        {tab === "mentors" && <Mentors />}
        {tab === "groups" && <Groups />}
        {tab === "events" && <Events />}
        {tab === "rewards" && <Rewards />}
        {tab === "reminders" && <Reminders />}
        {tab === "rules" && <Rules />}
      </main>

      <footer className="mt-10 border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-slate-500">
          © {new Date().getFullYear()} SafeSpace (MVP nội bộ). Dữ liệu lưu cục bộ (localStorage). Không thay thế tư vấn y tế/chuyên môn.
        </div>
      </footer>
    </div>
  );
}
