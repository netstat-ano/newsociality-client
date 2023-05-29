import { useEffect, useState } from "react";
import PostDB from "../../../models/PostDB";
import { useAppSelector } from "../../../store";
import CommentCard from "../CommentCard/CommentCard";
import CommentCreator from "../CommentCreator/CommentCreator";
import CommentDB from "../../../models/CommentDB";
import useAlert from "../../../hooks/use-alert";
import ModalPortal from "../../Modal/Modal";
const CommentsSection: React.FC<{
    postId: string;
}> = (props) => {
    const userId = useAppSelector((state) => state.user.userId);
    const [comments, setComments] = useState<CommentDB[]>([]);
    const [alertText, setAlertText, stop] = useAlert(2000);
    useEffect(() => {
        const fetchComments = async () => {
            const fetchedComments = await PostDB.getCommentsByPostId(
                props.postId
            );
            if (fetchedComments.ok) {
                setComments(fetchedComments.comments);
            } else {
                setAlertText(fetchedComments.message);
            }
        };
        fetchComments();
    }, []);
    return (
        <div>
            {alertText && (
                <ModalPortal colorsScheme="error">{alertText}</ModalPortal>
            )}
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
