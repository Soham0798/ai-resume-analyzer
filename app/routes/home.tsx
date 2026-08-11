import type { Route } from "./+types/home";
import NavBar from "~/components/navbar";
import ResumeCard from "~/components/resumecard";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter"
import resume from "./resume";
import BackgroundLayout from "~/components/BackgroundLayout";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Resume Analyze" },
    { name: "description", content: "Smart feedback for your resume" },
  ];
}


export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);


  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))

      console.log("parsedResumes", parsedResumes);

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }
    loadResumes();
  }, []);


  return (
    <BackgroundLayout>
      <main>
        <NavBar />
        <section className="main-section">
          <div className="page-heading py-16">
            <h1>Track Your Applications & Resume Ratings</h1>
            {!loadingResumes && resumes?.length === 0 ? (
              <h2>No resumes found. Upload your first resume to get feedback.</h2>
            ) : (
              <h2>Review Your submissions and check AI-powered feedback</h2>
            )}
          </div>
          {loadingResumes && (
            <div className="flex flex-col items-center justify-center">
              <img src="/images/resume-scan-2.gif" className="w-[200px]" />
            </div>
          )}

          {!loadingResumes && resumes.length > 0 && (
            <div className="resumes-section">
              {resumes.map((resume) => (
                <div>
                  <ResumeCard key={resume.id} resume={resume} />
                </div>
              ))}
            </div>
          )}
          {!loadingResumes && resumes?.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-10 gap-4">
              <Link to="/upload" className="primary-button group w-fit text-xl font-semibold">
                <div className="icon-container">
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                Upload Resume
              </Link>
            </div>
          )}
        </section>
      </main>
    </BackgroundLayout>
  )
}
