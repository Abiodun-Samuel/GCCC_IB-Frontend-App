import TimelineItem from "@/components/dashboard/timeline/TimelineItem";

const TimelineContainer = ({ data }) => (
    <div className="relative">
        <div className="space-y-6">
            {data?.map((item) => (
                <TimelineItem key={item.id} item={item} />
            ))}
        </div>
    </div>
);

export default TimelineContainer;
