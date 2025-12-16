import { useEffect, useState } from "react";
import './PostingLists.css'

const BASE_URL = "http://127.0.0.1:8000";

const DEFAULT_LIMIT = 10;

function PostingLists(){
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [limit] = useState(DEFAULT_LIMIT);
    const [page, setPage] = useState(0); // 0-based
    const [total, setTotal] = useState(0);

    const get_postings = async (nextPage = page) => {
        setLoading(true);
        setError(null);

        try {
            const offset = nextPage * limit;
            const params = new URLSearchParams({
                limit: String(limit),
                offset: String(offset),
            });

            const res = await fetch(`${BASE_URL}/posts/?${params.toString()}`, {
                method : "GET",
                credentials: "include",
            });
            
            if (!res.ok) {
                let message = "Get Posting Failed";
                try {
                    const err = await res.json();
                    message = err.detail || message;
                } catch {
                    // ignore non-json
                }
                throw new Error(message);
            }

            const data = await res.json();
            setPosts(data.items ?? []);
            setTotal(data.total ?? 0);
            setPage(nextPage);
        } catch (e){
            setError(e?.message || "Network error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        get_postings(0);
    }, [limit]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const canPrev = page > 0;
    const canNext = page + 1 < totalPages;

    if (loading) {
        return <div className="post-list">Loading...</div>;
    }

    if (error) {
        return (
            <div className="post-list">
                <div>{error}</div>
                <button type="button" onClick={() => get_postings(page)}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="post-list">
                {posts.length === 0 ? (
                    <div>No posts yet</div>
                ) : (
                    posts.map((post) => (
                        <div className="post-card" key={post.id}>
                            <h3 className="post-title">{post.title}</h3>
                            <p className="post-content">{post.content}</p>

                            <div className="post-meta">
                                <span>작성자: {post.author}</span>
                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="pagination">
                <button type="button" disabled={!canPrev} onClick={() => get_postings(page - 1)}>
                    Prev
                </button>
                <span className="pagination__info">
                    {page + 1} / {totalPages}
                </span>
                <button type="button" disabled={!canNext} onClick={() => get_postings(page + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default PostingLists;
