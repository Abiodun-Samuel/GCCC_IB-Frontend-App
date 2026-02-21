import AttendanceRecords from "@/components/attendance-records/UsherAttendanceRecords"
import ComponentCard from "@/components/common/ComponentCard"
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import PageMeta from "@/components/common/PageMeta"

const LeadersAttendanceRecordsPage = () => {
    return (
        <>
            <PageMeta title="Leaders: Attendance Records | GCCC Ibadan" />
            <PageBreadcrumb pageTitle="Leaders: Attendance Records" description={''} />
            <ComponentCard>
                <AttendanceRecords />
            </ComponentCard>
        </>
    )
}

export default LeadersAttendanceRecordsPage