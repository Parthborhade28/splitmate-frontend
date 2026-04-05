import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const CAT_EMOJI = { FOOD:"🍔", PETROL:"⛽", HOTEL:"🏨", SHOPPING:"🛍", OTHER:"📦" };

export default function History() {

  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [toast, setToast] = useState({ show:false, message:"", type:"ok" });

  const userId = parseInt(localStorage.getItem("userId"));

  const showToast = (message, type="ok") => {
    setToast({ show:true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show:false })), 3000);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const expRes = await API.get(`/expenses/user/${userId}`);
      const payRes = await API.get(`/payments/user/${userId}`);

      setExpenses(Array.isArray(expRes.data) ? expRes.data : []);
      setPayments(Array.isArray(payRes.data) ? payRes.data : []);

    } catch (err) {
      console.error(err);
      showToast("Failed to load history ✕", "err");
    }
  };

  return (
    <>
      <style>{`
        .hs-root { min-height:100vh; background:#050508; color:#f5f5f7; }

        .hs-main { max-width:1100px; margin:0 auto; padding:48px 32px 100px; }

        .hs-title {
          font-family:'Instrument Serif',serif;
          font-size:38px;
          font-style:italic;
          margin-bottom:32px;
        }

        .hs-card {
          background:rgba(255,255,255,.045);
          border:1px solid rgba(255,255,255,.10);
          border-radius:20px;
          padding:24px;
          backdrop-filter:blur(30px);
          margin-bottom:20px;
        }

        .hs-header {
          display:flex;
          justify-content:space-between;
          margin-bottom:18px;
        }

        .hs-label {
          font-size:12px;
          letter-spacing:.08em;
          color:rgba(245,245,247,.45);
          text-transform:uppercase;
        }

        .hs-count {
          font-size:11px;
          background:rgba(255,255,255,.06);
          padding:4px 10px;
          border-radius:20px;
        }

        .hs-item {
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:14px;
          border-radius:12px;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.07);
          margin-bottom:8px;
          transition:.2s;
        }

        .hs-item:hover { background:rgba(255,255,255,.07); }

        .hs-left { display:flex; gap:12px; align-items:center; }

        .hs-icon {
          width:36px; height:36px;
          display:flex; align-items:center; justify-content:center;
          border-radius:10px;
          background:rgba(41,151,255,.12);
          font-size:16px;
        }

        .hs-desc { font-size:14px; }
        .hs-sub { font-size:11px; color:rgba(245,245,247,.45); }

        .hs-amount { font-weight:600; }

        .hs-red { color:#ff6b6b; }
        .hs-green { color:#34d399; }

        .hs-badge {
          font-size:11px;
          padding:4px 10px;
          border-radius:20px;
        }

        .hs-paid { background:rgba(52,211,153,.15); color:#34d399; }
        .hs-pending { background:rgba(255,70,70,.15); color:#ff6b6b; }

        .hs-empty {
          text-align:center;
          padding:40px;
          color:rgba(245,245,247,.4);
        }

        .hs-toast {
          position:fixed;
          top:20px;
          left:50%;
          transform:translateX(-50%) translateY(-80px);
          padding:10px 20px;
          border-radius:10px;
          transition:.4s;
        }

        .hs-toast-show { transform:translateX(-50%) translateY(0); }
        .hs-toast-ok { background:rgba(0,200,120,.2); }
        .hs-toast-err { background:rgba(255,70,70,.2); }

      `}</style>

      {/* 🔥 Toast */}
      <div className={`hs-toast hs-toast-${toast.type} ${toast.show ? "hs-toast-show" : ""}`}>
        {toast.message}
      </div>

      <div className="hs-root">

        <Navbar />

        <div className="hs-main">

          <h1 className="hs-title">History 📊</h1>

          {/* EXPENSES */}
          <div className="hs-card">

            <div className="hs-header">
              <span className="hs-label">Expenses</span>
              <span className="hs-count">{expenses.length}</span>
            </div>

            {expenses.length === 0 ? (
              <div className="hs-empty">No expenses yet</div>
            ) : expenses.map(e => (
              <div key={e.id} className="hs-item">

                <div className="hs-left">
                  <div className="hs-icon">
                    {CAT_EMOJI[e.category] || "📦"}
                  </div>

                  <div>
                    <div className="hs-desc">
                      {e.description || "No description"}
                    </div>
                    <div className="hs-sub">
                      Trip #{e.tripId}
                    </div>
                  </div>
                </div>

                <div className="hs-amount">
                  ₹{Number(e.amount).toLocaleString("en-IN")}
                </div>

              </div>
            ))}

          </div>

          {/* PAYMENTS */}
          <div className="hs-card">

            <div className="hs-header">
              <span className="hs-label">Payments</span>
              <span className="hs-count">{payments.length}</span>
            </div>

            {payments.length === 0 ? (
              <div className="hs-empty">No payments yet</div>
            ) : payments.map(p => (
              <div key={p.id} className="hs-item">

                <div>
                  {Number(p.fromUserId) === Number(userId) ? (
                    <div className="hs-red">
                      You owe ₹{p.amount}
                    </div>
                  ) : (
                    <div className="hs-green">
                      You get ₹{p.amount}
                    </div>
                  )}
                </div>

                <span className={`hs-badge ${p.paid ? "hs-paid" : "hs-pending"}`}>
                  {p.paid ? "Paid" : "Pending"}
                </span>

              </div>
            ))}

          </div>

        </div>
      </div>
    </>
  );
}