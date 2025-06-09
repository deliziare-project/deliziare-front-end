import AuthWrapper from "@/components/AuthWrapper";
import ChefPostForm from "@/components/chef/post/chefPost";
import { useSelector } from "react-redux";


export default function ChefPostPage() {
  
  return (
    <div className="p-4">
      <AuthWrapper routeType="private">
      <ChefPostForm  />
      </AuthWrapper>
    </div>
  );
}
