import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const AVATAR_COLORS = [
  "linear-gradient(135deg,#2997ff,#6060ff)",
  "linear-gradient(135deg,#34d399,#059669)",
  "linear-gradient(135deg,#f59e0b,#d97706)",
  "linear-gradient(135deg,#ec4899,#be185d)",
  "linear-gradient(135deg,#8b5cf6,#6d28d9)",
];
const CAT_EMOJI = { FOOD:"🍔", PETROL:"⛽", HOTEL:"🏨", SHOPPING:"🛍", OTHER:"📦" };

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [members,     setMembers]     = useState([]);
  const [expenses,    setExpenses]    = useState([]);
  const [payments,    setPayments]    = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [userId,      setUserId]      = useState(null);
  const [memberEmail, setMemberEmail] = useState("");
  const [paidBy,      setPaidBy]      = useState("");
  const [amount,      setAmount]      = useState("");
  const [desc,        setDesc]        = useState("");
  const [category,    setCategory]    = useState("");
  const [showDelete,  setShowDelete]  = useState(false);
  const [toast,       setToast]       = useState({ show:false, message:"", type:"ok" });

  const showToast = (message, type="ok") => {
    setToast({ show:true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show:false })), 3000);
  };

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    setUserId(uid ? parseInt(uid) : null);
  }, []);

  const fetchMembers = async () => {
    const res = await API.get(`/trips/${id}/members`);
    const users = await Promise.all(
      res.data.map(async (m) => {
        try { return (await API.get(`/users/${m.userId}`)).data; }
        catch { return null; }
      })
    );
    setMembers(users.filter(Boolean));
  };

  const fetchExpenses = async () => {
    const res = await API.get(`/expenses/${id}`);
    setExpenses(res.data);
  };

  const fetchPayments = async () => {
    const res = await API.get(`/payments/${id}`);
    setPayments(res.data);
  };

  useEffect(() => {
    fetchMembers(); fetchExpenses(); fetchPayments();
  }, [id]);

  const searchUsers = async (value) => {
    setMemberEmail(value);
    if (value.length < 2) { setSuggestions([]); return; }
    const res = await API.get(`/users/search?keyword=${value}`);
    setSuggestions(res.data);
  };

  const addMember = async () => {
    try {
      const res = await API.get(`/users/by-email?email=${memberEmail}`);
      await API.post(`/trips/${id}/add-member`, null, { params: { userId: res.data.id } });
      setMemberEmail(""); setSuggestions([]);
      fetchMembers();
      showToast("Member added ✓");
    } catch { showToast("Error adding member ✕", "err"); }
  };

  const removeMember = async (uid) => {
    await API.delete(`/trips/${id}/remove-member/${uid}`);
    fetchMembers(); showToast("Member removed");
  };

  const addExpense = async () => {
    if (!paidBy || !amount || !desc) { showToast("Please fill all expense fields ✕", "err"); return; }
    await API.post(`/expenses?tripId=${id}&paidBy=${paidBy}&amount=${amount}&desc=${desc}&category=${category}`);
    setAmount(""); setDesc("");
    fetchExpenses();
    await API.post(`/payments/create/${id}`);
    fetchPayments();
    showToast("Expense added ✓");
  };

  const payNow = async (payment) => {
    const res = await API.post(`/payments/create-order?amount=${payment.amount}`);
    new window.Razorpay({
      key: "rzp_test_SUmxsFnz3cClM0",
      amount: res.data.amount, currency: "INR", name: "SplitMates",
      order_id: res.data.id,
      handler: async () => {
        await API.post(`/payments/pay/${payment.id}`);
        fetchPayments(); showToast("Payment successful ✓");
      },
    }).open();
  };

  const handleDeleteTrip = async () => {
    await API.delete(`/trips/${id}`);
    navigate("/dashboard");
  };

  const getName = (uid) => members.find(m => m.id === uid)?.name ?? uid;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        .td-root { font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; background:#050508; color:#f5f5f7; overflow-x:hidden; }
        .td-grid-bg { position:fixed;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.05) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0; }
        .td-orb { position:fixed;border-radius:50%;pointer-events:none;animation:td-breathe 8s ease-in-out infinite; }
        .td-o1 { width:580px;height:580px;background:radial-gradient(circle,rgba(41,151,255,.12) 0%,transparent 70%);top:-180px;left:-140px; }
        .td-o2 { width:460px;height:460px;background:radial-gradient(circle,rgba(100,55,255,.10) 0%,transparent 70%);bottom:-160px;right:-100px;animation-delay:4s; }
        @keyframes td-breathe{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.08)}}
        @keyframes td-fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

        .td-main { position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:48px 32px 100px; }

        /* Header */
        .td-header { display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:40px;animation:td-fadeUp .7s .08s cubic-bezier(.16,1,.3,1) both; }
        .td-title { font-family:'Instrument Serif',serif;font-size:38px;font-weight:400;font-style:italic;line-height:1.1; }
        .td-title span { color:#2997ff; }
        .td-btn-delete { display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:11px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:500;color:#ff6b6b;background:rgba(255,70,70,.08);border:1px solid rgba(255,70,70,.2);cursor:pointer;transition:background .2s,border-color .2s,transform .18s; }
        .td-btn-delete:hover { background:rgba(255,70,70,.15);border-color:rgba(255,70,70,.35);transform:translateY(-1px); }

        /* Layout */
        .td-layout { display:grid;grid-template-columns:1fr 1fr;gap:20px; }
        .td-full { grid-column:1/-1; }

        /* Card */
        .td-card { background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.095);border-radius:20px;padding:24px 26px;backdrop-filter:blur(32px);box-shadow:0 0 0 .5px rgba(255,255,255,.05) inset,0 16px 40px rgba(0,0,0,.3);animation:td-fadeUp .7s cubic-bezier(.16,1,.3,1) both; }
        .td-card-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:20px; }
        .td-card-title { font-size:13px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(245,245,247,.48);display:flex;align-items:center;gap:8px; }
        .td-card-title::before { content:'';display:block;width:3px;height:14px;border-radius:2px;background:#2997ff; }
        .td-card-count { font-size:11px;font-weight:600;letter-spacing:.06em;color:rgba(245,245,247,.45);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);padding:3px 10px;border-radius:20px; }

        /* Members */
        .td-member-row { display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:11px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);margin-bottom:8px;transition:background .2s; }
        .td-member-row:hover { background:rgba(255,255,255,.07); }
        .td-member-left { display:flex;align-items:center;gap:10px; }
        .td-avatar { width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#fff;flex-shrink:0; }
        .td-member-name { font-size:14px;font-weight:500; }
        .td-member-email { font-size:11px;color:rgba(245,245,247,.45); }
        .td-btn-remove { font-size:11px;font-weight:500;color:rgba(255,107,107,.6);background:transparent;border:none;cursor:pointer;padding:5px 10px;border-radius:7px;transition:color .2s,background .2s; }
        .td-btn-remove:hover { color:#ff6b6b;background:rgba(255,70,70,.1); }

        /* Search */
        .td-add-row { display:flex;gap:10px;margin-top:14px;position:relative; }
        .td-search-input { flex:1;padding:11px 14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.11);border-radius:11px;color:#f5f5f7;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;outline:none;transition:border-color .25s,box-shadow .25s; }
        .td-search-input::placeholder { color:rgba(255,255,255,.2); }
        .td-search-input:focus { border-color:#2997ff;background:rgba(41,151,255,.05);box-shadow:0 0 0 3px rgba(41,151,255,.18); }
        .td-btn-add-m { padding:11px 18px;background:rgba(52,211,153,.15);border:1px solid rgba(52,211,153,.25);border-radius:11px;color:#34d399;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .2s,transform .18s; }
        .td-btn-add-m:hover { background:rgba(52,211,153,.22);transform:translateY(-1px); }
        .td-dropdown { position:absolute;top:calc(100% + 6px);left:0;right:80px;background:#0d0d14;border:1px solid rgba(255,255,255,.12);border-radius:12px;overflow:hidden;z-index:20;box-shadow:0 16px 40px rgba(0,0,0,.5); }
        .td-dropdown-item { padding:11px 14px;font-size:13px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,.05);transition:background .15s; }
        .td-dropdown-item:last-child { border-bottom:none; }
        .td-dropdown-item:hover { background:rgba(41,151,255,.1);color:#2997ff; }

        /* Expense Form */
        .td-exp-form { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
        .td-fl { grid-column:1/-1; }
        .td-label { font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(245,245,247,.45);margin-bottom:6px;display:block; }
        .td-input,.td-select { width:100%;padding:11px 14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.11);border-radius:11px;color:#f5f5f7;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;outline:none;transition:border-color .25s,box-shadow .25s;-webkit-appearance:none; }
        .td-input::placeholder { color:rgba(255,255,255,.2); }
        .td-input:focus,.td-select:focus { border-color:#2997ff;background:rgba(41,151,255,.05);box-shadow:0 0 0 3px rgba(41,151,255,.18); }
        .td-select option { background:#0d0d14; }
        .td-btn-expense { grid-column:1/-1;padding:13px;background:#2997ff;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;border:none;border-radius:11px;cursor:pointer;transition:transform .18s,box-shadow .18s,background .18s;box-shadow:0 4px 20px rgba(41,151,255,.28); }
        .td-btn-expense:hover { transform:translateY(-1px);box-shadow:0 8px 28px rgba(41,151,255,.42);background:#3aa0ff; }

        /* Expense list */
        .td-exp-item { display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:12px;margin-bottom:8px;transition:background .2s; }
        .td-exp-item:hover { background:rgba(255,255,255,.07); }
        .td-exp-left { display:flex;align-items:center;gap:11px; }
        .td-exp-cat { width:36px;height:36px;border-radius:10px;background:rgba(41,151,255,.12);border:1px solid rgba(41,151,255,.18);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0; }
        .td-exp-desc { font-size:14px;font-weight:500; }
        .td-exp-payer { font-size:11px;color:rgba(245,245,247,.45); }
        .td-exp-right { text-align:right; }
        .td-exp-amount { font-size:15px;font-weight:600; }
        .td-exp-share { font-size:11px;color:#2997ff; }

        /* Payments */
        .td-pay-item { padding:14px 16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:12px;margin-bottom:8px; }
        .td-pay-item.owe { border-color:rgba(255,107,107,.18);background:rgba(255,70,70,.05); }
        .td-pay-item.owed { border-color:rgba(52,211,153,.18);background:rgba(52,211,153,.04); }
        .td-pay-row { display:flex;align-items:center;justify-content:space-between; }
        .td-pay-text { font-size:13px; }
        .td-pay-amount { font-size:15px;font-weight:700; }
        .td-pay-amount.red { color:#ff6b6b; }
        .td-pay-amount.green { color:#34d399; }
        .td-btn-pay { margin-top:10px;padding:8px 18px;background:rgba(52,211,153,.15);border:1px solid rgba(52,211,153,.28);border-radius:9px;color:#34d399;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:background .2s,transform .18s; }
        .td-btn-pay:hover { background:rgba(52,211,153,.25);transform:translateY(-1px); }
        .td-settled { display:flex;flex-direction:column;align-items:center;padding:36px;gap:10px; }
        .td-settled-icon { font-size:32px; }
        .td-settled-text { font-family:'Instrument Serif',serif;font-size:20px;font-style:italic;color:#34d399; }
        .td-settled-sub { font-size:12px;color:rgba(245,245,247,.4); }

        /* Delete modal */
        .td-modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);z-index:100;display:flex;align-items:center;justify-content:center; }
        .td-modal { background:#0d0d14;border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:32px;width:360px;box-shadow:0 32px 80px rgba(0,0,0,.6);animation:td-fadeUp .4s cubic-bezier(.16,1,.3,1) both; }
        .td-modal-title { font-family:'Instrument Serif',serif;font-size:22px;font-style:italic;margin-bottom:8px; }
        .td-modal-sub { font-size:13px;color:rgba(245,245,247,.5);margin-bottom:24px;line-height:1.6; }
        .td-modal-btns { display:flex;gap:10px; }
        .td-modal-cancel { flex:1;padding:12px;border-radius:11px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#f5f5f7;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:background .2s; }
        .td-modal-cancel:hover { background:rgba(255,255,255,.12); }
        .td-modal-confirm { flex:1;padding:12px;border-radius:11px;background:rgba(255,70,70,.15);border:1px solid rgba(255,70,70,.3);color:#ff6b6b;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s; }
        .td-modal-confirm:hover { background:rgba(255,70,70,.25); }

        /* Toast */
        .td-toast { position:fixed;top:24px;left:50%;transform:translateX(-50%) translateY(-90px);padding:11px 20px;border-radius:12px;font-size:13px;font-weight:500;backdrop-filter:blur(20px);z-index:999;transition:transform .4s cubic-bezier(.16,1,.3,1);white-space:nowrap;pointer-events:none; }
        .td-toast-err { background:rgba(255,70,70,.12);border:1px solid rgba(255,70,70,.3);color:#ff6b6b; }
        .td-toast-ok  { background:rgba(0,220,120,.12);border:1px solid rgba(0,220,120,.3);color:#34d399; }
        .td-toast-show { transform:translateX(-50%) translateY(0); }

        @media(max-width:700px) {
          .td-layout { grid-template-columns:1fr; }
          .td-exp-form { grid-template-columns:1fr; }
          .td-main { padding:28px 16px 80px; }
          .td-title { font-size:28px; }
        }
      `}</style>

      {/* Toast */}
      <div className={`td-toast td-toast-${toast.type} ${toast.show ? "td-toast-show" : ""}`}>
        {toast.message}
      </div>

      {/* Delete confirm modal */}
      {showDelete && (
        <div className="td-modal-overlay">
          <div className="td-modal">
            <div className="td-modal-title">Delete this trip?</div>
            <div className="td-modal-sub">
              This will permanently remove all expenses and payments. This action cannot be undone.
            </div>
            <div className="td-modal-btns">
              <button className="td-modal-cancel" onClick={() => setShowDelete(false)}>Cancel</button>
              <button className="td-modal-confirm" onClick={handleDeleteTrip}>Delete Trip</button>
            </div>
          </div>
        </div>
      )}

      <div className="td-root">
        <div className="td-grid-bg" />
        <div className="td-orb td-o1" />
        <div className="td-orb td-o2" />

        <Navbar />

        <main className="td-main">
          {/* Header */}
          <div className="td-header">
            <h1 className="td-title">Trip <span>Details.</span></h1>
            <button className="td-btn-delete" onClick={() => setShowDelete(true)}>
              🗑 Delete Trip
            </button>
          </div>

          <div className="td-layout">

            {/* MEMBERS */}
            <div className="td-card" style={{ animationDelay: ".14s" }}>
              <div className="td-card-header">
                <div className="td-card-title">Members</div>
                <span className="td-card-count">{members.length} people</span>
              </div>
              {members.map((m, i) => (
                <div key={m.id} className="td-member-row">
                  <div className="td-member-left">
                    <div className="td-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                      {m.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="td-member-name">{m.name}</div>
                      <div className="td-member-email">{m.email}</div>
                    </div>
                  </div>
                  <button className="td-btn-remove" onClick={() => removeMember(m.id)}>Remove</button>
                </div>
              ))}
              <div className="td-add-row">
                <input
                  className="td-search-input"
                  placeholder="Search by email…"
                  value={memberEmail}
                  onChange={e => searchUsers(e.target.value)}
                />
                <button className="td-btn-add-m" onClick={addMember}>+ Add</button>
                {suggestions.length > 0 && (
                  <div className="td-dropdown">
                    {suggestions.map(u => (
                      <div key={u.id} className="td-dropdown-item"
                        onClick={() => { setMemberEmail(u.email); setSuggestions([]); }}>
                        {u.email}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ADD EXPENSE */}
            <div className="td-card" style={{ animationDelay: ".20s" }}>
              <div className="td-card-header">
                <div className="td-card-title">Add Expense</div>
              </div>
              <div className="td-exp-form">
                <div>
                  <label className="td-label">Paid By</label>
                  <select className="td-select" value={paidBy} onChange={e => setPaidBy(e.target.value)}>
                    <option value="">Select payer</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="td-label">Amount (₹)</label>
                  <input className="td-input" type="number" placeholder="0.00" value={amount}
                    onChange={e => setAmount(e.target.value)} />
                </div>
                <div className="td-fl">
                  <label className="td-label">Description</label>
                  <input className="td-input" placeholder="What was this for?" value={desc}
                    onChange={e => setDesc(e.target.value)} />
                </div>
                <div className="td-fl">
                  <label className="td-label">Category</label>
                  <select className="td-select" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">Select category</option>
                    <option value="FOOD">🍔 Food</option>
                    <option value="PETROL">⛽ Petrol</option>
                    <option value="HOTEL">🏨 Hotel</option>
                    <option value="SHOPPING">🛍 Shopping</option>
                    <option value="OTHER">📦 Other</option>
                  </select>
                </div>
                <button className="td-btn-expense" onClick={addExpense}>+ Add Expense</button>
              </div>
            </div>

            {/* EXPENSES */}
            <div className="td-card td-full" style={{ animationDelay: ".26s" }}>
              <div className="td-card-header">
                <div className="td-card-title">Expenses</div>
                <span className="td-card-count">{expenses.length} entries</span>
              </div>
              {expenses.map(e => {
                const share = members.length > 0 ? (e.amount / members.length).toFixed(2) : 0;
                return (
                  <div key={e.id} className="td-exp-item">
                    <div className="td-exp-left">
                      <div className="td-exp-cat">{CAT_EMOJI[e.category] ?? "📦"}</div>
                      <div>
                        <div className="td-exp-desc">{e.desc || e.description}</div>
                        <div className="td-exp-payer">Paid by {getName(e.paidBy)}</div>
                      </div>
                    </div>
                    <div className="td-exp-right">
                      <div className="td-exp-amount">₹{Number(e.amount).toLocaleString("en-IN")}</div>
                      <div className="td-exp-share">Each: ₹{share}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PAYMENTS */}
            <div className="td-card td-full" style={{ animationDelay: ".32s" }}>
              <div className="td-card-header">
                <div className="td-card-title">Settlements</div>
                <span className="td-card-count">
                  {payments.filter(p => !p.paid).length > 0
                    ? `${payments.filter(p => !p.paid).length} pending`
                    : "All settled"}
                </span>
              </div>
              {payments.length === 0 ? (
                <div className="td-settled">
                  <div className="td-settled-icon">✅</div>
                  <div className="td-settled-text">All settled up!</div>
                  <div className="td-settled-sub">No pending payments in this trip.</div>
                </div>
              ) : payments.map(p => (
                <div key={p.id} className={`td-pay-item ${Number(p.fromUserId) === Number(userId) ? "owe" : "owed"}`}>
                  <div className="td-pay-row">
                    {Number(p.fromUserId) === Number(userId) ? (
                      <>
                        <span className="td-pay-text">You owe <b>{getName(p.toUserId)}</b></span>
                        <span className="td-pay-amount red">₹{Number(p.amount).toLocaleString("en-IN")}</span>
                      </>
                    ) : (
                      <>
                        <span className="td-pay-text"><b>{getName(p.fromUserId)}</b> owes you</span>
                        <span className="td-pay-amount green">₹{Number(p.amount).toLocaleString("en-IN")}</span>
                      </>
                    )}
                  </div>
                  {Number(p.fromUserId) === Number(userId) && !p.paid && (
                    <button className="td-btn-pay" onClick={() => payNow(p)}>Pay via Razorpay →</button>
                  )}
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </>
  );
}