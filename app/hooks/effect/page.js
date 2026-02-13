"use client";
import { useEffect, useState, useRef } from "react";
export default function EffectPage() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log("useEffect");
  }, []);
  return (
    <div style={{ margin: "24px auto", width: "100px" }}>
      <div>Count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Add</button>
    </div>
  );
}
