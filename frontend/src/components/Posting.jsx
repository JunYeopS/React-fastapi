import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Posting.css";

const BASE_URL = "http://127.0.0.1:8000";

function Posting() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const createPost = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력하세요.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/posts/posting`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Posting failed");
        return;
      }

      // 작성 성공 → 목록으로 이동
      navigate("/");
    } catch (e) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    navigate(-1);
  };

  return (
    <div className="posting-page">
      <h2>새 글 작성</h2>

      <div className="form-group">
        <label>제목</label>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>내용</label>
        <textarea
          placeholder="내용을 입력하세요"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="posting-actions">
        <button
          type="button"
          className="primary-button"
          onClick={createPost}
          disabled={loading}
        >
          {loading ? "Posting..." : "Submit"}
        </button>
        <button type="button" className="secondary-button" onClick={close} disabled={loading}>
          돌아가기
        </button>
      </div>
    </div>
  );
}

export default Posting;
