import { useEffect, useState } from "react";
import Post, { CommentResponse } from "../../../models/Post";
import { useAppSelector } from "../../../store";
import CommentCard from "../CommentCard/CommentCard";
import CommentCreator from "../CommentCreator/CommentCreator";
const CommentsSection: React.FC<{
    postId: string;
}> = (props) => {
    const userId = useAppSelector((state) => state.user.userId);
    const [comments, setComments] = useState<CommentResponse[]>([]);
    useEffect(() => {
        const fetchComments = async () => {
            const fetchedComments = await Post.getCommentsByPostId(
                props.postId
            );
            if (fetchedComments.ok) {
                setComments(fetchedComments.comments);
            }
        };
        fetchComments();
    }, []);
    return (
        <div>
            {userId && (
                <CommentCreator
                    setComments={setComments}
                    postId={props.postId}
                />
            )}
            {comments &&
                comments.map((comment) => <CommentCard comment={comment} />)}
        </div>
    );
};

export default CommentsSection;
