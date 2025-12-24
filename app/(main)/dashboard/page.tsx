import { fetchAccountList } from "@/actions/dashboard";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import AccountCards from "./_components/AccountCards";

const DashboardPage = async () => {
  const { data: accountsList, success, message } = await fetchAccountList();
  return (
    <div className="px-5">
      {/* BUDGET PROGRESS */}

      {/* OVERVIEW */}
      {/* ACCOUNTS GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
        {accountsList && accountsList?.length > 0 ? (
          accountsList.map((item, idx) => {
            console.log(item);
            return <AccountCards key={idx} account={item} />;
          })
        ) : (
          <>No card found</>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
