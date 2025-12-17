import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PostDetail.css";

const BASE_URL = "http://127.0.0.1:8000";

function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);
      setPost(null);

      try {
        const res = await fetch(`${BASE_URL}/posts/${postId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          let message = "Failed to load post";
          try {
            const err = await res.json();
            message = err.detail || message;
          } catch {
            // ignore non-json
          }
          throw new Error(message);
        }

        const data = await res.json();
        setPost(data);
      } catch (e) {
        if (e?.name === "AbortError") return;
        setError(e?.message || "Network error");
      } finally {
        setLoading(false);
      }
    };

    if (postId) load();

    return () => controller.abort();
  }, [postId]);

  const author =
    typeof post?.author === "string" ? post.author : post?.author?.username ?? "";

  return (
    <div className="post-detail-page">
      <div className="post-detail-actions">
        <button type="button" className="secondary-button" onClick={() => navigate(-1)}>
          돌아가기
        </button>
        <button type="button" className="secondary-button" onClick={() => navigate("/")}>
          목록
        </button>
      </div>

      {loading ? (
        <div className="post-detail__status">Loading...</div>
      ) : error ? (
        <div className="post-detail__status">
          <div>{error}</div>
        </div>
      ) : !post ? (
        <div className="post-detail__status">Post not found</div>
      ) : (
        <article className="post-detail-card">
          <h2 className="post-detail-title">{post.title}</h2>
          <div className="post-detail-meta">
            <span>작성자: {author}</span>
            <span>{new Date(post.created_at).toLocaleString()}</span>
          </div>
          <div className="post-detail-content">{post.content}</div>
        </article>
      )}
    </div>
  );
}

export default PostDetail;
