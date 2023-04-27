import { useEffect, useState } from "react";
import PostDB from "../../../models/PostDB";
import { useAppSelector } from "../../../store";
import CommentCard from "../CommentCard/CommentCard";
import CommentCreator from "../CommentCreator/CommentCreator";
import CommentDB from "../../../models/CommentDB";
const CommentsSection: React.FC<{
    postId: string;
}> = (props) => {
    const userId = useAppSelector((state) => state.user.userId);
    const [comments, setComments] = useState<CommentDB[]>([]);
    useEffect(() => {
        const fetchComments = async () => {
            const fetchedComments = await PostDB.getCommentsByPostId(
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
                comments.map((comment) => (
                    <CommentCard
                        key={comment._id}
                        comment={comment}
                        postId={props.postId}
                    />
                ))}
        </div>
    );
};

export default CommentsSection;
