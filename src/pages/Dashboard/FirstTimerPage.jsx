import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import AdminFirstTimersTable from '@/components/admin/firsttimer/AdminFirstTimersTable';
import Button from '@/components/ui/Button';
import { Units } from '@/utils/constant';
import { useHasUnit } from '@/hooks/useUnitPermission';

const FirstTimerPage = () => {
    const navigate = useNavigate();
    const hasFollowUp = useHasUnit(Units.FOLLOW_UP);

    useEffect(() => {
        if (hasFollowUp === false) {
            navigate('/dashboard', { replace: true });
        }
    }, [hasFollowUp, navigate]);

    if (hasFollowUp !== true) return null;

    return (
        <>
            <PageMeta title="First Timers | GCCC Ibadan" />
            <PageBreadcrumb
                pageTitle="First Timers"
                description="Log, track, and manage all first timer's records, follow-up process and assign care tasks."
            />
            <ComponentCard>
                <Button variant="outline-primary" href="/first-timer/welcome">
                    First Timer Welcome Page
                </Button>
                <AdminFirstTimersTable />
            </ComponentCard>
        </>
    );
};

export default FirstTimerPage;