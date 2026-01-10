import { EmptyState } from "@/components/common/EmptyState";
import TimelineContainer from "@/components/dashboard/timeline/TimelineContainer";
import TimelineHeader from "@/components/dashboard/timeline/TimelineHeader";
import { TimelineSkeletonLoader } from "@/components/skeleton";
import { ClockIcon } from "@/icons";
import {
    useGetFollowUpsByFirstTimer,
    useGetFollowUpsByMember,
} from "@/queries/followupFeedback.query";
import { useParams } from "react-router-dom";

const SUBJECT_TYPES = {
    MEMBERS: "members",
    FIRST_TIMER: "first_timer",
};

const EMPTY_STATE_CONFIG = {
    icon: <ClockIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />,
    title: "No timeline entries yet",
    description:
        "Timeline entries will appear here as they are created. Start by adding your first activity.",
};

const FeedbackTimeline = () => {
    const { memberId, firstTimerId } = useParams();

    const subject_type = memberId
        ? SUBJECT_TYPES.MEMBERS
        : SUBJECT_TYPES.FIRST_TIMER;

    const subject_id = memberId ?? firstTimerId;

    // Map subject type to the corresponding query hook
    const queryHooks = {
        [SUBJECT_TYPES.MEMBERS]: useGetFollowUpsByMember,
        [SUBJECT_TYPES.FIRST_TIMER]: useGetFollowUpsByFirstTimer,
    };

    const useActiveQuery =
        queryHooks[subject_type] || useGetFollowUpsByFirstTimer;

    const { data: timelineData = [], isLoading } = useActiveQuery(subject_id);

    if (isLoading) {
        return <TimelineSkeletonLoader />;
    }

    const hasTimelineData = timelineData.length > 0;

    return (
        <div className="max-w-4xl mx-auto w-full py-5 transition-colors duration-300">
            <TimelineHeader />

            {hasTimelineData ? (
                <TimelineContainer data={timelineData} />
            ) : (
                <EmptyState {...EMPTY_STATE_CONFIG} />
            )}
        </div>
    );
};

export default FeedbackTimeline;
