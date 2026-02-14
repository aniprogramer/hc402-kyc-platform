"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import Camera from "./Camera";
import FileUpload from "./FileUpload";
import {Progress} from "@/components/ui/progress";

export default function OnboardingWizard() {
    const [step, setStep] = useState(1);
    const router = useRouter();

    async function handleSubmit() {
        // Later: call /api/upload
        router.push("/dashboard");
    }

    return (
        <Card className="max-w-md mx-auto">

            <CardHeader>
                <h2 className="text-lg font-semibold">Step {step} of 3</h2>
                <Progress value={(step / 3) * 100} className="mt-2" />
            </CardHeader>
            <CardContent>
                {step === 1 && <FileUpload/>}
                {step === 2 && <Camera/>}
                {step === 3 && <p>Review & Submit</p>}
            </CardContent>
            <CardFooter className="flex justify-between">
                {step > 1 && (
                    <Button variant="outline" onClick={() => setStep(step - 1)}>
                        Back
                    </Button>
                )}
                {step < 3 ? (
                    <Button onClick={() => setStep(step + 1)}>Next</Button>
                ) : (
                    <Button onClick={handleSubmit}>Submit</Button>
                )}
            </CardFooter>
        </Card>
    );
}