import { Layout } from "@/components/Layout";

const MyTasks = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <p className="text-muted-foreground">Your assigned tasks will appear here.</p>
      </div>
    </Layout>
  );
};

export default MyTasks;
