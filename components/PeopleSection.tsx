import { useState } from "react";
import { User } from "@/app/types";

export function PeopleSection({
  users,
  onAddUser,
}: {
  users: User[];
  onAddUser: (name: string) => void;
}) {
  const [name, setName] = useState("");

  return (
    <section className="space-y-4 border p-4 rounded-xl">
      <h2 className="font-bold text-4xl">1. Add People</h2>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button
          className="bg-purple-600 text-white px-4 rounded"
          onClick={() => {
            if (!name) return;
            onAddUser(name);
            setName("");
          }}
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {users.map(u => (
          <span key={u.id} className="border px-3 py-1 rounded-full text-sm">
            {u.name}
          </span>
        ))}
      </div>
    </section>
  );
}