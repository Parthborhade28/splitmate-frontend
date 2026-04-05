import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function TripDetails() {
  const { id } = useParams();

  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);

  const [memberEmail, setMemberEmail] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  const fetchMembers = async () => {
    try {
      const res = await API.get("/trips/" + id + "/members");
      if (Array.isArray(res.data)) {
        setMembers(res.data);
      } else {
        setMembers([]);
      }
    } catch (e) {
      setMembers([]);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses/" + id);
      if (Array.isArray(res.data)) {
        setExpenses(res.data);
      } else {
        setExpenses([]);
      }
    } catch (e) {
      setExpenses([]);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await API.get("/payments/" + id);
      if (Array.isArray(res.data)) {
        setPayments(res.data);
      } else {
        setPayments([]);
      }
    } catch (e) {
      setPayments([]);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchExpenses();
    fetchPayments();
  }, [id]);

  const addMember = async () => {
    try {
      const user = await API.get("/users/by-email?email=" + memberEmail);
      await API.post("/trips/" + id + "/add-member?userId=" + user.data.id);
      setMemberEmail("");
      fetchMembers();
    } catch (e) {
      alert("Error adding member");
    }
  };

  const addExpense = async () => {
    try {
      if (paidBy === "" || amount === "" || desc === "") {
        alert("Fill all fields");
        return;
      }

      await API.post(
        "/expenses?tripId=" +
          id +
          "&paidBy=" +
          paidBy +
          "&amount=" +
          amount +
          "&desc=" +
          desc
      );

      setAmount("");
      setDesc("");

      fetchExpenses();
      fetchPayments();
    } catch (e) {
      alert("Error adding expense");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Trip Details</h1>

      <h2>Members</h2>
      {members.length === 0 ? (
        <p>No members</p>
      ) : (
        members.map((m) => (
          <div key={m.id}>
            {m.name} ({m.email})
          </div>
        ))
      )}

      <input
        value={memberEmail}
        onChange={(e) => setMemberEmail(e.target.value)}
        placeholder="Enter email"
      />
      <button onClick={addMember}>Add Member</button>

      <h2>Add Expense</h2>

      <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
        <option value="">Select payer</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />

      <input
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Description"
      />

      <button onClick={addExpense}>Add Expense</button>

      <h2>Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses</p>
      ) : (
        expenses.map((e) => (
          <div key={e.id}>
            {e.desc} - ₹{e.amount}
          </div>
        ))
      )}

      <h2>Payments</h2>
      {payments.length === 0 ? (
        <p>No payments</p>
      ) : (
        payments.map((p) => (
          <div key={p.id}>
            {p.fromUserId} → {p.toUserId} : ₹{p.amount}
          </div>
        ))
      )}
    </div>
  );
}

export default TripDetails;