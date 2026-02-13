"use client";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  const jumpToPage = (url) => {
    router.push(url);
  };
  const arr = [
    { text: "State Hooks", link: "/hooks/state" },
    { text: "Effect Hooks", link: "/hooks/effect" },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "max-content",
        margin: "auto",
      }}
    >
      {arr.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => jumpToPage(item.link)}
            style={{ cursor: "pointer", margin: "10px 0", color: "#1890ff" }}
          >
            {item.text}
          </div>
        );
      })}
    </div>
  );
}
