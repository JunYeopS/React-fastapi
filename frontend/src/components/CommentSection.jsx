import { useEffect, useState } from "react";
import "./CommentSection.css";

const BASE_URL = "http://127.0.0.1:8000";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadComments = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("댓글을 불러오지 못했습니다.");
      }

      const data = await res.json();
      setComments(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) loadComments();
  }, [postId]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          is_anonymous: isAnonymous,
        }),
      });

      if (!res.ok) {
        throw new Error("댓글 작성 실패");
      }

      setContent("");
      setIsAnonymous(false);
      loadComments();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <section className="comment-section">
      <h3>댓글</h3>

      {loading && <div className="comment-status">Loading...</div>}
      {error && <div className="comment-status error">{error}</div>}

      {!loading && comments.length === 0 && (
        <div className="comment-status">아직 댓글이 없습니다.</div>
      )}

      <ul className="comment-list">
        {comments.map((c) => (
          <li key={c.id} className="comment-item">
            <div className="comment-meta">
              <span className="comment-author">{c.author}</span>
              <span className="comment-date">
                {new Date(c.created_at).toLocaleString()}
              </span>
            </div>
            <div className="comment-content">{c.content}</div>
          </li>
        ))}
      </ul>

      <form className="comment-form" onSubmit={submitComment}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요"
          rows={3}
        />

        <div className="comment-form-footer">
          <label className="anonymous-check">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            익명으로 작성
          </label>

          <button type="submit">댓글 달기</button>
        </div>
      </form>
    </section>
  );
}

export default CommentSection;
