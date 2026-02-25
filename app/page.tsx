"use client";

import { useEffect, useState } from "react";
import { User, Expense } from "./types";
import { Header } from "@/components/Header";
import { PeopleSection } from "@/components/PeopleSection";
import { ExpenseSection } from "@/components/ExpenseSection";

const API = "https://splitbe-f98v.onrender.com/";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<string[]>([]);

  const fetchUsers = async () => {
    const res = await fetch(`${API}/users`);
    setUsers(await res.json());
  };

  const fetchExpenses = async () => {
    const res = await fetch(`${API}/expenses`);
    setExpenses(await res.json());
  };

  const fetchBalances = async () => {
    const res = await fetch(`${API}/expenses/balances`);
    setBalances(await res.json());
  };

  const createUser = async (name: string) => {
    await fetch(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    fetchUsers();
  };

  const createExpense = async (data: any) => {
    await fetch(`${API}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchExpenses();
  };

  useEffect(() => {
    fetchUsers();
    fetchExpenses();
  }, []);

  return (
    <main className="p-8 space-y-8 max-w-5xl mx-auto">
      <Header />

      <PeopleSection users={users} onAddUser={createUser} />

      <ExpenseSection
        users={users}
        expenses={expenses}
        balances={balances}
        onAddExpense={createExpense}
        onRefreshBalances={fetchBalances}
      />
    </main>
  );
}
