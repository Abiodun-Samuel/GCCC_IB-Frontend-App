import ServiceAttendance from "@/components/attendance-records/ServiceAttendance"
import ComponentCard from "@/components/common/ComponentCard"
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import PageMeta from "@/components/common/PageMeta"
import { useHasUnit } from "@/hooks/useUnitPermission"
import { Units } from "@/utils/constant"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const ServiceAttendancePage = () => {
    const navigate = useNavigate();
    const hasUshering = useHasUnit(Units.USHERING);

    useEffect(() => {
        if (hasUshering === false) {
            navigate('/dashboard', { replace: true });
        }
    }, [hasUshering, navigate]);

    if (hasUshering !== true) return null;

    return (
        <>
            <PageMeta title="Attendance Records | GCCC Ibadan" />
            <PageBreadcrumb pageTitle="Attendance Records" description={''} />
            <ComponentCard>
                <ServiceAttendance />
            </ComponentCard>
        </>
    )
}

export default ServiceAttendancePage