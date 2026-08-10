import NavBar from "~/components/navbar";
import type { PdfConversionResult } from "~/lib/pdf2img";
import { useState, type SubmitEvent } from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { generateUUID } from "~/lib/util";
import BackgroundLayout from "~/components/BackgroundLayout";

const upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null)
    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true);
        setStatusText('Uploading the file ... ');
        const uploadedFile = await fs.upload([file]);

        if (!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image ...');
        const { convertPdfToImage } = await import("~/lib/pdf2img");
        const imageFile = await convertPdfToImage(file);

        if (!imageFile.file) return setStatusText(`Error: ${imageFile.error || 'Failed to convert PDF to image'}`);

        setStatusText('Uploading the image');
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data ...');
        const uuid = generateUUID();

        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: ''
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Extracting resume text...');
        const { extractTextFromPdf } = await import("~/lib/pdf2img");
        const resumeText = await extractTextFromPdf(file);

        setStatusText("Analyzing with AI...");

        // Send extracted text instead of the raw PDF
        const formData = new FormData();
        formData.append('resumeText', resumeText);
        formData.append('jobTitle', jobTitle);
        formData.append('jobDescription', jobDescription);

        try {
            // Start both the API fetch and the 5.5s animation timer
            const fetchPromise = (async () => {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.error || 'Failed to analyze resume');
                }

                const result = await response.json();
                const feedbackText = result.content;
                if (!feedbackText) {
                    throw new Error('AI returned an empty response');
                }

                // Strip markdown code fences and extract JSON
                let jsonText = feedbackText.trim();
                const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
                if (jsonMatch) jsonText = jsonMatch[1].trim();

                try {
                    data.feedback = JSON.parse(jsonText);
                } catch (e) {
                    throw new Error('AI returned invalid JSON. Check console for details.');
                }
            })();

            const timerPromise = new Promise(resolve => setTimeout(resolve, 5500));

            // Wait for both to finish before proceeding
            await Promise.all([fetchPromise, timerPromise]);

        } catch (err) {

            return setStatusText(`Error: ${err instanceof Error ? err.message : 'Network error'}`);
        }

        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting ...');
        navigate(`/resume/${uuid}`);


    }
    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;
        handleAnalyze({ companyName, jobTitle, jobDescription, file });

    }
    return (
        <BackgroundLayout>
            <main>
                <NavBar />
                <section className="main-section">
                    <div className="page-heading py-16">
                        <h1>Smart feedback for your dream job</h1>
                        {isProcessing && (
                            <>
                                <h2>{statusText}</h2>
                                <img src="/images/resume-scan.gif" className="w-full " />
                            </>
                        )}
                        {!isProcessing && (
                            <h2>Drop your resume for an ATS score and improvement tips</h2>
                        )}
                        <form id='upload-form' onSubmit={handleSubmit} className={`flex flex-col gap-4 mt-8 ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name='company-name' placeholder="Company name" id='company-name' />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name='job-title' placeholder="Job Title" id='job-title' />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name='job-description' placeholder="Job Description" id='job-description' />
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>
                            
                            <div className="w-full flex justify-center mt-4">
                                <button className={`analyze-button ${isProcessing ? 'is-analyzing' : ''}`} type="submit" disabled={isProcessing}>
                                    <span className="analyze-text">Analyze Resume</span>
                                    <div className="analyze-arrow">
                                        <div className="arrow-line before"></div>
                                        <div className="arrow-line after"></div>
                                    </div>
                                    <div className="analyze-success">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </BackgroundLayout>
    )
}

export default upload