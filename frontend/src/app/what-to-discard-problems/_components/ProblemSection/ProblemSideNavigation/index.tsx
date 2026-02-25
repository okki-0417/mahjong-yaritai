import CreateProblemButton from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemSideNavigation/CreateProblemButton";

export default function ProblemsSideNavigation() {
  return (
    <div className="bg-neutral rounded-sm">
      <p className="text-xl">何切る問題</p>

      <div className="mt-2">
        <ul>
          <li className="flex flex-col items-stretch">
            <CreateProblemButton />
          </li>
        </ul>
      </div>
    </div>
  );
}
