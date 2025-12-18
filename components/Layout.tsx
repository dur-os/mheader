import { ReactNode } from "react";

interface LayoutProps {
    sidebar: ReactNode;
    children: ReactNode;
    isDisabled?: boolean;
    onEnable?: () => void;
}

export const Layout = ({ sidebar, children, isDisabled, onEnable }: LayoutProps) => {
    return (
        <div className="flex w-[780px] h-[600px] bg-background text-foreground overflow-hidden">
            <aside className="w-16 flex-none border-r border-divider bg-content1 flex flex-col items-center py-4 gap-4 z-20 shadow-sm">
                {sidebar}
            </aside>
            <main className="flex-1 min-w-0 flex flex-col h-full bg-background relative">
                {children}

                {isDisabled && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                        <div className="bg-danger-50 border-danger-200 border px-6 py-4 rounded-xl shadow-lg flex flex-col items-center gap-3 max-w-sm text-center">
                            <div className="text-danger font-semibold text-lg">Extension Disabled</div>
                            <p className="text-danger-600 text-sm">
                                Modification rules are currently inactive.
                            </p>
                            <button
                                onClick={onEnable}
                                className="px-4 py-2 bg-danger text-white rounded-lg font-medium hover:bg-danger-600 transition-colors shadow-md active:scale-95"
                            >
                                Enable Extension
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
