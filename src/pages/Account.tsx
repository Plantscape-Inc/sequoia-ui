import React from "react";
import { Button, Card } from "flowbite-react";
import type { GoogleUserInfo } from "../types/auth.type";

interface AccountProps {
    user: GoogleUserInfo | null;
    setUser: React.Dispatch<React.SetStateAction<GoogleUserInfo | null>>;
}

export default function Account({ user, setUser }: AccountProps) {

    function login() {
        window.location.href = `${import.meta.env.VITE_AUTH_API_URL}/login`;
    }

    function logout() {
        localStorage.removeItem("auth_token");
        setUser(null);
    }

    return (
        <div className="flex flex-col items-center p-6">
            <div className="w-full max-w-md">
                <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                        User Portal
                    </h2>

                    {user ? (
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                                Welcome, {user.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{user.email}</p>
                            <Button onClick={logout} fullSized>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={login} fullSized>
                            Login with Google
                        </Button>
                    )}
                </Card>
            </div>
        </div>
    );
}
