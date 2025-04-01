import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import LoginPage from "@/pages/LoginPage";
import OtpPage from "@/pages/OtpPage";
import VerifyCustomerPage from "@/pages/VerifyCustomerPage";
import VerifyPanPage from "@/pages/VerifyPanPage";
import VerifyAccountPage from "@/pages/VerifyAccountPage";
import CompletionPage from "@/pages/CompletionPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/otp" component={OtpPage} />
      <Route path="/verify-customer" component={VerifyCustomerPage} />
      <Route path="/verify-pan" component={VerifyPanPage} />
      <Route path="/verify-account" component={VerifyAccountPage} />
      <Route path="/completion" component={CompletionPage} />
      <Route path="/admin" component={AdminLoginPage} />
      <Route path="/admin/dashboard" component={AdminDashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
