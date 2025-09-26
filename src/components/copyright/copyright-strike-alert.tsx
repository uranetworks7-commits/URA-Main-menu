
'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { CopyrightStrike } from "@/lib/types";

interface CopyrightStrikeAlertProps {
    strikes: CopyrightStrike[];
}

export function CopyrightStrikeAlert({ strikes }: CopyrightStrikeAlertProps) {
    const strikeCount = strikes.length;

    if (strikeCount === 0) return null;

    let title = `You have ${strikeCount} active copyright strike${strikeCount > 1 ? 's' : ''}.`;
    let description = `Another strike will result in further penalties. Strikes expire 7 days after being issued. Be careful.`;

    if (strikeCount >= 3) {
        title = "You have received 3 copyright strikes.";
        description = "Your account is scheduled for termination in 3 days. All strikes are now permanent.";
    }

    return (
        <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                {description}
            </AlertDescription>
        </Alert>
    );
}
