"use client";

import { useEffect, useState } from "react";

const API = "http://localhost:3001";

interface User { id: string; name: string; }
interface Expense { id: string; description: string; totalAmount: number; }

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [paidBy, setPaidBy] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const [uRes, eRes] = await Promise.all([
        fetch(`${API}/users`),
        fetch(`${API}/expenses`)
      ]);
      setUsers(await uRes.json());
      setExpenses(await eRes.json());
    } catch (e) { console.error("Fetch error:", e); }
  };

  useEffect(() => { fetchData(); }, []);

  const createUser = async () => {
    if (!name) return;
    await fetch(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    fetchData();
  };

  const addExpense = async () => {
    if (!desc || !amount || !paidBy || !participants.length) return;
    await fetch(`${API}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: desc, totalAmount: Number(amount), paidBy, participants }),
    });
    setDesc(""); setAmount(""); setPaidBy(""); setParticipants([]);
    fetchData();
    showBalances();
  };

  const showBalances = async () => {
    const res = await fetch(`${API}/expenses/balances`);
    setBalances(await res.json());
  };

  const toggleParticipant = (id: string) => {
    setParticipants(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  return (
    // Forced white background and slate text for visibility
    <main className="min-h-screen bg-white text-slate-900 max-w-2xl mx-auto p-8 space-y-10 font-sans">
      <h1 className="text-4xl font-extrabold text-center tracking-tight text-slate-900">
        SplitEase
      </h1>

      {/* User Creation */}
      <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold mb-4 text-slate-800">1. Add People</h2>
        <div className="flex gap-2 mb-4">
          <input 
            className="border border-slate-300 p-2 rounded-lg flex-1 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          <button onClick={createUser} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {users.map(u => (
            <span key={u.id} className="bg-white border border-slate-200 px-3 py-1 rounded-full text-sm font-medium text-slate-700 shadow-sm">
              {u.name}
            </span>
          ))}
        </div>
      </section>

      {/* Expense Form */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-800">2. Add Expense</h2>
        <input 
          className="border border-slate-300 p-2 w-full rounded-lg bg-white text-slate-900" 
          placeholder="What was it for?" 
          value={desc} 
          onChange={e => setDesc(e.target.value)} 
        />
        <input 
          type="number" 
          className="border border-slate-300 p-2 w-full rounded-lg bg-white text-slate-900" 
          placeholder="Total Amount" 
          value={amount} 
          onChange={e => setAmount(e.target.value === "" ? "" : Number(e.target.value))} 
        />
        
        <select 
          className="border border-slate-300 p-2 w-full rounded-lg bg-white text-slate-900" 
          value={paidBy} 
          onChange={e => setPaidBy(e.target.value)}
        >
          <option value="" className="text-slate-500">Who paid?</option>
          {users.map(u => <option key={u.id} value={u.id} className="text-slate-900">{u.name}</option>)}
        </select>

        <div>
          <p className="text-sm font-semibold mb-2 text-slate-700">Split amongst:</p>
          <div className="grid grid-cols-2 gap-2">
            {users.map(u => (
              <label key={u.id} className="flex items-center gap-2 cursor-pointer p-2 border border-slate-100 rounded-lg hover:bg-slate-50 text-slate-800">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300" checked={participants.includes(u.id)} onChange={() => toggleParticipant(u.id)} />
                {u.name}
              </label>
            ))}
          </div>
        </div>

        <button onClick={addExpense} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-opacity">
          Add Expense
        </button>
      </section>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="border border-slate-200 p-5 rounded-xl bg-white">
          <h2 className="font-bold mb-3 border-b border-slate-100 pb-2 text-slate-800">Recent Activity</h2>
          <div className="space-y-2">
            {expenses.map(e => (
              <div key={e.id} className="text-sm py-1 text-slate-600 flex justify-between">
                <span>💰 {e.description}</span>
                <span className="font-mono font-bold text-slate-900">₹{e.totalAmount}</span>
              </div>
            ))}
          </div>
        </section>
        
        <section className="border border-green-200 p-5 rounded-xl bg-green-50">
          <h2 className="font-bold mb-3 border-b border-green-200 pb-2 text-green-800">Final Settlements</h2>
          <button onClick={showBalances} className="text-xs text-green-700 underline mb-3 hover:text-green-900">
            Refresh Balances
          </button>
          <div className="space-y-1">
            {balances.map((b, i) => (
              <div key={i} className="text-sm font-medium text-green-900 flex items-start gap-2">
                <span className="mt-1">✓</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}