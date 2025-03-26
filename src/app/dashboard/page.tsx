import { auth } from "@/auth";
import { redirect } from "next/navigation";
// import LogoutButton from "./logout-button";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome {session.user?.email}</h1>
          {/* <LogoutButton /> */}
        </div>

        <pre className="bg-gray-50 p-4 rounded-md">
          {JSON.stringify(session.user.email, null, 2)}
          {JSON.stringify(session.user.roles, null, 2)}
        </pre>
      </div>
    </div>
  );
}
