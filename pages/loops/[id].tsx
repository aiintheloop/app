import { getLoopsApprovals } from '@/utils/supabase-client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Approval } from 'types';

export default function LoopApprovalsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [approvals, setApprovals] = useState<Approval[] | null>(null);

  useEffect(() => {
    async function fetchApprovals() {
      const dataApprovals = await getLoopsApprovals(id as string);
      setApprovals(dataApprovals);
    }
    if (id) fetchApprovals();
  }, [id]);

  return (
    <section className="bg-zinc-50 mb-32">
      <div className="max-w-6xl mx-auto pt-4 sm:pt-12 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-black sm:text-center sm:text-6xl">
            Approvals
          </h1>
        </div>
      </div>

      <div className="p-4 pt-8 sm:pt-20"></div>
    </section>
  );
}
