import { Navbar } from '@/components/navbar';
import Solution from '@/components/Solution';
import { solutionsData, solutionPageData } from '@/data/solutions';

export const dynamic = 'force-static';

export default function SolutionPage() {
  return (
    <>
      <Navbar />
      <Solution
        solutions={solutionsData}
        page={solutionPageData}
      />
    </>
  );
}
