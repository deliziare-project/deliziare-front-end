'use client'

import ChefPostView from "@/components/profiles/ChefPost";
import ChefProfileview from "@/components/profiles/ChefProfileview";
import { useRouter, useParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="bg-white min-h-screen">
      <button
        onClick={() => router.push('/user/chefs')}
        className="mb-4 text-sm text-[#B8755D] cursor-pointer flex items-center"
      >
        ← Back
      </button>

      <ChefProfileview chefId={id} />
      <ChefPostView chefId={id} />
    </div>
  );
};

export default Page;
