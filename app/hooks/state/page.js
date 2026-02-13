"use client";
import { useState } from "react";
export default function StatePage() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ margin: "48px auto", width: "max-content" }}>
      <div style={{ marginBottom: "24px" }}> 计数器：{count}</div>
      <button onClick={() => setCount(count + 1)}>Click: +1</button>
    </div>
  );
}
