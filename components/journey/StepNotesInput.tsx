"use client";
import { useState } from "react";

export default function StepNotesInput({ defaultValue }: { defaultValue: string }) {
  const [userInput, setUserInput] = useState(defaultValue);
  return (
    <textarea
      name="inputContent"
      className="textarea textarea-bordered w-full h-48 bg-slate-700"
      placeholder="Jot down your thoughts, research findings, and next steps..."
      value={userInput}
      onChange={e => setUserInput(e.target.value)}
    />
  );
}
