import {AlertCircle} from "lucide-react"

import {Alert, AlertDescription, AlertTitle} from "./alert.tsx"

interface AlertDestructiveProps {
    title: string,
    description: string
}

export function AlertDestructive(props: AlertDestructiveProps): JSX.Element {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4"/>
            <AlertTitle>{props.title}</AlertTitle>
            <AlertDescription>
                {props.description}
            </AlertDescription>
        </Alert>
    )
}
