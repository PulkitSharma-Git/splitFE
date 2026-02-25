import { useState } from "react";
import { User, Expense } from "@/app/types";

export function ExpenseSection({
  users,
  expenses,
  balances,
  onAddExpense,
  onRefreshBalances,
}: {
  users: User[];
  expenses: Expense[];
  balances: string[];
  onAddExpense: (data: any) => void;
  onRefreshBalances: () => void;
}) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [paidBy, setPaidBy] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);

  const toggleParticipant = (id: string) => {
    setParticipants(p =>
      p.includes(id) ? p.filter(x => x !== id) : [...p, id]
    );
  };

  return (
    <section className="border p-4 rounded-xl space-y-6">
      <h2 className="font-bold text-4xl">2. Add Expense</h2>

      <input
        className="border p-2 w-full"
        placeholder="Description"
        value={desc}
        onChange={e => setDesc(e.target.value)}
      />

      <input
        type="number"
        className="border p-2 w-full"
        placeholder="Amount"
        value={amount}
        onChange={e =>
          setAmount(e.target.value === "" ? "" : Number(e.target.value))
        }
      />

      <select
        className="bg-black border p-2 w-full"
        value={paidBy}
        onChange={e => setPaidBy(e.target.value)}
      >
        <option value="">Who paid?</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      <div>
        <p className="font-semibold mb-1">Split amongst:</p>
        {users.map(u => (
          <label key={u.id} className="block">
            <input
              type="checkbox"
              checked={participants.includes(u.id)}
              onChange={() => toggleParticipant(u.id)}
            />{" "}
            {u.name}
          </label>
        ))}
      </div>

      <button
        className="bg-slate-900 text-white px-4 py-2 rounded"
        onClick={() =>
          onAddExpense({
            description: desc,
            totalAmount: amount,
            paidBy,
            participants,
          })
        }
      >
        Add Expense
      </button>

      <div>
        <h3 className="font-bold mt-4">Recent Activity</h3>
        {expenses.map(e => (
          <div key={e.id}>
            {e.description} — ₹{e.totalAmount}
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-bold mt-4">Final Settlements</h3>
        <button
          onClick={onRefreshBalances}
          className="underline text-sm"
        >
          Refresh Balances
        </button>
        {balances.map((b, i) => (
          <div key={i}>{b}</div>
        ))}
      </div>
    </section>
  );
}